import assert from 'assert';
import buildDebug from 'debug';
import _ from 'lodash';

import { APP_ERROR, warningUtils } from '@verdaccio/core';
import { Codes } from '@verdaccio/core/build/warning-utils';
import {
  Config as AppConfig,
  AuthConf,
  ConfigYaml,
  FlagsConfig,
  PackageAccess,
  PackageList,
  RateLimit,
  Security,
  ServerSettingsConf,
} from '@verdaccio/types';
import { generateRandomHexString, getMatchedPackagesSpec, isObject } from '@verdaccio/utils';

import { getUserAgent } from './agent';
import { normalisePackageAccess } from './package-access';
import { defaultSecurity } from './security';
import serverSettings from './serverSettings';
import { generateRandomSecretKey } from './token';
import { sanityCheckUplinksProps, uplinkSanityCheck } from './uplinks';

const strategicConfigProps = ['uplinks', 'packages'];
const allowedEnvConfig = ['http_proxy', 'https_proxy', 'no_proxy'];
const debug = buildDebug('verdaccio:config');

export const WEB_TITLE = 'Verdaccio';

// we limit max 1000 request per 15 minutes on user endpoints
export const defaultUserRateLimiting = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
};

/**
 * Coordinates the application configuration
 */
class Config implements AppConfig {
  public user_agent: string | undefined;
  public uplinks: any;
  public packages: PackageList;
  public users: any;
  public auth: AuthConf;
  public server_id: string;
  public configPath: string;
  /**
   * @deprecated use configPath or config.getConfigPath();
   */
  public self_path: string;
  public storage: string | void;

  public plugins: string | void | null;
  public security: Security;
  public serverSettings: ServerSettingsConf;
  // @ts-ignore
  public secret: string;
  public flags: FlagsConfig;
  public userRateLimit: RateLimit;
  private configOptions: { forceEnhancedLegacySignature: boolean };
  public constructor(
    config: ConfigYaml & { config_path: string },
    configOptions = { forceEnhancedLegacySignature: true }
  ) {
    const self = this;
    this.configOptions = configOptions;
    this.storage = process.env.VERDACCIO_STORAGE_PATH || config.storage;
    if (!config.configPath) {
      // backport self_path for previous to version 6
      // @ts-expect-error
      config.configPath = config.config_path ?? config.self_path;
      if (!config.configPath) {
        throw new Error('configPath property is required');
      }
    }
    this.configPath = config.configPath;
    this.self_path = this.configPath;
    debug('config path: %s', this.configPath);
    this.plugins = config.plugins;
    this.security = _.merge(defaultSecurity, config.security);
    this.serverSettings = serverSettings;
    this.flags = {
      searchRemote: config.flags?.searchRemote ?? true,
    };
    this.user_agent = config.user_agent;

    for (const configProp in config) {
      if (self[configProp] == null) {
        self[configProp] = config[configProp];
      }
    }

    if (typeof this.user_agent === 'undefined') {
      // by default user agent is hidden
      debug('set default user agent');
      this.user_agent = getUserAgent(false);
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

  public getConfigPath() {
    return this.configPath;
  }

  /**
   * Check for package spec
   */
  public getMatchedPackagesSpec(pkgName: string): PackageAccess | void {
    // TODO: remove this method and replace by library utils
    return getMatchedPackagesSpec(pkgName, this.packages);
  }

  /**
   * Store or create whether receive a secret key
   * @secret external secret key
   */
  public checkSecretKey(secret?: string): string {
    debug('check secret key');
    if (typeof secret === 'string' && _.isEmpty(secret) === false) {
      this.secret = secret;
      debug('reusing previous key');
      return secret;
    }
    // generate a new a secret key
    // FUTURE: this might be an external secret key, perhaps within config file?
    debug('generate a new key');
    //
    if (this.configOptions.forceEnhancedLegacySignature) {
      this.secret = generateRandomSecretKey();
    } else {
      this.secret =
        this.security.enhancedLegacySignature === true
          ? generateRandomSecretKey()
          : generateRandomHexString(32);
      // set this to false allow use old token signature and is not recommended
      // only use for migration reasons, major release will remove this property and
      // set it by default
      if (this.security.enhancedLegacySignature === false) {
        warningUtils.emit(Codes.VERWAR005);
      }
    }

    debug('generated a new secret key %s', this.secret?.length);
    return this.secret;
  }
}

export { Config };
