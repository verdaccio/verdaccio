// @flow

import _ from 'lodash';
import {ErrorCode, isObject, normalizeDistTags, DIST_TAGS, semverSort} from './utils';
import Search from './search';
import {generateRandomHexString} from '../lib/crypto-utils';

import type {Package, Version, Author} from '@verdaccio/types';
import type {IStorage} from '../../types';
import {API_ERROR, HTTP_STATUS} from './constants';

const pkgFileName = 'package.json';
const fileExist: string = 'EEXISTS';
const noSuchFile: string = 'ENOENT';
export const DEFAULT_REVISION: string = `0-0000000000000000`;

const generatePackageTemplate = function(name: string): Package {
  return {
    // standard things
    name,
    versions: {},
    time: {},
    [DIST_TAGS]: {},
    _uplinks: {},
    _distfiles: {},
    _attachments: {},
    _rev: '',
  };
};

/**
 * Normalise package properties, tags, revision id.
 * @param {Object} pkg package reference.
 */
function normalizePackage(pkg: Package) {
  const pkgProperties = [
    'versions',
    'dist-tags',
    '_distfiles',
    '_attachments',
    '_uplinks',
    'time'];

  pkgProperties.forEach((key) => {
    const pkgProp = pkg[key];

    if (_.isNil(pkgProp) || isObject(pkgProp) === false) {
      pkg[key] = {};
    }
  });

  if (_.isString(pkg._rev) === false) {
    pkg._rev = DEFAULT_REVISION;
  }

  if (_.isString(pkg._id) === false) {
    pkg._id = pkg.name;
  }

  // normalize dist-tags
  normalizeDistTags(pkg);

  return pkg;
}

function generateRevision(rev: string): string {
  const _rev = rev.split('-');

  return ((+_rev[0] || 0) + 1) + '-' + generateRandomHexString();
}

function getLatestReadme(pkg: Package): string {
  const versions = pkg['versions'] || {};
  const distTags = pkg['dist-tags'] || {};
  const latestVersion = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = _.trim(pkg.readme || latestVersion.readme || '');
  if (readme) {
    return readme;
  }
  // In case of empty readme - trying to get ANY readme in the following order: 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = [
    'next',
    'beta',
    'alpha',
    'test',
    'dev',
    'canary'];
  readmeDistTagsPriority.map(function(tag) {
    if (readme) {
      return readme;
    }
    const data = distTags[tag] ? versions[distTags[tag]] || {} : {};
    readme = _.trim(data.readme || readme);
  });
  return readme;
}

function cleanUpReadme(version: Version): Version {
  if (_.isNil(version) === false) {
    delete version.readme;
  }

  return version;
}

export function normalizeContributors(contributors: Array<Author>): Array<Author> {
   if (isObject(contributors) || _.isString(contributors)) {
    return [((contributors): any)];
  }

  return contributors;
}

export const WHITELIST = ['_rev', 'name', 'versions', 'dist-tags', 'readme', 'time', '_id'];

export function cleanUpLinksRef(keepUpLinkData: boolean, result: Package): Package {
  const propertyToKeep = [...WHITELIST];
    if (keepUpLinkData === true) {
      propertyToKeep.push('_uplinks');
    }

    for (let i in result) {
      if (propertyToKeep.indexOf(i) === -1) { // Remove sections like '_uplinks' from response
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
export function checkPackageLocal(name: string, localStorage: IStorage): Promise<any> {
  return new Promise((resolve, reject) => {
    localStorage.getPackageMetadata(name, (err, results) => {
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

export function publishPackage(name: string, metadata: any, localStorage: IStorage): Promise<any> {
  return new Promise((resolve, reject) => {
    localStorage.addPackage(name, metadata, (err, latest) => {
      if (!_.isNull(err)) {
        return reject(err);
      } else if (!_.isUndefined(latest)) {
        Search.add(latest);
      }
      return resolve();
    });
  });
}

export function checkPackageRemote(name: string, isAllowPublishOffline: boolean, syncMetadata: Function): Promise<any> {
  return new Promise((resolve, reject) => {
    // $FlowFixMe
    syncMetadata(name, null, {}, (err, packageJsonLocal, upLinksErrors) => {
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

export function prepareSearchPackage(data: Package, time: mixed) {
  const listVersions: Array<string> = Object.keys(data.versions);
  const versions: Array<string> = semverSort(listVersions);
  const latest: string = data[DIST_TAGS] && data[DIST_TAGS].latest ? data[DIST_TAGS].latest : versions.pop();

  if (data.versions[latest]) {
    const version: Version = data.versions[latest];
    const pkg: any = {
      name: version.name,
      description: version.description,
      [DIST_TAGS]: {latest},
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
      versions: {[latest]: 'latest'},
    };

    return pkg;
  }
}

export {
  generatePackageTemplate,
  normalizePackage,
  generateRevision,
  getLatestReadme,
  cleanUpReadme,
  fileExist,
  noSuchFile,
  pkgFileName,
};

