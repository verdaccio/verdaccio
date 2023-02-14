import assert from 'assert';
import _ from 'lodash';

import { getUserAgent } from '@verdaccio/config';
import { Config as AppConfig, Logger, PackageList, RateLimit, Security } from '@verdaccio/types';
import { generateRandomHexString, getMatchedPackagesSpec } from '@verdaccio/utils';

import { MatchedPackage, StartUpConfig } from '../types';
import { defaultUserRateLimiting } from './auth-utils';
import { normalisePackageAccess, sanityCheckUplinksProps, uplinkSanityCheck } from './config-utils';
import { APP_ERROR } from './constants';
import { isObject } from './utils';

const LoggerApi = require('./logger');
const strategicConfigProps = ['uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];

/**
 * Coordinates the application configuration
 */
class Config implements AppConfig {
  public logger: Logger;
  // @ts-ignore
  public user_agent: boolean | string;
  // @ts-ignore
  public secret: string;
  public uplinks: any;
  public packages: PackageList;
  public users: any;
  public userRateLimit: RateLimit;
  public server_id: string;
  public self_path: string;
  public storage: string | void;
  public plugins: string | void;
  // @ts-ignore
  public security: Security;

  public constructor(config: StartUpConfig) {
    const self = this;
    this.logger = LoggerApi.logger;
    this.self_path = config.self_path;
    this.storage = process.env.VERDACCIO_STORAGE_PATH || config.storage;
    this.plugins = config.plugins;

    for (const configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }

    if (config?.user_agent) {
      this.user_agent = getUserAgent(config?.user_agent);
    }

    this.userRateLimit = { ...defaultUserRateLimiting, ...config?.userRateLimit };

    // some weird shell scripts are valid yaml files parsed as string
    assert(_.isObject(config), APP_ERROR.CONFIG_NOT_VALID);

    // sanity check for strategic config properties
    strategicConfigProps.forEach(function (x): void {
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
    allowedEnvConfig.forEach((envConf): void => {
      if (!(envConf in self)) {
        self[envConf] = process.env[envConf] || process.env[envConf.toUpperCase()];
      }
    });

    // unique identifier of self server (or a cluster), used to avoid loops
    // @ts-ignore
    if (!this.server_id) {
      this.server_id = generateRandomHexString(6);
    }
  }

  /**
   * Check for package spec
   */
  public getMatchedPackagesSpec(pkgName: string): MatchedPackage {
    return getMatchedPackagesSpec(pkgName, this.packages);
  }

  /**
   * Store or create whether receive a secret key
   */
  public checkSecretKey(secret: string): string {
    if (_.isString(secret) && _.isEmpty(secret) === false) {
      this.secret = secret;
      return secret;
    }
    // it generates a secret key
    // FUTURE: this might be an external secret key, perhaps within config file?
    this.secret = generateRandomHexString(32);
    return this.secret;
  }
}

export default Config;
