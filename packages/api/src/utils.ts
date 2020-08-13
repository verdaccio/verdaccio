import { Package } from '@verdaccio/types';
import _ from 'lodash';

/**
 * Check whether the package metadta has enough data to be published
 * @param pkg metadata
 */

export function isPublishablePackage(pkg: Package): boolean {
  const keys: string[] = Object.keys(pkg);

  return _.includes(keys, 'versions');
}
