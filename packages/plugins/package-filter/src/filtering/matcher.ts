import { satisfies } from 'semver';

import { Package } from '@verdaccio/types';

import { ParsedRule } from '../config/types';
import { MatchResult, MatchType } from './types';

/**
 * Split a package name into name itself and scope
 * @param name
 */
function splitName(name: string): { name: string; scope?: string } {
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
  packageInfo: Package,
  rules: Map<string, ParsedRule>
): MatchResult | undefined {
  const { scope } = splitName(packageInfo.name);
  if (scope) {
    const rule = rules.get(scope);
    if (rule === 'scope') {
      return {
        type: MatchType.SCOPE,
        rule,
        scope,
        versions: Object.keys(packageInfo.versions),
      };
    }
  }

  const rule = rules.get(packageInfo.name);
  if (!rule) {
    // No match
    return undefined;
  }

  if (rule === 'package') {
    return {
      type: MatchType.PACKAGE,
      rule,
      package: packageInfo.name,
      versions: Object.keys(packageInfo.versions),
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
  Object.keys(packageInfo.versions).forEach((version) => {
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
