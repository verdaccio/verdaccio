import buildDebug from 'debug';

import type { Manifest } from '@verdaccio/types';

import { resolveAllowList } from './matcher';
import type { MatchResult } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Filter out all package versions that were published after dateThreshold.
 */
export function filterVersionsByPublishDate(
  manifest: Manifest,
  dateThreshold: Date,
  allowMatch: MatchResult | undefined
): Manifest {
  const { allowAll, whitelistedVersions } = resolveAllowList(allowMatch);
  if (allowAll) {
    // An entire scope or package is whitelisted
    return manifest;
  }

  const { versions, time, name } = manifest;

  if (!time) {
    throw new TypeError(`Time of publication was not provided for package ${name}`);
  }

  const clearVersions: string[] = [];

  Object.keys(versions).forEach((version) => {
    if (whitelistedVersions.includes(version)) {
      return;
    }

    const publishTime = time[version];

    if (!publishTime) {
      throw new TypeError(
        `Time of publication was not provided for package ${name}, version ${version}`
      );
    }

    if (new Date(publishTime) > dateThreshold) {
      // clear untrusted version
      clearVersions.push(version);
    }
  });

  // delete version from versions
  clearVersions.forEach((version) => {
    delete manifest.versions[version];
  });

  if (clearVersions.length > 0) {
    debug(
      'date filter removed %d versions from %s: %o',
      clearVersions.length,
      manifest.name,
      clearVersions
    );
  }

  return manifest;
}
