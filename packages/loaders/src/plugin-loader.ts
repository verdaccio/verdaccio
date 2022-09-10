import buildDebug from 'debug';
import Path from 'path';

import { logger } from '@verdaccio/logger';
import { Config, IPlugin } from '@verdaccio/types';

import { isES6, isValid, mergeConfig, tryLoad } from './utils';

const debug = buildDebug('verdaccio:plugin:loader');

// export type PluginGeneric<R, T extends IPlugin<R> = ;

/**
 * Load a plugin following the rules
 * - First try to load from the internal directory plugins (which will disappear soon or later).
 * - If the package is scoped eg: @scope/foo, try to load as a package
 * - A second attempt from the external plugin directory
 * - A third attempt from node_modules, in case to have multiple match as for instance
 * verdaccio-ldap
 * and sinopia-ldap. All verdaccio prefix will have preferences.
 * @param {*} config a reference of the configuration settings
 * @param {*} pluginConfigs
 * @param {*} params a set of params to initialize the plugin
 * @param {*} sanityCheck callback that check the shape that should fulfill the plugin
 * @param {*} prefix by default is verdaccio but can be override with config.server.pluginPrefix
 * @return {Array} list of plugins
 */
export function loadPlugin<T extends IPlugin<T>>(
  config: Config,
  pluginConfigs: any = {},
  params: any,
  sanityCheck: any,
  prefix: string = 'verdaccio'
): any[] {
  return Object.keys(pluginConfigs).map((pluginId: string): IPlugin<T> => {
    let plugin;
    const isScoped: boolean = pluginId.startsWith('@') && pluginId.includes('/');
    debug('isScoped %s', isScoped);
    if (isScoped) {
      plugin = tryLoad(pluginId);
    }

    let isDirectory = false;
    const localPlugin = Path.resolve(__dirname + '/../plugins', pluginId);
    // console.log('--localPlugin', localPlugin);
    // try local plugins first
    plugin = tryLoad(localPlugin);

    if (plugin !== null) {
      isDirectory = true;
    }

    // try the external plugin directory
    if (plugin === null && config.plugins) {
      const pluginDir = config.plugins;
      const externalFilePlugin = Path.resolve(pluginDir, pluginId);
      plugin = tryLoad(externalFilePlugin);

      // npm package
      if (plugin === null && pluginId.match(/^[^\.\/]/)) {
        plugin = tryLoad(Path.resolve(pluginDir, `${prefix}-${pluginId}`));
      }

      if (plugin) {
        debug('plugin %s is an npm package', pluginId);
      }
    }

    // npm package
    if (plugin === null && pluginId.match(/^[^\.\/]/)) {
      plugin = tryLoad(`${prefix}-${pluginId}`);
    }

    if (plugin === null) {
      plugin = tryLoad(pluginId);
    }

    // relative to config path
    debug('config path: %s', config.configPath);
    if (plugin === null && pluginId.match(/^\.\.?($|\/)/) && config.configPath) {
      plugin = tryLoad(Path.resolve(Path.dirname(config.configPath), pluginId));
    }

    if (plugin === null) {
      if (isScoped) {
        logger.error({ content: pluginId }, 'plugin not found. try npm install @{content}');
      } else {
        if (isDirectory) {
          logger.error({ content: pluginId }, 'plugin not found.');
        } else {
          logger.error(
            { content: pluginId, prefix },
            'plugin not found. try npm install @{prefix}-@{content}'
          );
        }
      }
      const msg = isScoped
        ? `
      ${pluginId} plugin not found. try "npm install ${pluginId}"`
        : `
      ${prefix}-${pluginId} plugin not found. try "npm install ${prefix}-${pluginId}"`;
      throw Error(msg);
    }

    if (!isValid(plugin)) {
      if (isDirectory) {
        logger.error(
          { content: pluginId },
          'plugin located at @{content} does not have the right code structure'
        );
      } else {
        logger.error(
          { content: pluginId },
          '@{prefix}-@{content} plugin does not have the right code structure'
        );
      }
      throw Error(`"${pluginId}" plugin does not have the right code structure`);
    }

    /* eslint new-cap:off */
    try {
      if (isES6(plugin)) {
        debug('plugin is ES6');
        plugin = new plugin.default(mergeConfig(config, pluginConfigs[pluginId]), params);
      } else {
        debug('plugin is commonJS');
        plugin = plugin(pluginConfigs[pluginId], params);
      }
    } catch (error: any) {
      plugin = null;
      logger.error({ error, pluginId }, 'error loading a plugin @{pluginId}: @{error}');
    }
    /* eslint new-cap:off */

    if (plugin === null || !sanityCheck(plugin)) {
      if (isScoped) {
        logger.error({ content: pluginId }, "@{content} doesn't look like a valid plugin");
      } else {
        if (isDirectory) {
          logger.error({ content: pluginId }, "@{content} doesn't look like a valid plugin");
        } else {
          logger.error(
            { content: pluginId, prefix },
            "@{prefix}-@{content} doesn't look like a valid plugin"
          );
        }
      }
      throw Error(`sanity check has failed, "${pluginId}" is not a valid plugin`);
    }

    debug('Plugin successfully loaded: %o-%o', prefix, pluginId);
    if (isScoped) {
      logger.info({ content: pluginId }, 'plugin successfully loaded: @{content}');
    } else {
      if (isDirectory) {
        logger.info({ content: pluginId }, 'plugin successfully loaded: @{content}');
      } else {
        logger.info(
          { content: pluginId, prefix },
          'plugin successfully loaded: @{prefix}-@{content}'
        );
      }
    }
    return plugin;
  });
}
