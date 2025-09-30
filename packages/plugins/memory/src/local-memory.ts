import buildDebug from 'debug';

import { pluginUtils, searchUtils } from '@verdaccio/core';
import { Logger, Token, TokenFilter } from '@verdaccio/types';

import MemoryHandler, { DataHandler } from './memory-handler';

export type ConfigMemory = { limit?: number };
export interface MemoryLocalStorage {
  secret: string;
  list: string[];
  files: DataHandler;
  tokens: { [user: string]: Token[] };
}

const debug = buildDebug('verdaccio:plugin:storage:local-memory');

const DEFAULT_LIMIT = 1000;

class LocalMemory
  extends pluginUtils.Plugin<ConfigMemory>
  implements pluginUtils.Storage<ConfigMemory>
{
  private path: string;
  private limit: number;
  public logger: Logger;
  private data: MemoryLocalStorage;
  public config: ConfigMemory;

  public constructor(config: ConfigMemory, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.config = config;
    this.limit = config.limit || DEFAULT_LIMIT;
    this.logger = options.logger;
    this.data = this._createEmtpyDatabase();
    this.path = '/';
    debug('start plugin');
  }

  public init() {
    return Promise.resolve();
  }

  public getSecret(): Promise<string> {
    return Promise.resolve(this.data.secret);
  }

  public setSecret(secret: string): Promise<string | null> {
    return new Promise((resolve): void => {
      this.data.secret = secret;
      resolve(null);
    });
  }

  async add(name: string): Promise<void> {
    return new Promise((resolve, reject): void => {
      const { list } = this.data;

      if (list.length < this.limit) {
        if (list.indexOf(name) === -1) {
          list.push(name);
        }
        resolve();
      } else {
        this.logger.info(
          { limit: this.limit },
          'Storage memory has reached limit of @{limit} packages'
        );
        reject(new Error(`Storage memory has reached limit of ${this.limit} packages`));
      }
    });
  }

  public async search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]> {
    const results: searchUtils.SearchItem[] = [];
    const packagesOnStorage = this.filterByQuery(this.data.list, query);
    debug('memory search: packages found %o', packagesOnStorage.length);
    for (const name of packagesOnStorage) {
      const pkg: searchUtils.SearchItemPkg = { name };
      const isPrivate = this.data.list.includes(name);
      const score = this.getScore(pkg);
      results.push({
        package: pkg,
        verdaccioPrivate: isPrivate,
        verdaccioPkgCached: !isPrivate,
        score,
      });
    }
    return results;
  }

  private filterByQuery(list: string[], query: searchUtils.SearchQuery): string[] {
    const safeText = query.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeText, 'i');
    return list.filter((name) => regex.test(name));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getScore(_pkg: searchUtils.SearchItemPkg): searchUtils.Score {
    return {
      final: 1,
      detail: {
        maintenance: 0,
        popularity: 1,
        quality: 1,
      },
    };
  }

  async remove(name: string): Promise<void> {
    return new Promise((resolve): void => {
      const { list } = this.data;
      const item = list.indexOf(name);

      if (item !== -1) {
        list.splice(item, 1);
      }

      return resolve();
    });
  }

  async get(): Promise<any> {
    debug('data list length %o', this.data?.list?.length);
    return Promise.resolve(this.data?.list);
  }

  public getPackageStorage(packageInfo: string): MemoryHandler {
    // Ensure the package is in the list
    if (!this.data.list.includes(packageInfo)) {
      this.data.list.push(packageInfo);
    }
    return new MemoryHandler(packageInfo, this.data.files, this.logger);
  }

  private _createEmtpyDatabase(): MemoryLocalStorage {
    const list: string[] = [];
    const files = {};
    const tokens = {};
    const emptyDatabase = {
      list,
      files,
      tokens,
      secret: '',
    };

    return emptyDatabase;
  }

  public saveToken(token: Token): Promise<void> {
    return new Promise((resolve): void => {
      const { tokens } = this.data;

      if (!tokens[token.user]) {
        tokens[token.user] = [token];
      } else {
        tokens[token.user].push(token);
      }

      debug('token saved for user %o', token.user);
      resolve();
    });
  }

  public deleteToken(user: string, tokenKey: string): Promise<void> {
    return new Promise((resolve, reject): void => {
      const { tokens } = this.data;
      const userTokens = tokens[user];

      if (!userTokens) {
        reject(new Error('user not found'));
        return;
      }

      const remainingTokens = userTokens.filter((token) => token.key !== tokenKey);
      tokens[user] = remainingTokens;

      debug('removed token key %o for user %o', tokenKey, user);
      resolve();
    });
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    return new Promise((resolve): void => {
      const { tokens } = this.data;
      const userTokens = tokens[filter.user] || [];

      debug('read tokens for user %o: %o tokens', filter.user, userTokens.length);
      resolve(userTokens);
    });
  }
}

export default LocalMemory;
