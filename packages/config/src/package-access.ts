import assert from 'assert';
import _ from 'lodash';

import { errorUtils } from '@verdaccio/core';
import { PackageAccess } from '@verdaccio/types';

export interface LegacyPackageList {
  [key: string]: PackageAccess;
}

// @deprecated use @verdaccio/core:authUtils
export const ROLES = {
  $ALL: '$all',
  ALL: 'all',
  $AUTH: '$authenticated',
  $ANONYMOUS: '$anonymous',
  DEPRECATED_ALL: '@all',
  DEPRECATED_AUTH: '@authenticated',
  DEPRECATED_ANONYMOUS: '@anonymous',
};

// @deprecated use @verdaccio/core:authUtils
export const PACKAGE_ACCESS = {
  SCOPE: '@*/*',
  ALL: '**',
};

export function normalizeUserList(groupsList: any): any {
  const result: any[] = [];
  if (_.isNil(groupsList)) {
    return result;
  }

  // if it's a string, split it to array
  if (_.isString(groupsList)) {
    const groupsArray = groupsList.split(/\s+/);

    result.push(groupsArray);
  } else if (Array.isArray(groupsList)) {
    result.push(groupsList);
  } else {
    throw errorUtils.getInternalError(
      'CONFIG: bad package acl (array or string expected): ' + JSON.stringify(groupsList)
    );
  }

  return _.flatten(result);
}

export function normalisePackageAccess(packages: LegacyPackageList): LegacyPackageList {
  const normalizedPkgs: LegacyPackageList = { ...packages };
  if (_.isNil(normalizedPkgs['**'])) {
    normalizedPkgs['**'] = {
      access: [],
      publish: [],
      unpublish: [],
      proxy: [],
    };
  }

  for (const pkg in packages) {
    if (Object.prototype.hasOwnProperty.call(packages, pkg)) {
      const packageAccess = packages[pkg];
      const isInvalid = _.isObject(packageAccess) && _.isArray(packageAccess) === false;
      assert(isInvalid, `CONFIG: bad "'${pkg}'" package description (object expected)`);

      normalizedPkgs[pkg].access = normalizeUserList(packageAccess.access);
      normalizedPkgs[pkg].publish = normalizeUserList(packageAccess.publish);
      normalizedPkgs[pkg].proxy = normalizeUserList(packageAccess.proxy);
      // if unpublish is not defined, we set to false to fallback in publish access
      normalizedPkgs[pkg].unpublish = _.isUndefined(packageAccess.unpublish)
        ? false
        : normalizeUserList(packageAccess.unpublish);
    }
  }

  return normalizedPkgs;
}
