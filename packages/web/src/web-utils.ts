import _ from 'lodash';

import { Author, ConfigYaml } from '@verdaccio/types';

export function hasLogin(config: ConfigYaml) {
  return _.isNil(config?.web?.login) || config?.web?.login === true;
}

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();
    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

export type AuthorAvatar = Author & { avatar?: string };

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  _.forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}
