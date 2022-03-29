import _ from 'lodash';

import { validatioUtils } from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';

import { Users } from '../type';

/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */

/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */
export function isPublishablePackage(pkg: Manifest): boolean {
  // TODO: we can do better, no need get keys
  const keys: string[] = Object.keys(pkg);

  return keys.includes('versions');
}

// @deprecated don't think this is used anymore (REMOVE)
export function isRelatedToDeprecation(pkgInfo: Manifest): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

export function validateInputs(localUsers: Users, username: string, isStar: boolean): boolean {
  const isExistlocalUsers = _.isNil(localUsers[username]) === false;
  if (isStar && isExistlocalUsers && localUsers[username]) {
    return true;
  } else if (!isStar && isExistlocalUsers) {
    return false;
  } else if (!isStar && !isExistlocalUsers) {
    return true;
  }
  return false;
}

export function isStarManifest(manifest: Manifest): boolean {
  return isPublishablePackage(manifest) === false && validatioUtils.isObject(manifest.users);
}
