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
    'name': name,
    'versions': {},
    'dist-tags': {},
    'time': {},
    '_distfiles': {},
    '_attachments': {},
    '_uplinks': {},
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
    if (_.isNil(Utils.is_object(pkg[key]))) {
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

export {
  generatePackageTemplate,
  normalizePackage,
  generateRevision,
  cleanUpReadme,
  DEFAULT_REVISION,
  fileExist,
  noSuchFile,
  pkgFileName,
  resourceNotAvailable,
};

