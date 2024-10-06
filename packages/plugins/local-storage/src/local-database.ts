// import LRU from 'lru-cache';
import buildDebug from 'debug';
import _ from 'lodash';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import FileMemory from 'lowdb/adapters/Memory';
import path from 'path';

import { errorUtils, fileUtils, pluginUtils, searchUtils } from '@verdaccio/core';
import { Config, Logger, Token, TokenFilter } from '@verdaccio/types';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

import { searchOnStorage } from './dir-utils';
import { mkdirPromise, writeFilePromise } from './fs';
import LocalDriver, { noSuchFile } from './local-fs';
import { LocalStorage, loadPrivatePackages } from './pkg-utils';
import { _dbGenPath } from './utils';

const TOKEN_DB_NAME = '.token-db.json';
const DB_NAME = process.env.VERDACCIO_STORAGE_NAME ?? fileUtils.Files.DatabaseName;

const debug = buildDebug('verdaccio:plugin:local-storage');

export const ERROR_DB_LOCKED =
  'Database is locked, please check error message printed during startup to prevent data loss';

type Storage = pluginUtils.Storage<{}>;

class LocalDatabase extends pluginUtils.Plugin<{}> implements Storage {
  private readonly path: string;
  private readonly logger: Logger;
  public readonly config: Config;
  public readonly storages: Map<string, string>;
  public data: LocalStorage | undefined;
  public locked: boolean;
  public tokenDb: low.LowdbAsync<any> | null;

  public constructor(config: Config, logger: Logger) {
    // TODO: fix double config
    super(config, { config, logger });
    this.tokenDb = null;
    this.config = config;
    this.logger = logger;
    this.locked = false;
    this.data = undefined;
    debug('config path %o', config.configPath);
    this.path = _dbGenPath(DB_NAME, config);
    this.storages = this._getCustomPackageLocalStorages();
    this.logger.info({ path: this.path }, 'local storage path: @{path}');
    debug('plugin storage path %o', this.path);
  }

  public async init(): Promise<void> {
    debug('plugin init');
    this.data = await this.fetchLocalPackages();
    debug('local packages loaded');
    await this._sync();
  }

  public async getSecret(): Promise<string> {
    if (typeof this.data === 'undefined') {
      throw Error('no data secret available');
    }

    return Promise.resolve(this.data.secret);
  }

  public async setSecret(secret: string): Promise<void> {
    if (typeof this.data === 'undefined') {
      throw Error('no data secret available');
    } else {
      this.data.secret = secret;
    }

    await this._sync();
  }

  public async add(name: string): Promise<void> {
    if (typeof this.data === 'undefined') {
      throw Error('no data secret available');
    }

    if (this.data.list.indexOf(name) === -1) {
      this.data.list.push(name);
      debug('the private package %s has been added', name);
      await this._sync();
    } else {
      debug('the private package %s already exist on database', name);
      return Promise.resolve();
    }
  }

  /**
   * The field storage could be absolute or relative.
   * If relative, it will be resolved against the config path.
   * If absolute, it will be returned as is.
   **/
  private getStoragePath() {
    const { storage } = this.config;
    if (typeof storage !== 'string') {
      throw new TypeError('storage field is mandatory');
    }

    const storagePath = path.isAbsolute(storage)
      ? storage
      : path.normalize(path.join(this.getBaseConfigPath(), storage));
    debug('storage path %o', storagePath);
    return storagePath;
  }

  private getBaseConfigPath(): string {
    return path.dirname(this.config.configPath);
  }

  /**
   * Filter and only match those values that the query define.
   **/
  public async filterByQuery(results: searchUtils.SearchItemPkg[], query: searchUtils.SearchQuery) {
    // FUTURE: apply new filters, keyword, version, ...
    return results.filter((item: searchUtils.SearchItemPkg) => {
      // Sanitize user input
      const safeText = _.escapeRegExp(query.text);
      return item?.name?.match(safeText) !== null;
    }) as searchUtils.SearchItemPkg[];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getScore(_pkg: searchUtils.SearchItemPkg): Promise<searchUtils.Score> {
    // TODO: there is no particular reason to predefined scores
    // could be improved by using
    return Promise.resolve({
      final: 1,
      detail: {
        maintenance: 0,
        popularity: 1,
        quality: 1,
      },
    });
  }

  /**
   *
   * @param query
   * @returns
   */
  public async search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]> {
    debug('search query to %o', query.text);
    const results: searchUtils.SearchItem[] = [];
    const storagePath = this.getStoragePath();
    const localResults = await searchOnStorage(storagePath, this.storages);
    const packagesOnStorage = await this.filterByQuery(localResults, query);
    debug('packages found %o', packagesOnStorage.length);
    for (let storage of packagesOnStorage) {
      // check if package is listed on the cache private database
      const isPrivate = (this.data as LocalStorage).list.includes(storage.name);
      const score = await this.getScore(storage);
      results.push({
        package: storage,
        verdaccioPrivate: isPrivate,
        verdaccioPkgCached: !isPrivate,
        score,
      });
    }
    return results;
  }

  public async remove(name: string): Promise<void> {
    try {
      if (typeof this.data === 'undefined') {
        throw Error('no data secret available');
      }

      const data = await this.get();

      const pkgName = data.indexOf(name);
      if (pkgName !== -1) {
        this.data.list.splice(pkgName, 1);
        debug('remove package %o has been removed', name);
      }
      await this._sync();
    } catch (err) {
      this.logger.error({ err }, 'remove the private package has failed @{err}');
      throw errorUtils.getInternalError('error remove private package');
    }
  }

