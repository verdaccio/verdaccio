// @flow
// @prettier
import _ from 'lodash';
import fs from 'fs';
import assert from 'assert';
import semver from 'semver';
import YAML from 'js-yaml';
import URL from 'url';
import createError from 'http-errors';
import marked from 'marked';

import {
  HTTP_STATUS,
  API_ERROR,
  DEFAULT_PORT,
  DEFAULT_DOMAIN,
  DEFAULT_PROTOCOL,
  CHARACTER_ENCODING
} from './constants';
import {generateGravatarUrl} from '../utils/user';

import type {Package} from '@verdaccio/types';
import type {$Request} from 'express';
import type {StringValue} from '../../types';

const Logger = require('./logger');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

export const DIST_TAGS = 'dist-tags';

export function getUserAgent(): string {
  assert(_.isString(pkgName));
  assert(_.isString(pkgVersion));
  return `${pkgName}/${pkgVersion}`;
}

export function convertPayloadToBase64(payload: string): Buffer {
  return new Buffer(payload, 'base64');
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
  } else {
    // scoped package
    return (
      nameList[0][0] === '@' &&
      validateName(nameList[0].slice(1)) &&
      validateName(nameList[1])
    );
  }
}

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

  // all URL-safe characters and "@" for issue #75
  return !(
    !normalizedName.match(/^[-a-zA-Z0-9_.!~*'()@]+$/) ||
    normalizedName.charAt(0) === '.' || // ".bin", etc.
    normalizedName.charAt(0) === '-' || // "-" is reserved by couchdb
    normalizedName === 'node_modules' ||
    normalizedName === '__proto__' ||
    normalizedName === 'package.json' ||
    normalizedName === 'favicon.ico'
  );
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
export function validateMetadata(object: Package, name: string): Object {
  assert(isObject(object), 'not a json object');
  assert.equal(object.name, name);

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
 * Create base url for registry.
 * @return {String} base registry url
 */
export function combineBaseUrl(
  protocol: string,
  host: string,
  prefix?: string
): string {
  let result = `${protocol}://${host}`;

  if (prefix) {
    prefix = prefix.replace(/\/$/, '');

    result = prefix.indexOf('/') === 0 ? `${result}${prefix}` : prefix;
  }

  return result;
}

export function extractTarballFromUrl(url: string) {
  // $FlowFixMe
  return URL.parse(url).pathname.replace(/^.*\//, '');
}

/**
 * Iterate a packages's versions and filter each original tarball url.
 * @param {*} pkg
 * @param {*} req
 * @param {*} config
 * @return {String} a filtered package
 */
export function convertDistRemoteToLocalTarballUrls(
  pkg: Package,
  req: $Request,
  urlPrefix: string | void
) {
  for (let ver in pkg.versions) {
    if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
      const distName = pkg.versions[ver].dist;

      if (
        _.isNull(distName) === false &&
        _.isNull(distName.tarball) === false
      ) {
        distName.tarball = getLocalRegistryTarballUri(
          distName.tarball,
          pkg.name,
          req,
          urlPrefix
        );
      }
    }
  }
  return pkg;
}

/**
 * Filter a tarball url.
 * @param {*} uri
 * @return {String} a parsed url
 */
export function getLocalRegistryTarballUri(
  uri: string,
  pkgName: string,
  req: $Request,
  urlPrefix: string | void
) {
  const currentHost = req.headers.host;

  if (!currentHost) {
    return uri;
  }
  const tarballName = extractTarballFromUrl(uri);
  const domainRegistry = combineBaseUrl(
    getWebProtocol(req),
    req.headers.host,
    urlPrefix
  );

  return `${domainRegistry}/${pkgName.replace(/\//g, '%2f')}/-/${tarballName}`;
}

/**
 * Create a tag for a package
 * @param {*} data
 * @param {*} version
 * @param {*} tag
 * @return {Boolean} whether a package has been tagged
 */
export function tagVersion(data: Package, version: string, tag: StringValue): boolean {
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
export function getVersion(pkg: Package, version: any) {
  // this condition must allow cast
  if (_.isNil(pkg.versions[version]) === false) {
    return pkg.versions[version];
  }

  try {
    version = semver.parse(version, true);
    for (let versionItem in pkg.versions) {
      // $FlowFixMe
      if (version.compare(semver.parse(versionItem, true)) === 0) {
        return pkg.versions[versionItem];
      }
    }
  } catch (err) {
    return undefined;
  }
}

/**
 * Parse an internet address
 * Allow:
    - https:localhost:1234        - protocol + host + port
    - localhost:1234              - host + port
    - 1234                        - port
    - http::1234                  - protocol + port
    - https://localhost:443/      - full url + https
    - http://[::1]:443/           - ipv6
    - unix:/tmp/http.sock         - unix sockets
    - https://unix:/tmp/http.sock - unix sockets (https)
 * @param {*} urlAddress the internet address definition
 * @return {Object|Null} literal object that represent the address parsed
 */
export function parseAddress(urlAddress: any) {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(
    urlAddress
  );

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      host: urlPattern[6] || urlPattern[7] || DEFAULT_DOMAIN,
      port: urlPattern[8] || DEFAULT_PORT,
    };
  }

  urlPattern = /^((https?):(\/\/)?)?unix:(.*)$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || DEFAULT_PROTOCOL,
      path: urlPattern[4],
    };
  }

  return null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
export function semverSort(listVersions: Array<string>): string[] {
  return listVersions
    .filter(function(x) {
      if (!semver.parse(x, true)) {
        Logger.logger.warn({ver: x}, 'ignoring bad version @{ver}');
        return false;
      }
      return true;
    })
    .sort(semver.compareLoose)
    .map(String);
}

/**
 * Flatten arrays of tags.
 * @param {*} data
 */
export function normalizeDistTags(pkg: Package) {
  let sorted;
  if (!pkg[DIST_TAGS].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = semverSort(Object.keys(pkg.versions));
    if (sorted && sorted.length) {
      pkg[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (let tag in pkg[DIST_TAGS]) {
    if (_.isArray(pkg[DIST_TAGS][tag])) {
      if (pkg[DIST_TAGS][tag].length) {
        // sort array
        // $FlowFixMe
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
  interval.split(/\s+/).forEach(function(x) {
    if (!x) return;
    let m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
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

/**
 * Detect running protocol (http or https)
 * @param {*} req
 * @return {String}
 */
export function getWebProtocol(req: $Request): string {
  return req.get('X-Forwarded-Proto') || req.protocol;
}

export function getLatestVersion(pkgInfo: Package): string {
  return pkgInfo[DIST_TAGS].latest;
};

export const ErrorCode = {
  getConflict: (message: string = API_ERROR.PACKAGE_EXIST) => {
    return createError(HTTP_STATUS.CONFLICT, message);
  },
  getBadData: (customMessage?: string) => {
    return createError(HTTP_STATUS.BAD_DATA, customMessage || API_ERROR.BAD_DATA);
  },
  getBadRequest: (customMessage?: string) => {
    return createError(HTTP_STATUS.BAD_REQUEST, customMessage);
  },
  getInternalError: (customMessage?: string) => {
    return customMessage
      ? createError(HTTP_STATUS.INTERNAL_ERROR, customMessage)
      : createError(HTTP_STATUS.INTERNAL_ERROR);
  },
  getForbidden: (message: string = 'can\'t use this filename') => {
    return createError(HTTP_STATUS.FORBIDDEN, message);
  },
  getServiceUnavailable: (
    message: string = API_ERROR.RESOURCE_UNAVAILABLE
  ) => {
    return createError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
  },
  getNotFound: (customMessage?: string) => {
    return createError(
      HTTP_STATUS.NOT_FOUND,
      customMessage || API_ERROR.NO_PACKAGE
    );
  },
  getCode: (statusCode: number, customMessage: string) => {
    return createError(statusCode, customMessage);
  },
};

export function parseConfigFile (configPath: string): Object {
  return YAML.safeLoad(fs.readFileSync(configPath, CHARACTER_ENCODING.UTF8));
}

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function folderExists(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch (_) {
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function fileExists(path: string): boolean {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch (_) {
    return false;
  }
}

export function sortByName(packages: Array<any>): string[] {
  return packages.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function addScope(scope: string, packageName: string) {
  return `@${scope}/${packageName}`;
}

export function deleteProperties(propertiesToDelete: Array<string>, objectItem: any) {
  _.forEach(propertiesToDelete, (property) => {
    delete objectItem[property];
  });

  return objectItem;
}

export function addGravatarSupport(pkgInfo: Object): Object {
  const pkgInfoCopy = {...pkgInfo};
  const author = _.get(pkgInfo, 'latest.author', null);
  const contributors = _.get(pkgInfo, 'latest.contributors', []);
  const maintainers = _.get(pkgInfo, 'latest.maintainers', []);

  // for author.
  if (author && _.isObject(author)) {
    pkgInfoCopy.latest.author.avatar = generateGravatarUrl(author.email);
  }

  if (author && _.isString(author)) {
    pkgInfoCopy.latest.author = {
      avatar: generateGravatarUrl(),
      email: '',
      author,
    };
  }

  // for contributors
  if (_.isEmpty(contributors) === false) {
    pkgInfoCopy.latest.contributors = contributors.map((contributor) => {
      contributor.avatar = generateGravatarUrl(contributor.email);
      return contributor;
    });
  }

  // for maintainers
  if (_.isEmpty(maintainers) === false) {
    pkgInfoCopy.latest.maintainers = maintainers.map((maintainer) => {
      maintainer.avatar = generateGravatarUrl(maintainer.email);
      return maintainer;
    });
  }

  return pkgInfoCopy;
}

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme
 * @return {String} converted html template
 */
export function parseReadme(packageName: string, readme: string): string {
  if (readme) {
    return marked(readme);
  }

  // logs readme not found error
  Logger.logger.error({packageName}, '@{packageName}: No readme found');

  return marked('ERROR: No README data found!');
}

export function buildToken(type: string, token: string): string {
  return `${_.capitalize(type)} ${token}`;
}
