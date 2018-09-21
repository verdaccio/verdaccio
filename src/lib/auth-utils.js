// @flow
import _ from 'lodash';
import {convertPayloadToBase64, ErrorCode} from './utils';
import {API_ERROR, HTTP_STATUS, ROLES, TIME_EXPIRATION_7D, TOKEN_BASIC, TOKEN_BEARER, CHARACTER_ENCODING} from './constants';

import type {
  RemoteUser,
  Package,
  Callback,
  Config,
  Security,
  APITokenOptions,
  JWTOptions} from '@verdaccio/types';
import type {
  CookieSessionToken, IAuthWebUI, AuthMiddlewarePayload, AuthTokenHeader, BasicPayload,
} from '../../types';
import {aesDecrypt, verifyPayload} from './crypto-utils';


/**
 * Create a RemoteUser object
 * @return {Object} { name: xx, pluginGroups: [], real_groups: [] }
 */
export function createRemoteUser(name: string, pluginGroups: Array<string>): RemoteUser {
  const isGroupValid: boolean = Array.isArray(pluginGroups);
  const groups = (isGroupValid ? pluginGroups : []).concat([
    ROLES.$ALL,
    ROLES.$AUTH,
    ROLES.DEPRECATED_ALL,
    ROLES.DEPRECATED_AUTH,
    ROLES.ALL]);

  return {
    name,
    groups,
    real_groups: pluginGroups,
  };
}


/**
 * Builds an anonymous remote user in case none is logged in.
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
export function createAnonymousRemoteUser(): RemoteUser {
  return {
    name: undefined,
    // groups without '$' are going to be deprecated eventually
    groups: [
      ROLES.$ALL,
      ROLES.$ANONYMOUS,
      ROLES.DEPRECATED_ALL,
      ROLES.DEPRECATED_ANONYMOUS,
    ],
    real_groups: [],
  };
}

export function allow_action(action: string) {
  return function(user: RemoteUser, pkg: Package, callback: Callback) {
    const {name, groups} = user;
    const hasPermission = pkg[action].some((group) => name === group || groups.includes(group));

    if (hasPermission) {
      return callback(null, true);
    }

    if (name) {
      callback(ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(ErrorCode.getForbidden(`unregistered users are not allowed to ${action} package ${pkg.name}`));
    }
  };
}

export function getDefaultPlugins() {
  return {
    authenticate(user: string, password: string, cb: Callback) {
      cb(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user(user: string, password: string, cb: Callback) {
      return cb(ErrorCode.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    allow_access: allow_action('access'),
    allow_publish: allow_action('publish'),
  };
}

export function createSessionToken(): CookieSessionToken {
  const tenHoursTime = 10 * 60 * 60 * 1000;

  return {
    // npmjs.org sets 10h expire
    expires: new Date(Date.now() + tenHoursTime),
  };
}

const defaultWebTokenOptions: JWTOptions = {
  sign: {
    expiresIn: TIME_EXPIRATION_7D,
  },
  verify: {},
};

const defaultApiTokenConf: APITokenOptions = {
    legacy: true,
    sign: {},
};

export function getSecurity(config: Config): Security {
  const defaultSecurity: Security = {
    web: defaultWebTokenOptions,
    api: defaultApiTokenConf,
  };

  if (_.isNil(config.security) === false) {
    return _.merge(defaultSecurity, config.security);
  }

  return defaultSecurity;
}

export function getAuthenticatedMessage(user: string): string {
  return `you are authenticated as '${user}'`;
}

export function buildUserBuffer(name: string, password: string) {
  return Buffer.from(`${name}:${password}`, CHARACTER_ENCODING.UTF8);
}

export function isAESLegacy(security: Security): boolean {
  const {legacy, jwt} = security.api;

  return _.isNil(legacy) === false &&_.isNil(jwt) && legacy === true;
}

export async function getApiToken(
  auth: IAuthWebUI,
  config: Config,
  remoteUser: RemoteUser,
  aesPassword: string): Promise<string> {
  const security: Security = getSecurity(config);

  if (isAESLegacy(security)) {
     // fallback all goes to AES encryption
    return await new Promise((resolve) => {
      resolve(auth.aesEncrypt(buildUserBuffer((remoteUser: any).name, aesPassword)).toString('base64'));
    });
  } else {
      // i am wiling to use here _.isNil but flow does not like it yet.
    const {jwt} = security.api;

    if (jwt && jwt.sign) {
      return await auth.jwtEncrypt(remoteUser, jwt.sign);
    } else {
      return await new Promise((resolve) => {
        resolve(auth.aesEncrypt(buildUserBuffer((remoteUser: any).name, aesPassword)).toString('base64'));
      });
  }
  }
}

export function parseAuthTokenHeader(authorizationHeader: string): AuthTokenHeader {
  const parts = authorizationHeader.split(' ');
  const [scheme, token] = parts;

  return {scheme, token};
}

export function parseBasicPayload(credentials: string): BasicPayload {
  const index = credentials.indexOf(':');
  if (index < 0) {
    return;
  }

  const user: string = credentials.slice(0, index);
  const password: string = credentials.slice(index + 1);

  return {user, password};
}

export function parseAESCredentials(
  authorizationHeader: string, secret: string) {
  const {scheme, token} = parseAuthTokenHeader(authorizationHeader);

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

export const expireReasons: Array<string> = ['JsonWebTokenError', 'TokenExpiredError'];

export function verifyJWTPayload(token: string, secret: string): RemoteUser {
  try {
    const payload: RemoteUser = (verifyPayload(token, secret): RemoteUser);

    return payload;
  } catch (error) {
    // #168 this check should be removed as soon AES encrypt is removed.
    if (expireReasons.includes(error.name)) {
      // it might be possible the jwt configuration is enabled and
      // old tokens fails still remains in usage, thus
      // we return an anonymous user to force log in.
      return createAnonymousRemoteUser();
    } else {
      throw ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, error.message);
    }
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
  } else {
    const {scheme, token} = parseAuthTokenHeader(authorizationHeader);

    if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
        return verifyJWTPayload(token, secret);
    }
  }
}
