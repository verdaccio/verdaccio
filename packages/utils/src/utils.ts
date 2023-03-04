import _ from 'lodash';

import { DEFAULT_USER, DIST_TAGS } from '@verdaccio/core';
import { Author, Manifest, Package } from '@verdaccio/types';

import { stringToMD5 } from './crypto-utils';

export type AuthorAvatar = Author & { avatar?: string };
/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 * @deprecated
 */
export function validateName(name: string): boolean {
  if (_.isString(name) === false) {
    return false;
  }
  let normalizedName: string = name.toLowerCase();

  const isScoped: boolean = name.startsWith('@') && name.includes('/');
  const scopedName = name.split('/', 2)[1];

  if (isScoped && !_.isUndefined(scopedName)) {
    normalizedName = scopedName.toLowerCase();
  }

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
 * @deprecated
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
 * @deprecated
 */
export function isObject(obj: any): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

export function getLatestVersion(pkgInfo: Package): string {
  return pkgInfo[DIST_TAGS].latest;
}

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
  return `${str.slice(0, charNum)}...${str.slice(-charNum)}`;
}

// @deprecated
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

export function addGravatarSupport(pkgInfo: Manifest, online = true): AuthorAvatar {
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
      // @ts-ignore
      maintainer.avatar = generateGravatarUrl(maintainer.email, online);
      return maintainer;
    });
  }

  return pkgInfoCopy;
}

const AVATAR_PROVIDER = 'https://www.gravatar.com/avatar/';
export const GENERIC_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg height="100" viewBox="-27 24 100 100" width="100" xmlns="http://www.w3.org/' +
      '2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle cx="23" cy="7' +
      '4" id="a" r="50"/></defs><use fill="#F5EEE5" overflow="visible" xlink:href="#a"/' +
      '><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><g clip-pa' +
      'th="url(#b)"><defs><path d="M36 95.9c0 4 4.7 5.2 7.1 5.8 7.6 2 22.8 5.9 22.8 5.9' +
      ' 3.2 1.1 5.7 3.5 7.1 6.6v9.8H-27v-9.8c1.3-3.1 3.9-5.5 7.1-6.6 0 0 15.2-3.9 22.8-' +
      '5.9 2.4-.6 7.1-1.8 7.1-5.8V85h26v10.9z" id="c"/></defs><use fill="#E6C19C" overf' +
      'low="visible" xlink:href="#c"/><clipPath id="d"><use overflow="visible" xlink:hr' +
      'ef="#c"/></clipPath><path clip-path="url(#d)" d="M23.2 35h.2c3.3 0 8.2.2 11.4 2 ' +
      '3.3 1.9 7.3 5.6 8.5 12.1 2.4 13.7-2.1 35.4-6.3 42.4-4 6.7-9.8 9.2-13.5 9.4H23h-.' +
      '1c-3.7-.2-9.5-2.7-13.5-9.4-4.2-7-8.7-28.7-6.3-42.4 1.2-6.5 5.2-10.2 8.5-12.1 3.2' +
      '-1.8 8.1-2 11.4-2h.2z" fill="#D4B08C"/></g><path d="M22.6 40c19.1 0 20.7 13.8 20' +
      '.8 15.1 1.1 11.9-3 28.1-6.8 33.7-4 5.9-9.8 8.1-13.5 8.3h-.5c-3.8-.3-9.6-2.5-13.6' +
      '-8.4-3.8-5.6-7.9-21.8-6.8-33.8C2.3 53.7 3.5 40 22.6 40z" fill="#F2CEA5"/></svg>'
  );

/**
 * Generate gravatar url from email address
 */
export function generateGravatarUrl(email: string | void = '', online: boolean = true): string {
  if (online && _.isString(email) && _.size(email) > 0) {
    email = email.trim().toLocaleLowerCase();
    const emailMD5 = stringToMD5(email);
    return `${AVATAR_PROVIDER}${emailMD5}`;
  }
  return GENERIC_AVATAR;
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

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}
