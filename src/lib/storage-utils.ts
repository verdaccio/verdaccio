import _ from 'lodash';

import { AbbreviatedManifest, AbbreviatedVersions, Author, Manifest, Package, Version } from '@verdaccio/types';

import { generateRandomHexString } from '../lib/crypto-utils';
import { IStorage } from '../types';
import { API_ERROR, DIST_TAGS, HTTP_STATUS, STORAGE, USERS } from './constants';
import Search from './search';
import { ErrorCode, isObject, normalizeDistTags, semverSort } from './utils';

export function generatePackageTemplate(name: string): Package {
  return {
    // standard things
    name,
    versions: {},
    time: {},
    [USERS]: {},
    [DIST_TAGS]: {},
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
export function normalizePackage(pkg: Package): Package {
  const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

  pkgProperties.forEach((key): void => {
    const pkgProp = pkg[key];

    if (_.isNil(pkgProp) || isObject(pkgProp) === false) {
      pkg[key] = {};
    }
  });

  if (_.isString(pkg._rev) === false) {
    pkg._rev = STORAGE.DEFAULT_REVISION;
  }

  if (_.isString(pkg._id) === false) {
    pkg._id = pkg.name;
  }

  // normalize dist-tags
  normalizeDistTags(pkg);

  return pkg;
}

export function generateRevision(rev: string): string {
  const _rev = rev.split('-');

  return (+_rev[0] || 0) + 1 + '-' + generateRandomHexString();
}

export function getLatestReadme(pkg: Package): string {
  const versions = pkg['versions'] || {};
  const distTags = pkg[DIST_TAGS] || {};
  // FIXME: here is a bit tricky add the types
  const latestVersion: Version | any = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = _.trim(pkg.readme || latestVersion.readme || '');
  if (readme) {
    return readme;
  }

  // In case of empty readme - trying to get ANY readme in the following order: 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = ['next', 'beta', 'alpha', 'test', 'dev', 'canary'];
  readmeDistTagsPriority.map(function (tag): string | void {
    if (readme) {
      return readme;
    }
    const version: Version | any = distTags[tag] ? versions[distTags[tag]] || {} : {};
    readme = _.trim(version.readme || readme);
  });
  return readme;
}

export function cleanUpReadme(version: Version): Version {
  if (_.isNil(version) === false) {
    // @ts-ignore
    delete version.readme;
  }

  return version;
}

export function normalizeContributors(contributors: Author[]): Author[] {
  if (_.isNil(contributors)) {
    return [];
  } else if (contributors && _.isArray(contributors) === false) {
    // FIXME: this branch is clearly no an array, still tsc complains
    // @ts-ignore
    return [contributors];
  } else if (_.isString(contributors)) {
    return [
      {
        name: contributors,
      },
    ];
  }

  return contributors;
}

export const WHITELIST = ['_rev', 'name', 'versions', 'dist-tags', 'readme', 'time', '_id', 'users'];

export function cleanUpLinksRef(keepUpLinkData: boolean, result: Package): Package {
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

/**
 * Check whether a package it is already a local package
 * @param {*} name
 * @param {*} localStorage
 */
export function checkPackageLocal(name: string, localStorage: IStorage): Promise<void> {
  return new Promise((resolve, reject): void => {
    localStorage.getPackageMetadata(name, (err, results): void => {
      if (!_.isNil(err) && err.status !== HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }
      if (results) {
        return reject(ErrorCode.getConflict(API_ERROR.PACKAGE_EXIST));
      }
      return resolve();
    });
  });
}

export function publishPackage(name: string, metadata: any, localStorage: IStorage): Promise<void> {
  return new Promise((resolve, reject): void => {
    localStorage.addPackage(name, metadata, (err, latest): void => {
      if (!_.isNull(err)) {
        return reject(err);
      } else if (!_.isUndefined(latest)) {
        Search.add(latest);
      }
      return resolve();
    });
  });
}

export function checkPackageRemote(name: string, isAllowPublishOffline: boolean, syncMetadata: Function): Promise<void> {
  return new Promise((resolve, reject): void => {
    syncMetadata(name, null, {}, (err, packageJsonLocal, upLinksErrors): void => {
      // something weird
      if (err && err.status !== HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }

      // checking package exist already
      if (_.isNil(packageJsonLocal) === false) {
        return reject(ErrorCode.getConflict(API_ERROR.PACKAGE_EXIST));
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (_.isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== HTTP_STATUS.NOT_FOUND) {
            if (isAllowPublishOffline) {
              return resolve();
            }

            return reject(ErrorCode.getServiceUnavailable(API_ERROR.UPLINK_OFFLINE_PUBLISH));
          }
        }
      }

      return resolve();
    });
  });
}

export function mergeUplinkTimeIntoLocal(localMetadata: Package, remoteMetadata: Package): any {
  if ('time' in remoteMetadata) {
    return Object.assign({}, localMetadata.time, remoteMetadata.time);
  }

  return localMetadata.time;
}

export function prepareSearchPackage(data: Package, time: unknown): any {
  const listVersions: string[] = Object.keys(data.versions);
  const versions: string[] = semverSort(listVersions);
  const latest: string | undefined = data[DIST_TAGS] && data[DIST_TAGS].latest ? data[DIST_TAGS].latest : versions.pop();

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
      time: {
        modified: time,
      },
      versions,
    };

    return pkg;
  }
}

/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */
export function isPublishablePackage(pkg: Package): boolean {
  const keys: string[] = Object.keys(pkg);

  return _.includes(keys, 'versions');
}

export function hasInstallScript(version: Version) {
  if(version?.scripts) {
    const scripts = Object.keys(version.scripts);
    return scripts.find(item => {
      return ['install', 'preinstall', 'postinstall'].includes(item);
    }) !== undefined;
  }
  return false;
}

export function convertAbbreviatedManifest(manifest: Manifest): AbbreviatedManifest {
  const abbreviatedVersions = Object.keys(manifest.versions).reduce((acc: AbbreviatedVersions, version: string) => {
    const _version = manifest.versions[version];
    // This should be align with this document
    // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object
    const _version_abbreviated = {
      name: _version.name,
      version: _version.version,
      description: _version.description,
      deprecated: _version.deprecated,
      bin: _version.bin,
      dist: _version.dist,
      engines: _version.engines,
      cpu: _version.cpu,
      os: _version.os,
      funding: _version.funding,
      directories: _version.directories,
      dependencies: _version.dependencies,
      devDependencies: _version.devDependencies,
      peerDependencies: _version.peerDependencies,
      peerDependenciesMeta: _version.peerDependenciesMeta,
      optionalDependencies: _version.optionalDependencies,
      bundleDependencies: _version.bundleDependencies,
      // npm cli specifics
      _hasShrinkwrap: _version._hasShrinkwrap,
      hasInstallScript: hasInstallScript(_version),
    };
    acc[version] = _version_abbreviated;
    return acc;
  }, {});
  const convertedManifest = {
    name: manifest['name'],
    [DIST_TAGS]: manifest[DIST_TAGS],
    versions: abbreviatedVersions,
    // @ts-ignore
    modified: manifest?.time?.modified,
    // NOTE: special case for pnpm https://github.com/pnpm/rfcs/pull/2
    time: manifest?.time,
  };

  // @ts-ignore
  return convertedManifest;
}
