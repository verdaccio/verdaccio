import buildDebug from 'debug';

import type { Manifest } from '@verdaccio/types';

import { resolveAllowList } from './matcher';
import type { MatchResult } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Filter out all package versions that have a deprecation notice.
 */
export function filterDeprecatedVersions(
  manifest: Manifest,
  allowMatch: MatchResult | undefined
): Manifest {
  const { allowAll, whitelistedVersions } = resolveAllowList(allowMatch);
  if (allowAll) {
    return manifest;
  }

  const removedVersions: string[] = [];

  Object.entries(manifest.versions).forEach(([version, versionData]) => {
    if (whitelistedVersions.includes(version)) {
      return;
    }

    if (typeof versionData.deprecated === 'string' && versionData.deprecated.length > 0) {
      removedVersions.push(version);
      delete manifest.versions[version];
    }
  });

  if (removedVersions.length > 0) {
    debug(
      'deprecated filter removed %d versions from %s: %o',
      removedVersions.length,
      manifest.name,
      removedVersions
    );
  }

  return manifest;
}
