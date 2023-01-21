import assert from 'assert';
import _ from 'lodash';

import { PackageList, UpLinksConfList } from '@verdaccio/types';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

import { LegacyPackageList, MatchedPackage } from '../types';
import { ErrorCode } from './utils';

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
export function normalizeUserList(oldFormat: any, newFormat: any): any {
  const result: any[][] = [];
  /* eslint prefer-rest-params: "off" */

  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      continue;
    }

    // if it's a string, split it to array
    if (_.isString(arguments[i])) {
      result.push(arguments[i].split(/\s+/));
    } else if (Array.isArray(arguments[i])) {
      result.push(arguments[i]);
    } else {
      throw ErrorCode.getInternalError(
        'CONFIG: bad package acl (array or string expected): ' + JSON.stringify(arguments[i])
      );
    }
  }
  return _.flatten(result);
}

export function uplinkSanityCheck(
  uplinks: UpLinksConfList,
  users: any = BLACKLIST
): UpLinksConfList {
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
    item !== 'all' &&
      item !== 'owner' &&
      item !== 'anonymous' &&
      item !== 'undefined' &&
      item !== 'none',
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
    return proxyList.some((curr) => upLink === curr);
  }

  return false;
}

export function normalisePackageAccess(packages: LegacyPackageList): LegacyPackageList {
  const normalizedPkgs: LegacyPackageList = { ...packages };
  // add a default rule for all packages to make writing plugins easier
  if (_.isNil(normalizedPkgs['**'])) {
    normalizedPkgs['**'] = { access: [], publish: [], proxy: [] };
  }

  for (const pkg in packages) {
    if (Object.prototype.hasOwnProperty.call(packages, pkg)) {
      assert(
        _.isObject(packages[pkg]) && _.isArray(packages[pkg]) === false,
        `CONFIG: bad "'${pkg}'" package description (object expected)`
      );
      normalizedPkgs[pkg].access = normalizeUserList(
        packages[pkg].allow_access,
        packages[pkg].access
      );
      delete normalizedPkgs[pkg].allow_access;
      normalizedPkgs[pkg].publish = normalizeUserList(
        packages[pkg].allow_publish,
        packages[pkg].publish
      );
      delete normalizedPkgs[pkg].allow_publish;
      normalizedPkgs[pkg].proxy = normalizeUserList(
        packages[pkg].proxy_access,
        packages[pkg].proxy
      );
      delete normalizedPkgs[pkg].proxy_access;
      // if unpublish is not defined, we set to false to fallback in publish access
      normalizedPkgs[pkg].unpublish = _.isUndefined(packages[pkg].unpublish)
        ? false
        : normalizeUserList([], packages[pkg].unpublish);
    }
  }

  return normalizedPkgs;
}
