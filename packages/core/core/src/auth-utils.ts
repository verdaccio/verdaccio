import _ from 'lodash';
import { MMRegExp, minimatch } from 'minimatch';

import { PackageAccess, PackageList } from '@verdaccio/types';

export interface CookieSessionToken {
  expires: Date;
}

export function createSessionToken(): CookieSessionToken {
  const tenHoursTime = 10 * 60 * 60 * 1000;

  return {
    // npmjs.org sets 10h expire
    expires: new Date(Date.now() + tenHoursTime),
  };
}

export function getAuthenticatedMessage(user: string): string {
  return `you are authenticated as '${user}'`;
}

export function buildUserBuffer(name: string, password: string): Buffer {
  return Buffer.from(`${name}:${password}`, 'utf8');
}

export function buildToken(type: string, token: string): string {
  return `${_.capitalize(type)} ${token}`;
}

export function getMatchedPackagesSpec(
  pkgName: string,
  packages: PackageList
): PackageAccess | void {
  for (const i in packages) {
    if ((minimatch.makeRe(i) as MMRegExp).exec(pkgName)) {
      return packages[i];
    }
  }
  return;
}
