import path from 'path';
// import LRU from 'lru-cache';
import buildDebug from 'debug';
import _ from 'lodash';
import { Config, IPackageStorage, LocalStorage, Logger } from '@verdaccio/types';
import { errorUtils, searchUtils, pluginUtils, fileUtils } from '@verdaccio/core';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

import LocalDriver, { noSuchFile } from './local-fs';
import { loadPrivatePackages } from './pkg-utils';
import TokenActions from './token';
import { mkdirPromise, writeFilePromise } from './fs';
import { searchOnStorage } from './dir-utils';
import { _dbGenPath } from './utils';

const DB_NAME = process.env.VERDACCIO_STORAGE_NAME ?? fileUtils.Files.DatabaseName;

const debug = buildDebug('verdaccio:plugin:local-storage:experimental');

export const ERROR_DB_LOCKED =
  'Database is locked, please check error message printed during startup to prevent data loss';

type IPluginStorage = pluginUtils.IPluginStorage<{}>;

class LocalDatabase extends TokenActions implements IPluginStorage {
  private readonly path: string;
  private readonly logger: Logger;
  public readonly config: Config;
  public readonly storages: Map<string, string>;
  public data: LocalStorage | void;
  public locked: boolean;

  public constructor(config: Config, logger: Logger) {
    super(config);
    this.config = config;
    this.logger = logger;
    this.locked = false;
    this.data = undefined;
    this.path = _dbGenPath(DB_NAME, config);
    this.storages = this._getCustomPackageLocalStorages();
    debug('plugin storage path %o', this.path);
  }

  public async init(): Promise<void> {
    debug('plugin init');
    this.data = await this._fetchLocalPackages();
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
    return path.dirname(this.config.config_path);
  }

  /**
   * Filter by query.
   **/
  public async filterByQuery(results: searchUtils.SearchItemPkg[], query: searchUtils.SearchQuery) {
    // FUTURE: apply new filters, keyword, version, ...
    return results.filter((item: searchUtils.SearchItemPkg) => {
      return item?.name?.match(query.text) !== null;
    }) as searchUtils.SearchItemPkg[];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getScore(_pkg: searchUtils.SearchItemPkg): Promise<searchUtils.Score> {
    return Promise.resolve({
      final: 1,
      detail: {
        maintenance: 0,
        popularity: 1,
        quality: 1,
      },
    });
  }

  public async search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]> {
    const results: searchUtils.SearchItem[] = [];
    const storagePath = this.getStoragePath();
    const packagesOnStorage = await this.filterByQuery(
      await searchOnStorage(storagePath, this.storages),
      query
    );
    debug('packages found %o', packagesOnStorage.length);
    for (let storage of packagesOnStorage) {
      const score = await this.getScore(storage);
      results.push({
        package: storage,
        // there is no particular reason to predefined scores
        // could be improved by using
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

  public getPackageStorage(packageName: string): IPackageStorage {
    const packageAccess = getMatchedPackagesSpec(packageName, this.config.packages);

    const packagePath: string = this._getLocalStoragePath(
      packageAccess ? packageAccess.storage : undefined
    );
    debug('storage path selected: ', packagePath);
    if (_.isString(packagePath) === false) {
      debug('the package %o has no storage defined ', packageName);
      return;
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
      debug('sync write succeed');

      return null;
    } catch (err: any) {
      this.logger.error({ err }, 'sync database file failed: @{err}');
      throw err;
    }
  }

  private _getLocalStoragePath(storage: string | void): string {
    const globalConfigStorage = this.getStoragePath();
    if (_.isNil(globalConfigStorage)) {
      this.logger.error('property storage in config.yaml is required for using  this plugin');
      throw new Error('property storage in config.yaml is required for using  this plugin');
    } else {
      if (typeof storage === 'string') {
        return path.join(globalConfigStorage as string, storage as string);
      }

      return globalConfigStorage as string;
    }
  }

  private async _fetchLocalPackages(): Promise<LocalStorage> {
    try {
      return await loadPrivatePackages(this.path, this.logger);
    } catch (err: any) {
      // readFileSync is platform specific, macOS, Linux and Windows thrown an error
      // Only recreate if file not found to prevent data loss
      this.logger.warn(
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

      return { list: [], secret: '' };
    }
  }
}

export default LocalDatabase;
