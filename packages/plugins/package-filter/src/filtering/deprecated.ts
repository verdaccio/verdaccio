import buildDebug from 'debug';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import { resolveAllowList } from './matcher';
import type { MatchResult } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Filter out all package versions that have a deprecation notice.
 * The version currently tagged as `latest` is always preserved so that
 * `dist-tags.latest` continues to point to a valid entry.
 */
export function filterDeprecatedVersions(
  manifest: Manifest,
  allowMatch: MatchResult | undefined
): Manifest {
  const { allowAll, whitelistedVersions } = resolveAllowList(allowMatch);
  if (allowAll) {
    return manifest;
  }

  const latestVersion = manifest[DIST_TAGS]?.latest;
  const removedVersions: string[] = [];

  Object.entries(manifest.versions).forEach(([version, versionData]) => {
    if (whitelistedVersions.includes(version)) {
      return;
    }

    // Always keep the version currently tagged as latest so dist-tags.latest
    // continues to resolve to a valid entry after filtering.
    if (version === latestVersion) {
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
