import buildDebug from 'debug';
import { satisfies } from 'semver';

import type { Manifest } from '@verdaccio/types';

import type { ParsedRule } from '../config/types';
import type { MatchResult } from './types';
import { MatchType } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

/**
 * Split a package name into name itself and scope.
 */
function splitName(name: string): { name: string; scope?: string } {
  if (!name) {
    return { name: '' };
  }

  const parts = name.split('/');

  if (parts.length > 1) {
    return {
      scope: parts[0],
      name: parts[1],
    };
  } else {
    return {
      name: parts[0],
    };
  }
}

/**
 * Try to find a rule that matches the package.
 * If found, returns the rule and the matched package versions from the manifest.
 */
export function matchRules(
  manifest: Manifest,
  rules: Map<string, ParsedRule>
): MatchResult | undefined {
  const { scope } = splitName(manifest.name);
  if (scope) {
    const rule = rules.get(scope);
    if (rule === 'scope') {
      debug('scope match: %s matched rule for %s', manifest.name, scope);
      return {
        type: MatchType.SCOPE,
        rule,
        scope,
        versions: Object.keys(manifest.versions),
      };
    }
  }

  const rule = rules.get(manifest.name);
  if (!rule) {
    // No match
    return undefined;
  }

  if (rule === 'package') {
    debug('package match: %s', manifest.name);
    return {
      type: MatchType.PACKAGE,
      rule,
      package: manifest.name,
      versions: Object.keys(manifest.versions),
    };
  }

  if (rule === 'scope') {
    throw new Error('Unexpected case - rule for package should never be "scope"');
  }

  const versionRanges = rule.versions;
  if (versionRanges.length === 0) {
    // No match
    return undefined;
  }

  const matchedVersions: string[] = [];
  Object.keys(manifest.versions).forEach((version) => {
    versionRanges.forEach((versionRange) => {
      if (
        satisfies(version, versionRange, {
          includePrerelease: true,
          loose: true,
        })
      ) {
        matchedVersions.push(version);
      }
    });
  });

  if (matchedVersions.length > 0) {
    debug(
      'version match: %s matched %d versions: %o',
      manifest.name,
      matchedVersions.length,
      matchedVersions
    );
  }

  return {
    type: MatchType.VERSIONS,
    rule,
    versions: matchedVersions,
  };
}
