import buildDebug from 'debug';
import _ from 'lodash';

import { createAnonymousRemoteUser } from '@verdaccio/config';
import {
  API_ERROR,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  VerdaccioError,
  errorUtils,
} from '@verdaccio/core';
import {
  AuthPackageAllow,
  Callback,
  Config,
  IPluginAuth,
  RemoteUser,
  Security,
} from '@verdaccio/types';

import { AESPayload, TokenEncryption } from './auth';
import { verifyPayload } from './jwt-token';
import { aesDecrypt } from './legacy-token';
import { parseBasicPayload } from './token';

const debug = buildDebug('verdaccio:auth:utils');

export type BasicPayload = AESPayload | void;
export type AuthMiddlewarePayload = RemoteUser | BasicPayload;

export interface AuthTokenHeader {
  scheme: string;
  token: string;
}
export type AllowActionCallbackResponse = boolean | undefined;
export type AllowActionCallback = (
  error: VerdaccioError | null,
  allowed?: AllowActionCallbackResponse
) => void;

export type AllowAction = (
  user: RemoteUser,
  pkg: AuthPackageAllow,
  callback: AllowActionCallback
) => void;

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
  debug('parseAESCredentials');
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  // basic is deprecated and should not be enforced
  // basic is currently being used for functional test
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    debug('legacy header basic');
    const credentials = convertPayloadToBase64(token).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    debug('legacy header bearer');
    const credentials = aesDecrypt(token, secret);

    return credentials;
  }
}

export function getMiddlewareCredentials(
  security: Security,
  secretKey: string,
  authorizationHeader: string
): AuthMiddlewarePayload {
  debug('getMiddlewareCredentials');
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

export function getDefaultPlugins(logger: any): IPluginAuth<Config> {
  return {
    authenticate(user: string, password: string, cb: Callback): void {
      cb(errorUtils.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    adduser(user: string, password: string, cb: Callback): void {
      return cb(errorUtils.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    // FIXME: allow_action and allow_publish should be in the @verdaccio/types
    // @ts-ignore
    allow_access: allow_action('access', logger),
    // @ts-ignore
    allow_publish: allow_action('publish', logger),
    allow_unpublish: handleSpecialUnpublish(logger),
  };
}

export type ActionsAllowed = 'publish' | 'unpublish' | 'access';

export function allow_action(action: ActionsAllowed, logger): AllowAction {
  return function allowActionCallback(
    user: RemoteUser,
    pkg: AuthPackageAllow,
    callback: AllowActionCallback
  ): void {
    logger.trace({ remote: user.name }, `[auth/allow_action]: user: @{remote}`);
    const { name, groups } = user;
    const groupAccess = pkg[action] as string[];
    const hasPermission = groupAccess.some((group) => name === group || groups.includes(group));
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
export function handleSpecialUnpublish(logger): any {
  return function (user: RemoteUser, pkg: AuthPackageAllow, callback: AllowActionCallback): void {
    const action = 'unpublish';
    // verify whether the unpublish prop has been defined
    const isUnpublishMissing: boolean = _.isNil(pkg[action]);
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
