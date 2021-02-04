import { Package, Version } from '@verdaccio/types';
import _, { String } from 'lodash';
import semver, { SemVer } from 'semver';
/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */
export function isPublishablePackage(pkg: Package): boolean {
  const keys: string[] = Object.keys(pkg);

  return _.includes(keys, 'versions');
}

export function isRelatedToDeprecation(pkgInfo: Package): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
export function getVersion(pkg: Package, version: any ): Version | void {
  // this condition must allow cast
  if (_.isNil(pkg.versions[version]) === false) {
    return pkg.versions[version.version];
  }

  try {
     version = semver.parse(version, true);
    for (const versionItem in pkg.versions) {
      if (version.compare(semver.parse(versionItem, true)) === 0) {
        return pkg.versions[versionItem];
      }
    }
  } catch (err) {
    return undefined;
  }
}

export function hasDiffOneKey(versions): boolean {
  return Object.keys(versions).length !== 1;
}
