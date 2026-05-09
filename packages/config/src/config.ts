import buildDebug from 'debug';
import { isEmpty, merge } from 'lodash-es';
import assert from 'node:assert';

import { APP_ERROR, authUtils, cryptoUtils, validationUtils } from '@verdaccio/core';
import type {
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

import { getUserAgent } from './agent';
import { normalisePackageAccess } from './package-access';
import { defaultSecurity } from './security';
import defaultServerSettings from './serverSettings';
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

const TOKEN_VALID_LENGTH = 32;

/**
 * Coordinates the application configuration
 */
class Config implements AppConfig {
  public user_agent: string | undefined;
  public uplinks: any;
  public packages: PackageList;
  public users: any;
  public auth: AuthConf;
  public store: any;
  public server_id: string;
  public configPath: string;
  public storage: string | void;

  public plugins: string | void | null;
  public security: Security;
  public server: ServerSettingsConf;
  // @ts-ignore
  public secret: string;
  public flags: FlagsConfig;
  public userRateLimit: RateLimit;
  public constructor(config: ConfigYaml & { config_path: string }) {
    const self = this;
    this.storage = process.env.VERDACCIO_STORAGE_PATH || config.storage;
    if (!config.configPath) {
      config.configPath = config.config_path;
      if (!config.configPath) {
        throw new Error('configPath property is required');
      }
    }
    this.configPath = config.configPath;
    debug('config path: %s', this.configPath);
    this.plugins = config.plugins;
    this.security = merge(defaultSecurity, config.security);
    this.server = { ...defaultServerSettings, ...config.server };
    this.flags = {
      changePassword: config.flags?.changePassword ?? false,
      webLogin: config.flags?.webLogin ?? false,
      createUser: config.flags?.createUser ?? false,
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
    assert(validationUtils.isObject(config), APP_ERROR.CONFIG_NOT_VALID);

    // sanity check for strategic config properties
    strategicConfigProps.forEach(function (x): void {
      if (self[x] == null) {
        self[x] = {};
      }

      assert(validationUtils.isObject(self[x]), `CONFIG: bad "${x}" value (object expected)`);
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
      this.server_id = cryptoUtils.generateRandomHexString(6);
    }
  }

  public getConfigPath() {
    return this.configPath;
  }

  /**
   * Check for package spec
   * @param pkgName - package name
   * @returns package access
   * @deprecated use core.authUtils instead
   */
  public getMatchedPackagesSpec(pkgName: string): PackageAccess | void {
    // TODO: remove this method and replace by library utils
    return authUtils.getMatchedPackagesSpec(pkgName, this.packages);
  }

  /**
   * Verify if the secret complies with the required structure.
   * The secret must be exactly 32 characters long for aes-256-ctr encryption.
   * If no secret is provided, a new one will be generated.
   * @secret external secret key
   */
  public checkSecretKey(secret?: string): string {
    debug('checking secret key init');
    if (typeof secret === 'string' && isEmpty(secret) === false) {
      debug('checking secret key length %s', secret.length);
      if (secret.length !== TOKEN_VALID_LENGTH) {
        throw new Error(
          `Invalid storage secret key length, must be ${TOKEN_VALID_LENGTH} characters long but is ${secret.length}. ` +
            `Please generate a new one. Learn more at https://verdaccio.org/docs/configuration/#.verdaccio-db`
        );
      }
      debug('detected valid secret key length %s', secret.length);
      this.secret = secret;
      return this.secret;
    } else {
      debug('generating a new secret key');
      this.secret = generateRandomSecretKey();
      debug('generated a new secret key length %s', this.secret?.length);
      return this.secret;
    }
  }
}

export { Config };
