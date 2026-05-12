import { Range } from 'semver';
import { describe, expect, test } from 'vitest';

import type { Manifest, Version } from '@verdaccio/types';

import { matchRules } from '../src/filtering/matcher';
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

  test('matches version rules by package glob pattern', () => {
    const result = matchRules(
      createManifest('@babel/test'),
      new Map([['@babel/*', { versions: [new Range('>1.0.0')] }]])
    );

    expect(result?.type).toBe(MatchType.VERSIONS);
    expect(result?.versions).toEqual(['2.0.0']);
  });

  test('keeps exact package rules before glob package rules', () => {
    const result = matchRules(
      createManifest('@babel/test'),
      new Map([
        ['@babel/*', 'package'],
        ['@babel/test', { versions: [new Range('>1.0.0')] }],
      ])
    );

    expect(result?.type).toBe(MatchType.VERSIONS);
    expect(result?.versions).toEqual(['2.0.0']);
  });
});
