import { Manifest } from '@verdaccio/types';

/**
 * Check whether the package metadata has enough data to be published
 * @param pkg metadata
 */
export function isPublishablePackage(pkg: Manifest): boolean {
  // TODO: we can do better, no need get keys
  const keys: string[] = Object.keys(pkg);

  return keys.includes('versions');
}
