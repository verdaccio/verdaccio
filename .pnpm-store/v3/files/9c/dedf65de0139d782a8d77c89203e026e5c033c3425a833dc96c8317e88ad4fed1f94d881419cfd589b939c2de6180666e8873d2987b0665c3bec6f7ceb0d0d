"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadPlugin;

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _logger = require("./logger");

var _constants = require("./constants");

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
  return _lodash.default.merge(appConfig, pluginConfig);
}

function isValid(plugin) {
  return _lodash.default.isFunction(plugin) || _lodash.default.isFunction(plugin.default);
}

function isES6(plugin) {
  return Object.keys(plugin).includes('default');
} // export type PluginGeneric<R, T extends IPlugin<R> = ;

/**
 * Load a plugin following the rules
 * - First try to load from the internal directory plugins (which will disappear soon or later).
 * - A second attempt from the external plugin directory
 * - A third attempt from node_modules, in case to have multiple match as for instance verdaccio-ldap
 * and sinopia-ldap. All verdaccio prefix will have preferences.
 * @param {*} config a reference of the configuration settings
 * @param {*} pluginConfigs
 * @param {*} params a set of params to initialize the plugin
 * @param {*} sanityCheck callback that check the shape that should fulfill the plugin
 * @return {Array} list of plugins
 */


