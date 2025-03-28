import _ from 'lodash';
import semver from 'semver';

import { errorUtils, pkgUtils, searchUtils, validationUtils } from '@verdaccio/core';
import { API_ERROR, DIST_TAGS, HTTP_STATUS, MAINTAINERS, USERS } from '@verdaccio/core';
import { GenericBody, Manifest, ReadmeOptions, Version } from '@verdaccio/types';
import { generateRandomHexString, isNil } from '@verdaccio/utils';

import { sortVersionsAndFilterInvalid } from './versions-utils';

export const STORAGE = {
  PACKAGE_FILE_NAME: 'package.json',
  FILE_EXIST_ERROR: 'EEXISTS',
  NO_SUCH_FILE_ERROR: 'ENOENT',
  DEFAULT_REVISION: '0-0000000000000000',
};

/**
 * Create a new package in the storage, return a boilerplate package
 * @param name package name
 * @returns {Manifest}
 */
export function generatePackageTemplate(name: string): Manifest {
  return {
    // standard things
    name,
    versions: {},
    time: {},
    [USERS]: {},
    [DIST_TAGS]: {},
    [MAINTAINERS]: [],
    _uplinks: {},
    _distfiles: {},
    _attachments: {},
    _rev: '',
  };
}

/**
 * Normalize package properties, tags, revision id.
 * @param {Object} pkg package reference.
 */
export function normalizePackage(pkg: Manifest): Manifest {
  const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

  pkgProperties.forEach((key): void => {
    const pkgProp = pkg[key];

    if (isNil(pkgProp) || validationUtils.isObject(pkgProp) === false) {
      pkg[key] = {};
    }
  });

  if (typeof pkg?._rev !== 'string') {
    pkg._rev = STORAGE.DEFAULT_REVISION;
  }

  if (typeof pkg?._id !== 'string') {
    pkg._id = pkg.name;
  }

  // normalize dist-tags
  return normalizeDistTags(pkg);
}

export function generateRevision(rev: string): string {
  const _rev = rev.split('-');

  return (+_rev[0] || 0) + 1 + '-' + generateRandomHexString();
}

export function getLatestReadme(pkg: Manifest): string {
  const versions = pkg['versions'] || {};
  const distTags = pkg[DIST_TAGS] || {};
  // FIXME: here is a bit tricky add the types
  const latestVersion: Version | any = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = _.trim(pkg.readme || latestVersion.readme || '');
  if (readme) {
    return readme;
  }

  // In case of empty readme - trying to get ANY readme in the following order:
  // 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = ['next', 'beta', 'alpha', 'test', 'dev', 'canary'];
  readmeDistTagsPriority.forEach(function (tag): string | void {
    if (readme) {
      return readme;
    }
    const version: Version | any = distTags[tag] ? versions[distTags[tag]] || {} : {};
    readme = _.trim(version.readme || readme);
  });
  return readme;
}

/**
 * Cleanup readme from package version
 *
 * By default, we don't keep readmes for package versions, only one readme per package.
 * Using publish.keep_readmes you can override this behavior and keep all readmes
 * or only readmes for tagged versions.
 */
export function cleanUpReadme(
  version: Version,
  distTags?: GenericBody,
  keepReadmes?: ReadmeOptions
): Version {
  if (keepReadmes === 'all') {
    return version;
  } else if (keepReadmes === 'tagged') {
    if (distTags && Object.values(distTags).includes(version.version)) {
      return version;
    }
  }

  if (isNil(version) === false) {
    version.readme = '';
  }

  return version;
}

export const WHITELIST = [
  '_rev',
  'name',
  'versions',
  'dist-tags',
  'readme',
  'time',
  '_id',
  'users',
  'maintainers',
];

export function cleanUpLinksRef(result: Manifest, keepUpLinkData?: boolean): Manifest {
  const propertyToKeep = [...WHITELIST];
  if (keepUpLinkData === true) {
    propertyToKeep.push('_uplinks');
  }

  for (const i in result) {
    if (propertyToKeep.indexOf(i) === -1) {
      // Remove sections like '_uplinks' from response
      delete result[i];
    }
  }

  return result;
}

// TODO: move to abstract storage
// @deprecated use abstract.storage.ts:checkPackageRemote
export function checkPackageRemote(
  name: string,
  isAllowPublishOffline: boolean,
  syncMetadata: Function
): Promise<any> {
  return new Promise<void>((resolve, reject): void => {
    syncMetadata(name, null, {}, (err, packageJsonLocal, upLinksErrors): void => {
      // something weird
      if (err && err.status !== HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }

      // checking package exist already
      if (isNil(packageJsonLocal) === false) {
        return reject(errorUtils.getConflict(API_ERROR.PACKAGE_EXIST));
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== HTTP_STATUS.NOT_FOUND) {
            if (isAllowPublishOffline) {
              return resolve();
            }

            return reject(errorUtils.getServiceUnavailable(API_ERROR.UPLINK_OFFLINE_PUBLISH));
          }
        }
      }

      return resolve();
    });
  });
}

