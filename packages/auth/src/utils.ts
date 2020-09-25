import _ from 'lodash';
import { Callback, Config, IPluginAuth, RemoteUser, Security } from '@verdaccio/types';
import { HTTP_STATUS, TOKEN_BASIC, TOKEN_BEARER, API_ERROR } from '@verdaccio/dev-commons';
import { getForbidden, getUnauthorized, getConflict, getCode } from '@verdaccio/commons-api';
import {
  aesDecrypt,
  AllowAction,
  AllowActionCallback,
  AuthPackageAllow,
  buildUserBuffer,
  convertPayloadToBase64,
  createAnonymousRemoteUser,
  defaultSecurity,
  verifyPayload,
} from '@verdaccio/utils';

import { IAuthWebUI, AESPayload } from './auth';

export type BasicPayload = AESPayload | void;
export type AuthMiddlewarePayload = RemoteUser | BasicPayload;

export interface AuthTokenHeader {
  scheme: string;
  token: string;
}

export function parseAuthTokenHeader(authorizationHeader: string): AuthTokenHeader {
  const parts = authorizationHeader.split(' ');
  const [scheme, token] = parts;

  return { scheme, token };
}

export function parseAESCredentials(authorizationHeader: string, secret: string) {
  const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

  // basic is deprecated and should not be enforced
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    const credentials = convertPayloadToBase64(token).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    const tokenAsBuffer = convertPayloadToBase64(token);
    const credentials = aesDecrypt(tokenAsBuffer, secret).toString('utf8');

    return credentials;
  }
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
      resolve(
        auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64')
      );
    });
  }
  // i am wiling to use here _.isNil but flow does not like it yet.
  const { jwt } = security.api;

  if (jwt?.sign) {
    return await auth.jwtEncrypt(remoteUser, jwt.sign);
  }
  return await new Promise((resolve): void => {
    resolve(
      auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64')
    );
  });
}

export function getSecurity(config: Config): Security {
  if (_.isNil(config.security) === false) {
    return _.merge(defaultSecurity, config.security);
  }

  return defaultSecurity;
}

export const expireReasons: string[] = ['JsonWebTokenError', 'TokenExpiredError'];

export function verifyJWTPayload(token: string, secret: string): RemoteUser {
  try {
    const payload: RemoteUser = verifyPayload(token, secret);

    return payload;
  } catch (error) {
    // #168 this check should be removed as soon AES encrypt is removed.
    if (expireReasons.includes(error.name)) {
      // it might be possible the jwt configuration is enabled and
      // old tokens fails still remains in usage, thus
      // we return an anonymous user to force log in.
      return createAnonymousRemoteUser();
    }
    throw getCode(HTTP_STATUS.UNAUTHORIZED, error.message);
  }
}

export function isAuthHeaderValid(authorization: string): boolean {
  return authorization.split(' ').length === 2;
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

export function getDefaultPlugins(logger: any): IPluginAuth<Config> {
  return {
    authenticate(user: string, password: string, cb: Callback): void {
      cb(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    adduser(user: string, password: string, cb: Callback): void {
      return cb(getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
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
    logger.trace({ remote: user.name }, `[auth/allow_action]: user: @{user.name}`);
    const { name, groups } = user;
    const groupAccess = pkg[action] as string[];
    const hasPermission = groupAccess.some((group) => name === group || groups.includes(group));
    logger.trace(
      { pkgName: pkg.name, hasPermission, remote: user.name, groupAccess },
      `[auth/allow_action]: hasPermission? @{hasPermission} for user: @{user}`
    );

    if (hasPermission) {
      logger.trace({ remote: user.name }, `auth/allow_action: access granted to: @{user}`);
      return callback(null, true);
    }

    if (name) {
      callback(getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(getUnauthorized(`authorization required to ${action} package ${pkg.name}`));
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
