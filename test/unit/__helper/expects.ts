import { DIST_TAGS, LATEST } from '../../../src/lib/constants';

/**
 * Verify whether the package tag match with the desired version.
 */
export function getTaggedVersionFromPackage(pkg, pkgName, tag: string = LATEST, version: string) {
  // extract the tagged version
  const taggedVersion = pkg[DIST_TAGS][tag];
  expect(taggedVersion).toBeDefined();
  expect(taggedVersion).toEqual(version);

  // the version must exist
  const latestPkg = pkg.versions[taggedVersion];
  expect(latestPkg).toBeDefined();
  // the name must match
  expect(latestPkg.name).toEqual(pkgName);

  return latestPkg;
}
