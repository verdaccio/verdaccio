'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _cryptoUtils = require('./crypto-utils');

var _configUtils = require('./config-utils');

var _utils = require('./utils');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    this.self_path = config.self_path;
    this.storage = config.storage;
    this.plugins = config.plugins;

    for (let configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }

    if (_lodash2.default.isNil(this.user_agent)) {
      this.user_agent = (0, _utils.getUserAgent)();
    }

    // some weird shell scripts are valid yaml files parsed as string
    (0, _assert2.default)(_lodash2.default.isObject(config), _constants.APP_ERROR.CONFIG_NOT_VALID);

    // sanity check for strategic config properties
    strategicConfigProps.forEach(function (x) {
      if (self[x] == null) {
        self[x] = {};
      }

      (0, _assert2.default)((0, _utils.isObject)(self[x]), `CONFIG: bad "${x}" value (object expected)`);
    });

    this.uplinks = (0, _configUtils.sanityCheckUplinksProps)((0, _configUtils.uplinkSanityCheck)(this.uplinks));

    if (_lodash2.default.isNil(this.users) === false) {
      this.logger.warn(`[users]: property on configuration file
      is not longer supported, property being ignored`);
    }

    this.packages = (0, _configUtils.normalisePackageAccess)(self.packages);

    // loading these from ENV if aren't in config
    allowedEnvConfig.forEach(envConf => {
      if (!(envConf in self)) {
        self[envConf] = process.env[envConf] || process.env[envConf.toUpperCase()];
      }
    });

    // unique identifier of self server (or a cluster), used to avoid loops
    if (!this.server_id) {
      this.server_id = (0, _cryptoUtils.generateRandomHexString)(6);
    }
  }

  /**
   * Check for package spec
   */
  getMatchedPackagesSpec(pkgName) {
    return (0, _configUtils.getMatchedPackagesSpec)(pkgName, this.packages);
  }

  /**
   * Store or create whether recieve a secret key
   */
  checkSecretKey(secret) {
    if (_lodash2.default.isString(secret) && _lodash2.default.isEmpty(secret) === false) {
      this.secret = secret;
      return secret;
    }
    // it generates a secret key
    // FUTURE: this might be an external secret key, perhaps whitin config file?
    this.secret = (0, _cryptoUtils.generateRandomHexString)(32);
    return this.secret;
  }
}

exports.default = Config;