/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */

'use strict';

const assert = require('assert');
const _ = require('lodash');
const Error = require('http-errors');
const Crypto = require('crypto');
const minimatch = require('minimatch');

const Utils = require('./utils');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

/**
 * [[a, [b, c]], d] -> [a, b, c, d]
 * @param {*} array
 * @return {Array}
 */
function flatten(array) {
  let result = [];
  for (let i=0; i<array.length; i++) {
    if (Array.isArray(array[i])) {
      result.push.apply(result, flatten(array[i]));
    } else {
      result.push(array[i]);
    }
  }
  return result;
}

/**
 * Coordinates the application configuration
 */
class Config {

  /**
   * @param {*} config config the content
   */
  constructor(config) {
    const self = this;
    for (let i in config) {
      if (self[i] == null) {
        self[i] = config[i];
      }
    }

    if (!self.user_agent) {
      self.user_agent = `${pkgName}/${pkgVersion}`;
    }

    // some weird shell scripts are valid yaml files parsed as string
    assert.equal(typeof(config), 'object', 'CONFIG: it doesn\'t look like a valid config file');

    assert(self.storage, 'CONFIG: storage path not defined');

    const users = {
      'all': true,
      'anonymous': true,
      'undefined': true,
      'owner': true,
      'none': true,
    };

    const check_user_or_uplink = function(arg) {
        assert(arg !== 'all' && arg !== 'owner'
          && arg !== 'anonymous' && arg !== 'undefined' && arg !== 'none', 'CONFIG: reserved user/uplink name: ' + arg);
        assert(!arg.match(/\s/), 'CONFIG: invalid user name: ' + arg);
        assert(users[arg] == null, 'CONFIG: duplicate user/uplink name: ' + arg);
        users[arg] = true;
      };

      // sanity check for strategic config properties
    ['users', 'uplinks', 'packages'].forEach(function(x) {
      if (self[x] == null) self[x] = {};
      assert(Utils.is_object(self[x]), `CONFIG: bad "${x}" value (object expected)`);
    });
    // sanity check for users
    for (let i in self.users) {
      if (Object.prototype.hasOwnProperty.call(self.users, i)) {
        check_user_or_uplink(i);
      }
    }
    // sanity check for uplinks
    for (let i in self.uplinks) {
      if (self.uplinks[i].cache == null) {
        self.uplinks[i].cache = true;
      }
      if (Object.prototype.hasOwnProperty.call(self.uplinks, i)) {
        check_user_or_uplink(i);
      }
    }
    for (let i in self.users) {
      if (Object.prototype.hasOwnProperty.call(self.users, i)) {
        assert(self.users[i].password, 'CONFIG: no password for user: ' + i);
        assert(typeof(self.users[i].password) === 'string' &&
          self.users[i].password.match(/^[a-f0-9]{40}$/)
          , 'CONFIG: wrong password format for user: ' + i + ', sha1 expected');
      }
    }
    for (let i in self.uplinks) {
      if (Object.prototype.hasOwnProperty.call(self.uplinks, i)) {
        assert(self.uplinks[i].url, 'CONFIG: no url for uplink: ' + i);
        assert( typeof(self.uplinks[i].url) === 'string'
          , 'CONFIG: wrong url format for uplink: ' + i);
        self.uplinks[i].url = self.uplinks[i].url.replace(/\/$/, '');
      }
    }

    /**
     * Normalise user list.
     * @return {Array}
     */
    function normalize_userlist() {
      let result = [];

      for (let i=0; i<arguments.length; i++) {
        if (arguments[i] == null) continue;

        // if it's a string, split it to array
        if (typeof(arguments[i]) === 'string') {
          result.push(arguments[i].split(/\s+/));
        } else if (Array.isArray(arguments[i])) {
          result.push(arguments[i]);
        } else {
          throw Error('CONFIG: bad package acl (array or string expected): ' + JSON.stringify(arguments[i]));
        }
      }
      return flatten(result);
    }

    // add a default rule for all packages to make writing plugins easier
    if (self.packages['**'] == null) {
      self.packages['**'] = {};
    }

    for (let i in self.packages) {
      if (Object.prototype.hasOwnProperty.call(self.packages, i)) {
        assert(
          typeof(self.packages[i]) === 'object' &&
          !Array.isArray(self.packages[i])
          , 'CONFIG: bad "'+i+'" package description (object expected)');

        self.packages[i].access = normalize_userlist(
          self.packages[i].allow_access,
          self.packages[i].access
        );
        delete self.packages[i].allow_access;

        self.packages[i].publish = normalize_userlist(
          self.packages[i].allow_publish,
          self.packages[i].publish
        );
        delete self.packages[i].allow_publish;

        self.packages[i].proxy = normalize_userlist(
          self.packages[i].proxy_access,
          self.packages[i].proxy
        );
        delete self.packages[i].proxy_access;
      }
    }

    // loading these from ENV if aren't in config
    ['http_proxy', 'https_proxy', 'no_proxy'].forEach((function(v) {
      if (!(v in self)) {
        self[v] = process.env[v] || process.env[v.toUpperCase()];
      }
    }));

    // unique identifier of self server (or a cluster), used to avoid loops
    if (!self.server_id) {
      self.server_id = Crypto.pseudoRandomBytes(6).toString('hex');
    }
  }

  /**
   * Check whether an uplink can proxy
   * @param {String} pkg package anem
   * @param {*} upLink
   * @return {Boolean}
   */
  hasProxyTo(pkg, upLink) {
    return (this.getMatchedPackagesSpec(pkg).proxy || []).reduce(function(prev, curr) {
      if (upLink === curr) {
        return true;
      }
      return prev;
    }, false);
  }

  /**
   * Check for package spec
   * @param {String} pkg package name
   * @return {Object}
   */
  getMatchedPackagesSpec(pkg) {
    for (let i in this.packages) {
      if (minimatch.makeRe(i).exec(pkg)) {
        return this.packages[i];
      }
    }
    return {};
  }

  /**
   * Store or create whether recieve a secret key
   * @param {String} secret
   * @return {String}
   */
  checkSecretKey(secret) {
    if (_.isNil(secret) === false && secret !== '') {
      this.secret = secret;
      return secret;
    }
    // it generates a secret key
    // FUTURE: this might be an external secret key, perhaps whitin config file?
    this.secret = Crypto.pseudoRandomBytes(32).toString('hex');
    return this.secret;
  }
}

module.exports = Config;
