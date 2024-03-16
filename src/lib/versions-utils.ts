import buildDebug from 'debug';
import _ from 'lodash';
import semver from 'semver';

import {  searchUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:storage:utils');

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
