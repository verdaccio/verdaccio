import { describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { DIST_TAGS } from '@verdaccio/core';
import { addNewVersion, generatePackageMetadata } from '@verdaccio/test-helper';

import { DeniedVersionFilter } from '../src/lib/denied-version-filter';

const createConfigWithDeniedVersions = (pkgName: string, deniedVersions: string[]) => {
  const baseConfig = getDefaultConfig();
  return new Config({
    ...baseConfig,
    packages: {
      [pkgName]: {
        access: '$all',
        publish: '$authenticated',
        unpublish: '$authenticated',
        proxy: 'npmjs',
        deniedVersions,
      },
      ...(baseConfig.packages || {}),
    },
  });
};

describe('DeniedVersionFilter', () => {
  test('should return manifest untouched when no denied versions configured', () => {
    const pkgName = 'pkg-no-denied';
    const filter = new DeniedVersionFilter(createConfigWithDeniedVersions(pkgName, []));
    const manifest = generatePackageMetadata(pkgName, '1.0.0');
    const filtered = filter.filterManifest(pkgName, manifest);

    expect(filtered).toBe(manifest);
  });

  test('should remove denied versions and retag latest', () => {
    const pkgName = 'pkg-denied';
    let manifest = generatePackageMetadata(pkgName, '1.0.0');
    manifest = addNewVersion(manifest, '2.0.0', false);
    manifest.time = {
      ...(manifest.time || {}),
      '1.0.0': '2020-01-01T00:00:00.000Z',
      '2.0.0': '2020-01-02T00:00:00.000Z',
    };
    const filter = new DeniedVersionFilter(createConfigWithDeniedVersions(pkgName, ['2.0.0']));
    const filtered = filter.filterManifest(pkgName, manifest);
    expect(Object.keys(filtered.versions)).toEqual(['1.0.0']);
    expect(filtered.time?.['2.0.0']).toBeUndefined();
    expect(Object.keys(filtered._attachments || {})).toHaveLength(1);
    expect(filtered[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('should detect denied versions', () => {
    const pkgName = 'pkg-denied-check';
    const filter = new DeniedVersionFilter(createConfigWithDeniedVersions(pkgName, ['3.0.0']));

    expect(filter.isVersionDenied(pkgName, '3.0.0')).toBe(true);
    expect(filter.isVersionDenied(pkgName, '1.0.0')).toBe(false);
    expect(filter.isVersionDenied(pkgName, undefined)).toBe(false);
  });
});
