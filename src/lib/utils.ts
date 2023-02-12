import assert from 'assert';
import buildDebug from 'debug';
import fs from 'fs';
import YAML from 'js-yaml';
import _ from 'lodash';
import semver from 'semver';
import { URL } from 'url';
import validator from 'validator';

// eslint-disable-next-line max-len
import { errorUtils, validatioUtils } from '@verdaccio/core';
import { StringValue } from '@verdaccio/types';
import { Author, Config, Package, Version } from '@verdaccio/types';
import {
  GENERIC_AVATAR,
  buildToken as buildTokenUtil,
  generateGravatarUrl,
  normalizeContributors,
} from '@verdaccio/utils';

import { AuthorAvatar } from '../types';
import {
  APP_ERROR,
  DEFAULT_DOMAIN,
  DEFAULT_PORT,
  DEFAULT_PROTOCOL,
  DEFAULT_USER,
  DIST_TAGS,
} from './constants';
import { logger } from './logger';

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
const debug = buildDebug('verdaccio');
const validProtocols = ['https', 'http'];
export function convertPayloadToBase64(payload: string): Buffer {
  return Buffer.from(payload, 'base64');
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
export const isObject = validatioUtils.isObject;

/**
 * @deprecated not used un v6
 */
export function isObjectOrArray(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false;
}

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
export function parseAddress(urlAddress: any): any {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

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
export function semverSort(listVersions: string[]): string[] {
  return (
    listVersions
      .filter(function (x): boolean {
        if (!semver.parse(x, true)) {
          logger.warn({ ver: x }, 'ignoring bad version @{ver}');
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
    if (sorted && sorted.length) {
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

export function parseConfigFile(configPath: string): any {
  try {
    if (/\.ya?ml$/i.test(configPath)) {
      return YAML.load(fs.readFileSync(configPath, 'utf-8'));
    }
    debug('yaml parsed');
    return require(configPath);
  } catch (e) {
    debug('yaml parse failed');
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = APP_ERROR.CONFIG_NOT_VALID;
    }

    throw new Error(e);
  }
}

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function folderExists(path: string): boolean {
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

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();

    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}

export function addGravatarSupport(pkgInfo: Package, online = true): AuthorAvatar {
  const pkgInfoCopy = { ...pkgInfo } as any;
  const author: any = _.get(pkgInfo, 'latest.author', null) as any;
  const contributors: AuthorAvatar[] = normalizeContributors(
    _.get(pkgInfo, 'latest.contributors', [])
  );
  const maintainers = _.get(pkgInfo, 'latest.maintainers', []);

  // for author.
  if (author && _.isObject(author)) {
    const { email } = author as Author;
    pkgInfoCopy.latest.author.avatar = generateGravatarUrl(email, online);
  }

  if (author && _.isString(author)) {
    pkgInfoCopy.latest.author = {
      avatar: GENERIC_AVATAR,
      email: '',
      author,
    };
  }

  // for contributors
  if (_.isEmpty(contributors) === false) {
    pkgInfoCopy.latest.contributors = contributors.map((contributor): AuthorAvatar => {
      if (isObject(contributor)) {
        contributor.avatar = generateGravatarUrl(contributor.email, online);
      } else if (_.isString(contributor)) {
        contributor = {
          avatar: GENERIC_AVATAR,
          email: contributor,
          name: contributor,
        };
      }

      return contributor;
    });
  }

  // for maintainers
  if (_.isEmpty(maintainers) === false) {
    pkgInfoCopy.latest.maintainers = maintainers.map((maintainer): void => {
      maintainer.avatar = generateGravatarUrl(maintainer.email, online);
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
export function parseReadme(packageName: string, readme: string): string | void {
  if (_.isEmpty(readme) === false) {
    return readme;
  }

  // logs readme not found error
  logger.info({ packageName }, '@{packageName}: No readme found');

  return 'ERROR: No README data found!';
}

export type AuthorFormat = Author | string | null | object | void;

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

export function isRelatedToDeprecation(pkgInfo: Package): boolean {
  const { versions } = pkgInfo;
  for (const version in versions) {
    if (Object.prototype.hasOwnProperty.call(versions[version], 'deprecated')) {
      return true;
    }
  }
  return false;
}

export function validateURL(publicUrl: string | void) {
  try {
    const parsed = new URL(publicUrl as string);
    if (!validProtocols.includes(parsed.protocol.replace(':', ''))) {
      throw Error('invalid protocol');
    }
    return true;
  } catch (err) {
    // TODO: add error logger here
    return false;
  }
}

export function isHost(url: string = '', options = {}): boolean {
  return validator.isURL(url, {
    require_host: true,
    allow_trailing_dot: false,
    require_valid_protocol: false,
    // @ts-ignore
    require_port: false,
    require_tld: false,
    ...options,
  });
}

export function hasLogin(config: Config) {
  // FIXME: types are not yet on the library verdaccio/monorepo
  // @ts-ignore
  return _.isNil(config?.web?.login) || config?.web?.login === true;
}

export { buildTokenUtil as buildToken };
