import _ from 'lodash';
import LRU from "lru-cache";
import { convertPayloadToBase64, ErrorCode } from './utils';
import { API_ERROR, HTTP_STATUS, ROLES, TIME_EXPIRATION_7D, TOKEN_BASIC, TOKEN_BEARER, DEFAULT_MIN_LIMIT_PASSWORD } from './constants';

import { RemoteUser, Package, Callback, Config, Security, APITokenOptions, JWTOptions, IPluginAuth } from '@verdaccio/types';
import { CookieSessionToken, IAuthWebUI, IAuth, AuthMiddlewarePayload, AuthTokenHeader, BasicPayload, IStorageHandler } from '../../types';
import { aesDecrypt, verifyPayload, stringToMD5, isUUID } from './crypto-utils';

import { logger } from '../lib/logger';

const blacklistCache = new LRU({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24 // 24h
});

export function validatePassword(password: string, minLength: number = DEFAULT_MIN_LIMIT_PASSWORD): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

/**
 * Create a RemoteUser object
 * @return {Object} { name: xx, pluginGroups: [], real_groups: [] }
 */
export function createRemoteUser(name: string | void, pluginGroups: string[]): RemoteUser {
  const isGroupValid: boolean = Array.isArray(pluginGroups);
  const groups = (isGroupValid ? pluginGroups : []).concat([ROLES.$ALL, ROLES.$AUTH, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_AUTH, ROLES.ALL]);

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
    groups: [ROLES.$ALL, ROLES.$ANONYMOUS, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_ANONYMOUS],
    real_groups: [],
  };
}

export function allow_action(action: string): Function {
  return function(user: RemoteUser, pkg: Package, callback: Callback): void {
    logger.trace({remote: user.name}, `[auth/allow_action]: user: @{user.name}`);
    const { name, groups } = user;
    const groupAccess = pkg[action];
    const hasPermission = groupAccess.some(group => name === group || groups.includes(group));
    logger.trace({pkgName: pkg.name, hasPermission, remote: user.name, groupAccess}, `[auth/allow_action]: hasPermission? @{hasPermission} for user: @{user}`);

    if (hasPermission) {
      logger.trace({remote: user.name}, `auth/allow_action: access granted to: @{user}`);
      return callback(null, true);
    }

    if (name) {
      callback(ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(ErrorCode.getUnauthorized(`authorization required to ${action} package ${pkg.name}`));
    }
  };
}

/**
 *
 */
export function handleSpecialUnpublish(): any {
  return function(user: RemoteUser, pkg: Package, callback: Callback): void {
    const action = 'unpublish';
    // verify whether the unpublish prop has been defined
    const isUnpublishMissing: boolean = _.isNil(pkg[action]);
    const hasGroups: boolean = isUnpublishMissing ? false : pkg[action].length > 0;
    logger.trace({user: user.name, name: pkg.name, hasGroups}, `fallback unpublish for @{name} has groups: @{hasGroups} for @{user}`);

    if (isUnpublishMissing || hasGroups === false) {
      return callback(null, undefined);
    }

    logger.trace({user: user.name, name: pkg.name, action, hasGroups}, `allow_action for @{action} for @{name} has groups: @{hasGroups} for @{user}`);
    return allow_action(action)(user, pkg, callback);
  };
}

export function getDefaultPlugins(): IPluginAuth<Config> {
  return {
    authenticate(user: string, password: string, cb: Callback): void {
      cb(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user(user: string, password: string, cb: Callback): void {
      return cb(ErrorCode.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    // FIXME: allow_action and allow_publish should be in the @verdaccio/types
    // @ts-ignore
    allow_access: allow_action('access'),
    // @ts-ignore
    allow_publish: allow_action('publish'),
    allow_unpublish: handleSpecialUnpublish(),
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
    // The expiration token for the website is 7 days
    expiresIn: TIME_EXPIRATION_7D,
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

export function getAuthenticatedMessage(user: string): string {
  return `you are authenticated as '${user}'`;
}

export function buildUserBuffer(name: string, password: string): Buffer {
  return Buffer.from(`${name}:${password}`, 'utf8');
}

export function isAESLegacy(security: Security): boolean {
  const { legacy, jwt } = security.api;

  return _.isNil(legacy) === false && _.isNil(jwt) && legacy === true;
}

export async function getApiToken(auth: IAuthWebUI, config: Config, remoteUser: RemoteUser, aesPassword: string): Promise<string> {
  const security: Security = getSecurity(config);

  if (isAESLegacy(security)) {
    // fallback all goes to AES encryption
    return await new Promise((resolve): void => {
      resolve(auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64'));
    });
  }
  // i am wiling to use here _.isNil but flow does not like it yet.
  const { jwt } = security.api;

  if (jwt && jwt.sign) {
    return await auth.jwtEncrypt(remoteUser, jwt.sign);
  }
  return await new Promise((resolve): void => {
    resolve(auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64'));
  });

}

export async function getTokenKey(auth: IAuth, token: string): Promise<string> {
  let key: string = "";
  try {
    // jwt token
    const payload = (await verifyPayload(token, auth.secret, { ignoreNotBefore: true})) as RemoteUser&{jti?: string}
    if (payload?.jti) key = payload.jti
  } catch(err) {
    // legacy token
    if (key === "") key = stringToMD5(token);    
  }
  return key;
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
    const tokenAsBuffer = convertPayloadToBase64(token);
    const credentials = aesDecrypt(tokenAsBuffer, secret).toString('utf8');

    return credentials;
  }
}

export const expireReasons: string[] = ['JsonWebTokenError', 'TokenExpiredError', 'TokenRevokedError'];

export async function verifyJWTPayload(token: string, secret: string, storage?: IStorageHandler): Promise<RemoteUser> {
  try {
    const payload: RemoteUser&{jti?:string} = verifyPayload(token, secret);
    // check for revoked tokens
    if (storage && payload?.jti && payload?.name) {
      const revoked = await isTokenRevoked(payload.name, payload.jti, storage);
      if (revoked) {
        const err = new Error("The JWT token is revoked by the user");
        err.name = "TokenRevokedError";
        throw err;
      }
    }
    return payload;
  } catch (error) {
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

export async function getMiddlewareCredentials(security: Security, secret: string, authorizationHeader: string, storage?: IStorageHandler): Promise<AuthMiddlewarePayload> {
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
    return await verifyJWTPayload(token, secret, storage);
  }
}

// currently only manually created tokens via the token command can be validated
// as verdaccio only stores these tokens in the storage handler
export async function isTokenRevoked(name: string, tokenKey: string, storage: IStorageHandler): Promise<boolean> {
  if (!isUUID(tokenKey)){
    // if tokenKey is a UUID it is a unique jwtid and originates from a manually generated jwt token (npm comman)
    // else it will be an non-identifiable token (jwt or legacy) and can not be validated in absence of an unqiue identifier
    // we should skip
    return false;
  }

  // validate if tokenIdentifier is already listed in memory cache
  const tokenIdentifier = `${name}:${tokenKey}`;
  let blacklisted = blacklistCache.get(tokenIdentifier) as boolean | undefined;
  if (blacklisted !== undefined) { 
    return blacklisted;
  }

  // validate if tokenKey is part of user token storage
  // a fallback lookup; store in memory cache if token is not found
  try {
    const tokens = await storage.readTokens({user: name})
    blacklisted = tokens.find((token) => token.key === tokenKey) === undefined;
    if (blacklisted) blacklistCache.set(tokenIdentifier, true)
  } catch (err) {
    // issue with access to storage pass for now
    blacklisted = false;
  }

  return blacklisted;
}
