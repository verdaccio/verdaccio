import buildDebug from 'debug';
import { Range, satisfies } from 'semver';

import type { Logger, Manifest } from '@verdaccio/types';

import type { ParsedConfigRule, ParsedRule } from '../config/types';
import { matchRules } from './matcher';
import { MatchType } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Filter out all blocked package versions.
 * If package or scope is blocked, then block all versions.
 *
 * TODO: consider adding a `prerelease` filter option to block/allow
 * prerelease versions independently. Currently prereleases are matched by
 * semver ranges with `includePrerelease: true`, but there's no dedicated toggle.
 *
 * Example config (not yet implemented):
 *   block:
 *     - package: 'foo'
 *       prerelease: true    # block 1.0.0-beta.1, 2.0.0-rc.1, keep 1.0.0, 2.0.0
 *     - package: 'bar'
 *       prerelease: false   # block 1.0.0, 2.0.0, keep 1.0.0-beta.1
 *
 * Today the only workaround is using awkward ranges like ">=1.0.0-0 <1.0.0".
 */
export function filterBlockedVersions(
  manifest: Manifest,
  blockRules: Map<string, ParsedRule>,
  allowRules: Map<string, ParsedRule>,
  logger: Logger
): Manifest {
  const allowMatch = matchRules(manifest, allowRules);
  if (
    allowMatch &&
    (allowMatch.type === MatchType.SCOPE || allowMatch.type === MatchType.PACKAGE)
  ) {
    // An entire scope or package is whitelisted
    logger.trace({ name: manifest.name }, 'package @{name} is allow-listed, skipping block rules');
    return manifest;
  }

  const blockMatch = matchRules(manifest, blockRules);
  if (!blockMatch) {
    // No rule is blocking this package
    return manifest;
  }

  logger.trace(
    { name: manifest.name, type: blockMatch.type },
    'block rule matched for @{name} (type: @{type})'
  );

  const whitelistedVersions: string[] = allowMatch ? allowMatch.versions : [];
  let blockRule: ParsedConfigRule = {
    versions: [new Range('*')],
    strategy: 'block',
  };

  if (blockMatch.type === MatchType.SCOPE) {
    if (whitelistedVersions.length === 0) {
      debug('blocking all versions of %s (scope %s blocked)', manifest.name, blockMatch.scope);
      logger.trace(
        { name: manifest.name, scope: blockMatch.scope },
        'all versions of @{name} blocked (scope @{scope})'
      );
      return {
        ...manifest,
        versions: {},
        readme: `All packages in scope ${blockMatch.scope} are blocked by rule`,
      };
    }
  } else if (blockMatch.type === MatchType.PACKAGE) {
    if (whitelistedVersions.length === 0) {
      debug('blocking all versions of %s (package blocked)', manifest.name);
      logger.trace({ name: manifest.name }, 'all versions of @{name} blocked (package rule)');
      return {
        ...manifest,
        versions: {},
        readme: `All package versions are blocked by rule`,
      };
    }
  } else {
    blockRule = { ...blockRule, ...blockMatch.rule };
  }

  const versionRanges = blockRule.versions;

  if (blockRule.strategy === 'block') {
    const blockedVersions = blockMatch.versions.filter((v) => !whitelistedVersions.includes(v));
    for (const version of blockedVersions) {
      delete manifest.versions[version];
    }

    if (blockedVersions.length > 0) {
      debug(
        'blocked %d versions of %s: %o',
        blockedVersions.length,
        manifest.name,
        blockedVersions
      );
      logger.trace(
        {
          name: manifest.name,
          count: blockedVersions.length,
          versions: blockedVersions.join(', '),
        },
        '@{count} versions of @{name} blocked: @{versions}'
      );
      // Add debug info for devs
      manifest.readme =
        (manifest.readme || '') +
        `\nSome versions(${blockedVersions.length}) of package are blocked by rules: ${versionRanges.map(
          (range) => range.raw
        )}`;
    }

    return manifest;
  }

  // Process block rule strategy 'replace'.
  // We assume that the order of versions is already sorted.
  const nonBlockedVersions = { ...manifest.versions };
  const newVersionsMapping: Record<string, string | null> = {};

  versionRanges.forEach((versionRange) => {
    const allVersions = Object.keys(nonBlockedVersions);

    let lastNonBlockedVersion: string | null = null;

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
      }
    });
  });

  debug('replacing versions for %s: %o', manifest.name, newVersionsMapping);

  const removedVersions = Object.entries(newVersionsMapping).filter(
    ([_, replace]) => replace === null
  ) as [string, null][];
  const replacedVersions = Object.entries(newVersionsMapping).filter(
    ([_, replace]) => replace !== null
  ) as [string, string][];

  removedVersions.forEach(([version]) => {
    debug('no version to replace %s in %s', version, manifest.name);
    logger.trace(
      { name: manifest.name, version },
      'version @{version} of @{name} removed (no replacement available)'
    );
    delete manifest.versions[version];
  });

  replacedVersions.forEach(([version, replaceVersion]) => {
    logger.trace(
      { name: manifest.name, version, replaceVersion },
      'version @{version} of @{name} replaced with @{replaceVersion}'
    );
    manifest.versions[version] = {
      ...manifest.versions[replaceVersion],
      version,
    };
  });

  if (removedVersions.length > 0) {
    manifest.readme +=
      `\nSome versions of package could not be replaced and thus are fully blocked (${removedVersions.length}):` +
      ` ${removedVersions.map((a) => a[0])}`;
  }

  if (replacedVersions.length > 0) {
    manifest.readme +=
      `\nSome versions of package are replaced by other(${replacedVersions.length}):` +
      ` ${replacedVersions.map((a) => `${a[0]} => ${a[1]}`)}`;
  }

  return manifest;
}
