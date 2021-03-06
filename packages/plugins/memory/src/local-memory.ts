import { getServiceUnavailable } from '@verdaccio/commons-api';
import {
  Logger,
  Callback,
  Config,
  IPluginStorage,
  Token,
  TokenFilter,
  PluginOptions,
} from '@verdaccio/types';
import buildDebug from 'debug';

import MemoryHandler, { DataHandler } from './memory-handler';

export type ConfigMemory = Config & { limit?: number };
export interface MemoryLocalStorage {
  secret: string;
  list: string[];
  files: DataHandler;
}

const debug = buildDebug('verdaccio:plugin:storage:local-memory');

const DEFAULT_LIMIT = 1000;
class LocalMemory implements IPluginStorage<ConfigMemory> {
  private path: string;
  private limit: number;
  public logger: Logger;
  private data: MemoryLocalStorage;
  public config: ConfigMemory;

  public constructor(config: ConfigMemory, options: PluginOptions<ConfigMemory>) {
    this.config = config;
    this.limit = config.limit || DEFAULT_LIMIT;
    this.logger = options.logger;
    this.data = this._createEmtpyDatabase();
    this.path = '/';
    debug('start plugin');
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

  public add(name: string, cb: Callback): void {
    const { list } = this.data;

    if (list.length < this.limit) {
      if (list.indexOf(name) === -1) {
        list.push(name);
      }
      cb(null);
    } else {
      this.logger.info(
        { limit: this.limit },
        'Storage memory has reached limit of @{limit} packages'
      );
      cb(new Error('Storage memory has reached limit of limit packages'));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public search(onPackage: Callback, onEnd: Callback, validateName: Function): void {
    this.logger.warn('[verdaccio/memory]: search method not implemented, PR is welcome');
    onEnd();
  }

  public remove(name: string, cb: Callback): void {
    const { list } = this.data;
    const item = list.indexOf(name);

    if (item !== -1) {
      list.splice(item, 1);
    }

    cb(null);
  }

  public get(cb: Callback): void {
    debug('data list length %o', this.data?.list?.length);
    cb(null, this.data?.list);
  }

  public getPackageStorage(packageInfo: string): MemoryHandler {
    return new MemoryHandler(packageInfo, this.data.files, this.logger);
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

  public saveToken(token: Token): Promise<void> {
    this.logger.warn('[verdaccio/memory][saveToken] save token has not been implemented yet');

    return Promise.reject(getServiceUnavailable('method not implemented'));
  }

  public deleteToken(user: string, tokenKey: string): Promise<void> {
    this.logger.warn(
      { tokenKey, user },
      '[verdaccio/memory][deleteToken] delete token has not been implemented yet @{user}'
    );

    return Promise.reject(getServiceUnavailable('method not implemented'));
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    this.logger.warn('[verdaccio/memory][readTokens] read tokens has not been implemented yet ');

    return Promise.reject(getServiceUnavailable('method not implemented'));
  }
}

export default LocalMemory;
