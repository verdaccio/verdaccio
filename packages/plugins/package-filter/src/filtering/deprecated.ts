import buildDebug from 'debug';

import type { Manifest } from '@verdaccio/types';

import type { ParsedRule } from '../config/types';
import { matchRules } from './matcher';
import { MatchType } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Filter out all package versions that have a deprecation notice.
 */
export function filterDeprecatedVersions(
  manifest: Manifest,
  allowRules: Map<string, ParsedRule>
): Manifest {
  const allowMatch = matchRules(manifest, allowRules);
  if (
    allowMatch &&
    (allowMatch.type === MatchType.SCOPE || allowMatch.type === MatchType.PACKAGE)
  ) {
    return manifest;
  }

  const whitelistedVersions: string[] = allowMatch ? allowMatch.versions : [];
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
