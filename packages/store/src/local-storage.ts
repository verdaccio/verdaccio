import assert from 'assert';
import buildDebug from 'debug';
import _ from 'lodash';

import { errorUtils, pluginUtils } from '@verdaccio/core';
import { loadPlugin } from '@verdaccio/loaders';
import LocalDatabase from '@verdaccio/local-storage';
import { Config, Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:local');

export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export type IPluginStorage = pluginUtils.IPluginStorage<Config>;

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage {
  public config: Config;
  public storagePlugin: IPluginStorage;
  public logger: Logger;

  public constructor(config: Config, logger: Logger) {
    debug('local storage created');
    this.logger = logger.child({ sub: 'fs' });
    this.config = config;
    // @ts-expect-error
    this.storagePlugin = null;
  }

  public async init() {
    if (this.storagePlugin === null) {
      this.storagePlugin = this._loadStorage(this.config, this.logger);
      debug('storage plugin init');
      await this.storagePlugin.init();
      debug('storage plugin initialized');
    } else {
      this.logger.warn('storage plugin has been already initialized');
    }
    return;
  }

  public getStoragePlugin(): IPluginStorage {
    if (this.storagePlugin === null) {
      throw errorUtils.getInternalError('storage plugin is not initialized');
    }

    return this.storagePlugin;
  }

  public async getSecret(config: Config): Promise<void> {
    const secretKey = await this.storagePlugin.getSecret();

    return this.storagePlugin.setSecret(config.checkSecretKey(secretKey));
  }

  private _loadStorage(config: Config, logger: Logger): IPluginStorage {
    const Storage = this._loadStorePlugin();

    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      return new LocalDatabase(config, logger);
    }
    return Storage as IPluginStorage;
  }

  private _loadStorePlugin(): IPluginStorage | void {
    const plugin_params = {
      config: this.config,
      logger: this.logger,
    };

    const plugins: IPluginStorage[] = loadPlugin<IPluginStorage>(
      this.config,
      this.config.store,
      plugin_params,
      (plugin): IPluginStorage => {
        return plugin.getPackageStorage;
      }
    );

    return _.head(plugins);
  }
}

export { LocalStorage };
