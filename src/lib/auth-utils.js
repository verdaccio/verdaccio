// @flow
import _ from 'lodash';
import {ErrorCode} from './utils';
import {API_ERROR, TIME_EXPIRATION_7D} from './constants';

import type {
  RemoteUser,
  Package,
  Callback,
  Config,
  Security,
  APITokenOptions,
  JWTOptions} from '@verdaccio/types';
import type {CookieSessionToken, IAuthWebUI} from '../../types';

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
  return 'you are authenticated as \'' + user + '\'';
}

export function buildUserBuffer(name: string, password: string) {
  return new Buffer(`${name}:${password}`);
}

export function getApiToken(
  auth: IAuthWebUI,
  config: Config,
  username: string,
  password: string): string {
  const security: Security = getSecurity(config);

  if (_.isNil(security.api.legacy) === false &&
      _.isNil(security.api.jwt) &&
      security.api.legacy === true) {
     // fallback all goes to AES encription
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
