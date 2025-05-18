import { MMRegExp, minimatch } from 'minimatch';

import { PackageAccess, PackageList } from '@verdaccio/types';

// @deprecated use @verdaccio/core:pkgUtils
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
