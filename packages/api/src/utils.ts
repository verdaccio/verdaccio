import _ from 'lodash';

import { Package } from '@verdaccio/types';

/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */

export function isPublishablePackage(pkg: Package): boolean {
  const keys: string[] = Object.keys(pkg);

  return _.includes(keys, 'versions');
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
