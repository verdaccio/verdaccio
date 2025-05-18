import assert from 'assert';
import buildDebug from 'debug';
import _ from 'lodash';

import { PLUGIN_CATEGORY, PLUGIN_PREFIX, errorUtils, pluginUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import LocalDatabase from '@verdaccio/local-storage';
import { Config, Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:local');

export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export type PluginStorage = pluginUtils.Storage<Config>;

/**
 * Implements Storage interface (same for storage.js, local-storage.js, up-storage.js).
 */
class LocalStorage {
  public config: Config;
  public storagePlugin: PluginStorage;
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
      this.storagePlugin = await this.loadStorage(this.config, this.logger);
      debug('storage plugin init');
      await this.storagePlugin.init();
      debug('storage plugin initialized');
    } else {
      this.logger.warn('storage plugin has been already initialized');
    }
    return;
  }

  public getStoragePlugin(): PluginStorage {
    if (this.storagePlugin === null) {
      throw errorUtils.getInternalError('storage plugin is not initialized');
    }

    return this.storagePlugin;
  }

  public async getSecret(config: Config): Promise<void> {
    const secretKey = await this.storagePlugin.getSecret();

    return this.storagePlugin.setSecret(config.checkSecretKey(secretKey));
  }

  private async loadStorage(config: Config, logger: Logger): Promise<PluginStorage> {
    const Storage = await this.loadStorePlugin();
    if (_.isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      debug('no custom storage found, loading default storage @verdaccio/local-storage');
      const localStorage = new LocalDatabase(config, logger);
      logger.info(
        { name: '@verdaccio/local-storage', pluginCategory: PLUGIN_CATEGORY.STORAGE },
        'plugin @{name} successfully loaded (@{pluginCategory})'
      );
      return localStorage;
    }
    return Storage as PluginStorage;
  }

  private async loadStorePlugin(): Promise<PluginStorage | undefined> {
    const plugins: PluginStorage[] = await asyncLoadPlugin<pluginUtils.Storage<unknown>>(
      this.config.store,
      {
        config: this.config,
        logger: this.logger,
      },
      (plugin) => {
        return typeof plugin.getPackageStorage !== 'undefined';
      },
      false,
      this.config.server?.pluginPrefix ?? PLUGIN_PREFIX,
      PLUGIN_CATEGORY.STORAGE
    );

    if (plugins.length > 1) {
      this.logger.warn(
        'more than one storage plugins has been detected, multiple storage are not supported, one will be selected automatically'
      );
    }

    return _.head(plugins);
  }
}

export { LocalStorage };
