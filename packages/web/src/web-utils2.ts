import _ from 'lodash';
import { Author } from '@verdaccio/types';
import { DEFAULT_USER } from '@verdaccio/commons-api';
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

export type AuthorFormat = Author | string | null | void;

/**
 * Formats author field for webui.
 * @see https://docs.npmjs.com/files/package.json#author
 * @param {string|object|undefined} author
 */
export function formatAuthor(author: AuthorFormat): AuthorFormat {
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
