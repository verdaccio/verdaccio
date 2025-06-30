import buildDebug from 'debug';
import _ from 'lodash';
import fs from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import { PLUGIN_PREFIX, pluginUtils } from '@verdaccio/core';

import { PluginType, isES6, isValid, tryLoad } from './utils';

const debug = buildDebug('verdaccio:plugin:loader:async');

const { lstat } = fs.promises ? fs.promises : require('fs/promises');

async function isDirectory(pathFolder: string) {
  const stat = await lstat(pathFolder);
  return stat.isDirectory();
}

function mergeConfig(appConfig: unknown, pluginConfig: unknown) {
  return _.merge({}, appConfig, pluginConfig);
}

// type Plugins<T> =
//   | pluginUtils.Auth<T>
//   | pluginUtils.Storage<T>
//   | pluginUtils.ExpressMiddleware<T, unknown, unknown>;

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
 * - If the package is not scoped, will use the default prefix: verdaccio-foo ("verdaccio-theme-" prefix for theme ui plugins).
 * - If a custom prefix is provided, the verdaccio- is replaced by the config.server.pluginPrefix.
 *
 * The `sanityCheck` is the validation for the required methods to load the plugin, if the validation fails the plugin won't be loaded.
 * The `params` is an object that contains the global configuration and the logger.
 *
 * @param {*} pluginConfigs the custom plugin section
 * @param {*} pluginOptions a set of options to initialize the plugin
 * @param {*} sanityCheck callback that check the shape that should fulfill the plugin
 * @param {*} prefix by default is verdaccio but can be override with config.server.pluginPrefix
 * @param {*} pluginCategory the category of the plugin, eg: auth, storage, middleware
 * @return {Array} list of plugins
 */
export async function asyncLoadPlugin<T extends pluginUtils.Plugin<T>>(
  pluginConfigs: any = {},
  pluginOptions: pluginUtils.PluginOptions,
  sanityCheck: (plugin: PluginType<T>) => boolean,
  legacyMergeConfigs: boolean = false,
  prefix: string = PLUGIN_PREFIX,
  pluginCategory: string = 'unknown'
): Promise<PluginType<T>[]> {
  const logger = pluginOptions?.logger;
  const pluginsIds = Object.keys(pluginConfigs);
  const { config } = pluginOptions;
  let plugins: PluginType<T>[] = [];
  for (let pluginId of pluginsIds) {
    debug('>>> looking for plugin %o', pluginId);

    const isScoped: boolean = pluginId.startsWith('@') && pluginId.includes('/');
    debug('is scoped plugin: %s', isScoped);
    const pluginName = isScoped ? pluginId : `${prefix}-${pluginId}`;
    debug('plugin package name %s', pluginName);

    // Try to load the plugin from the config.plugins path
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
      // throws if is not a directory
      try {
        await isDirectory(pluginsPath);
        const pluginDir = pluginsPath;
        const externalFilePlugin = resolve(pluginDir, pluginName);
        let plugin = tryLoad<T>(externalFilePlugin, (a: any, b: any) => {
          logger.error(a, b);
        });
        debug('external plugin %o', plugin);
        if (plugin && isValid(plugin)) {
          plugin = executePlugin(
            plugin,
            pluginConfigs[pluginId],
            pluginOptions,
            legacyMergeConfigs
          );
          if (!sanityCheck(plugin)) {
            logger.error(
              { content: externalFilePlugin },
              "@{content} doesn't look like a valid plugin"
            );
            continue;
          }
          debug('>>> plugin is running and passed sanity check');
          plugins.push(plugin);
          logger.info(
            { pluginName, pluginCategory },
            'plugin @{pluginName} successfully loaded (@{pluginCategory})'
          );
          continue;
        }
      } catch (err: any) {
        logger.warn(
          { err: err.message, pluginsPath, pluginName },
          '@{err} on loading plugins at @{pluginsPath} for @{pluginName}'
        );
      }
    }

    // Try to load the plugin from the node_modules or global based on the `require` native algorithm
    if (typeof pluginId === 'string') {
      let plugin = tryLoad<T>(pluginName, (a: any, b: any) => {
        logger.error(a, b);
      });
      if (plugin && isValid(plugin)) {
        plugin = executePlugin(plugin, pluginConfigs[pluginId], pluginOptions, legacyMergeConfigs);
        if (!sanityCheck(plugin)) {
          logger.error({ pluginName }, "@{pluginName} doesn't look like a valid plugin");
          continue;
        }
        debug('>>> plugin is running and passed sanity check');
        plugins.push(plugin);
        logger.info(
          { pluginName, pluginCategory },
          'plugin @{pluginName} successfully loaded (@{pluginCategory})'
        );
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
  debug('%o plugins found: %o', pluginCategory, plugins.length);
  return plugins;
}

export function executePlugin<T>(
  plugin: PluginType<T>,
  pluginConfig: unknown,
  pluginOptions: pluginUtils.PluginOptions,
  legacyMergeConfigs: boolean = false
): PluginType<T> {
  // this is a legacy support for plugins that are not using the new API
  if (legacyMergeConfigs) {
    debug('>>> plugin merge config enabled');
    let originalConfig = pluginOptions.config;
    pluginConfig = mergeConfig(originalConfig, pluginConfig);
  }
  if (isES6(plugin)) {
    debug('plugin is ES6');
    // @ts-expect-error no relevant for the code
    // eslint-disable-next-line new-cap
    return new plugin.default(pluginConfig, pluginOptions) as Plugin;
  } else {
    debug('plugin is commonJS');
    // @ts-expect-error improve this type
    return plugin(pluginConfig, pluginOptions) as PluginType<T>;
  }
}
