// @flow

import _ from 'lodash';
import minimatch from 'minimatch';
import assert from 'assert';
import {ErrorCode} from './utils';

const BLACKLIST = {
  all: true,
  anonymous: true,
  undefined: true,
  owner: true,
  none: true,
};

/**
 * Normalise user list.
 * @return {Array}
 */
export function normalizeUserlist(oldFormat: any, newFormat: any) {
  const result = [];
  /* eslint prefer-rest-params: "off" */

  for (let i=0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      continue;
    }

    // if it's a string, split it to array
    if (typeof(arguments[i]) === 'string') {
      result.push(arguments[i].split(/\s+/));
    } else if (Array.isArray(arguments[i])) {
      result.push(arguments[i]);
    } else {
      throw ErrorCode.getInternalError('CONFIG: bad package acl (array or string expected): ' + JSON.stringify(arguments[i]));
    }
  }
  return _.flatten(result);
}

export function getMatchedPackagesSpec(packages: any, pkg: any) {
  for (let i in packages) {
    // $FlowFixMe
    if (minimatch.makeRe(i).exec(pkg)) {
      return packages[i];
    }
  }

  return {};
}

export function uplinkSanityCheck(uplinks: any, users: any = BLACKLIST) {
  const newUplinks = _.clone(uplinks);
  let newUsers = _.clone(users);

  for (let uplink in newUplinks) {
    if (Object.prototype.hasOwnProperty.call(newUplinks, uplink)) {
      if (_.isNil(newUplinks[uplink].cache)) {
        newUplinks[uplink].cache = true;
      }
      newUsers = sanityCheckNames(uplink, newUsers);
    }
  }

  return newUplinks;
}

export function sanityCheckNames(item: string, users: any) {
  assert(item !== 'all' && item !== 'owner' && item !== 'anonymous' && item !== 'undefined' && item !== 'none', 'CONFIG: reserved user/uplink name: ' + item);
  assert(!item.match(/\s/), 'CONFIG: invalid user name: ' + item);
  assert(users[item] == null, 'CONFIG: duplicate user/uplink name: ' + item);
  users[item] = true;

  return users;
}

export function sanityCheckUplinksProps(configUpLinks: any) {
  const uplinks = _.clone(configUpLinks);

  for (let uplink in uplinks) {
    if (Object.prototype.hasOwnProperty.call(uplinks, uplink)) {
      assert(uplinks[uplink].url, 'CONFIG: no url for uplink: ' + uplink);
      assert( _.isString(uplinks[uplink].url), 'CONFIG: wrong url format for uplink: ' + uplink);
      uplinks[uplink].url = uplinks[uplink].url.replace(/\/$/, '');
    }
  }

  return uplinks;
}

export function normalisePackageAccess(packages: any): any {
  const normalizedPkgs: any = {...packages};
  // add a default rule for all packages to make writing plugins easier
  if (_.isNil(normalizedPkgs['**'])) {
    normalizedPkgs['**'] = {};
  }

  for (let pkg in packages) {
    if (Object.prototype.hasOwnProperty.call(packages, pkg)) {
      assert(_.isObject(packages[pkg]) && _.isArray(packages[pkg]) === false,
        `CONFIG: bad "'${pkg}'" package description (object expected)`);
      normalizedPkgs[pkg].access = normalizeUserlist(packages[pkg].allow_access, packages[pkg].access);
      delete normalizedPkgs[pkg].allow_access;
      normalizedPkgs[pkg].publish = normalizeUserlist(packages[pkg].allow_publish, packages[pkg].publish);
      delete normalizedPkgs[pkg].allow_publish;
      normalizedPkgs[pkg].proxy = normalizeUserlist(packages[pkg].proxy_access, packages[pkg].proxy);
      delete normalizedPkgs[pkg].proxy_access;
    }
  }

  return normalizedPkgs;
}

