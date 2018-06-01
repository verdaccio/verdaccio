// @flow

import _ from 'lodash';
import {ErrorCode, isObject, normalizeDistTags, DIST_TAGS} from './utils';
import Search from './search';
import {generateRandomHexString} from '../lib/crypto-utils';

import type {Package, Version} from '@verdaccio/types';
import type {IStorage} from '../../types';

const pkgFileName = 'package.json';
const fileExist: string = 'EEXISTS';
const noSuchFile: string = 'ENOENT';
const resourceNotAvailable: string = 'EAGAIN';
const DEFAULT_REVISION: string = `0-0000000000000000`;

const generatePackageTemplate = function(name: string): Package {
  return {
    // standard things
    name,
    versions: {},
    'dist-tags': {},
    time: {},
    _distfiles: {},
    _attachments: {},
    _uplinks: {},
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
    if (_.isNil(isObject(pkg[key]))) {
      pkg[key] = {};
    }
  });

  if (_.isString(pkg._rev) === false) {
    pkg._rev = DEFAULT_REVISION;
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

export const WHITELIST = ['_rev', 'name', 'versions', DIST_TAGS, 'readme', 'time'];

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
      if (!_.isNil(err) && err.status !== 404) {
        return reject(err);
      }
      if (results) {
        return reject(ErrorCode.get409('this package is already present'));
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
      if (err && err.status !== 404) {
        return reject(err);
      }

      // checking package exist already
      if (_.isNil(packageJsonLocal) === false) {
        return reject(ErrorCode.get409('this package is already present'));
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (_.isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== 404) {
            if (isAllowPublishOffline) {
              return resolve();
            }

            return reject(ErrorCode.get503('one of the uplinks is down, refuse to publish'));
          }
        }
      }

      return resolve();
    });
  });
}

export {
  generatePackageTemplate,
  normalizePackage,
  generateRevision,
  getLatestReadme,
  cleanUpReadme,
  DEFAULT_REVISION,
  fileExist,
  noSuchFile,
  pkgFileName,
  resourceNotAvailable,
};

