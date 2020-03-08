import _ from 'lodash';

import { API_ERROR, ROLES, TIME_EXPIRATION_7D, DEFAULT_MIN_LIMIT_PASSWORD } from '@verdaccio/dev-commons';
import { CookieSessionToken, AuthTokenHeader, BasicPayload } from '@verdaccio/dev-types';
import { RemoteUser, AllowAccess, PackageAccess, Callback, Config, Security, APITokenOptions, JWTOptions, IPluginAuth } from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';

import { ErrorCode } from './utils';

import { logger } from '@verdaccio/logger';

export function validatePassword(password: string, minLength: number = DEFAULT_MIN_LIMIT_PASSWORD): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

/**
 * All logged users will have by default the group $all and $authenticate
 */
export const defaultLoggedUserRoles = [ROLES.$ALL, ROLES.$AUTH, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_AUTH, ROLES.ALL];
/**
 *
 */
export const defaultNonLoggedUserRoles = [
  ROLES.$ALL,
  ROLES.$ANONYMOUS,
  // groups without '$' are going to be deprecated eventually
  ROLES.DEPRECATED_ALL,
  ROLES.DEPRECATED_ANONYMOUS
];

/**
 * Create a RemoteUser object
 * @return {Object} { name: xx, pluginGroups: [], real_groups: [] }
 */
export function createRemoteUser(name: string, pluginGroups: string[]): RemoteUser {
  const isGroupValid: boolean = Array.isArray(pluginGroups);
  const groups = (isGroupValid ? pluginGroups : []).concat([...defaultLoggedUserRoles]);

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
    groups: [...defaultNonLoggedUserRoles],
    real_groups: [],
  };
}

export type AllowActionCallbackResponse = boolean | undefined;
export type AllowActionCallback = (error: VerdaccioError | null, allowed?: AllowActionCallbackResponse) => void;
export type AllowAction = (user: RemoteUser, pkg: AuthPackageAllow, callback: AllowActionCallback) => void;
export interface AuthPackageAllow extends PackageAccess, AllowAccess {
  // TODO: this should be on @verdaccio/types
  unpublish: boolean | string[];
}

export type ActionsAllowed = 'publish' | 'unpublish' | 'access';

export function allow_action(action: ActionsAllowed): AllowAction {
  return function allowActionCallback(user: RemoteUser, pkg: AuthPackageAllow, callback: AllowActionCallback): void {
    logger.trace({remote: user.name}, `[auth/allow_action]: user: @{user.name}`);
    const { name, groups } = user;
    const groupAccess = pkg[action] as string[];
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
  return function(user: RemoteUser, pkg: AuthPackageAllow, callback: AllowActionCallback): void {
    const action = 'unpublish';
    // verify whether the unpublish prop has been defined
    const isUnpublishMissing: boolean = _.isNil(pkg[action]);
    const hasGroups: boolean = isUnpublishMissing ? false : ((pkg[action]) as string[]).length > 0;
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

    adduser(user: string, password: string, cb: Callback): void {
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

export function getAuthenticatedMessage(user: string): string {
  return `you are authenticated as '${user}'`;
}

export function buildUserBuffer(name: string, password: string): Buffer {
  return Buffer.from(`${name}:${password}`, 'utf8');
}
