import assert from 'assert';
import _ from 'lodash';
import semver from 'semver';
import { Package, Version, Author } from '@verdaccio/types';
import {
  DIST_TAGS,
  DEFAULT_USER,
  getConflict,
  getBadData,
  getBadRequest,
  getInternalError,
  getUnauthorized,
  getForbidden,
  getServiceUnavailable,
  getNotFound,
  getCode,
} from '@verdaccio/commons-api';

/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 */
export function validateName(name: string): boolean {
  if (_.isString(name) === false) {
    return false;
  }

  const normalizedName: string = name.toLowerCase();

  /**
   * Some context about the first regex
   * - npm used to have a different tarball naming system.
   * eg: http://registry.npmjs.com/thirty-two
   * https://registry.npmjs.org/thirty-two/-/thirty-two@0.0.1.tgz
   * The file name thirty-two@0.0.1.tgz, the version and the pkg name was separated by an at (@)
   * while nowadays the naming system is based in dashes
   * https://registry.npmjs.org/verdaccio/-/verdaccio-1.4.0.tgz
   *
   * more info here: https://github.com/rlidwka/sinopia/issues/75
   */
  return !(
    !normalizedName.match(/^[-a-zA-Z0-9_.!~*'()@]+$/) ||
    normalizedName.startsWith('.') || // ".bin", etc.
    ['node_modules', '__proto__', 'favicon.ico'].includes(normalizedName)
  );
}

/**
 * Validate a package.
 * @return {Boolean} whether the package is valid or not
 */
export function validatePackage(name: string): boolean {
  const nameList = name.split('/', 2);
  if (nameList.length === 1) {
    // normal package
    return validateName(nameList[0]);
  }
  // scoped package
  return nameList[0][0] === '@' && validateName(nameList[0].slice(1)) && validateName(nameList[1]);
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
export function isObject(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
export function validateMetadata(object: Package, name: string): Package {
  assert(isObject(object), 'not a json object');
  assert.strictEqual(object.name, name);

  if (!isObject(object[DIST_TAGS])) {
    object[DIST_TAGS] = {};
  }

  if (!isObject(object['versions'])) {
    object['versions'] = {};
  }

  if (!isObject(object['time'])) {
    object['time'] = {};
  }

  return object;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
export function getVersion(pkg: Package, version: any): Version | void {
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
  } catch (err) {
    return undefined;
  }
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
export function semverSort(listVersions: string[] /* logger */): string[] {
  return (
    listVersions
      .filter(function (x): boolean {
        if (!semver.parse(x, true)) {
          // FIXME: logger is always undefined
          // logger.warn({ ver: x }, 'ignoring bad version @{ver}');
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
 * Flatten arrays of tags.
 * @param {*} data
 */
export function normalizeDistTags(pkg: Package): void {
  let sorted;
  if (!pkg[DIST_TAGS].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = semverSort(Object.keys(pkg.versions));
    if (sorted?.length) {
      pkg[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (const tag in pkg[DIST_TAGS]) {
    if (_.isArray(pkg[DIST_TAGS][tag])) {
      if (pkg[DIST_TAGS][tag].length) {
        // sort array
        // FIXME: this is clearly wrong, we need to research why this is like this.
        // @ts-ignore
        sorted = semverSort(pkg[DIST_TAGS][tag]);
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

export function getLatestVersion(pkgInfo: Package): string {
  return pkgInfo[DIST_TAGS].latest;
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

export function buildToken(type: string, token: string): string {
  return `${_.capitalize(type)} ${token}`;
}

export type AuthorFormat = Author | string | null | void;

/**
 * Formats author field for webui.
 * @see https://docs.npmjs.com/files/package.json#author
 * @param {string|object|undefined} author
 */
export function formatAuthor(author: AuthorFormat): any {
  let authorDetails = {
    name: DEFAULT_USER,
    email: '',
    url: '',
  };

  if (_.isNil(author)) {
    return authorDetails;
  }

  if (_.isString(author)) {
    authorDetails = {
      ...authorDetails,
      name: author as string,
    };
  }

  if (_.isObject(author)) {
    authorDetails = {
      ...authorDetails,
      ...(author as Author),
    };
  }

  return authorDetails;
}

/**
 * Apply whitespaces based on the length
 * @param {*} str the log message
 * @return {String}
 */
export function pad(str, max): string {
  if (str.length < max) {
    return str + ' '.repeat(max - str.length);
  }
  return str;
}

/**
 * return a masquerade string with its first and last {charNum} and three dots in between.
 * @param {String} str
 * @param {Number} charNum
 * @returns {String}
 */
export function mask(str: string, charNum = 3): string {
  return `${str.substr(0, charNum)}...${str.substr(-charNum)}`;
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
