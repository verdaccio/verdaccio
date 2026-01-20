import { Manifest } from '@verdaccio/types';

import { ParsedRule } from '../config/types';
import { matchRules } from './matcher';
import { MatchType } from './types';

/**
 * filter out all package versions that were published after dateThreshold
 * @param manifest
 * @param dateThreshold
 */
export function filterVersionsByPublishDate(
  manifest: Manifest,
  dateThreshold: Date,
  allowRules: Map<string, ParsedRule>
): Manifest {
  const allowMatch = matchRules(manifest, allowRules);
  if (
    allowMatch &&
    (allowMatch.type === MatchType.SCOPE || allowMatch.type === MatchType.PACKAGE)
  ) {
    // An entire scope or package is whitelisted
    return manifest;
  }

  const { versions, time, name } = manifest;

  if (!time) {
    throw new TypeError(`Time of publication was not provided for package ${name}`);
  }

  const whitelistedVersions: string[] = allowMatch ? allowMatch.versions : [];
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

  return manifest;
}
