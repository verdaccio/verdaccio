import buildDebug from 'debug';

import { errorUtils, pluginUtils, searchUtils } from '@verdaccio/core';
import { Logger, Token } from '@verdaccio/types';

import MemoryHandler, { DataHandler } from './memory-handler';

export type ConfigMemory = { limit?: number };
export interface MemoryLocalStorage {
  secret: string;
  list: string[];
  files: DataHandler;
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
  // @ts-ignore
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]> {
    this.logger.warn('[verdaccio/memory]: search method not implemented, PR is welcome');
    return Promise.reject('not implemented');
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
    return new MemoryHandler(packageInfo, this.data.files, this.logger);
  }

  public async hasTarball(/* fileName: string */): Promise<boolean> {
    throw new Error('not  implemented');
  }

  public async hasPackage(): Promise<boolean> {
    return false;
  }

  private _createEmtpyDatabase(): MemoryLocalStorage {
    const list: string[] = [];
    const files = {};
    const emptyDatabase = {
      list,
      files,
      secret: '',
    };

    return emptyDatabase;
  }

  public saveToken(): Promise<void> {
    this.logger.warn('[verdaccio/memory][saveToken] save token has not been implemented yet');

    return Promise.reject(errorUtils.getServiceUnavailable('method not implemented'));
  }

  public deleteToken(user: string, tokenKey: string): Promise<void> {
    this.logger.warn(
      { tokenKey, user },
      '[verdaccio/memory][deleteToken] delete token has not been implemented yet @{user}'
    );

    return Promise.reject(errorUtils.getServiceUnavailable('method not implemented'));
  }

  public readTokens(): Promise<Token[]> {
    this.logger.warn('[verdaccio/memory][readTokens] read tokens has not been implemented yet ');

    return Promise.reject(errorUtils.getServiceUnavailable('method not implemented'));
  }
}

export default LocalMemory;
