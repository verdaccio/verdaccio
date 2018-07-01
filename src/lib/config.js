import _ from 'lodash';
import assert from 'assert';
import minimatch from 'minimatch';

import {generateRandomHexString} from './crypto-utils';
import {normalisePackageAccess, sanityCheckUplinksProps, uplinkSanityCheck} from './config-utils';
import {getUserAgent, isObject} from './utils';
import {APP_ERROR} from './constants';

const LoggerApi = require('./logger');
const strategicConfigProps = ['uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];

/**
 * Coordinates the application configuration
 */
class Config {
  constructor(config) {
    const self = this;
    this.logger = LoggerApi.logger;

    for (let configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }

    if (_.isNil(this.user_agent)) {
      this.user_agent = getUserAgent();
    }

    // some weird shell scripts are valid yaml files parsed as string
    assert(_.isObject(config), APP_ERROR.CONFIG_NOT_VALID);

    // sanity check for strategic config properties
    strategicConfigProps.forEach(function(x) {
      if (self[x] == null) {
        self[x] = {};
      }

      assert(isObject(self[x]), `CONFIG: bad "${x}" value (object expected)`);
    });

    this.uplinks = sanityCheckUplinksProps(uplinkSanityCheck(this.uplinks));

    if (_.isNil(this.users) === false) {
      this.logger.warn(`[users]: property on configuration file 
      is not longer supported, property being ignored`);
    }

    this.packages = normalisePackageAccess(self.packages);

    // loading these from ENV if aren't in config
    allowedEnvConfig.forEach((function(v) {
      if (!(v in self)) {
        self[v] = process.env[v] || process.env[v.toUpperCase()];
      }
    }));

    // unique identifier of self server (or a cluster), used to avoid loops
    if (!this.server_id) {
      this.server_id = generateRandomHexString(6);
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
    this.secret = generateRandomHexString(32);
    return this.secret;
  }
}

module.exports = Config;
