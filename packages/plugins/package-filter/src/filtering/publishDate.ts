import { Package } from '@verdaccio/types';

import { ParsedRule } from '../config/types';
import { matchRules } from './matcher';
import { MatchType } from './types';

/**
 * filter out all package versions that were published after dateThreshold
 * @param packageInfo
 * @param dateThreshold
 */
export function filterVersionsByPublishDate(
  packageInfo: Package,
  dateThreshold: Date,
  allowRules: Map<string, ParsedRule>
): Package {
  const allowMatch = matchRules(packageInfo, allowRules);
  if (
    allowMatch &&
    (allowMatch.type === MatchType.SCOPE || allowMatch.type === MatchType.PACKAGE)
  ) {
    // An entire scope or package is whitelisted
    return packageInfo;
  }

  const { versions, time, name } = packageInfo;

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
    delete packageInfo.versions[version];
  });

  return packageInfo;
}
