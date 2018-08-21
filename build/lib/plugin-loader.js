'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPlugin;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
function tryLoad(path) {
  try {
    return require(path);
  } catch (err) {
    if (err.code === _constants.MODULE_NOT_FOUND) {
      return null;
    }
    throw err;
  }
}

function mergeConfig(appConfig, pluginConfig) {
  return _lodash2.default.merge(appConfig, pluginConfig);
}

function isValid(plugin) {
  return _lodash2.default.isFunction(plugin) || _lodash2.default.isFunction(plugin.default);
}

function isES6(plugin) {
  return Object.keys(plugin).includes('default');
}

/**
 * Load a plugin following the rules
 * - First try to load from the internal directory plugins (which will disappear soon or later).
 * - A second attempt from the external plugin directory
 * - A third attempt from node_modules, in case to have multiple match as for instance verdaccio-ldap
 * and sinopia-ldap. All verdaccio prefix will have preferences.
 * @param {*} config a reference of the configuration settings
 * @param {*} pluginConfigs
 * @param {*} params a set of params to initialise the plugin
 * @param {*} sanityCheck callback that check the shape that should fulfill the plugin
 * @return {Array} list of plugins
 */
function loadPlugin(config, pluginConfigs = {}, params, sanityCheck) {
  return Object.keys(pluginConfigs).map(pluginId => {
    let plugin;

    // try local plugins first
    plugin = tryLoad(_path2.default.resolve(__dirname + '/../plugins', pluginId));

    // try the external plugin directory
    if (plugin === null && config.plugins) {
      const pluginDir = config.plugins;
      plugin = tryLoad(_path2.default.resolve(pluginDir, pluginId));

      // npm package
      if (plugin === null && pluginId.match(/^[^\.\/]/)) {
        plugin = tryLoad(_path2.default.resolve(pluginDir, `verdaccio-${pluginId}`));
        // compatibility for old sinopia plugins
        if (!plugin) {
          plugin = tryLoad(_path2.default.resolve(pluginDir, `sinopia-${pluginId}`));
        }
      }
    }

    // npm package
    if (plugin === null && pluginId.match(/^[^\.\/]/)) {
      plugin = tryLoad(`verdaccio-${pluginId}`);
      // compatibility for old sinopia plugins
      if (!plugin) {
        plugin = tryLoad(`sinopia-${pluginId}`);
      }
    }

    if (plugin === null) {
      plugin = tryLoad(pluginId);
    }

    // relative to config path
    if (plugin === null && pluginId.match(/^\.\.?($|\/)/)) {
      plugin = tryLoad(_path2.default.resolve(_path2.default.dirname(config.self_path), pluginId));
    }

    if (plugin === null) {
      _logger2.default.logger.error({ content: pluginId }, 'plugin not found. try npm install verdaccio-@{content}');
      throw Error('"' + pluginId + '" plugin not found\ntry "npm install verdaccio-' + pluginId + '"');
    }

    if (!isValid(plugin)) {
      _logger2.default.logger.error({ content: pluginId }, '@{content} doesn\'t look like a valid plugin');
      throw Error('"' + pluginId + '" doesn\'t look like a valid plugin');
    }
    /* eslint new-cap:off */
    plugin = isES6(plugin) ? new plugin.default(mergeConfig(config, pluginConfigs[pluginId]), params) : plugin(pluginConfigs[pluginId], params);
    /* eslint new-cap:off */

    if (plugin === null || !sanityCheck(plugin)) {
      _logger2.default.logger.error({ content: pluginId }, '@{content} doesn\'t look like a valid plugin');
      throw Error('"' + pluginId + '" doesn\'t look like a valid plugin');
    }
    _logger2.default.logger.warn({ content: pluginId }, 'Plugin successfully loaded: @{content}');
    return plugin;
  });
}