import { validationUtils } from '@verdaccio/core';
import { Manifest, PackageUsers } from '@verdaccio/types';

/**
 * Check whether the package metadata has enough data to be published
 * @param pkg metadata
 */
export function isPublishablePackage(pkg: Manifest): boolean {
  // TODO: we can do better, no need get keys
  const keys: string[] = Object.keys(pkg);

  return keys.includes('versions');
}

/**
 * Verify if the user is actually executing an action, to avoid unnecessary calls
 * to the storage.
 * @param localUsers current state at cache
 * @param username user is executing the action
 * @param userIsAddingStar whether user is removing or adding star
 * @returns boolean
 */
export function isExecutingStarCommand(
  localUsers: PackageUsers,
  username: string,
  userIsAddingStar: boolean
): boolean {
  const isExist = typeof localUsers[username] !== 'undefined';
  // fails if user already exist and us trying to add star.
  if (userIsAddingStar && isExist && localUsers[username]) {
    return false;
    // if is not adding a start but user exists (removing star)
  } else if (!userIsAddingStar && isExist) {
    return true;
    // fails if user does not exist and is not adding any star
  } else if (!userIsAddingStar && !isExist) {
    return false;
  }
  return true;
}

export function isStarManifest(manifest: Manifest): boolean {
  return isPublishablePackage(manifest) === false && validationUtils.isObject(manifest.users);
}
