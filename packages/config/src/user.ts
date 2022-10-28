import { RemoteUser } from '@verdaccio/types';

import { ROLES } from './package-access';

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
  const groups = Array.from(
    new Set((isGroupValid ? pluginGroups : []).concat([...defaultLoggedUserRoles]))
  );

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
