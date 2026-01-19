import { Range, satisfies } from 'semver';

import { Logger, Package } from '@verdaccio/types';

import { ParsedConfigRule, ParsedRule } from '../config/types';
import { matchRules } from './matcher';
import { MatchType } from './types';

/**
 * Filter out all blocked package versions.
 * If all package is blocked, or it's scope is blocked - block all versions.
 */
export function filterBlockedVersions(
  packageInfo: Package,
  blockRules: Map<string, ParsedRule>,
  allowRules: Map<string, ParsedRule>,
  logger: Logger
): Package {
  const allowMatch = matchRules(packageInfo, allowRules);
  if (
    allowMatch &&
    (allowMatch.type === MatchType.SCOPE || allowMatch.type === MatchType.PACKAGE)
  ) {
    // An entire scope or package is whitelisted
    return packageInfo;
  }

  const blockMatch = matchRules(packageInfo, blockRules);
  if (!blockMatch) {
    // No rule is blocking this package
    return packageInfo;
  }

  const whitelistedVersions: string[] = allowMatch ? allowMatch.versions : [];
  let blockRule: ParsedConfigRule = {
    versions: [new Range('*')],
    strategy: 'block',
  };

  if (blockMatch.type === MatchType.SCOPE) {
    if (whitelistedVersions.length === 0) {
      return {
        ...packageInfo,
        versions: {},
        readme: `All packages in scope ${blockMatch.scope} are blocked by rule`,
      };
    }
  } else if (blockMatch.type === MatchType.PACKAGE) {
    if (whitelistedVersions.length === 0) {
      return {
        ...packageInfo,
        versions: {},
        readme: `All package versions are blocked by rule`,
      };
    }
  } else {
    blockRule = { ...blockRule, ...blockMatch.rule };
  }

  const versionRanges = blockRule.versions;
  if (versionRanges.length === 0) {
    // No version range specified. Nothing is blocked then.
    return packageInfo;
  }

  if (blockRule.strategy === 'block') {
    const blockedVersions = blockMatch.versions.filter((v) => !whitelistedVersions.includes(v));
    for (const version of blockedVersions) {
      delete packageInfo.versions[version];
    }

    if (blockedVersions.length > 0) {
      // Add debug info for devs
      packageInfo.readme =
        (packageInfo.readme || '') +
        `\nSome versions(${blockedVersions.length}) of package are blocked by rules: ${versionRanges.map(
          (range) => range.raw
        )}`;
    }

    return packageInfo;
  }

  // Process block rule strategy 'replace'.
  // We assume that the order of versions is already sorted.
  const nonBlockedVersions = { ...packageInfo.versions };
  const newVersionsMapping: Record<string, string | null> = {};

  versionRanges.forEach((versionRange) => {
    const allVersions = Object.keys(nonBlockedVersions);

    let lastNonBlockedVersion: string | null = null;
    let firstNonBlockedVersion: string | null = null;

    allVersions.forEach((version) => {
      if (
        !whitelistedVersions.includes(version) &&
        satisfies(version, versionRange, {
          includePrerelease: true,
          loose: true,
        })
      ) {
        delete nonBlockedVersions[version];
        newVersionsMapping[version] = lastNonBlockedVersion;
      } else {
        lastNonBlockedVersion = version;
        firstNonBlockedVersion = firstNonBlockedVersion ?? version;
      }
    });
  });

  logger.debug(`Filtering package ${packageInfo.name}, replacing versions`);
  logger.debug(`${JSON.stringify(newVersionsMapping)}`);

  const removedVersions = Object.entries(newVersionsMapping).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, replace]) => replace === null
  ) as [string, null][];
  const replacedVersions = Object.entries(newVersionsMapping).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, replace]) => replace !== null
  ) as [string, string][];

  removedVersions.forEach(([version]) => {
    logger.debug(`No version to replace ${version}`);
    delete packageInfo.versions[version];
  });

  replacedVersions.forEach(([version, replaceVersion]) => {
    packageInfo.versions[version] = {
      ...packageInfo.versions[replaceVersion],
      version,
    };
  });

  if (removedVersions.length > 0) {
    packageInfo.readme +=
      `\nSome versions of package could not be replaced and thus are fully blocked (${removedVersions.length}):` +
      ` ${removedVersions.map((a) => a[0])}`;
  }

  if (replacedVersions.length > 0) {
    packageInfo.readme +=
      `\nSome versions of package are replaced by other(${replacedVersions.length}):` +
      ` ${replacedVersions.map((a) => `${a[0]} => ${a[1]}`)}`;
  }

  return packageInfo;
}
