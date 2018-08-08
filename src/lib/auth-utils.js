// @flow
import _ from 'lodash';
import {buildBase64Buffer, ErrorCode} from './utils';
import {API_ERROR, HTTP_STATUS, ROLES, TIME_EXPIRATION_7D, TOKEN_BASIC, TOKEN_BEARER} from './constants';

import type {
  RemoteUser,
  Package,
  Callback,
  Config,
  Security,
  APITokenOptions,
  JWTOptions} from '@verdaccio/types';
import type {CookieSessionToken, IAuthWebUI, JWTPayload} from '../../types';
import {aesDecrypt, verifyPayload} from './crypto-utils';

/**
 * Builds an anonymous user in case none is logged in.
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
export function buildAnonymousUser() {
  return {
    name: undefined,
    // groups without '$' are going to be deprecated eventually
    groups: [ROLES.$ALL, ROLES.$ANONYMOUS, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_ANONUMOUS],
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
  return {
    // npmjs.org sets 10h expire
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
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
  return new Buffer(`${name}:${password}`);
}

function isAESLegacy(security: Security): boolean {
  return _.isNil(security.api.legacy) === false &&
    _.isNil(security.api.jwt) &&
    security.api.legacy === true;
}

export function getApiToken(
  auth: IAuthWebUI,
  config: Config,
  username: string,
  password: string): string {
  const security: Security = getSecurity(config);

  if (isAESLegacy(security)) {
     // fallback all goes to AES encryption
     return auth.aesEncrypt(buildUserBuffer(username, password)).toString('base64');
  } else {
      // i am wiling to use here _.isNil but flow does not like it yet.
    if (typeof security.api.jwt !== 'undefined' &&
      typeof security.api.jwt.sign !== 'undefined') {
      return auth.issuAPIjwt(username, password, security.api.jwt.sign);
    } else {
      return auth.aesEncrypt(buildUserBuffer(username, password)).toString('base64');
    }
  }
}

export function parseAESCredentials(parts: Array<string>, secret: string) {
  let credentials;
  const scheme = parts[0];
  if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
    credentials = buildBase64Buffer(parts[1]).toString();

    return credentials;
  } else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
    const token = buildBase64Buffer(parts[1]);

    credentials = aesDecrypt(token, secret).toString('utf8');
    return credentials;
  } else {
    return;
  }
}

export function verifyJWTPayload(token: string, secret: string): JWTPayload {
  try {
    const payload = verifyPayload(token, secret);

    return {
      user: payload.user,
      password: payload.password,
      group: payload.group,
    };
  } catch (err) {
    throw ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, err.message);
  }
}

export function resolveTokenMiddleWare(
    config: Config,
    authorizationHeader: string,
    next: any): JWTPayload {
  const security: Security = getSecurity(config);
  const parts = authorizationHeader.split(' ');

  if (parts.length !== 2) {
    return next( ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER) );
  }

  if (isAESLegacy(security)) {
    const credentials = parseAESCredentials(parts, config.secret);
    if (!credentials) {
      return next();
    }

    const index = credentials.indexOf(':');
    if (index < 0) {
      return next();
    }

    const user: string = credentials.slice(0, index);
    const password: string = credentials.slice(index + 1);

    return {user, password};
  } else {
    const token = parts[1];
    const scheme = parts[0];

    if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
        return verifyJWTPayload(token, config.secret);
    } else {
      return next( ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER) );
    }
  }
}
