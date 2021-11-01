import minimatch from 'minimatch';

import { PackageAccess, PackageList } from '@verdaccio/types';

export function getMatchedPackagesSpec(
  pkgName: string,
  packages: PackageList
): PackageAccess | void {
  for (const i in packages) {
    if (minimatch.makeRe(i).exec(pkgName)) {
      return packages[i];
    }
  }
  return;
}
