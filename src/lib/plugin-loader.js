
import Path from 'path';
import logger from './logger';

/**
 * Requires a module.
 * @param {*} path the module's path
 * @return {Object}
 */
function tryLoad(path) {
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
function loadPlugin(config, plugin_configs, params, sanity_check) {
  let plugins = Object.keys(plugin_configs || {}).map(function(p) {
    let plugin;

    // try local plugins first
    plugin = tryLoad(Path.resolve(__dirname + '/..//plugins', p));

    // npm package
    if (plugin === null && p.match(/^[^\.\/]/)) {
      plugin = tryLoad(`verdaccio-${p}`);
      // compatibility for old sinopia plugins
      if (!plugin) {
        plugin = tryLoad(`sinopia-${p}`);
      }
    }

    if (plugin === null) {
      plugin = tryLoad(p);
    }

    // relative to config path
    if (plugin === null && p.match(/^\.\.?($|\/)/)) {
      plugin = tryLoad(Path.resolve(Path.dirname(config.self_path), p));
    }

    if (plugin === null) {
      logger.logger.error({content: p}, 'plugin not found. try npm install verdaccio-@{content}');
      throw Error('"' + p + '" plugin not found\ntry "npm install verdaccio-' + p + '"');
    }

    if (typeof(plugin) !== 'function') {
      logger.logger.error({content: p}, '@{content} doesn\'t look like a valid plugin');
      throw Error('"' + p + '" doesn\'t look like a valid plugin');
    }

    plugin = plugin(plugin_configs[p], params);

    if (plugin === null || !sanity_check(plugin)) {
      logger.logger.error({content: p}, '@{content} doesn\'t look like a valid plugin');
      throw Error('"' + p + '" doesn\'t look like a valid plugin');
    }
    logger.logger.info({content: p}, 'Plugin successfully loaded: @{content}');
    return plugin;
  });

  return plugins;
}

export {loadPlugin};