function loadPlugin(config, pluginConfigs = {}, params, sanityCheck, prefix = 'verdaccio') {
  return Object.keys(pluginConfigs).map(pluginId => {
    let plugin;

    const localPlugin = _path.default.resolve(__dirname + '/../plugins', pluginId); // try local plugins first


    plugin = tryLoad(localPlugin); // try the external plugin directory

    if (plugin === null && config.plugins) {
      const pluginDir = config.plugins;

      const externalFilePlugin = _path.default.resolve(pluginDir, pluginId);

      plugin = tryLoad(externalFilePlugin); // npm package

      if (plugin === null && pluginId.match(/^[^\.\/]/)) {
        plugin = tryLoad(_path.default.resolve(pluginDir, `${prefix}-${pluginId}`)); // compatibility for old sinopia plugins

        if (!plugin) {
          plugin = tryLoad(_path.default.resolve(pluginDir, `sinopia-${pluginId}`));
        }
      }
    } // npm package


    if (plugin === null && pluginId.match(/^[^\.\/]/)) {
      plugin = tryLoad(`${prefix}-${pluginId}`); // compatibility for old sinopia plugins

      if (!plugin) {
        plugin = tryLoad(`sinopia-${pluginId}`);
      }
    }

    if (plugin === null) {
      plugin = tryLoad(pluginId);
    } // relative to config path


    if (plugin === null && pluginId.match(/^\.\.?($|\/)/)) {
      plugin = tryLoad(_path.default.resolve(_path.default.dirname(config.self_path), pluginId));
    }

    if (plugin === null) {
      _logger.logger.error({
        content: pluginId,
        prefix
      }, 'plugin not found. try npm install @{prefix}-@{content}');

      throw Error(`
        ${prefix}-${pluginId} plugin not found. try "npm install ${prefix}-${pluginId}"`);
    }

    if (!isValid(plugin)) {
      _logger.logger.error({
        content: pluginId
      }, "@{prefix}-@{content} plugin does not have the right code structure");

      throw Error(`"${pluginId}" plugin does not have the right code structure`);
    }
    /* eslint new-cap:off */


    try {
      plugin = isES6(plugin) ? new plugin.default(mergeConfig(config, pluginConfigs[pluginId]), params) : plugin(pluginConfigs[pluginId], params);
    } catch (error) {
      plugin = null;

      _logger.logger.error({
        error,
        pluginId
      }, "error loading a plugin @{pluginId}: @{error}");
    }
    /* eslint new-cap:off */


    if (plugin === null || !sanityCheck(plugin)) {
      _logger.logger.error({
        content: pluginId,
        prefix
      }, "@{prefix}-@{content} doesn't look like a valid plugin");

      throw Error(`sanity check has failed, "${pluginId}" is not a valid plugin`);
    }

    _logger.logger.warn({
      content: pluginId,
      prefix
    }, 'Plugin successfully loaded: @{prefix}-@{content}');

    return plugin;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcGx1Z2luLWxvYWRlci50cyJdLCJuYW1lcyI6WyJ0cnlMb2FkIiwicGF0aCIsInJlcXVpcmUiLCJlcnIiLCJjb2RlIiwiTU9EVUxFX05PVF9GT1VORCIsIm1lcmdlQ29uZmlnIiwiYXBwQ29uZmlnIiwicGx1Z2luQ29uZmlnIiwiXyIsIm1lcmdlIiwiaXNWYWxpZCIsInBsdWdpbiIsImlzRnVuY3Rpb24iLCJkZWZhdWx0IiwiaXNFUzYiLCJPYmplY3QiLCJrZXlzIiwiaW5jbHVkZXMiLCJsb2FkUGx1Z2luIiwiY29uZmlnIiwicGx1Z2luQ29uZmlncyIsInBhcmFtcyIsInNhbml0eUNoZWNrIiwicHJlZml4IiwibWFwIiwicGx1Z2luSWQiLCJsb2NhbFBsdWdpbiIsIlBhdGgiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwicGx1Z2lucyIsInBsdWdpbkRpciIsImV4dGVybmFsRmlsZVBsdWdpbiIsIm1hdGNoIiwiZGlybmFtZSIsInNlbGZfcGF0aCIsImxvZ2dlciIsImVycm9yIiwiY29udGVudCIsIkVycm9yIiwid2FybiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7O0FBS0EsU0FBU0EsT0FBVCxDQUFpQkMsSUFBakIsRUFBb0M7QUFDbEMsTUFBSTtBQUNGLFdBQU9DLE9BQU8sQ0FBQ0QsSUFBRCxDQUFkO0FBQ0QsR0FGRCxDQUVFLE9BQU9FLEdBQVAsRUFBWTtBQUNaLFFBQUlBLEdBQUcsQ0FBQ0MsSUFBSixLQUFhQywyQkFBakIsRUFBbUM7QUFDakMsYUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBTUYsR0FBTjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0csV0FBVCxDQUFxQkMsU0FBckIsRUFBZ0NDLFlBQWhDLEVBQXNEO0FBQ3BELFNBQU9DLGdCQUFFQyxLQUFGLENBQVFILFNBQVIsRUFBbUJDLFlBQW5CLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxPQUFULENBQWlCQyxNQUFqQixFQUFrQztBQUNoQyxTQUFPSCxnQkFBRUksVUFBRixDQUFhRCxNQUFiLEtBQXdCSCxnQkFBRUksVUFBRixDQUFhRCxNQUFNLENBQUNFLE9BQXBCLENBQS9CO0FBQ0Q7O0FBRUQsU0FBU0MsS0FBVCxDQUFlSCxNQUFmLEVBQWdDO0FBQzlCLFNBQU9JLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZTCxNQUFaLEVBQW9CTSxRQUFwQixDQUE2QixTQUE3QixDQUFQO0FBQ0QsQyxDQUVEOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQVllLFNBQVNDLFVBQVQsQ0FDYkMsTUFEYSxFQUViQyxhQUFrQixHQUFHLEVBRlIsRUFHYkMsTUFIYSxFQUliQyxXQUphLEVBS2JDLE1BQWMsR0FBRyxXQUxKLEVBTU47QUFDUCxTQUFPUixNQUFNLENBQUNDLElBQVAsQ0FBWUksYUFBWixFQUEyQkksR0FBM0IsQ0FDSkMsUUFBRCxJQUFrQztBQUNoQyxRQUFJZCxNQUFKOztBQUVBLFVBQU1lLFdBQVcsR0FBR0MsY0FBS0MsT0FBTCxDQUFhQyxTQUFTLEdBQUcsYUFBekIsRUFBd0NKLFFBQXhDLENBQXBCLENBSGdDLENBSWhDOzs7QUFDQWQsSUFBQUEsTUFBTSxHQUFHWixPQUFPLENBQUMyQixXQUFELENBQWhCLENBTGdDLENBT2hDOztBQUNBLFFBQUlmLE1BQU0sS0FBSyxJQUFYLElBQW1CUSxNQUFNLENBQUNXLE9BQTlCLEVBQXVDO0FBQ3JDLFlBQU1DLFNBQVMsR0FBR1osTUFBTSxDQUFDVyxPQUF6Qjs7QUFDQSxZQUFNRSxrQkFBa0IsR0FBR0wsY0FBS0MsT0FBTCxDQUFhRyxTQUFiLEVBQXdCTixRQUF4QixDQUEzQjs7QUFDQWQsTUFBQUEsTUFBTSxHQUFHWixPQUFPLENBQUNpQyxrQkFBRCxDQUFoQixDQUhxQyxDQUtyQzs7QUFDQSxVQUFJckIsTUFBTSxLQUFLLElBQVgsSUFBbUJjLFFBQVEsQ0FBQ1EsS0FBVCxDQUFlLFVBQWYsQ0FBdkIsRUFBbUQ7QUFDakR0QixRQUFBQSxNQUFNLEdBQUdaLE9BQU8sQ0FBQzRCLGNBQUtDLE9BQUwsQ0FBYUcsU0FBYixFQUF5QixHQUFFUixNQUFPLElBQUdFLFFBQVMsRUFBOUMsQ0FBRCxDQUFoQixDQURpRCxDQUVqRDs7QUFDQSxZQUFJLENBQUNkLE1BQUwsRUFBYTtBQUNYQSxVQUFBQSxNQUFNLEdBQUdaLE9BQU8sQ0FBQzRCLGNBQUtDLE9BQUwsQ0FBYUcsU0FBYixFQUF5QixXQUFVTixRQUFTLEVBQTVDLENBQUQsQ0FBaEI7QUFDRDtBQUNGO0FBQ0YsS0FyQitCLENBdUJoQzs7O0FBQ0EsUUFBSWQsTUFBTSxLQUFLLElBQVgsSUFBbUJjLFFBQVEsQ0FBQ1EsS0FBVCxDQUFlLFVBQWYsQ0FBdkIsRUFBbUQ7QUFDakR0QixNQUFBQSxNQUFNLEdBQUdaLE9BQU8sQ0FBRSxHQUFFd0IsTUFBTyxJQUFHRSxRQUFTLEVBQXZCLENBQWhCLENBRGlELENBRWpEOztBQUNBLFVBQUksQ0FBQ2QsTUFBTCxFQUFhO0FBQ1hBLFFBQUFBLE1BQU0sR0FBR1osT0FBTyxDQUFFLFdBQVUwQixRQUFTLEVBQXJCLENBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJZCxNQUFNLEtBQUssSUFBZixFQUFxQjtBQUNuQkEsTUFBQUEsTUFBTSxHQUFHWixPQUFPLENBQUMwQixRQUFELENBQWhCO0FBQ0QsS0FsQytCLENBb0NoQzs7O0FBQ0EsUUFBSWQsTUFBTSxLQUFLLElBQVgsSUFBbUJjLFFBQVEsQ0FBQ1EsS0FBVCxDQUFlLGNBQWYsQ0FBdkIsRUFBdUQ7QUFDckR0QixNQUFBQSxNQUFNLEdBQUdaLE9BQU8sQ0FBQzRCLGNBQUtDLE9BQUwsQ0FBYUQsY0FBS08sT0FBTCxDQUFhZixNQUFNLENBQUNnQixTQUFwQixDQUFiLEVBQTZDVixRQUE3QyxDQUFELENBQWhCO0FBQ0Q7O0FBRUQsUUFBSWQsTUFBTSxLQUFLLElBQWYsRUFBcUI7QUFDbkJ5QixxQkFBT0MsS0FBUCxDQUFhO0FBQUVDLFFBQUFBLE9BQU8sRUFBRWIsUUFBWDtBQUFxQkYsUUFBQUE7QUFBckIsT0FBYixFQUE0Qyx3REFBNUM7O0FBQ0EsWUFBTWdCLEtBQUssQ0FBRTtVQUNYaEIsTUFBTyxJQUFHRSxRQUFTLHVDQUFzQ0YsTUFBTyxJQUFHRSxRQUFTLEdBRG5FLENBQVg7QUFFRDs7QUFFRCxRQUFJLENBQUNmLE9BQU8sQ0FBQ0MsTUFBRCxDQUFaLEVBQXNCO0FBQ3BCeUIscUJBQU9DLEtBQVAsQ0FBYTtBQUFFQyxRQUFBQSxPQUFPLEVBQUViO0FBQVgsT0FBYixFQUFvQyxvRUFBcEM7O0FBQ0EsWUFBTWMsS0FBSyxDQUFFLElBQUdkLFFBQVMsaURBQWQsQ0FBWDtBQUNEO0FBRUQ7OztBQUNFLFFBQUk7QUFDQWQsTUFBQUEsTUFBTSxHQUFHRyxLQUFLLENBQUNILE1BQUQsQ0FBTCxHQUFnQixJQUFJQSxNQUFNLENBQUNFLE9BQVgsQ0FBbUJSLFdBQVcsQ0FBQ2MsTUFBRCxFQUFTQyxhQUFhLENBQUNLLFFBQUQsQ0FBdEIsQ0FBOUIsRUFBaUVKLE1BQWpFLENBQWhCLEdBQTJGVixNQUFNLENBQUNTLGFBQWEsQ0FBQ0ssUUFBRCxDQUFkLEVBQTBCSixNQUExQixDQUExRztBQUNILEtBRkQsQ0FFRSxPQUFPZ0IsS0FBUCxFQUFjO0FBQ1oxQixNQUFBQSxNQUFNLEdBQUcsSUFBVDs7QUFDQXlCLHFCQUFPQyxLQUFQLENBQWE7QUFBRUEsUUFBQUEsS0FBRjtBQUFTWixRQUFBQTtBQUFULE9BQWIsRUFBa0MsOENBQWxDO0FBQ0g7QUFDSDs7O0FBRUEsUUFBSWQsTUFBTSxLQUFLLElBQVgsSUFBbUIsQ0FBQ1csV0FBVyxDQUFDWCxNQUFELENBQW5DLEVBQTZDO0FBQzNDeUIscUJBQU9DLEtBQVAsQ0FBYTtBQUFFQyxRQUFBQSxPQUFPLEVBQUViLFFBQVg7QUFBcUJGLFFBQUFBO0FBQXJCLE9BQWIsRUFBNEMsdURBQTVDOztBQUNBLFlBQU1nQixLQUFLLENBQUUsNkJBQTRCZCxRQUFTLHlCQUF2QyxDQUFYO0FBQ0Q7O0FBRURXLG1CQUFPSSxJQUFQLENBQVk7QUFBRUYsTUFBQUEsT0FBTyxFQUFFYixRQUFYO0FBQXFCRixNQUFBQTtBQUFyQixLQUFaLEVBQTJDLGtEQUEzQzs7QUFDQSxXQUFPWixNQUFQO0FBQ0QsR0FyRUksQ0FBUDtBQXVFRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IENvbmZpZywgSVBsdWdpbiB9IGZyb20gJ0B2ZXJkYWNjaW8vdHlwZXMnO1xuaW1wb3J0IHsgTU9EVUxFX05PVF9GT1VORCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBSZXF1aXJlcyBhIG1vZHVsZS5cbiAqIEBwYXJhbSB7Kn0gcGF0aCB0aGUgbW9kdWxlJ3MgcGF0aFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiB0cnlMb2FkKHBhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUocGF0aCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gTU9EVUxFX05PVF9GT1VORCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZUNvbmZpZyhhcHBDb25maWcsIHBsdWdpbkNvbmZpZyk6IENvbmZpZyB7XG4gIHJldHVybiBfLm1lcmdlKGFwcENvbmZpZywgcGx1Z2luQ29uZmlnKTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZChwbHVnaW4pOiBib29sZWFuIHtcbiAgcmV0dXJuIF8uaXNGdW5jdGlvbihwbHVnaW4pIHx8IF8uaXNGdW5jdGlvbihwbHVnaW4uZGVmYXVsdCk7XG59XG5cbmZ1bmN0aW9uIGlzRVM2KHBsdWdpbik6IGJvb2xlYW4ge1xuICByZXR1cm4gT2JqZWN0LmtleXMocGx1Z2luKS5pbmNsdWRlcygnZGVmYXVsdCcpO1xufVxuXG4vLyBleHBvcnQgdHlwZSBQbHVnaW5HZW5lcmljPFIsIFQgZXh0ZW5kcyBJUGx1Z2luPFI+ID0gO1xuXG4vKipcbiAqIExvYWQgYSBwbHVnaW4gZm9sbG93aW5nIHRoZSBydWxlc1xuICogLSBGaXJzdCB0cnkgdG8gbG9hZCBmcm9tIHRoZSBpbnRlcm5hbCBkaXJlY3RvcnkgcGx1Z2lucyAod2hpY2ggd2lsbCBkaXNhcHBlYXIgc29vbiBvciBsYXRlcikuXG4gKiAtIEEgc2Vjb25kIGF0dGVtcHQgZnJvbSB0aGUgZXh0ZXJuYWwgcGx1Z2luIGRpcmVjdG9yeVxuICogLSBBIHRoaXJkIGF0dGVtcHQgZnJvbSBub2RlX21vZHVsZXMsIGluIGNhc2UgdG8gaGF2ZSBtdWx0aXBsZSBtYXRjaCBhcyBmb3IgaW5zdGFuY2UgdmVyZGFjY2lvLWxkYXBcbiAqIGFuZCBzaW5vcGlhLWxkYXAuIEFsbCB2ZXJkYWNjaW8gcHJlZml4IHdpbGwgaGF2ZSBwcmVmZXJlbmNlcy5cbiAqIEBwYXJhbSB7Kn0gY29uZmlnIGEgcmVmZXJlbmNlIG9mIHRoZSBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gKiBAcGFyYW0geyp9IHBsdWdpbkNvbmZpZ3NcbiAqIEBwYXJhbSB7Kn0gcGFyYW1zIGEgc2V0IG9mIHBhcmFtcyB0byBpbml0aWFsaXplIHRoZSBwbHVnaW5cbiAqIEBwYXJhbSB7Kn0gc2FuaXR5Q2hlY2sgY2FsbGJhY2sgdGhhdCBjaGVjayB0aGUgc2hhcGUgdGhhdCBzaG91bGQgZnVsZmlsbCB0aGUgcGx1Z2luXG4gKiBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiBwbHVnaW5zXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRQbHVnaW48VCBleHRlbmRzIElQbHVnaW48VD4+KFxuICBjb25maWc6IENvbmZpZyxcbiAgcGx1Z2luQ29uZmlnczogYW55ID0ge30sXG4gIHBhcmFtczogYW55LFxuICBzYW5pdHlDaGVjazogYW55LFxuICBwcmVmaXg6IHN0cmluZyA9ICd2ZXJkYWNjaW8nXG4pOiBhbnlbXSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwbHVnaW5Db25maWdzKS5tYXAoXG4gICAgKHBsdWdpbklkOiBzdHJpbmcpOiBJUGx1Z2luPFQ+ID0+IHtcbiAgICAgIGxldCBwbHVnaW47XG5cbiAgICAgIGNvbnN0IGxvY2FsUGx1Z2luID0gUGF0aC5yZXNvbHZlKF9fZGlybmFtZSArICcvLi4vcGx1Z2lucycsIHBsdWdpbklkKTtcbiAgICAgIC8vIHRyeSBsb2NhbCBwbHVnaW5zIGZpcnN0XG4gICAgICBwbHVnaW4gPSB0cnlMb2FkKGxvY2FsUGx1Z2luKTtcblxuICAgICAgLy8gdHJ5IHRoZSBleHRlcm5hbCBwbHVnaW4gZGlyZWN0b3J5XG4gICAgICBpZiAocGx1Z2luID09PSBudWxsICYmIGNvbmZpZy5wbHVnaW5zKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbkRpciA9IGNvbmZpZy5wbHVnaW5zO1xuICAgICAgICBjb25zdCBleHRlcm5hbEZpbGVQbHVnaW4gPSBQYXRoLnJlc29sdmUocGx1Z2luRGlyLCBwbHVnaW5JZCk7XG4gICAgICAgIHBsdWdpbiA9IHRyeUxvYWQoZXh0ZXJuYWxGaWxlUGx1Z2luKTtcblxuICAgICAgICAvLyBucG0gcGFja2FnZVxuICAgICAgICBpZiAocGx1Z2luID09PSBudWxsICYmIHBsdWdpbklkLm1hdGNoKC9eW15cXC5cXC9dLykpIHtcbiAgICAgICAgICBwbHVnaW4gPSB0cnlMb2FkKFBhdGgucmVzb2x2ZShwbHVnaW5EaXIsIGAke3ByZWZpeH0tJHtwbHVnaW5JZH1gKSk7XG4gICAgICAgICAgLy8gY29tcGF0aWJpbGl0eSBmb3Igb2xkIHNpbm9waWEgcGx1Z2luc1xuICAgICAgICAgIGlmICghcGx1Z2luKSB7XG4gICAgICAgICAgICBwbHVnaW4gPSB0cnlMb2FkKFBhdGgucmVzb2x2ZShwbHVnaW5EaXIsIGBzaW5vcGlhLSR7cGx1Z2luSWR9YCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBucG0gcGFja2FnZVxuICAgICAgaWYgKHBsdWdpbiA9PT0gbnVsbCAmJiBwbHVnaW5JZC5tYXRjaCgvXlteXFwuXFwvXS8pKSB7XG4gICAgICAgIHBsdWdpbiA9IHRyeUxvYWQoYCR7cHJlZml4fS0ke3BsdWdpbklkfWApO1xuICAgICAgICAvLyBjb21wYXRpYmlsaXR5IGZvciBvbGQgc2lub3BpYSBwbHVnaW5zXG4gICAgICAgIGlmICghcGx1Z2luKSB7XG4gICAgICAgICAgcGx1Z2luID0gdHJ5TG9hZChgc2lub3BpYS0ke3BsdWdpbklkfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwbHVnaW4gPT09IG51bGwpIHtcbiAgICAgICAgcGx1Z2luID0gdHJ5TG9hZChwbHVnaW5JZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbGF0aXZlIHRvIGNvbmZpZyBwYXRoXG4gICAgICBpZiAocGx1Z2luID09PSBudWxsICYmIHBsdWdpbklkLm1hdGNoKC9eXFwuXFwuPygkfFxcLykvKSkge1xuICAgICAgICBwbHVnaW4gPSB0cnlMb2FkKFBhdGgucmVzb2x2ZShQYXRoLmRpcm5hbWUoY29uZmlnLnNlbGZfcGF0aCksIHBsdWdpbklkKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwbHVnaW4gPT09IG51bGwpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgY29udGVudDogcGx1Z2luSWQsIHByZWZpeCB9LCAncGx1Z2luIG5vdCBmb3VuZC4gdHJ5IG5wbSBpbnN0YWxsIEB7cHJlZml4fS1Ae2NvbnRlbnR9Jyk7XG4gICAgICAgIHRocm93IEVycm9yKGBcbiAgICAgICAgJHtwcmVmaXh9LSR7cGx1Z2luSWR9IHBsdWdpbiBub3QgZm91bmQuIHRyeSBcIm5wbSBpbnN0YWxsICR7cHJlZml4fS0ke3BsdWdpbklkfVwiYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNWYWxpZChwbHVnaW4pKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGNvbnRlbnQ6IHBsdWdpbklkIH0sIFwiQHtwcmVmaXh9LUB7Y29udGVudH0gcGx1Z2luIGRvZXMgbm90IGhhdmUgdGhlIHJpZ2h0IGNvZGUgc3RydWN0dXJlXCIpO1xuICAgICAgICB0aHJvdyBFcnJvcihgXCIke3BsdWdpbklkfVwiIHBsdWdpbiBkb2VzIG5vdCBoYXZlIHRoZSByaWdodCBjb2RlIHN0cnVjdHVyZWApO1xuICAgICAgfVxuXG4gICAgICAvKiBlc2xpbnQgbmV3LWNhcDpvZmYgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBsdWdpbiA9IGlzRVM2KHBsdWdpbikgPyBuZXcgcGx1Z2luLmRlZmF1bHQobWVyZ2VDb25maWcoY29uZmlnLCBwbHVnaW5Db25maWdzW3BsdWdpbklkXSksIHBhcmFtcykgOiBwbHVnaW4ocGx1Z2luQ29uZmlnc1twbHVnaW5JZF0sIHBhcmFtcyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBudWxsO1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZXJyb3IsIHBsdWdpbklkIH0sIFwiZXJyb3IgbG9hZGluZyBhIHBsdWdpbiBAe3BsdWdpbklkfTogQHtlcnJvcn1cIik7XG4gICAgICAgIH1cbiAgICAgIC8qIGVzbGludCBuZXctY2FwOm9mZiAqL1xuXG4gICAgICBpZiAocGx1Z2luID09PSBudWxsIHx8ICFzYW5pdHlDaGVjayhwbHVnaW4pKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGNvbnRlbnQ6IHBsdWdpbklkLCBwcmVmaXggfSwgXCJAe3ByZWZpeH0tQHtjb250ZW50fSBkb2Vzbid0IGxvb2sgbGlrZSBhIHZhbGlkIHBsdWdpblwiKTtcbiAgICAgICAgdGhyb3cgRXJyb3IoYHNhbml0eSBjaGVjayBoYXMgZmFpbGVkLCBcIiR7cGx1Z2luSWR9XCIgaXMgbm90IGEgdmFsaWQgcGx1Z2luYCk7XG4gICAgICB9XG5cbiAgICAgIGxvZ2dlci53YXJuKHsgY29udGVudDogcGx1Z2luSWQsIHByZWZpeCB9LCAnUGx1Z2luIHN1Y2Nlc3NmdWxseSBsb2FkZWQ6IEB7cHJlZml4fS1Ae2NvbnRlbnR9Jyk7XG4gICAgICByZXR1cm4gcGx1Z2luO1xuICAgIH1cbiAgKTtcbn1cbiJdfQ==