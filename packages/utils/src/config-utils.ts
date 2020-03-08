import _ from 'lodash';
import assert from 'assert';
import minimatch from 'minimatch';

import { ErrorCode } from './utils';

import { PackageList, UpLinksConfList } from '@verdaccio/types';
import { MatchedPackage, LegacyPackageList } from '@verdaccio/dev-types';

const BLACKLIST = {
  all: true,
  anonymous: true,
  undefined: true,
  owner: true,
  none: true,
};

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

export function uplinkSanityCheck(uplinks: UpLinksConfList, users: any = BLACKLIST): UpLinksConfList {
  const newUplinks = _.clone(uplinks);
  let newUsers = _.clone(users);

  for (const uplink in newUplinks) {
    if (Object.prototype.hasOwnProperty.call(newUplinks, uplink)) {
      if (_.isNil(newUplinks[uplink].cache)) {
        newUplinks[uplink].cache = true;
      }
      newUsers = sanityCheckNames(uplink, newUsers);
    }
  }

  return newUplinks;
}

export function sanityCheckNames(item: string, users: any): any {
  assert(
    item !== 'all' && item !== 'owner' && item !== 'anonymous' && item !== 'undefined' && item !== 'none',
    'CONFIG: reserved uplink name: ' + item
  );
  assert(!item.match(/\s/), 'CONFIG: invalid uplink name: ' + item);
  assert(_.isNil(users[item]), 'CONFIG: duplicate uplink name: ' + item);
  users[item] = true;

  return users;
}

export function sanityCheckUplinksProps(configUpLinks: UpLinksConfList): UpLinksConfList {
  const uplinks = _.clone(configUpLinks);

  for (const uplink in uplinks) {
    if (Object.prototype.hasOwnProperty.call(uplinks, uplink)) {
      assert(uplinks[uplink].url, 'CONFIG: no url for uplink: ' + uplink);
      assert(_.isString(uplinks[uplink].url), 'CONFIG: wrong url format for uplink: ' + uplink);
      uplinks[uplink].url = uplinks[uplink].url.replace(/\/$/, '');
    }
  }

  return uplinks;
}

/**
 * Check whether an uplink can proxy
 */
export function hasProxyTo(pkg: string, upLink: string, packages: PackageList): boolean {
  const matchedPkg: MatchedPackage = getMatchedPackagesSpec(pkg, packages);
  const proxyList = typeof matchedPkg !== 'undefined' ? matchedPkg.proxy : [];
  if (proxyList) {
    return proxyList.some(curr => upLink === curr);
  }

  return false;
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
      proxy: []
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
