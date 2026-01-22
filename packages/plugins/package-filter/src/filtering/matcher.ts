import { satisfies } from 'semver';

import type { Manifest } from '@verdaccio/types';

import { ParsedRule } from '../config/types';
import { MatchResult, MatchType } from './types';

/**
 * Split a package name into name itself and scope
 * @param name
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

export function matchRules(
  manifest: Manifest,
  rules: Map<string, ParsedRule>
): MatchResult | undefined {
  const { scope } = splitName(manifest.name);
  if (scope) {
    const rule = rules.get(scope);
    if (rule === 'scope') {
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

  return {
    type: MatchType.VERSIONS,
    rule,
    versions: matchedVersions,
  };
}
