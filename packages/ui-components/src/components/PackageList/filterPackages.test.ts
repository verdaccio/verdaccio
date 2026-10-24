import { describe, expect, test } from 'vitest';

import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';
import {
  NO_SCOPE,
  PackageSort,
  filterPackages,
  getPackageScope,
  getScopes,
} from './filterPackages';

const pkg = (name: string, extra: Partial<ManifestWeb> = {}) => ({ name, ...extra }) as ManifestWeb;

const packages = [
  pkg('verdaccio', {
    description: 'A lightweight private npm proxy registry',
    time: '2026-01-01T00:00:00.000Z',
  }),
  pkg('@verdaccio/ui-components', {
    keywords: ['react', 'ui'],
    time: '2026-03-01T00:00:00.000Z',
  }),
  pkg('@verdaccio/core', { time: '2026-02-01T00:00:00.000Z' }),
  pkg('@types/node'),
];

const names = (list: ManifestWeb[]) => list.map((item) => item.name);

describe('filterPackages', () => {
  test('keeps the server order by default', () => {
    expect(names(filterPackages(packages, {}))).toEqual([
      'verdaccio',
      '@verdaccio/ui-components',
      '@verdaccio/core',
      '@types/node',
    ]);
  });

  test('matches name, description and keywords case-insensitively', () => {
    expect(names(filterPackages(packages, { query: '@VERDACCIO' }))).toEqual([
      '@verdaccio/ui-components',
      '@verdaccio/core',
    ]);
    expect(names(filterPackages(packages, { query: 'proxy' }))).toEqual(['verdaccio']);
    expect(names(filterPackages(packages, { query: ' REACT ' }))).toEqual([
      '@verdaccio/ui-components',
    ]);
  });

  test('filters by scope, including packages without one', () => {
    expect(names(filterPackages(packages, { scope: '@verdaccio' }))).toEqual([
      '@verdaccio/ui-components',
      '@verdaccio/core',
    ]);
    expect(names(filterPackages(packages, { scope: NO_SCOPE }))).toEqual(['verdaccio']);
  });

  test('sorts by name and by most recent publication, packages without time last', () => {
    expect(names(filterPackages(packages, { sort: PackageSort.NAME }))).toEqual([
      '@types/node',
      '@verdaccio/core',
      '@verdaccio/ui-components',
      'verdaccio',
    ]);
    expect(names(filterPackages(packages, { sort: PackageSort.RECENT }))).toEqual([
      '@verdaccio/ui-components',
      '@verdaccio/core',
      'verdaccio',
      '@types/node',
    ]);
  });

  test('does not mutate the input list', () => {
    const input = [...packages];
    filterPackages(input, { sort: PackageSort.NAME });
    expect(input).toEqual(packages);
  });
});

describe('getScopes', () => {
  test('lists scopes alphabetically with unscoped packages last', () => {
    expect(getScopes(packages)).toEqual(['@types', '@verdaccio', NO_SCOPE]);
    expect(getPackageScope('@verdaccio')).toBe(NO_SCOPE);
  });
});
