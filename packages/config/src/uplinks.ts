import assert from 'assert';
import { PackageList, UpLinksConfList } from '@verdaccio/types';
import _ from 'lodash';

import { getMatchedPackagesSpec } from './package-access';
import { MatchedPackage } from './config';

const BLACKLIST = {
  all: true,
  anonymous: true,
  undefined: true,
  owner: true,
  none: true,
};

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
