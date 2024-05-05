import buildDebug from 'debug';
import _ from 'lodash';

import { pluginUtils } from '@verdaccio/core';
import {
  APITokenOptions,
  Callback,
  Config,
  JWTOptions,
  Package,
  RemoteUser,
  Security,
} from '@verdaccio/types';

import { API_ERROR, DEFAULT_MIN_LIMIT_PASSWORD, TIME_EXPIRATION_1H } from './constants';
import { logger } from './logger';
import { ErrorCode } from './utils';

const debug = buildDebug('verdaccio');

export function validatePassword(
  password: string, // pragma: allowlist secret
  minLength: number = DEFAULT_MIN_LIMIT_PASSWORD
): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

export function allow_action(action: string): Function {
  return function (user: RemoteUser, pkg: Package, callback: Callback): void {
    debug('[auth/allow_action]: user: %o', user?.name);
    const { name, groups } = user;
    const groupAccess = pkg[action];
    const hasPermission = groupAccess.some((group) => name === group || groups.includes(group));
    debug('[auth/allow_action]: hasPermission? %o} for user: %o', hasPermission, user?.name);

    if (hasPermission) {
      logger.info({ user: user.name }, `auth/allow_action: access granted to: @{user}`);
      return callback(null, true);
    }

    if (name) {
      callback(
        ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`)
      );
    } else {
      callback(
        ErrorCode.getUnauthorized(`authorization required to ${action} package ${pkg.name}`)
      );
    }
  };
}

/**
 *
 */
export function handleSpecialUnpublish(): any {
  return function (user: RemoteUser, pkg: Package, callback: Callback): void {
    const action = 'unpublish';
    // verify whether the unpublish prop has been defined
    const isUnpublishMissing: boolean = _.isNil(pkg[action]);
    const hasGroups: boolean = isUnpublishMissing ? false : pkg[action].length > 0;
    debug('fallback unpublish for @{name} has groups: %o for %o', hasGroups, user?.name);
    if (isUnpublishMissing || hasGroups === false) {
      return callback(null, undefined);
    }
    debug('allow_action for %o for %o has groups: %o for %o', action, user?.name, hasGroups, user);
    return allow_action(action)(user, pkg, callback);
  };
}

export function getDefaultPlugins(logger: any): pluginUtils.Auth<Config> {
  return {
    authenticate(_user: string, _password: string, cb: Callback): void {
      // pragma: allowlist secret
      cb(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user(_user: string, _password: string, cb: Callback): void {
      // pragma: allowlist secret
      return cb(ErrorCode.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    // FIXME: allow_action and allow_publish should be in the @verdaccio/types
    // @ts-ignore
    allow_access: allow_action('access', logger),
    // @ts-ignore
    allow_publish: allow_action('publish', logger),
    allow_unpublish: handleSpecialUnpublish(),
  };
}

const defaultWebTokenOptions: JWTOptions = {
  sign: {
    // The expiration token for the website is 1 hour
    expiresIn: TIME_EXPIRATION_1H,
  },
  verify: {},
};

const defaultApiTokenConf: APITokenOptions = {
  legacy: true,
  migrateToSecureLegacySignature: false,
};

export const defaultSecurity: Security = {
  web: defaultWebTokenOptions,
  api: defaultApiTokenConf,
};

export function getSecurity(config: Config): Security {
  if (_.isNil(config.security) === false) {
    return _.merge(defaultSecurity, config.security);
  }

  return defaultSecurity;
}
