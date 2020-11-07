import assert from 'assert';
import _ from 'lodash';
import minimatch from 'minimatch';

import { PackageList, PackageAccess } from '@verdaccio/types';
import { ErrorCode } from '@verdaccio/utils';
import { MatchedPackage } from './config';

export type PackageAccessAddOn = PackageAccess & {
  // FIXME: should be published on @verdaccio/types
  unpublish?: string[];
};

export interface LegacyPackageList {
  [key: string]: PackageAccessAddOn;
}

/**
 * Normalize user list.
 * @return {Array}
 */
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
    throw ErrorCode.getInternalError(
      'CONFIG: bad package acl (array or string expected): ' + JSON.stringify(groupsList)
    );
  }

  return _.flatten(result);
}

export function getMatchedPackagesSpec(pkgName: string, packages: PackageList): MatchedPackage {
  for (const i in packages) {
    if (minimatch.makeRe(i).exec(pkgName)) {
      return packages[i];
    }
  }
  return;
}

export function normalisePackageAccess(packages: LegacyPackageList): LegacyPackageList {
  const normalizedPkgs: LegacyPackageList = { ...packages };
  // add a default rule for all packages to make writing plugins easier
  if (_.isNil(normalizedPkgs['**'])) {
    normalizedPkgs['**'] = {
      access: [],
      publish: [],
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
