import assert from 'assert';
import _ from 'lodash';
import buildDebug from 'debug';

import { generateRandomHexString, isObject } from '@verdaccio/utils';
import { APP_ERROR } from '@verdaccio/commons-api';
import {
  PackageList,
  Config as AppConfig,
  ConfigRuntime,
  Security,
  PackageAccess,
  AuthConf,
} from '@verdaccio/types';

import { generateRandomSecretKey } from './token';
import { getMatchedPackagesSpec, normalisePackageAccess } from './package-access';
import { sanityCheckUplinksProps, uplinkSanityCheck } from './uplinks';
import { defaultSecurity } from './security';
import { getUserAgent } from './agent';

const strategicConfigProps = ['uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];

export type MatchedPackage = PackageAccess | void;

const debug = buildDebug('verdaccio:config');

export const WEB_TITLE = 'Verdaccio';

/**
 * Coordinates the application configuration
 */
class Config implements AppConfig {
  public user_agent: string;
  public uplinks: any;
  public packages: PackageList;
  public users: any;
  public auth: AuthConf;
  public server_id: string;
  public config_path: string;
  public storage: string | void;
  public plugins: string | void;
  public security: Security;
  // @ts-ignore
  public secret: string;

  public constructor(config: ConfigRuntime) {
    const self = this;
    this.storage = config.storage;
    this.config_path = config.config_path;
    this.plugins = config.plugins;
    this.security = _.merge(defaultSecurity, config.security);

    for (const configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }

    // @ts-ignore
    if (_.isNil(this.user_agent)) {
      this.user_agent = getUserAgent();
    }

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
    debug('check secret key');
    if (_.isString(secret) && _.isEmpty(secret) === false) {
      this.secret = secret;
      debug('reusing previous key');
      return secret;
    }
    // it generates a secret key
    // FUTURE: this might be an external secret key, perhaps within config file?
    debug('generate a new key');
    this.secret = generateRandomSecretKey();
    return this.secret;
  }
}

export { Config };
