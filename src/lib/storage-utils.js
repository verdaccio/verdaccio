// @flow

import _ from 'lodash';
import crypto from 'crypto';
import * as Utils from './utils';

import type {
  Package, Version,
} from '@verdaccio/types';

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
    if (_.isNil(Utils.isObject(pkg[key]))) {
      pkg[key] = {};
    }
  });

  if (_.isString(pkg._rev) === false) {
    pkg._rev = DEFAULT_REVISION;
  }

  // normalize dist-tags
  Utils.normalize_dist_tags(pkg);

  return pkg;
}

function generateRevision(rev: string): string {
  const _rev = rev.split('-');

  return ((+_rev[0] || 0) + 1) + '-' + crypto.pseudoRandomBytes(8).toString('hex');
}

function cleanUpReadme(version: Version): Version {
  if(_.isNil(version) === false) {
    delete version.readme;
  }

  return version;
}

function getLatestReadme(pkg: Package): string {
  const versions = pkg['versions'] || {};
  const distTags = pkg['dist-tags'] || {};
  const latestVersion = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = latestVersion.readme || pkg.readme || '';
  // In case of empty readme - trying to get ANY readme in the following order: 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = [
    'next',
    'beta',
    'alpha',
    'test',
    'dev',
    'canary'];
  readmeDistTagsPriority.map(function(tag) {
    if(!readme) {
      const data = distTags[tag] ? versions[distTags[tag]] || {} : {};
      readme = data.readme || readme;
    }
  });
  return readme;
}

export {
  generatePackageTemplate,
  normalizePackage,
  generateRevision,
  cleanUpReadme,
  getLatestReadme,
  DEFAULT_REVISION,
  fileExist,
  noSuchFile,
  pkgFileName,
  resourceNotAvailable,
};

