import buildDebug from 'debug';
import _ from 'lodash';
import semver, { SemVer } from 'semver';

import { DIST_TAGS, searchUtils } from '@verdaccio/core';
import { Manifest, StringValue, Version, Versions } from '@verdaccio/types';

const debug = buildDebug('verdaccio:storage:utils');

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
  return listVersions
    .filter(function (version): boolean {
      if (!semver.parse(version, true)) {
        return false;
      }
      return true;
    })
    .sort(semver.compareLoose)
    .map(String);
}

/**
 * Create a tag for a package
 * @param {*} data
 * @param {*} version
 * @param {*} tag
 * @return {Boolean} whether a package has been tagged
 * @deprecated
 */
export function tagVersion(data: Manifest, version: string, tag: StringValue): boolean {
  if (tag && data[DIST_TAGS][tag] !== version && semver.parse(version, true)) {
    // valid version - store
    data[DIST_TAGS][tag] = version;
    return true;
  }
  return false;
}

/**
 *
 * @param manifest
 * @param version
 * @param tag
 * @returns
 */
export function tagVersionNext(manifest: Manifest, version: string, tag: StringValue): Manifest {
  const data = { ...manifest };
  if (tag && data[DIST_TAGS][tag] !== version && semver.parse(version, true)) {
    // valid version - store
    data[DIST_TAGS][tag] = version;
  }
  return data;
}

/**
 *  Check if the version is newer than the older version.
 * @param newVersion
 * @param oldVersion
 * @returns
 */
export function isNewerVersion(newVersion, oldVersion) {
  const comparisonResult = semver.compare(newVersion, oldVersion);

  return comparisonResult === 1 || comparisonResult === 0;
}

/**
 * Remove duplicates from search results.
 * @param {Array} objects
 * @return {Array} filtered array
 */
export function removeLowerVersions(objects: searchUtils.SearchPackageItem[]) {
  const versionMap = new Map();

  // Iterate through the array and keep the highest version for each name
  objects.forEach((item) => {
    const { name, version } = item.package;
    const key = name;

    if (versionMap.has(name) === false || isNewerVersion(version, versionMap.get(name))) {
      debug('keeping %o@%o', name, version);
      versionMap.set(key, version);
    }
  });

  // Filter objects based on the version map
  return objects.reduce((acc, item) => {
    const { name, version } = item.package;
    if (
      versionMap.has(name) &&
      versionMap.get(name) === version &&
      acc.find((i) => i.package.name === name) === undefined
    ) {
      debug('adding %o@%o', name, version);
      acc.push(item);
    }
    return acc;
  }, [] as searchUtils.SearchPackageItem[]);
}
