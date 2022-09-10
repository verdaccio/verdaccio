import buildDebug from 'debug';
import { lstat } from 'fs/promises';
import { isAbsolute, join, resolve } from 'path';

import { logger, setup } from '@verdaccio/logger';
import { Config, IPlugin, Logger } from '@verdaccio/types';

import { isES6, isValid, tryLoad } from './utils';

setup({ level: 'debug' });

const debug = buildDebug('verdaccio:plugin:loader:async');

async function isDirectory(pathFolder) {
  const stat = await lstat(pathFolder);
  return stat.isDirectory();
}

export type Params = { config: Config; logger: Logger };

// export type PluginGeneric<R, T extends IPlugin<R> = ;

/**
 * Load a plugin following the rules
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
export async function asyncLoadPlugin<T extends IPlugin<T>>(
  pluginConfigs: any,
  params: Params,
  sanityCheck: any,
  prefix: string = 'verdaccio'
): Promise<any> {
  const pluginsIds = Object.keys(pluginConfigs);
  const { config } = params;
  let plugins: any[] = [];
  for (let pluginId of pluginsIds) {
    debug('plugin %s', pluginId);
    try {
      if (typeof config.plugins === 'string') {
        let pluginsPath = config.plugins;
        if (!isAbsolute(pluginsPath)) {
          if (typeof config.config_path === 'string' && !config.configPath) {
            logger.error(
              'configPath is missing and the legacy config.config_path is not available for loading plugins'
            );
          }

          if (!config.configPath) {
            throw new Error('config path property is required for loading plugins');
          }
          pluginsPath = resolve(join(config.configPath, pluginsPath));
        }

        logger.debug({ path: pluginsPath }, 'loading plugins from @{path} ');
        // throws if is nto a directory
        await isDirectory(pluginsPath);
        const pluginDir = pluginsPath;
        const externalFilePlugin = resolve(pluginDir, `${prefix}-${pluginId}`);
        let plugin = tryLoad(externalFilePlugin);
        if (plugin && isValid(plugin)) {
          plugin = executePlugin(plugin, pluginConfigs[pluginId], params);
          if (!sanityCheck(plugin)) {
            logger.error(
              { content: externalFilePlugin },
              "@{content} doesn't look like a valid plugin"
            );
            continue;
          }
          plugins.push(plugin);
          continue;
        }
      } else if (typeof pluginId === 'string') {
        const isScoped: boolean = pluginId.startsWith('@') && pluginId.includes('/');
        const pluginName = isScoped ? pluginId : `${prefix}-${pluginId}`;
        let plugin = tryLoad(pluginName);
        if (plugin && isValid(plugin)) {
          plugin = executePlugin(plugin, pluginConfigs[pluginId], params);
          if (!sanityCheck(plugin)) {
            logger.error({ content: pluginName }, "@{content} doesn't look like a valid plugin");
            continue;
          }
          plugins.push(plugin);
          continue;
        }
      }
    } catch (err: any) {
      logger.error(
        { content: config.plugins, err: err.message },
        'error @{err} processing plugin @{content}'
      );
    }
  }

  return plugins;
}

export function executePlugin(plugin, pluginConfig, params: Params) {
  if (isES6(plugin)) {
    debug('plugin is ES6');
    // eslint-disable-next-line new-cap
    return new plugin.default(pluginConfig, params);
  } else {
    debug('plugin is commonJS');
    return plugin(pluginConfig, params);
  }
}
