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

export function isNodeVersionGreaterThan21() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  return major > 21 || (major === 21 && minor >= 0);
}

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
  private configOverrideOptions: { forceMigrateToSecureLegacySignature: boolean };
  // @ts-ignore
  public secret: string;
  public flags: FlagsConfig;
  public userRateLimit: RateLimit;
  public constructor(
    config: ConfigYaml & { config_path: string },
    // forceEnhancedLegacySignature is a property that
    // allows switch a new legacy aes signature token signature
    // for older versions do not want to have this new signature model
    // this property must be false
    configOverrideOptions = { forceMigrateToSecureLegacySignature: true }
  ) {
    const self = this;
    this.storage = process.env.VERDACCIO_STORAGE_PATH || config.storage;
    if (!config.configPath) {
      // backport self_path for previous to version 6
      // @ts-expect-error
      config.configPath = config.config_path ?? config.self_path;
      if (!config.configPath) {
        throw new Error('configPath property is required');
      }
    }
    this.configOverrideOptions = configOverrideOptions;
    this.configPath = config.configPath;
    this.self_path = this.configPath;
    debug('config path: %s', this.configPath);
    this.plugins = config.plugins;
    this.security = _.merge(
      // override the default security configuration via constructor
      _.merge(defaultSecurity, {
        api: {
          migrateToSecureLegacySignature:
            this.configOverrideOptions.forceMigrateToSecureLegacySignature,
        },
      }),
      config.security
    );
    this.serverSettings = serverSettings;
    this.flags = {
      searchRemote: config.flags?.searchRemote ?? true,
      changePassword: config.flags?.changePassword ?? false,
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

  public getMigrateToSecureLegacySignature() {
    return this.security.api.migrateToSecureLegacySignature;
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
   * Verify if the secret complies with the required structure
   *  - If the secret is not provided, it will generate a new one
   *    - For any Node.js version the new secret will be 32 characters long (to allow compatibility with modern Node.js versions)
   *  - If the secret is provided:
   *    - If Node.js 22 or higher, the secret must be 32 characters long thus the application will fail on startup
   *    - If Node.js 21 or lower, the secret will be used as is but will display a deprecation warning
   *    - If the property `security.api.migrateToSecureLegacySignature` is provided and set to true, the secret will be
   *      generated with the new signature model
   * @secret external secret key
   */
  public checkSecretKey(secret?: string): string {
    debug('checking secret key init');
    if (typeof secret === 'string' && _.isEmpty(secret) === false) {
      debug('checking secret key length %s', secret.length);
      if (secret.length > TOKEN_VALID_LENGTH) {
        if (isNodeVersionGreaterThan21()) {
          debug('is node version greater than 21');
          if (this.getMigrateToSecureLegacySignature() === true) {
            this.secret = generateRandomSecretKey();
            debug('rewriting secret key with length %s', this.secret.length);
            return this.secret;
          }
          // oops, user needs to generate a new secret key
          debug(
            'secret does not comply with the required length, current length  %d, application will fail on startup',
            secret.length
          );
          throw new Error(
            `Invalid storage secret key length, must be 32 characters long but is ${secret.length}. 
            The secret length in Node.js 22 or higher must be 32 characters long. Please consider generate a new one. 
            Learn more at https://verdaccio.org/docs/configuration/#.verdaccio-db`
          );
        } else {
          debug('is node version lower than 22');
          if (this.getMigrateToSecureLegacySignature() === true) {
            this.secret = generateRandomSecretKey();
            debug('rewriting secret key with length %s', this.secret.length);
            return this.secret;
          }
          debug('triggering deprecation warning for secret key length %s', secret.length);
          // still using Node.js versions previous to 22, but we need to emit a deprecation warning
          // deprecation warning, secret key is too long and must be 32
          // this will be removed in the next major release and will produce an error
          warningUtils.emit(Codes.VERWAR007);
          this.secret = secret;
          return this.secret;
        }
      } else if (secret.length === TOKEN_VALID_LENGTH) {
        debug('detected valid secret key length %s', secret.length);
        this.secret = secret;
        return this.secret;
      }
      debug('reusing previous key with length %s', secret.length);
      this.secret = secret;
      return this.secret;
    } else {
      // generate a new a secret key
      // FUTURE: this might be an external secret key, perhaps within config file?
      debug('generating a new secret key');
      this.secret = generateRandomSecretKey();
      debug('generated a new secret key length %s', this.secret?.length);

      return this.secret;
    }
  }
}

export { Config };
