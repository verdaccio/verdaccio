import buildDebug from 'debug';
import { lstat } from 'fs/promises';
import { dirname, isAbsolute, join, resolve } from 'path';

import { logger } from '@verdaccio/logger';
import { Config, IPlugin, Logger } from '@verdaccio/types';

import { isES6, isValid, tryLoad } from './utils';

const debug = buildDebug('verdaccio:plugin:loader:async');

async function isDirectory(pathFolder) {
  const stat = await lstat(pathFolder);
  return stat.isDirectory();
}

export type Params = { config: Config; logger: Logger };

/**
 * The plugin loader find recursively plugins, if one plugin fails is ignored and report the error to the logger.
 *
 * The loader follows the order:
 * - If the at the `config.yaml` file the  `plugins: ./plugins` is defined
 *   - If is absolute will use the provided path
 *   - If is relative, will use the base path of the config file. eg: /root/config.yaml the plugins folder should be
 *     hosted at /root/plugins
 * - The next step is find at the node_modules or global based on the `require` native algorithm.
 * - If the package is scoped eg: @scope/foo, try to load the package `@scope/foo`
 * - If the package is not scoped, will use the default prefix: verdaccio-foo.
 * - If a custom prefix is provided, the verdaccio- is replaced by the config.server.pluginPrefix.
 *
 * The `sanityCheck` is the validation for the required methods to load the plugin, if the validation fails the plugin won't be loaded.
 * The `params` is an object that contains the global configuration and the logger.
 *
 * @param {*} pluginConfigs the custom plugin section
 * @param {*} params a set of params to initialize the plugin
 * @param {*} sanityCheck callback that check the shape that should fulfill the plugin
 * @param {*} prefix by default is verdaccio but can be override with config.server.pluginPrefix
 * @return {Array} list of plugins
 */
export async function asyncLoadPlugin<T extends IPlugin<T>>(
  pluginConfigs: any = {},
  params: Params,
  sanityCheck: any,
  prefix: string = 'verdaccio'
): Promise<any> {
  const pluginsIds = Object.keys(pluginConfigs);
  const { config } = params;
  let plugins: any[] = [];
  for (let pluginId of pluginsIds) {
    debug('plugin %s', pluginId);
    if (typeof config.plugins === 'string') {
      let pluginsPath = config.plugins;
      debug('plugin path %s', pluginsPath);
      if (!isAbsolute(pluginsPath)) {
        if (typeof config.config_path === 'string' && !config.configPath) {
          logger.error(
            'configPath is missing and the legacy config.config_path is not available for loading plugins'
          );
        }

        if (!config.configPath) {
          logger.error('config path property is required for loading plugins');
          continue;
        }
        pluginsPath = resolve(join(dirname(config.configPath), pluginsPath));
      }

      logger.debug({ path: pluginsPath }, 'plugins folder defined, loading plugins from @{path} ');
      // throws if is nto a directory
      try {
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
      } catch (err: any) {
        logger.warn(
          { err: err.message, pluginsPath, pluginId },
          '@{err} on loading plugins at @{pluginsPath} for @{pluginId}'
        );
      }
    }

    if (typeof pluginId === 'string') {
      const isScoped: boolean = pluginId.startsWith('@') && pluginId.includes('/');
      debug('is scoped plugin %s', isScoped);
      const pluginName = isScoped ? pluginId : `${prefix}-${pluginId}`;
      debug('plugin pkg name %s', pluginName);
      let plugin = tryLoad(pluginName);
      if (plugin && isValid(plugin)) {
        plugin = executePlugin(plugin, pluginConfigs[pluginId], params);
        if (!sanityCheck(plugin)) {
          logger.error({ content: pluginName }, "@{content} doesn't look like a valid plugin");
          continue;
        }
        plugins.push(plugin);
        continue;
      } else {
        logger.error(
          { pluginName },
          'package not found, try to install @{pluginName} with a package manager'
        );
        continue;
      }
    }
  }
  debug('plugin found %s', plugins.length);
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
