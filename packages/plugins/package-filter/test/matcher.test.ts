import { Minimatch } from 'minimatch';
import { Range } from 'semver';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { Manifest, Version } from '@verdaccio/types';

import { parseConfig } from '../src/config/parser';
import type { ParsedRule } from '../src/config/types';
import { matchRules, prepareRules } from '../src/filtering/matcher';
import { MatchType } from '../src/filtering/types';

function createVersion(name: string, version: string): Version {
  return {
    _id: `${name}@${version}`,
    _npmUser: { name: 'test-user' },
    author: { name: 'test-user' },
    description: '',
    dist: { shasum: '', tarball: '' },
    main: '',
    name,
    readme: '',
    version,
  };
}

function createManifest(name: string): Manifest {
  return {
    _attachments: {},
    _distfiles: {},
    _rev: '',
    _uplinks: {},
    'dist-tags': {},
    name,
    time: {},
    versions: {
      '1.0.0': createVersion(name, '1.0.0'),
      '2.0.0': createVersion(name, '2.0.0'),
    },
  };
}

describe('matchRules', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('matches scope glob patterns', () => {
    const result = matchRules(createManifest('@babel/test'), new Map([['@ba*', 'scope']]));

    expect(result?.type).toBe(MatchType.SCOPE);
    expect(result).toMatchObject({ scope: '@ba*', versions: ['1.0.0', '2.0.0'] });
  });

  test('matches package glob patterns', () => {
    const result = matchRules(createManifest('@babel/test'), new Map([['@babel/*', 'package']]));

    expect(result?.type).toBe(MatchType.PACKAGE);
    expect(result).toMatchObject({ package: '@babel/*', versions: ['1.0.0', '2.0.0'] });
  });

  test.each([
    [String.raw`react\-dom`, 'react-dom'],
    [String.raw`@babel/\core`, '@babel/core'],
  ])('matches escaped package pattern %s', (pattern, name) => {
    const { blockRules } = parseConfig({ block: [{ package: pattern }] });

    const result = matchRules(createManifest(name), blockRules);

    expect(result).toMatchObject({
      type: MatchType.PACKAGE,
      package: pattern,
      versions: ['1.0.0', '2.0.0'],
    });
  });

  test('matches escaped scope patterns', () => {
    const pattern = String.raw`@ba\bel`;
    const { allowRules } = parseConfig({ allow: [{ scope: pattern }] });

    const result = matchRules(createManifest('@babel/test'), allowRules);

    expect(result).toMatchObject({
      type: MatchType.SCOPE,
      scope: pattern,
      versions: ['1.0.0', '2.0.0'],
    });
  });

  test('matches version rules with escaped package patterns', () => {
    const { blockRules } = parseConfig({
      block: [{ package: String.raw`react\-dom`, versions: '>1.0.0' }],
    });

    const result = matchRules(createManifest('react-dom'), blockRules);

    expect(result).toMatchObject({ type: MatchType.VERSIONS, versions: ['2.0.0'] });
  });

  test('matches version rules by package glob pattern', () => {
    const result = matchRules(
      createManifest('@babel/test'),
      new Map([['@babel/*', { versions: [new Range('>1.0.0')] }]])
    );

    expect(result?.type).toBe(MatchType.VERSIONS);
    expect(result?.versions).toEqual(['2.0.0']);
  });

  test('keeps exact package rules before glob package rules', () => {
    const rules = new Map<string, ParsedRule>([
      ['@babel/*', 'package'],
      ['@babel/test', { versions: [new Range('>1.0.0')] }],
    ]);

    const result = matchRules(createManifest('@babel/test'), rules);

    expect(result?.type).toBe(MatchType.VERSIONS);
    expect(result?.versions).toEqual(['2.0.0']);
  });

  test('does not run glob matchers for exact-only parsed rules', () => {
    const match = vi.spyOn(Minimatch.prototype, 'match');
    const rules = parseConfig({
      block: [{ scope: '@babel' }, { package: '@types/node' }],
    }).blockRules;
    const make = vi.spyOn(Minimatch.prototype, 'make');
    const iterate = vi.spyOn(rules, Symbol.iterator);

    const result = matchRules(createManifest('@verdaccio/test'), rules);

    expect(result).toBeUndefined();
    expect(match).not.toHaveBeenCalled();
    expect(make).not.toHaveBeenCalled();
    expect(iterate).not.toHaveBeenCalled();
  });

  test('compiles direct rule maps once across scope and package lookups', () => {
    const rules = new Map<string, ParsedRule>([
      ['@other-*', 'scope'],
      ['@babel/*', 'package'],
    ]);
    const make = vi.spyOn(Minimatch.prototype, 'make');
    const iterate = vi.spyOn(rules, Symbol.iterator);

    for (let i = 0; i < 2; i++) {
      expect(matchRules(createManifest('@babel/test'), rules)).toMatchObject({
        package: '@babel/*',
      });
      expect(matchRules(createManifest('@other-org/test'), rules)).toMatchObject({
        scope: '@other-*',
      });
      expect(matchRules(createManifest('@verdaccio/test'), rules)).toBeUndefined();
    }

    expect(make).toHaveBeenCalledTimes(2);
    expect(iterate).toHaveBeenCalledTimes(1);
  });

  test('preparing rules again refreshes compiled patterns after a map changes', () => {
    const rules = new Map<string, ParsedRule>([['@babel/*', 'package']]);
    expect(matchRules(createManifest('@babel/test'), rules)).toMatchObject({
      package: '@babel/*',
    });

    rules.clear();
    rules.set('@types/*', 'package');
    prepareRules(rules);

    expect(matchRules(createManifest('@babel/test'), rules)).toBeUndefined();
    expect(matchRules(createManifest('@types/node'), rules)).toMatchObject({
      package: '@types/*',
    });
  });

  test('keeps glob rule order when multiple patterns match', () => {
    const rules = parseConfig({
      block: [{ package: '@babel/*' }, { package: '@*/test' }],
    }).blockRules;

    const result = matchRules(createManifest('@babel/test'), rules);

    expect(result).toMatchObject({ package: '@babel/*' });
  });
});
