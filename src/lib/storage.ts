import buildDebug from 'debug';
import { head, isNil } from 'lodash-es';
import assert from 'node:assert';

import { PLUGIN_CATEGORY, PLUGIN_PREFIX, errorUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import LocalDatabaseModule from '@verdaccio/local-storage';
import { Storage as BaseStorage } from '@verdaccio/store';
import { Config, Logger } from '@verdaccio/types';

import { isLegacyStoragePlugin, wrapLegacyStoragePlugin } from './legacy-storage-adapter';

const debug = buildDebug('verdaccio:storage');

// CJS/ESM interop for the default storage plugin
const LocalDatabase = (LocalDatabaseModule as any).default || LocalDatabaseModule;

// `storageSanityCheck` only verifies `getPackageStorage` exists, which both the
// legacy and promise contracts satisfy.
const storageSanityCheck = (plugin: any): boolean =>
  typeof plugin?.getPackageStorage !== 'undefined';

/**
 * Drop-in replacement for `@verdaccio/store`'s internal `LocalStorage` that
 * loads the configured storage plugin exactly like upstream, but wraps a
 * legacy callback-based plugin in a promisifying adapter so it satisfies the
 * promise contract the rest of `@verdaccio/store` relies on.
 *
 * `@verdaccio/store` only ever calls `init()`, `getSecret()` and
 * `getStoragePlugin()` on this object, so that is the entire surface we mirror.
 */
class CompatLocalStorage {
  public storagePlugin: any = null;
  private readonly config: Config;
  private readonly logger: Logger;

  public constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger.child({ sub: 'fs' });
  }

  public async init(): Promise<void> {
    if (this.storagePlugin === null) {
      const loaded = await this.loadStorage();
      this.storagePlugin = isLegacyStoragePlugin(loaded)
        ? wrapLegacyStoragePlugin(loaded, this.logger)
        : loaded;
      debug('storage plugin init');
      await this.storagePlugin.init();
      debug('storage plugin initialized');
    } else {
      this.logger.warn('storage plugin has been already initialized');
    }
  }

  public getStoragePlugin(): any {
    if (this.storagePlugin === null) {
      throw errorUtils.getInternalError('storage plugin is not initialized');
    }
    return this.storagePlugin;
  }

  public async getSecret(config: Config): Promise<void> {
    const secretKey = await this.storagePlugin.getSecret();
    return this.storagePlugin.setSecret(config.checkSecretKey(secretKey));
  }

  private async loadStorage(): Promise<any> {
    const Storage = await this.loadStorePlugin();
    if (isNil(Storage)) {
      assert(this.config.storage, 'CONFIG: storage path not defined');
      debug('no custom storage found, loading default storage @verdaccio/local-storage');
      const localStorage = new LocalDatabase(this.config, this.logger);
      this.logger.info(
        { name: '@verdaccio/local-storage', pluginCategory: PLUGIN_CATEGORY.STORAGE },
        'plugin @{name} successfully loaded (@{pluginCategory})'
      );
      return localStorage;
    }
    return Storage;
  }

  private async loadStorePlugin(): Promise<any> {
    const plugins = await asyncLoadPlugin(
      this.config.store,
      { config: this.config, logger: this.logger },
      storageSanityCheck,
      // legacyMergeConfigs: pass the full config as the plugin's first constructor
      // arg, which legacy `(config, logger)` storage plugins require (matches the
      // pre-migration 7.x behaviour; @verdaccio/store uses false and so cannot
      // drive legacy plugins).
      true,
      this.config.server?.pluginPrefix ?? PLUGIN_PREFIX,
      PLUGIN_CATEGORY.STORAGE
    );
    if (plugins.length > 1) {
      this.logger.warn(
        'more than one storage plugins has been detected, multiple storage are not supported, one will be selected automatically'
      );
    }
    return head(plugins);
  }
}

/**
 * `@verdaccio/store` Storage, with one change: it loads the storage plugin
 * through {@link CompatLocalStorage} so legacy callback plugins keep working.
 *
 * The base `init()` only creates its internal `LocalStorage` when
 * `this.localStorage` is still null; by pre-populating it we reuse the entire
 * rest of the upstream Storage implementation (including filter loading via
 * `super.init`) unchanged.
 */
class Storage extends BaseStorage {
  public async init(config: Config): Promise<void> {
    if (this.localStorage === null) {
      const localStorage = new CompatLocalStorage(this.config, this.logger);
      await localStorage.init();
      await localStorage.getSecret(config);
      // structurally compatible with the (non-exported) upstream LocalStorage
      this.localStorage = localStorage as any;
      debug('compat local storage initialized');
    }
    // localStorage is now non-null, so super.init only loads filter plugins
    await super.init(config);
  }
}

export default Storage;
export { Storage };
