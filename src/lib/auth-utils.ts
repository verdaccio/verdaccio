import buildDebug from 'debug';
import _ from 'lodash';

import { createAnonymousRemoteUser } from '@verdaccio/config';
import { pluginUtils } from '@verdaccio/core';
import { aesDecrypt, verifyPayload } from '@verdaccio/signature';
import {
  APITokenOptions,
  Callback,
  Config,
  JWTOptions,
  Package,
  RemoteUser,
  Security,
} from '@verdaccio/types';
import { buildUserBuffer } from '@verdaccio/utils';

import { AuthMiddlewarePayload, AuthTokenHeader, BasicPayload, IAuthWebUI } from '../types';
import {
  API_ERROR,
  DEFAULT_MIN_LIMIT_PASSWORD,
  HTTP_STATUS,
  TIME_EXPIRATION_1H,
  TOKEN_BASIC,
  TOKEN_BEARER,
} from './constants';
import { logger } from './logger';
import { ErrorCode, buildUser, convertPayloadToBase64 } from './utils';

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

export function isAESLegacy(security: Security): boolean {
  const { legacy, jwt } = security.api;

  return _.isNil(legacy) === false && _.isNil(jwt) && legacy === true;
}

export async function getApiToken(
  auth: IAuthWebUI,
  config: Config,
  remoteUser: RemoteUser,
  aesPassword: string
): Promise<string> {
  const security: Security = getSecurity(config);
  if (isAESLegacy(security)) {
    // fallback all goes to AES encryption
    return await new Promise((resolve): void => {
      resolve(auth.aesEncrypt(buildUser(remoteUser.name as string, aesPassword)) as string);
    });
  }
  // i am wiling to use here _.isNil but flow does not like it yet.
  const { jwt } = security.api;

  if (jwt && jwt.sign) {
    return await auth.jwtEncrypt(remoteUser, jwt.sign);
  }
  return await new Promise((resolve): void => {
    resolve(auth.aesEncrypt(buildUser(remoteUser.name as string, aesPassword)) as string);
  });
}

export function parseAuthTokenHeader(authorizationHeader: string): AuthTokenHeader {
  const parts = authorizationHeader.split(' ');
  const [scheme, token] = parts;

  return { scheme, token };
}

export function parseBasicPayload(credentials: string): BasicPayload {
  const index = credentials.indexOf(':');
  if (index < 0) {
    return;
  }

  const user: string = credentials.slice(0, index);
  const password: string = credentials.slice(index + 1);

  return { user, password };
}

export function parseAESCredentials(authorizationHeader: string, secret: string) {
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  // basic is deprecated and should not be enforced
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    const credentials = convertPayloadToBase64(token).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    const credentials = aesDecrypt(token.toString(), secret);

    return credentials;
  }
}

export const expireReasons: string[] = ['JsonWebTokenError', 'TokenExpiredError'];

export function verifyJWTPayload(token: string, secret: string): RemoteUser {
  try {
    const payload: RemoteUser = verifyPayload(token, secret);

    return payload;
  } catch (error: any) {
    // #168 this check should be removed as soon AES encrypt is removed.
    if (expireReasons.includes(error.name)) {
      // it might be possible the jwt configuration is enabled and
      // old tokens fails still remains in usage, thus
      // we return an anonymous user to force log in.
      return createAnonymousRemoteUser();
    }
    throw ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, error.message);
  }
}

export function isAuthHeaderValid(authorization: string): boolean {
  return authorization.split(' ').length === 2;
}

export function getMiddlewareCredentials(
  security: Security,
  secret: string,
  authorizationHeader: string
): AuthMiddlewarePayload {
  if (isAESLegacy(security)) {
    const credentials = parseAESCredentials(authorizationHeader, secret);
    if (!credentials) {
      return;
    }

    const parsedCredentials = parseBasicPayload(credentials);
    if (!parsedCredentials) {
      return;
    }

    return parsedCredentials;
  }
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    return verifyJWTPayload(token, secret);
  }
}
