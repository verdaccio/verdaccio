import _ from 'lodash';

import { PackageList } from '@verdaccio/types';
import { getMatchedPackagesSpec } from '@verdaccio/utils';

import { LegacyPackageList, MatchedPackage } from '../types';
import { ErrorCode } from './utils';

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
