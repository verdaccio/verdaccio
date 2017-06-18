/* eslint require-jsdoc: off */

'use strict';

let fs = require('fs');
let Path = require('path');
let utils = require('./utils');

module.exports = HTPasswd;

function HTPasswd(config, stuff) {
  let self = Object.create(HTPasswd.prototype);
  self._users = {};

  // config for this module
  self._config = config;

  // verdaccio logger
  self._logger = stuff.logger;

  // verdaccio main config object
  self._verdaccio_config = stuff.config;

  // all this "verdaccio_config" stuff is for b/w compatibility only
  self._maxusers = self._config.max_users;
  if (!self._maxusers) self._maxusers = self._verdaccio_config.max_users;
  // set maxusers to Infinity if not specified
  if (!self._maxusers) self._maxusers = Infinity;

  self._last_time = null;
  let file = self._config.file;
  if (!file) file = self._verdaccio_config.users_file;
  if (!file) throw new Error('should specify "file" in config');
  self._path = Path.resolve(Path.dirname(self._verdaccio_config.self_path), file);
  return self;
}

HTPasswd.prototype.authenticate = function(user, password, cb) {
  let self = this;
  self._reload(function(err) {
    if (err) return cb(err.code === 'ENOENT' ? null : err);
    if (!self._users[user]) return cb(null, false);
    if (!utils.verify_password(user, password, self._users[user])) return cb(null, false);

    // authentication succeeded!
    // return all usergroups this user has access to;
    // (this particular package has no concept of usergroups, so just return user herself)
    return cb(null, [user]);
  });
};

// hopefully race-condition-free way to add users:
// 1. lock file for writing (other processes can still read)
// 2. reload .htpasswd
// 3. write new data into .htpasswd.tmp
// 4. move .htpasswd.tmp to .htpasswd
// 5. reload .htpasswd
// 6. unlock file
HTPasswd.prototype.adduser = function(user, password, real_cb) {
  let self = this;

  function sanity_check() {
    let err = null;
    if (self._users[user]) {
      err = Error('this user already exists');
    } else if (Object.keys(self._users).length >= self._maxusers) {
      err = Error('maximum amount of users reached');
    }
    if (err) err.status = 403;
    return err;
  }

  // preliminary checks, just to ensure that file won't be reloaded if it's not needed
  let s_err = sanity_check();
  if (s_err) return real_cb(s_err, false);

  utils.lock_and_read(self._path, function(err, res) {
    let locked = false;

    // callback that cleans up lock first
    function cb(err) {
      if (locked) {
        utils.unlock_file(self._path, function() {
          // ignore any error from the unlock
          real_cb(err, !err);
        });
      } else {
        real_cb(err, !err);
      }
    }

    if (!err) {
      locked = true;
    }

    // ignore ENOENT errors, we'll just create .htpasswd in that case
    if (err && err.code !== 'ENOENT') return cb(err);

    let body = (res || '').toString('utf8');
    self._users = utils.parse_htpasswd(body);

    // real checks, to prevent race conditions
    let s_err = sanity_check();
    if (s_err) return cb(s_err);

    try {
      body = utils.add_user_to_htpasswd(body, user, password);
    } catch (err) {
      return cb(err);
    }
    fs.writeFile(self._path, body, function(err) {
      if (err) return cb(err);
      self._reload(function() {
        cb(null, true);
      });
    });
  });
};

HTPasswd.prototype._reload = function(_callback) {
  let self = this;

  fs.stat(self._path, function(err, stats) {
    if (err) return _callback(err);

    if (self._last_time === stats.mtime) return _callback();
    self._last_time = stats.mtime;

    fs.readFile(self._path, 'utf8', function(err, buffer) {
      if (err) return _callback(err);

      self._users = utils.parse_htpasswd(buffer);

      _callback();
    });
  });
};
