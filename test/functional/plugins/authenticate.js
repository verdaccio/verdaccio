
module.exports = Plugin

function Plugin(config, stuff) {
  var self = Object.create(Plugin.prototype)
  self._config = config
  return self
}

// plugin is expected to be compatible with...
Plugin.prototype.sinopia_version = '1.1.0'

Plugin.prototype.authenticate = function(user, password, cb) {
  var self = this
  if (user !== self._config.accept_user) {
    // delegate to next plugin
    return cb(null, false)
  }
  if (password !== self._config.with_password) {
    var err = Error("i don't like your password")
    err.status = 403
    return cb(err)
  }
  return cb(null, [ user ])
}

