var Logger       = require('./logger')
var load_plugins = require('./plugin-loader').load_plugins
var async        = require('async')

module.exports = PackageProvider

// provides configuration and access control information for packages
function PackageProvider(config) {
  var self = Object.create(PackageProvider.prototype)
  self.config = config
  self.logger = Logger.logger.child({ sub: 'packages' })

  var plugin_params = {
    config: config,
    logger: self.logger
  }

  self.plugins = load_plugins(config.package_provider, plugin_params, 'package_provider', ['allow_access'])

  self.plugins.push(new ConfigPackageProvider({}, plugin_params))
  self.plugins.push(new DenyPackageProvider({}, plugin_params))

  return self
}

function check_plugin_result(function_name, package, arg, cb) {
  var current_result
  async.eachSeries(this.plugins, function(plugin, next) {
    if(current_result === undefined && typeof plugin[function_name] === 'function') {
      plugin[function_name](package, arg, function(error, result) {
      	if(error) {
      	  next(error)
      	} else {
      	  current_result = result
      	  next()
      	}
      })
    } else {
      next()
    }
  }, function(error) {
    if(error) {
      cb(error)
    } else {
      cb(null, current_result)
    }
  })
}

PackageProvider.prototype.allow_access = function(package, user, cb) {
  check_plugin_result.call(this, 'allow_access', package, user, cb)
}

PackageProvider.prototype.allow_publish = function(package, user, cb) {
  check_plugin_result.call(this, 'allow_publish', package, user, cb)
}

PackageProvider.prototype.proxy_access = function(package, user, cb) {
  check_plugin_result.call(this, 'proxy_access', package, user, cb)
}

PackageProvider.prototype.get_package_setting = function(package, user, cb) {
  check_plugin_result.call(this, 'get_package_setting', package, user, cb)
}


// default fallthrough package provider engine to read packages from config file
function ConfigPackageProvider(settings, params) {
  var self = Object.create(ConfigPackageProvider.prototype)
  self.config = params.config

  return self
}

ConfigPackageProvider.prototype.allow_access = function(package, user, cb) {
  var self = this
  setImmediate(function() {
  	cb(null, self.config.allow_access(package, user))
  })
}

ConfigPackageProvider.prototype.allow_publish = function(package, user, cb) {
  var self = this
  setImmediate(function() {
  	cb(null, self.config.allow_publish(package, user))
  })
}

ConfigPackageProvider.prototype.proxy_access = function(package, uplink, cb) {
  var self = this
  setImmediate(function() {
  	cb(null, self.config.proxy_access(package, uplink))
  })
}

ConfigPackageProvider.prototype.get_package_setting = function(package, setting, cb) {
  var self = this
  setImmediate(function() {
  	cb(null, self.config.get_package_setting(package, setting))
  })
}


// package provider to deny all access, used as default after everything else falls through
function DenyPackageProvider() {
  var self = Object.create(DenyPackageProvider.prototype)
  return self
}

DenyPackageProvider.prototype.allow_access = function(package, user, cb) {
  setImmediate(function() {
    cb(null, false)
  })
}

DenyPackageProvider.prototype.allow_publish = function(package, user, cb) {
  setImmediate(function() {
    cb(null, false)
  })
}

DenyPackageProvider.prototype.proxy_access = function(package, uplink, cb) {
  setImmediate(function() {
    cb(null, false)
  })
}
