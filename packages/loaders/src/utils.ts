import buildDebug from 'debug';
import _ from 'lodash';

import { logger } from '@verdaccio/logger';
import { Config } from '@verdaccio/types';

const debug = buildDebug('verdaccio:plugin:loader:utils');

const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export function mergeConfig(appConfig, pluginConfig): Config {
  return _.merge(appConfig, pluginConfig);
}

export function isValid(plugin): boolean {
  return _.isFunction(plugin) || _.isFunction(plugin.default);
}

export function isES6(plugin): boolean {
  return Object.keys(plugin).includes('default');
}

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
export function tryLoad(path: string): any {
  try {
    debug('loading plugin %s', path);
    return require(path);
  } catch (err: any) {
    if (err.code === MODULE_NOT_FOUND) {
      debug('plugin %s not found', path);
      return null;
    }
    logger.error({ err: err.msg }, 'error loading plugin @{err}');
    throw err;
  }
}
