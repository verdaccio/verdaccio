import buildDebug from 'debug';
import { Minimatch } from 'minimatch';
import { satisfies } from 'semver';

import type { Manifest } from '@verdaccio/types';

import type { ParsedRule } from '../config/types';
import type { MatchResult } from './types';
import { MatchType } from './types';

const debug = buildDebug('verdaccio:plugin:package-filter:filter');

interface CompiledGlobRule {
  pattern: string;
  matcher: Minimatch;
  rule: ParsedRule;
}

interface CompiledGlobRules {
  packages: CompiledGlobRule[];
  scopes: CompiledGlobRule[];
}

const compiledGlobRules = new WeakMap<Map<string, ParsedRule>, CompiledGlobRules>();
const globMagic = /[\\*?[\]{}!]|[+@]\(/;

/**
 * Compile patterns requiring glob or escape handling, grouped by rule type.
 */
function compileGlobRules(rules: Map<string, ParsedRule>): CompiledGlobRules {
  const compiled: CompiledGlobRules = { packages: [], scopes: [] };

  for (const [pattern, rule] of rules) {
    if (!globMagic.test(pattern)) {
      continue;
    }

    const matcher = new Minimatch(pattern);
    const compiledRule = { pattern, matcher, rule };
    if (rule === 'scope') {
      compiled.scopes.push(compiledRule);
    } else {
      compiled.packages.push(compiledRule);
    }
  }

  return compiled;
}

/**
 * Cache the compiled glob rules for a rule map. Call again after changing the map.
 */
export function prepareRules(rules: Map<string, ParsedRule>): void {
  compiledGlobRules.set(rules, compileGlobRules(rules));
}

/**
 * Return cached glob rules, compiling and caching unprepared maps on first use.
 */
function getCompiledGlobRules(rules: Map<string, ParsedRule>): CompiledGlobRules {
  let compiled = compiledGlobRules.get(rules);
  if (!compiled) {
    compiled = compileGlobRules(rules);
    compiledGlobRules.set(rules, compiled);
  }

  return compiled;
}

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

  for (const { pattern, matcher } of getCompiledGlobRules(rules).scopes) {
    if (matcher.match(scope)) {
      return { scope: pattern, rule: 'scope' };
    }
  }

  return undefined;
}

function findPackageRule(
  packageName: string,
  rules: Map<string, ParsedRule>
): { pattern: string; rule: ParsedRule } | undefined {
  const exactRule = rules.get(packageName);
  if (exactRule) {
    return { pattern: packageName, rule: exactRule };
  }

  for (const { pattern, matcher, rule } of getCompiledGlobRules(rules).packages) {
    if (matcher.match(packageName)) {
      return { pattern, rule };
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
 * Rule maps are cached; call prepareRules after modifying them.
 */
export function matchRules(
  manifest: Manifest,
  rules: Map<string, ParsedRule>
): MatchResult | undefined {
  const packageName = manifest.name;
  if (!packageName) {
    return undefined;
  }

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
    debug('package match: %s matched rule for %s', packageName, packageMatch.pattern);
    return {
      type: MatchType.PACKAGE,
      rule,
      package: packageMatch.pattern,
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
