/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */

'use strict';
const _ = require('lodash');
const assert = require('assert');
const Crypto = require('crypto');
const Error = require('http-errors');
const minimatch = require('minimatch');
const Utils = require('./utils');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

const integrityPackages = ['users', 'uplinks', 'packages'];
const integrityProxy = ['http_proxy', 'https_proxy', 'no_proxy'];

/**
 * [[a, [b, c]], d] -> [a, b, c, d]
 * @param {*} array
 * @return {Array}
 */
function flatten(array) {
	const result = [];
	for (let i = 0; i < array.length; i++) {
		if (_.isArray(array[i])) {
			result.push.apply(result, flatten(array[i]));
		} else {
			result.push(array[i]);
		}
	}
	return result;
}

const parse_interval_table = {
	'': 1000,
	'ms': 1,
	's': 1000,
	'm': 60*1000,
	'h': 60*60*1000,
	'd': 86400000,
	'w': 7*86400000,
	'M': 30*86400000,
	'y': 365*86400000,
};

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

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
function parse_interval(interval) {
	if (typeof(interval) === 'number') {
		return interval * 1000;
	}
	let result = 0;
	let last_suffix = Infinity;
	interval.split(/\s+/).forEach(function(x) {
		if (!x) return;
		let m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
		if (!m
		|| parse_interval_table[m[4]] >= last_suffix
		|| (m[4] === '' && last_suffix !== Infinity)) {
			throw Error('invalid interval: ' + interval);
		}
		last_suffix = parse_interval_table[m[4]];
		result += Number(m[1]) * parse_interval_table[m[4]];
	});
	return result;
}

/**
 * Normalise user list.
 * @return {Array}
 */
function normalize_userlist() {
  const result = [];

  for (let i = 0; i<arguments.length; i++) {
    if (_.isNil(arguments[i])) {
      continue;
    }
    // if it's a string, split it to array
    if (_.isString(arguments[i])) {
      result.push(arguments[i].split(/\s+/));
    } else if (_.isArray(arguments[i])) {
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
	 * Constructor
	 * @param {*} defaultConfig config the content
	 */
	constructor(defaultConfig) {
		const self = this;

    // some weird shell scripts are valid yaml files parsed as string
    assert.equal(_.isObject(defaultConfig), true, 'CONFIG: it doesn\'t look like a valid config file');

    this._mixConfigProperties(defaultConfig);

		this._setUserAgent();

		assert(self.storage, 'CONFIG: storage path not defined');

		// sanity check for strategic config properties
    integrityPackages.forEach(function(x) {
			if (_.isNil(self[x])) {
			  self[x] = {};
      }
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

		this._setDefaultPackage();

		this._safetyCheckPackages();

		this._loadEnvironmentProxies();

		this._generateServerId();
	}

  /**
   * Mix the external configuration file.
   * @param {object} defaultConfig
   * @private
   */
  _mixConfigProperties(defaultConfig) {
    for (let i in defaultConfig) {
      if (_.isNil(this[i])) {
        this[i] = defaultConfig[i];
      }
    }
  }

  /**
   * Set the user agent.
   * @private
   */
	_setUserAgent() {
    if (!this.user_agent) {
      this.user_agent = `${pkgName}/${pkgVersion}`;
    }
  }

  /**
   *
   * @private
   */
	_setDefaultPackage() {
    // add a default rule for all packages to make writing plugins easier
    if (_.isNil(this.packages['**'])) {
      this.packages['**'] = {};
    }
  }

  /**
   *
   * @private
   */
	_loadEnvironmentProxies() {
    // loading these from ENV if aren't in config
    integrityProxy.forEach(((v) => {
      if (!(v in this)) {
        this[v] = process.env[v] || process.env[v.toUpperCase()];
      }
    }));
  }

  /**
   * unique identifier of self server (or a cluster), used to avoid loops
   * @private
   */
	_generateServerId() {
    if (!this.server_id) {
      this.server_id = Crypto.pseudoRandomBytes(6).toString('hex');
    }
  }

  /**
   *
   * @private
   */
	_safetyCheckPackages() {
    for (let i in this.packages) {
      if (Object.prototype.hasOwnProperty.call(this.packages, i)) {
        // validate integrity packages
        assert(_.isObject(this.packages[i]) && _.isArray(this.packages[i]) === false, 'CONFIG: bad "'+i+'" package description (object expected)');

        this.packages[i].access = normalize_userlist(
          this.packages[i].allow_access,
          this.packages[i].access
        );
        delete this.packages[i].allow_access;

        this.packages[i].publish = normalize_userlist(
          this.packages[i].allow_publish,
          this.packages[i].publish
        );
        delete this.packages[i].allow_publish;

        this.packages[i].proxy = normalize_userlist(
          this.packages[i].proxy_access,
          this.packages[i].proxy
        );
        delete this.packages[i].proxy_access;
      }
    }
  }

	/**
	 * Check whether an uplink can proxy
	 * @param {*} pkg
	 * @param {*} uplink
	 * @return {Boolean}
	 */
	can_proxy_to(pkg, uplink) {
    const compatibleProxies = this.get_package_spec(pkg).proxy || [];
		return (compatibleProxies).reduce(function(prev, curr) {
			return uplink === curr ? true : prev;
		}, false);
	}

	/**
	 * Check for package spec.
	 * @param {String} pkgName
	 * @return {Object}
	 */
	get_package_spec(pkgName) {
		for (let pkg in this.packages) {
			if (minimatch.makeRe(pkg).exec(pkgName)) {
				return this.packages[pkg];
			}
		}
		return {};
	}
}

module.exports = Config;
module.exports.parse_interval = parse_interval;
