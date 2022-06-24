import buildDebug from 'debug';
import _ from 'lodash';

import sanitizyReadme from '@verdaccio/readme';
// import { normalizeContributors } from '@verdaccio/store';
import { Author, ConfigYaml } from '@verdaccio/types';

export type AuthorAvatar = Author & { avatar?: string };

const debug = buildDebug('verdaccio:web:utils');

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(primaryColor);
  if (!isHex) {
    debug('invalid primary color %o', primaryColor);
    return;
  }

  return primaryColor;
}

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme
 * @return {String} converted html template
 */
export function parseReadme(packageName: string, readme: string): string | void {
  if (_.isEmpty(readme) === false) {
    debug('sanizity readme');
    return sanitizyReadme(readme);
  }

  // logs readme not found error
  // logger.error({ packageName }, '@{packageName}: No readme found');
  throw new Error('ERROR: No README data found!');
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  debug('deleted unused version properties');
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

export function hasLogin(config: ConfigYaml) {
  return _.isNil(config?.web?.login) || config?.web?.login === true;
}
