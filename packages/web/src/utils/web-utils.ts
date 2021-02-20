import _ from 'lodash';
import { isObject } from '@verdaccio/utils';
import { Package, Author } from '@verdaccio/types';
import { normalizeContributors } from '@verdaccio/store';
import sanitizyReadme from '@verdaccio/readme';

export type AuthorAvatar = Author & { avatar?: string };

import { generateGravatarUrl, GENERIC_AVATAR } from './user';

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(primaryColor);
  if (!isHex) {
    return;
  }

  return primaryColor;
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
    pkgInfoCopy.latest.contributors = contributors.map(
      (contributor): AuthorAvatar => {
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
      }
    );
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
    return sanitizyReadme(readme);
  }

  // logs readme not found error
  // logger.error({ packageName }, '@{packageName}: No readme found');
  throw new Error('ERROR: No README data found!');
}

/**
 * Check if URI is starting with "http://", "https://" or "//"
 * @param {string} uri
 */
export function isHTTPProtocol(uri: string): boolean {
  return /^(https?:)?\/\//.test(uri);
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();
    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

/**
 * Detect running protocol (http or https)
 */
export function getWebProtocol(headerProtocol: string | void, protocol: string): string {
  if (typeof headerProtocol === 'string' && headerProtocol !== '') {
    const commaIndex = headerProtocol.indexOf(',');
    return commaIndex > 0 ? headerProtocol.substr(0, commaIndex) : headerProtocol;
  }
  return protocol;
}
