import { PackageList, PackageAccess } from '@verdaccio/types';
import minimatch from 'minimatch';

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
