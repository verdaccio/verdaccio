var Path = require('path')

function try_load(path) {
  try {
    return require(path)
  } catch(err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null
    }
    throw err
  }
}

function load_plugins(config, plugin_configs, params, sanity_check) {
  var plugins = Object.keys(plugin_configs || {}).map(function(p) {
    var plugin

    // npm package
    if (plugin == null && p.match(/^[^\.\/]/)) {
      plugin = try_load('sinopia-' + p)
    }

    if (plugin == null) {
      plugin = try_load(p)
    }

    // relative to config path
    if (plugin == null && p.match(/^\.\.?($|\/)/)) {
      plugin = try_load(Path.resolve(Path.dirname(config.self_path), p))
    }

    if (plugin == null) {
      throw Error('"' + p + '" plugin not found\n'
        + 'try "npm install sinopia-' + p + '"')
    }

    if (typeof(plugin) !== 'function')
      throw Error('"' + p + '" doesn\'t look like a valid plugin')

    plugin = plugin(plugin_configs[p], params)

    if (plugin == null || !sanity_check(plugin))
      throw Error('"' + p + '" doesn\'t look like a valid plugin')

    return plugin
  })

  return plugins
}

exports.load_plugins = load_plugins;
