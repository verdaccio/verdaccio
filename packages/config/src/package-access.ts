import buildDebug from 'debug';
import { flatten, isEmpty, isNil, isObject, isUndefined } from 'lodash-es';
import assert from 'node:assert';

import { errorUtils } from '@verdaccio/core';
import type { PackageAccess } from '@verdaccio/types';

const debug = buildDebug('verdaccio:config:utils');

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
  if (isNil(groupsList) || isEmpty(groupsList)) {
    return result;
  }

  // if it's a string, split it to array
  if (typeof groupsList === 'string') {
    const groupsArray = groupsList.split(/\s+/);

    result.push(groupsArray);
  } else if (Array.isArray(groupsList)) {
    result.push(groupsList);
  } else {
    throw errorUtils.getInternalError(
      'CONFIG: bad package acl (array or string expected): ' + JSON.stringify(groupsList)
    );
  }

  return flatten(result);
}

export function normalisePackageAccess(packages: LegacyPackageList): LegacyPackageList {
  const normalizedPkgs: LegacyPackageList = { ...packages };
  if (isNil(normalizedPkgs['**'])) {
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
      debug('package access %s for %s ', packageAccess, pkg);
      const isInvalid = isObject(packageAccess) && !Array.isArray(packageAccess);
      assert(isInvalid, `CONFIG: bad "'${pkg}'" package description (object expected)`);

      normalizedPkgs[pkg].access = normalizeUserList(packageAccess.access);
      normalizedPkgs[pkg].publish = normalizeUserList(packageAccess.publish);
      normalizedPkgs[pkg].proxy = normalizeUserList(packageAccess.proxy);
      // if unpublish is not defined, we set to false to fallback in publish access
      normalizedPkgs[pkg].unpublish = isUndefined(packageAccess.unpublish)
        ? false
        : normalizeUserList(packageAccess.unpublish);
    }
  }

  return normalizedPkgs;
}
