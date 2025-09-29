import createDebug from 'debug';
import _ from 'lodash';
import path from 'node:path';
import semver from 'semver';

import { parseConfigFile } from '@verdaccio/config';
import { errorUtils, pkgUtils, validationUtils, warningUtils } from '@verdaccio/core';
import { ConfigYaml, LoggerConfigItem, StringValue } from '@verdaccio/types';
import { Config, Manifest, Version } from '@verdaccio/types';
import { buildToken as buildTokenUtil } from '@verdaccio/utils';

import { DIST_TAGS, certPem, csrPem, keyPem } from './constants';
import { logger, setup } from './logger';

const debug = createDebug('verdaccio:lib:utils');

const {
  getBadData,
  getBadRequest,
  getCode,
  getConflict,
  getForbidden,
  getInternalError,
  getNotFound,
  getServiceUnavailable,
  getUnauthorized,
} = errorUtils;

export function initLogger(logConfig: ConfigYaml) {
  if (logConfig.logs) {
    logConfig.log = logConfig.logs;
    warningUtils.emit(warningUtils.Codes.VERWAR002);
  }
  debug('initializing logger with config: %o', logConfig.log);
  setup(logConfig.log as LoggerConfigItem);
}

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
export const isObject = validationUtils.isObject;

/**
 * @deprecated not used un v6
 */
export function isObjectOrArray(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false;
}

export function tagVersion(data: Manifest, version: string, tag: StringValue): boolean {
  if (tag && data[DIST_TAGS][tag] !== version && semver.parse(version, true)) {
    // valid version - store
    data[DIST_TAGS][tag] = version;
    return true;
  }
  return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
export function getVersion(pkg: Manifest, version: any): Version | void {
  // this condition must allow cast
  if (_.isNil(pkg.versions[version]) === false) {
    return pkg.versions[version];
  }

  try {
    version = semver.parse(version, true);
    for (const versionItem in pkg.versions) {
      if (version.compare(semver.parse(versionItem, true)) === 0) {
        return pkg.versions[versionItem];
      }
    }
  } catch {
    return undefined;
  }
}

/**
 * Flatten arrays of tags.
 * @param {*} data
 */
export function normalizeDistTags(pkg: Manifest): void {
  let sorted;
  if (!pkg[DIST_TAGS].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = pkgUtils.semverSort(Object.keys(pkg.versions));
    if (sorted && sorted.length) {
      pkg[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (const tag in pkg[DIST_TAGS]) {
    if (_.isArray(pkg[DIST_TAGS][tag])) {
      if (pkg[DIST_TAGS][tag].length) {
        // sort array
        // FIXME: this is clearly wrong, we need to research why this is like this.
        sorted = pkgUtils.semverSort(pkg[DIST_TAGS][tag]);
        if (sorted.length) {
          // use highest version based on semver sort
          pkg[DIST_TAGS][tag] = sorted.pop();
        }
      } else {
        delete pkg[DIST_TAGS][tag];
      }
    } else if (_.isString(pkg[DIST_TAGS][tag])) {
      if (!semver.parse(pkg[DIST_TAGS][tag], true)) {
        // if the version is invalid, delete the dist-tag entry
        delete pkg[DIST_TAGS][tag];
      }
    }
  }
}

const parseIntervalTable = {
  '': 1000,
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 86400000,
  w: 7 * 86400000,
  M: 30 * 86400000,
  y: 365 * 86400000,
};

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
export function parseInterval(interval: any): number {
  if (typeof interval === 'number') {
    return interval * 1000;
  }
  let result = 0;
  let last_suffix = Infinity;
  interval.split(/\s+/).forEach(function (x): void {
    if (!x) {
      return;
    }
    const m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
    if (
      !m ||
      parseIntervalTable[m[4]] >= last_suffix ||
      (m[4] === '' && last_suffix !== Infinity)
    ) {
      throw Error('invalid interval: ' + interval);
    }
    last_suffix = parseIntervalTable[m[4]];
    result += Number(m[1]) * parseIntervalTable[m[4]];
  });
  return result;
}

export const ErrorCode = {
  getConflict,
  getBadData,
  getBadRequest,
  getInternalError,
  getUnauthorized,
  getForbidden,
  getServiceUnavailable,
  getNotFound,
  getCode,
};

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();

    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme

 * @return {String} converted html template
 */
// TODO: rename, does not parse anymore
export function parseReadme(packageName: string, readme: string): string | void {
  if (_.isEmpty(readme) === false) {
    return readme;
  }

  // logs readme not found error
  logger.info({ packageName }, '@{packageName}: No readme found');

  return 'ERROR: No README data found!';
}

export function encodeScopedUri(packageName): string {
  return packageName.replace(/\//g, '%2f');
}

export function hasDiffOneKey(versions): boolean {
  return Object.keys(versions).length !== 1;
}

export function isVersionValid(packageMeta, packageVersion): boolean {
  const hasVersion = typeof packageVersion !== 'undefined';
  if (!hasVersion) {
    return false;
  }

  const hasMatchVersion = Object.keys(packageMeta.versions).includes(packageVersion);
  return hasMatchVersion;
}

export function isRelatedToDeprecation(pkgInfo: Manifest): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

export const resolveConfigPath = function (storageLocation: string, file: string) {
  return path.resolve(path.dirname(storageLocation), file);
};

export function logHTTPSWarning(storageLocation) {
  logger.fatal(
    [
      'You have enabled HTTPS and need to specify either ',
      '    "https.key" and "https.cert" or ',
      '    "https.pfx" and optionally "https.passphrase" ',
      'to run https server',
      '',
      // commands are borrowed from node.js docs
      'To quickly create self-signed certificate, use:',
      ' $ openssl genrsa -out ' + resolveConfigPath(storageLocation, keyPem) + ' 2048',
      ' $ openssl req -new -sha256 -key ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, csrPem),
      ' $ openssl x509 -req -in ' +
        resolveConfigPath(storageLocation, csrPem) +
        ' -signkey ' +
        resolveConfigPath(storageLocation, keyPem) +
        ' -out ' +
        resolveConfigPath(storageLocation, certPem),
      '',
      'And then add to config file (' + storageLocation + '):',
      '  https:',
      `    key: ${resolveConfigPath(storageLocation, keyPem)}`,
      `    cert: ${resolveConfigPath(storageLocation, certPem)}`,
    ].join('\n')
  );
  process.exit(2);
}

export function hasLogin(config: Config) {
  return _.isNil(config?.web?.login) || config?.web?.login === true;
}

export { buildTokenUtil as buildToken, parseConfigFile };
