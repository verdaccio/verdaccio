'use strict';

/**
 * verdaccio-docker-dummy
 *
 * A minimal, dependency-free Verdaccio auth plugin used by the
 * `docker-local-plugin` example. Every hook resolves positively, so
 * authentication and every access / publish / unpublish check always
 * returns `true`.
 *
 * It implements the classic (legacy) callback-based auth plugin API, which
 * Verdaccio 7 (`7.x-next`) still supports. Because it has no dependencies, it
 * loads as-is once copied into the `plugins` folder — no `npm install` needed.
 *
 * ⚠️  DO NOT use in production: it grants everyone full access.
 */
function DummyAuthPlugin(config, options) {
  if (!(this instanceof DummyAuthPlugin)) {
    return new DummyAuthPlugin(config, options);
  }
  this.config = config;
  this.logger = options.logger;
  return this;
}

// Always authenticate the user, returning the username as its only group.
DummyAuthPlugin.prototype.authenticate = function (user, password, cb) {
  this.logger.warn({ user }, 'docker-dummy: authenticate @{user} -> always granted');
  cb(null, [user]);
};

// Allow registering any user.
DummyAuthPlugin.prototype.adduser = function (user, password, cb) {
  cb(null, true);
};

// Always allow read access.
DummyAuthPlugin.prototype.allow_access = function (user, pkg, cb) {
  cb(null, true);
};

// Always allow publish.
DummyAuthPlugin.prototype.allow_publish = function (user, pkg, cb) {
  cb(null, true);
};

// Always allow unpublish.
DummyAuthPlugin.prototype.allow_unpublish = function (user, pkg, cb) {
  cb(null, true);
};

module.exports = DummyAuthPlugin;
