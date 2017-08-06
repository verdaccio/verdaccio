'use strict';

module.exports = Plugin;

function Plugin(config) {
  let self = Object.create(Plugin.prototype);
  self._config = config;
  return self;
}

// plugin is expected to be compatible with...
Plugin.prototype.verdaccio_version = '1.1.0';

Plugin.prototype.allow_access = function(user, pkg, cb) {
  if (!pkg.handled_by_auth_plugin) {
    // delegate to next plugin
    return cb(null, false);
  }
  if (user.name !== this._config.allow_user) {
    let err = Error('i don\'t know anything about you');
    err.status = 403;
    return cb(err);
  }
  if (pkg.name !== this._config.to_access) {
    let err = Error('you\'re not allowed here');
    err.status = 403;
    return cb(err);
  }
  return cb(null, true);
};
