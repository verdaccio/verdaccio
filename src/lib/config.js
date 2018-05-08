const assert = require('assert');
const _ = require('lodash');
const Error = require('http-errors');
const Crypto = require('crypto');
const minimatch = require('minimatch');

const Utils = require('./utils');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;
const strategicConfigProps = ['users', 'uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];

/**
 * [[a, [b, c]], d] -> [a, b, c, d]
 * @param {*} array
 * @return {Array}
 */
function flatten(array) {
  let result = [];
  for (let i=0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      /* eslint prefer-spread: "off" */
      result.push.apply(result, flatten(array[i]));
    } else {
      result.push(array[i]);
    }
  }
  return result;
}

function checkUserOrUplink(item, users) {
  assert(item !== 'all' && item !== 'owner'
    && item !== 'anonymous' && item !== 'undefined' && item !== 'none', 'CONFIG: reserved user/uplink name: ' + item);
  assert(!item.match(/\s/), 'CONFIG: invalid user name: ' + item);
  assert(users[item] == null, 'CONFIG: duplicate user/uplink name: ' + item);
  users[item] = true;
}

/**
 * Normalise user list.
 * @return {Array}
 */
function normalizeUserlist() {
  let result = [];
  /* eslint prefer-rest-params: "off" */

  for (let i=0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      continue;
    }

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

/**
 * Coordinates the application configuration
 */
class Config {
  /**
   * @param {*} config config the content
   */
  constructor(config) {
    const self = this;
    const users = {
      all: true,
      anonymous: true,
      undefined: true,
      owner: true,
      none: true,
    };

    for (let configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }
    if (!self.user_agent) {
      self.user_agent = `${pkgName}/${pkgVersion}`;
    }

    // some weird shell scripts are valid yaml files parsed as string
    assert.equal(typeof(config), 'object', 'CONFIG: it doesn\'t look like a valid config file');

    // sanity check for strategic config properties
    strategicConfigProps.forEach(function(x) {
      if (self[x] == null) self[x] = {};
      assert(Utils.isObject(self[x]), `CONFIG: bad "${x}" value (object expected)`);
    });

    // sanity check for users
    for (let i in self.users) {
      if (Object.prototype.hasOwnProperty.call(self.users, i)) {
        checkUserOrUplink(i, users);
      }
    }
    // sanity check for uplinks
    /* eslint guard-for-in: 0 */
    for (let i in self.uplinks) {
      if (self.uplinks[i].cache == null) {
        self.uplinks[i].cache = true;
      }
      if (Object.prototype.hasOwnProperty.call(self.uplinks, i)) {
        checkUserOrUplink(i, users);
      }
    }

    for (let user in self.users) {
      if (Object.prototype.hasOwnProperty.call(self.users, user)) {
        assert(self.users[user].password, 'CONFIG: no password for user: ' + user);
        assert(typeof(self.users[user].password) === 'string' &&
          self.users[user].password.match(/^[a-f0-9]{40}$/)
          , 'CONFIG: wrong password format for user: ' + user + ', sha1 expected');
      }
    }

    for (let uplink in self.uplinks) {
      if (Object.prototype.hasOwnProperty.call(self.uplinks, uplink)) {
        assert(self.uplinks[uplink].url, 'CONFIG: no url for uplink: ' + uplink);
        assert( typeof(self.uplinks[uplink].url) === 'string'
          , 'CONFIG: wrong url format for uplink: ' + uplink);
        self.uplinks[uplink].url = self.uplinks[uplink].url.replace(/\/$/, '');
      }
    }

    // add a default rule for all packages to make writing plugins easier
    if (self.packages['**'] == null) {
      self.packages['**'] = {};
    }

    for (let pkg in self.packages) {
      if (Object.prototype.hasOwnProperty.call(self.packages, pkg)) {
        assert(
          typeof(self.packages[pkg]) === 'object' &&
          !Array.isArray(self.packages[pkg])
          , 'CONFIG: bad "'+pkg+'" package description (object expected)');

        self.packages[pkg].access = normalizeUserlist(self.packages[pkg].allow_access, self.packages[pkg].access);
        delete self.packages[pkg].allow_access;

        self.packages[pkg].publish = normalizeUserlist(self.packages[pkg].allow_publish, self.packages[pkg].publish);
        delete self.packages[pkg].allow_publish;

        self.packages[pkg].proxy = normalizeUserlist(self.packages[pkg].proxy_access, self.packages[pkg].proxy);
        delete self.packages[pkg].proxy_access;
      }
    }

    // loading these from ENV if aren't in config
    allowedEnvConfig.forEach((function(v) {
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
    if (_.isString(secret) && secret !== '') {
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
