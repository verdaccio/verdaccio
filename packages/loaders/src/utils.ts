import buildDebug from 'debug';
import _ from 'lodash';

import { pluginUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:plugin:loader:utils');
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export type PluginType<T> = T extends pluginUtils.Plugin<T> ? T : never;

export function isValid<T>(plugin: PluginType<T>): boolean {
  // @ts-expect-error default not relevant
  return _.isFunction(plugin) || _.isFunction(plugin.default);
}

export function isES6<T>(plugin: PluginType<T>): boolean {
  return Object.keys(plugin).includes('default');
}

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
export function tryLoad<T>(path: string, onError: any): PluginType<T> | null {
  try {
    debug('loading plugin %s', path);
    return require(path) as PluginType<T>;
  } catch (err: any) {
    if (err.code === MODULE_NOT_FOUND) {
      debug('"require" failed for plugin %s', path);
      // If loading fails, because a dependency is missing,
      // we want to log the error message and require stack
      // to see where the missing dependency is.
      const message = err.message.replace(/\\\\/g, '\\').split('\n');
      if (!message[0].includes(path)) {
        debug('%o', message[0]); // error message
        debug('%o', message.slice(1)); // stack trace
      }
      return null;
    }
    onError({ err: err.msg }, 'error loading plugin @{err}');
    throw err;
  }
}
