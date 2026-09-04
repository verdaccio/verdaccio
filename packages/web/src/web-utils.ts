import { forEach, isNil } from 'lodash-es';

import { DIST_TAGS } from '@verdaccio/core';
import type { ConfigYaml, Manifest } from '@verdaccio/types';

export function hasLogin(config: ConfigYaml) {
  return isNil(config?.web?.login) || config?.web?.login === true;
}

export function sortByName(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorNames = a.name.toLowerCase() < b.name.toLowerCase();
    return orderAscending ? (comparatorNames ? -1 : 1) : comparatorNames ? 1 : -1;
  });
}

export function sortByTime(packages: any[], orderAscending: boolean | void = true): string[] {
  return packages.slice().sort(function (a, b): number {
    const comparatorTime = a.time < b.time;
    return orderAscending ? (comparatorTime ? -1 : 1) : comparatorTime ? 1 : -1;
  });
}

export function addScope(scope: string, packageName: string): string {
  return `@${scope}/${packageName}`;
}

export function deleteProperties(propertiesToDelete: string[], objectItem: any): any {
  forEach(propertiesToDelete, (property): any => {
    delete objectItem[property];
  });

  return objectItem;
}

export function isVersionValid(packageMeta: Manifest, packageVersion: string): boolean {
  const hasVersion = typeof packageVersion !== 'undefined';
  if (!hasVersion) {
    return false;
  }

  // own-property check: the version may come from user input, and values like
  // `__proto__` must never validate against inherited properties
  return Object.hasOwn(packageMeta.versions, packageVersion);
}

/**
 * Resolve a user-supplied version or dist-tag to a concrete version of the
 * manifest, or undefined. Own-property checks only: `__proto__` must never
 * resolve against inherited properties.
 */
export function resolveVersion(packageMeta: Manifest, version: string): string | undefined {
  if (isVersionValid(packageMeta, version)) {
    return version;
  }

  const distTags = packageMeta[DIST_TAGS];
  if (distTags && Object.hasOwn(distTags, version)) {
    const resolved = distTags[version];
    if (typeof resolved === 'string' && isVersionValid(packageMeta, resolved)) {
      return resolved;
    }
  }

  return undefined;
}
