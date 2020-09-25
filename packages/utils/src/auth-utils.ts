import { ROLES, TIME_EXPIRATION_7D, DEFAULT_MIN_LIMIT_PASSWORD } from '@verdaccio/dev-commons';
import {
  RemoteUser,
  AllowAccess,
  PackageAccess,
  Security,
  APITokenOptions,
  JWTOptions,
} from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';

export interface CookieSessionToken {
  expires: Date;
}

export function validatePassword(
  password: string,
  minLength: number = DEFAULT_MIN_LIMIT_PASSWORD
): boolean {
  return typeof password === 'string' && password.length >= minLength;
}

/**
 * All logged users will have by default the group $all and $authenticate
 */
export const defaultLoggedUserRoles = [
  ROLES.$ALL,
  ROLES.$AUTH,
  ROLES.DEPRECATED_ALL,
  ROLES.DEPRECATED_AUTH,
  ROLES.ALL,
];
/**
 *
 */
export const defaultNonLoggedUserRoles = [
  ROLES.$ALL,
  ROLES.$ANONYMOUS,
  // groups without '$' are going to be deprecated eventually
  ROLES.DEPRECATED_ALL,
  ROLES.DEPRECATED_ANONYMOUS,
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
export type AllowActionCallback = (
  error: VerdaccioError | null,
  allowed?: AllowActionCallbackResponse
) => void;

export type AllowAction = (
  user: RemoteUser,
  pkg: AuthPackageAllow,
  callback: AllowActionCallback
) => void;

export interface AuthPackageAllow extends PackageAccess, AllowAccess {
  // TODO: this should be on @verdaccio/types
  unpublish: boolean | string[];
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
