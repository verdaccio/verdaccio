import buildDebug from 'debug';
import { minimatch } from 'minimatch';
import { satisfies } from 'semver';

import type { Manifest } from '@verdaccio/types';

import type { ParsedRule } from '../config/types';
import type { MatchResult } from './types';
import { MatchType } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

function findScopeRule(
  scope: string | undefined,
  rules: Map<string, ParsedRule>
): { scope: string; rule: 'scope' } | undefined {
  if (!scope) {
    return undefined;
  }

  const exactRule = rules.get(scope);
  if (exactRule === 'scope') {
    return { scope, rule: exactRule };
  }

  for (const [ruleScope, rule] of rules) {
    if (rule === 'scope' && minimatch(scope, ruleScope)) {
      return { scope: ruleScope, rule };
    }
  }

  return undefined;
}

function findPackageRule(
  packageName: string,
  rules: Map<string, ParsedRule>
): { packageName: string; rule: ParsedRule } | undefined {
  const exactRule = rules.get(packageName);
  if (exactRule) {
    return { packageName, rule: exactRule };
  }

  for (const [rulePackage, rule] of rules) {
    if (rule !== 'scope' && minimatch(packageName, rulePackage)) {
      return { packageName: rulePackage, rule };
    }
  }

  return undefined;
}

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
  const packageName = manifest.name || '';
  const { scope } = splitName(packageName);
  const scopeMatch = findScopeRule(scope, rules);
  if (scopeMatch) {
    debug('scope match: %s matched rule for %s', packageName, scopeMatch.scope);
    return {
      type: MatchType.SCOPE,
      rule: scopeMatch.rule,
      scope: scopeMatch.scope,
      versions: Object.keys(manifest.versions),
    };
  }

  const packageMatch = findPackageRule(packageName, rules);
  if (!packageMatch) {
    // No match
    return undefined;
  }
  const { rule } = packageMatch;

  if (rule === 'package') {
    debug('package match: %s matched rule for %s', packageName, packageMatch.packageName);
    return {
      type: MatchType.PACKAGE,
      rule,
      package: packageMatch.packageName,
      versions: Object.keys(manifest.versions),
    };
  }

  if (rule === 'scope') {
    throw new Error('Unexpected case - rule for package should never be "scope"');
  }

  if (!rule) {
    return undefined;
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
