
function load_plugins(plugin_configs, params, type, required_functions) {
  var plugins = Object.keys(plugin_configs || {}).map(function(p) {
    var plugin, name
    try {
      name = 'sinopia-' + p
      plugin = require(name)
    } catch(x) {
      try {
        name = p
        plugin = require(name)
      } catch(x) {}
    }

    if (plugin == null) {
      throw Error('"' + p + '" plugin not found\n'
        + 'try "npm install sinopia-' + p + '"')
    }

    if (typeof(plugin) !== 'function')
      throw Error('"' + name + '" doesn\'t look like a valid plugin')

    plugin = plugin(plugin_configs[p], params)

    if (plugin == null)
      throw Error('"' + name + '" doesn\'t look like a valid plugin')

    if(required_functions) {
      for(var i = 0; i < required_functions.length; ++i) {
        if(typeof plugin[required_functions[i]] !== 'function')
          throw Error('"' + name + '" doesn\'t look like a valid ' + type + ' plugin')
      }
    }

    return plugin
  })

  return plugins
}

exports.load_plugins = load_plugins;
