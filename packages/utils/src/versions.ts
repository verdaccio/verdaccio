import _ from 'lodash';
import semver, { SemVer } from 'semver';

import { DIST_TAGS } from '@verdaccio/core';
import { Package, Version, Versions } from '@verdaccio/types';

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
export function getVersion(versions: Versions, version: string): Version | undefined {
  if (!versions) {
    return;
  }

  // this condition must allow cast
  if (_.isNil(versions[version]) === false) {
    return versions[version];
  }

  const versionSemver: SemVer | null = semver.parse(version, true);
  if (versionSemver === null) {
    return;
  }

  for (const versionItem in versions) {
    if (Object.prototype.hasOwnProperty.call(versions, versionItem)) {
      // @ts-ignore
      if (versionSemver.compare(semver.parse(versionItem, true)) === 0) {
        return versions[versionItem];
      }
    }
  }
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
export function sortVersionsAndFilterInvalid(listVersions: string[] /* logger */): string[] {
  return (
    listVersions
      .filter(function (version): boolean {
        if (!semver.parse(version, true)) {
          return false;
        }
        return true;
      })
      // FIXME: it seems the @types/semver do not handle a legitimate method named 'compareLoose'
      // @ts-ignore
      .sort(semver.compareLoose)
      .map(String)
  );
}

/**
 * Normalize dist-tags.
 *
 * There is a legacy behaviour where the dist-tags could be an array, in such
 * case, the array is orderded and the highest version becames the
 * latest.
 *
 * The dist-tag tags must be plain strigs, if the latest is empty (for whatever reason) is
 * normalized to be the highest version available.
 *
 * This function cleans up every invalid version on dist-tags, but does not remove
 * invalid versions from the manifest.
 *
 * @param {*} data
 */
export function normalizeDistTags(manifest: Package): Package {
  let sorted;
  // handle missing latest dist-tag
  if (!manifest[DIST_TAGS].latest) {
    // if there is no latest tag, set the highest known version based on semver sort
    sorted = sortVersionsAndFilterInvalid(Object.keys(manifest.versions));
    if (sorted?.length) {
      // get the highest published version
      manifest[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (const tag in manifest[DIST_TAGS]) {
    // deprecated (will be removed un future majors)
    // this should not happen, tags should be plain strings, legacy fallback
    if (_.isArray(manifest[DIST_TAGS][tag])) {
      if (manifest[DIST_TAGS][tag].length) {
        // sort array
        // FIXME: this is clearly wrong, we need to research why this is like this.
        // @ts-ignore
        sorted = sortVersionsAndFilterInvalid(manifest[DIST_TAGS][tag]);
        if (sorted.length) {
          // use highest version based on semver sort
          manifest[DIST_TAGS][tag] = sorted.pop();
        }
      } else {
        delete manifest[DIST_TAGS][tag];
      }
    } else if (_.isString(manifest[DIST_TAGS][tag])) {
      if (!semver.parse(manifest[DIST_TAGS][tag], true)) {
        // if the version is invalid, delete the dist-tag entry
        delete manifest[DIST_TAGS][tag];
      }
    }
  }

  return manifest;
}
