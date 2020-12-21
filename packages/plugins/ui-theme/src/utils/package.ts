import { UpLinks } from '@verdaccio/types';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import i18next from 'i18next';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

import { Time } from '../../types/packageMeta';

export const TIMEFORMAT = 'L LTS';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

/**
 * Formats license field for webui.
 * @see https://docs.npmjs.com/files/package.json#license
 */
// License should use type License defined above, but conflicts with the unit test that provide array or empty object
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatLicense(license: any): string | undefined {
  if (isString(license)) {
    return license;
  }

  // @ts-ignore
  if (license && isObject(license) && license.type) {
    // @ts-ignore
    return license.type;
  }

  return;
}

export interface Repository {
  type: string;
  url: string;
}

/**
 * Formats repository field for webui.
 * @see https://docs.npmjs.com/files/package.json#repository
 */

// Repository should use type Repository defined above, but conflicts with the unit test that provide array or empty object
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatRepository(repository: any): string | null {
  if (isString(repository)) {
    return repository;
  }

  // @ts-ignore
  if (repository && isObject(repository) && repository.url) {
    // @ts-ignore
    return repository.url;
  }

  return null;
}

export function formatDate(lastUpdate: string | number): string {
  return dayjs(new Date(lastUpdate)).format(TIMEFORMAT);
}

export function formatDateDistance(lastUpdate: Date | string | number): string {
  return dayjs(new Date(lastUpdate)).fromNow();
}

/**
 * For <LastSync /> component
 * @param {array} uplinks
 */
export function getLastUpdatedPackageTime(uplinks: UpLinks = {}): string {
  let lastUpdate = 0;
  Object.keys(uplinks).forEach(function computeUplink(upLinkName): void {
    const status = uplinks[upLinkName];
    if (status.fetched > lastUpdate) {
      lastUpdate = status.fetched;
    }
  });

  return lastUpdate ? formatDate(lastUpdate) : '';
}

/**
 * For <LastSync /> component
 * @param {Object} time
 * @returns {Array} last 3 releases
 */
export function getRecentReleases(time: Time = {}): Time[] {
  const recent = Object.keys(time).map((version) => ({
    version,
    time: formatDate(time[version]),
  }));

  return recent.slice(recent.length - 3, recent.length).reverse();
}

export function getAuthorName(authorName?: string): string {
  if (!authorName) {
    return i18next.t('author-unknown');
  }

  if (authorName.toLowerCase() === 'anonymous') {
    return i18next.t('author-anonymous');
  }

  return authorName;
}