  public async get(): Promise<any> {
    if (typeof this.data === 'undefined') {
      throw Error('no data secret available');
    }

    const { list } = this.data;
    const totalItems = list?.length;
    debug('get full list of packages (%o) has been fetched', totalItems);
    return Promise.resolve(list);
  }

  public getPackageStorage(packageName: string): pluginUtils.StorageHandler {
    const packageAccess = getMatchedPackagesSpec(packageName, this.config.packages);

    const packagePath: string = this._getLocalStoragePath(
      packageAccess ? packageAccess.storage : undefined
    );
    debug('storage path selected: ', packagePath);
    if (_.isString(packagePath) === false) {
      debug('the package %o has no storage defined ', packageName);
      throw errorUtils.getInternalError('storage not found or implemented');
    }

    const packageStoragePath: string = path.join(
      // FIXME: use getBaseStoragePath instead
      path.resolve(path.dirname(this.config.config_path || ''), packagePath),
      packageName
    );

    debug('storage absolute path: ', packageStoragePath);

    return new LocalDriver(packageStoragePath, this.logger);
  }

  public async clean(): Promise<void> {
    await this._sync();
  }

  private _getCustomPackageLocalStorages(): Map<string, string> {
    const storages = new Map<string, string>();
    const { packages } = this.config;

    if (packages) {
      Object.keys(packages || {}).map((pkg) => {
        const { storage } = packages[pkg];
        if (typeof storage === 'string') {
          const storagePath = path.join(this.getStoragePath(), storage);
          debug('add custom storage for %s on %s', storage, storagePath);
          storages.set(storage, storagePath);
        }
      });
    }

    return storages;
  }

  private async _sync(): Promise<null> {
    debug('sync database started');

    if (this.locked) {
      this.logger.error(ERROR_DB_LOCKED);
      throw new Error(ERROR_DB_LOCKED);
    }
    // Uses sync to prevent ugly race condition
    try {
      const folderName = path.dirname(this.path);
      debug('creating folder %o', folderName);
      await mkdirPromise(folderName, { recursive: true });
      debug('creating folder %o created succeed', folderName);
    } catch (err) {
      this.logger.error({ err }, 'sync create folder has failed with error: @{err}');
      throw err;
    }

    try {
      await writeFilePromise(this.path, JSON.stringify(this.data));
      debug('sync write succeeded');

      return null;
    } catch (err: any) {
      this.logger.error({ err }, 'sync database file failed: @{err}');
      throw err;
    }
  }

  private _getLocalStoragePath(storage: string | void): string {
    const globalConfigStorage = this.getStoragePath();
    if (_.isNil(globalConfigStorage)) {
      this.logger.error('property storage in config.yaml is required for using this plugin');
      throw new Error('property storage in config.yaml is required for using this plugin');
    } else {
      if (typeof storage === 'string') {
        return path.join(globalConfigStorage as string, storage as string);
      }

      return globalConfigStorage as string;
    }
  }

  private async fetchLocalPackages(): Promise<LocalStorage> {
    try {
      return await loadPrivatePackages(this.path, this.logger);
    } catch (err: any) {
      // readFileSync is platform specific, macOS, Linux and Windows thrown an error
      // Only recreate if file not found to prevent data loss
      this.logger.info(
        { path: this.path },
        'no private database found, recreating new one on @{path}'
      );
      if (err.code !== noSuchFile) {
        this.locked = true;
        this.logger.error(
          'Failed to read package database file, please check the error printed below:\n',
          `File Path: ${this.path}\n\n ${err.message}`
        );
      }
      // if no database is found we set empty placeholders
      return { list: [], secret: '' };
    }
  }

  private async getTokenDb(): Promise<low.LowdbAsync<any>> {
    if (!this.tokenDb) {
      debug('token database is not defined');
      let adapter;
      if (process.env.NODE_ENV === 'test') {
        debug('token memory adapter');
        adapter = new FileMemory('');
      } else {
        debug('token async adapter');
        const pathDb = _dbGenPath(TOKEN_DB_NAME, this.config);
        adapter = new FileAsync(pathDb);
      }
      debug('token bd generated');
      this.tokenDb = await low(adapter);
    }

    return this.tokenDb;
  }

  public async saveToken(token: Token): Promise<void> {
    debug('token key %o', token.key);
    const db = await this.getTokenDb();
    const userData = await db.get(token.user).value();
    debug('user data %o', userData);
    if (_.isNil(userData)) {
      await db.set(token.user, [token]).write();
      debug('token user %o new database', token.user);
    } else {
      // types does not match with valid implementation
      // @ts-ignore
      await db.get(token.user).push(token).write();
    }
    debug('data %o', await db.getState());
    debug('token saved %o', token.user);
  }

  public async deleteToken(user: string, tokenKey: string): Promise<void> {
    const db = await this.getTokenDb();
    const userTokens = await db.get(user).value();
    if (_.isNil(userTokens)) {
      throw new Error('user not found');
    }
    debug('tokens %o - %o', userTokens, userTokens.length);
    const remainingTokens = userTokens.filter(({ key }) => {
      debug('key %o', key);
      return key !== tokenKey;
    });
    await db.set(user, remainingTokens).write();
    debug('removed tokens key %o', tokenKey);
  }

  public async readTokens(filter: TokenFilter): Promise<Token[]> {
    const { user } = filter;
    debug('read tokens with %o', user);
    const db = await this.getTokenDb();
    const tokens = await db.get(user).value();
    return tokens || [];
  }
}

export default LocalDatabase;