// @deprecated use export function mergeUplinkTimeIntoLocalNext
export function mergeUplinkTimeIntoLocal(localMetadata: Manifest, remoteMetadata: Manifest): any {
  if ('time' in remoteMetadata) {
    return Object.assign({}, localMetadata.time, remoteMetadata.time);
  }

  return localMetadata.time;
}

export function mergeUplinkTimeIntoLocalNext(
  cacheManifest: Manifest,
  remoteManifest: Manifest
): Manifest {
  if ('time' in remoteManifest) {
    // remote override cache time conflicts
    return { ...cacheManifest, time: { ...cacheManifest.time, ...remoteManifest.time } };
  }

  return cacheManifest;
}

export function updateUpLinkMetadata(uplinkName: string, manifest: Manifest, etag: string) {
  const _uplinks = {
    ...manifest._uplinks,
    [uplinkName]: {
      etag,
      fetched: Date.now(),
    },
  };
  return {
    ...manifest,
    _uplinks,
  };
}

export function prepareSearchPackage(data: Manifest): any {
  const latest = pkgUtils.getLatest(data);

  if (latest && data.versions[latest]) {
    const version: Version = data.versions[latest];
    const versions: any = { [latest]: 'latest' };
    const pkg: any = {
      name: version.name,
      description: version.description,
      [DIST_TAGS]: { latest },
      maintainers: version.maintainers || [version.author].filter(Boolean),
      author: version.author,
      repository: version.repository,
      readmeFilename: version.readmeFilename || '',
      homepage: version.homepage,
      keywords: version.keywords,
      bugs: version.bugs,
      license: version.license,
      // time: {
      //   modified: time,
      // },
      versions,
    };

    return pkg;
  }
}

/**
 * Function gets a local info and an info from uplinks and tries to merge it
 exported for unit tests only.
  * @param {*} cacheManifest
  * @param {*} remoteManifest
  */
export function mergeVersions(cacheManifest: Manifest, remoteManifest: Manifest): Manifest {
  let _cacheManifest = { ...cacheManifest };
  const { versions, time } = remoteManifest;
  // copy new versions to a cache
  // NOTE: if a certain version was updated, we can't refresh it reliably
  // however, we can refresh the deprecated status
  for (const i in versions) {
    if (typeof _cacheManifest.versions[i] === 'undefined') {
      _cacheManifest.versions[i] = versions[i];
    } else if (versions[i].deprecated) {
      _cacheManifest.versions[i].deprecated = versions[i].deprecated;
    }
  }

  for (const i in time) {
    if (typeof _cacheManifest.time[i] === 'undefined') {
      _cacheManifest.time[i] = time[i];
    }
  }

  for (const distTag in remoteManifest[DIST_TAGS]) {
    if (_cacheManifest[DIST_TAGS][distTag] !== remoteManifest[DIST_TAGS][distTag]) {
      if (
        !_cacheManifest[DIST_TAGS][distTag] ||
        semver.lte(_cacheManifest[DIST_TAGS][distTag], remoteManifest[DIST_TAGS][distTag])
      ) {
        _cacheManifest[DIST_TAGS][distTag] = remoteManifest[DIST_TAGS][distTag];
      }
      if (
        distTag === 'latest' &&
        _cacheManifest[DIST_TAGS][distTag] === remoteManifest[DIST_TAGS][distTag]
      ) {
        // NOTE: this override the latest publish readme from local cache with
        // the remote one
        _cacheManifest = { ..._cacheManifest, readme: remoteManifest.readme };
      }
    }
  }
  return _cacheManifest;
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
export function normalizeDistTags(manifest: Manifest): Manifest {
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

export function hasDeprecatedVersions(pkgInfo: Manifest): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

export function isDeprecatedManifest(manifest: Manifest): boolean {
  return (
    hasDeprecatedVersions(manifest) &&
    (typeof manifest._attachments === 'undefined' ||
      Object.keys(manifest._attachments).length === 0)
  );
}

export function mapManifestToSearchPackageBody(
  pkg: Manifest,
  searchItem: searchUtils.SearchItem
): searchUtils.SearchPackageBody {
  const latest = pkgUtils.getLatest(pkg);
  const version: Version = pkg.versions[latest];
  const result: searchUtils.SearchPackageBody = {
    name: version.name,
    scope: '',
    description: version.description,
    version: latest,
    keywords: version.keywords,
    date: pkg.time[latest],
    // FIXME: type
    author: version.author as any,
    // FIXME: not possible fill this out from a private package
    publisher: {},
    // FIXME: type
    maintainers: version.maintainers as any,
    links: {
      npm: '',
      homepage: version.homepage,
      repository: version.repository,
      bugs: version.bugs,
    },
  };

  if (typeof searchItem.package.scoped === 'string') {
    result.scope = searchItem.package.scoped;
  }

  return result;
}
