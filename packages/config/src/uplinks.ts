import assert from 'assert';
import _ from 'lodash';

import { PackageList, UpLinksConfList } from '@verdaccio/types';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
export const DEFAULT_UPLINK = 'npmjs';

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
      if (typeof newUplinks[uplink].cache === 'undefined') {
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

export function hasProxyTo(pkg: string, upLink: string, packages: PackageList): boolean {
  const matchedPkg = getMatchedPackagesSpec(pkg, packages);
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
