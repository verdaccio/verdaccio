import buildDebug from 'debug';
import _ from 'lodash';

import { createAnonymousRemoteUser } from '@verdaccio/config';
import {
  API_ERROR,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  errorUtils,
  pluginUtils,
} from '@verdaccio/core';
import {
  aesDecrypt,
  aesDecryptDeprecated,
  parseBasicPayload,
  verifyPayload,
} from '@verdaccio/signature';
import { AuthPackageAllow, Config, Logger, RemoteUser, Security } from '@verdaccio/types';

import {
  ActionsAllowed,
  AllowAction,
  AllowActionCallback,
  AuthMiddlewarePayload,
  AuthTokenHeader,
  TokenEncryption,
} from './types';

const debug = buildDebug('verdaccio:auth:utils');

/**
 * Split authentication header eg: Bearer [secret_token]
 * @param authorizationHeader auth token
 */
export function parseAuthTokenHeader(authorizationHeader: string): AuthTokenHeader {
  const parts = authorizationHeader.split(' ');
  const [scheme, token] = parts;

  return { scheme, token };
}

export function parseAESCredentials(authorizationHeader: string, secret: string) {
  debug('parseAESCredentials init');
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  // basic is deprecated and should not be enforced
  // basic is currently being used for functional test
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    debug('legacy header basic');
    const credentials = convertPayloadToBase64(token).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    debug('legacy header bearer');
    debug('secret length %o', secret.length);
    const isLegacyUnsecure = secret.length > 32;
    debug('is legacy unsecure %o', isLegacyUnsecure);
    if (isLegacyUnsecure) {
      debug('legacy unsecure enabled');
      return aesDecryptDeprecated(convertPayloadToBase64(token), secret).toString('utf-8');
    } else {
      debug('legacy secure enabled');
      return aesDecrypt(token.toString(), secret);
    }
  }
}

export function getMiddlewareCredentials(
  security: Security,
  secretKey: string,
  authorizationHeader: string
): AuthMiddlewarePayload {
  debug('getMiddlewareCredentials init');
  // comment out for debugging purposes
  if (isAESLegacy(security)) {
    debug('is legacy');
    const credentials = parseAESCredentials(authorizationHeader, secretKey);
    if (!credentials) {
      debug('parse legacy credentials failed');
      return;
    }

    const parsedCredentials = parseBasicPayload(credentials);
    if (!parsedCredentials) {
      debug('parse legacy basic payload credentials failed');
      return;
    }

    return parsedCredentials;
  }
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  debug('is jwt');
  if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    return verifyJWTPayload(token, secretKey);
  }
}

export function isAESLegacy(security: Security): boolean {
  const { legacy, jwt } = security.api;

  return _.isNil(legacy) === false && _.isNil(jwt) && legacy === true;
}

export async function getApiToken(
  auth: TokenEncryption,
  config: Config,
  remoteUser: RemoteUser,
  aesPassword: string
): Promise<string | void> {
  debug('get api token');
  const { security } = config;

  if (isAESLegacy(security)) {
    debug('security legacy enabled');
    // fallback all goes to AES encryption
    return await new Promise((resolve): void => {
      resolve(auth.aesEncrypt(buildUser(remoteUser.name as string, aesPassword)));
    });
  }
  const { jwt } = security.api;

  if (jwt?.sign) {
    return await auth.jwtEncrypt(remoteUser, jwt.sign);
  }
  return await new Promise((resolve): void => {
    resolve(auth.aesEncrypt(buildUser(remoteUser.name as string, aesPassword)));
  });
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
    throw errorUtils.getCode(HTTP_STATUS.UNAUTHORIZED, error.message);
  }
}

export function isAuthHeaderValid(authorization: string): boolean {
  return authorization.split(' ').length === 2;
}

/**
 * Return a default configuration for authentication if none is provided.
 * @param logger {Logger}
 * @returns object of default implementations.
 */
export function getDefaultPlugins(logger: Logger): pluginUtils.Auth<Config> {
  return {
    authenticate(_user: string, _password: string, cb: pluginUtils.AuthCallback): void {
      debug('triggered default authenticate method');
      cb(errorUtils.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    adduser(_user: string, _password: string, cb: pluginUtils.AuthUserCallback): void {
      debug('triggered default adduser method');
      return cb(errorUtils.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    // @ts-ignore
    allow_access: allow_action('access', logger),
    // @ts-ignore
    allow_publish: allow_action('publish', logger),
    allow_unpublish: handleSpecialUnpublish(logger),
  };
}

export function allow_action(action: ActionsAllowed, logger: Logger): AllowAction {
  return function allowActionCallback(
    user: RemoteUser,
    pkg: AuthPackageAllow,
    callback: AllowActionCallback
  ): void {
    logger.trace({ remote: user.name }, `[auth/allow_action]: user: @{remote}`);
    const { name, groups } = user;
    debug('allow_action "%s": groups %s', action, groups);
    const groupAccess = pkg[action] as string[];
    debug('allow_action "%s": groupAccess %s', action, groupAccess);
    const hasPermission = groupAccess.some((group) => {
      return name === group || groups.includes(group);
    });
    debug('package "%s" has permission "%s"', name, hasPermission);
    logger.trace(
      { pkgName: pkg.name, hasPermission, remote: user.name, groupAccess },
      `[auth/allow_action]: hasPermission? @{hasPermission} for user: @{remote}, package: @{pkgName}`
    );

    if (hasPermission) {
      logger.trace({ remote: user.name }, `auth/allow_action: access granted to: @{remote}`);
      return callback(null, true);
    }

    if (name) {
      callback(
        errorUtils.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`)
      );
    } else {
      callback(
        errorUtils.getUnauthorized(`authorization required to ${action} package ${pkg.name}`)
      );
    }
  };
}

/**
 *
 */
export function handleSpecialUnpublish(logger: Logger): any {
  return function (user: RemoteUser, pkg: AuthPackageAllow, callback: AllowActionCallback): void {
    const action = 'unpublish';
    // verify whether the unpublish prop has been defined
    const isUnpublishMissing: boolean = !pkg[action];
    debug('is unpublish method missing ? %s', isUnpublishMissing);
    const hasGroups: boolean = isUnpublishMissing ? false : (pkg[action] as string[]).length > 0;
    logger.trace(
      { user: user.name, name: pkg.name, hasGroups },
      `fallback unpublish for @{name} has groups: @{hasGroups} for @{user}`
    );

    if (isUnpublishMissing || hasGroups === false) {
      return callback(null, undefined);
    }

    logger.trace(
      { user: user.name, name: pkg.name, action, hasGroups },
      `allow_action for @{action} for @{name} has groups: @{hasGroups} for @{user}`
    );
    return allow_action(action, logger)(user, pkg, callback);
  };
}

export function buildUser(name: string, password: string): string {
  return String(`${name}:${password}`);
}

export function convertPayloadToBase64(payload: string): Buffer {
  return Buffer.from(payload, 'base64');
}
