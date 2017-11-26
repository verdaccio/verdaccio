'use strict';

const Path = require('path');
const logger = require('./logger')();

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
function try_load(path) {
  try {
    return require(path);
  } catch(err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

/**
 * Load a plugin following the rules
 * - First try to load from the internal directory plugins (which will disappear soon or later).
 * - A seccond attempt from node_modules, in case to have multiple match as for instance verdaccio-ldap
 * and sinopia-ldap. All verdaccio prefix will have preferences.
 * @param {*} config a reference of the configuration settings
 * @param {*} plugin_configs
 * @param {*} params a set of params to initialise the plugin
 * @param {*} sanity_check callback that check the shape that should fulfill the plugin
 * @return {Array} list of plugins
 */
function load_plugins(config, plugin_configs, params, sanity_check) {
  let plugins = Object.keys(plugin_configs || {}).map(function(p) {
    let plugin;

    // try local plugins first
    plugin = try_load(Path.resolve(__dirname + '/..//plugins', p));

    // npm package
    if (plugin === null && p.match(/^[^\.\/]/)) {
      plugin = try_load(`verdaccio-${p}`);
      // compatibility for old sinopia plugins
      if (!plugin) {
        plugin = try_load(`sinopia-${p}`);
      }
    }

    if (plugin === null) {
      plugin = try_load(p);
    }

    // relative to config path
    if (plugin === null && p.match(/^\.\.?($|\/)/)) {
      plugin = try_load(Path.resolve(Path.dirname(config.self_path), p));
    }

    if (plugin === null) {
      const msg = `"${p}" plugin not found\ntry "npm install verdaccio-${p}"`;
      logger.error(msg);
      throw Error(msg);
    }

    if (typeof(plugin) !== 'function') {
      const msg = `"${p}" doesn't look like a valid plugin`;
      logger.error(msg);
      throw Error(msg);
    }

    plugin = plugin(plugin_configs[p], params);

    if (plugin === null || !sanity_check(plugin)) {
      const msg = `"${p}" doesn't look like a valid plugin`;
      logger.error(msg);
      throw Error(msg);
    }
    logger.info('Plugin successfully loaded: %s', p);
    return plugin;
  });

  return plugins;
}

exports.load_plugins = load_plugins;
