import { describe, expect, test } from 'vitest';

import { DIST_TAGS, pkgUtils } from '../src';

describe('pkg-utils', () => {
  test('getLatest fails if no versions', () => {
    expect(() =>
      // @ts-expect-error
      pkgUtils.getLatest({
        versions: {},
      })
    ).toThrow('cannot get lastest version of none');
  });

  test('getLatest get latest', () => {
    expect(
      pkgUtils.getLatest({
        versions: {
          // @ts-expect-error
          '1.0.0': {},
        },
        [DIST_TAGS]: {
          latest: '1.0.0',
        },
      })
    ).toBe('1.0.0');
  });

  test('semverSanitize', () => {
    expect(pkgUtils.semverSanitize('1.0.0')).toBe('1.0.0');
    expect(pkgUtils.semverSanitize('1.0.0-beta.1')).toBe('1.0.0-beta.1');
    expect(pkgUtils.semverSanitize('1.2')).toBe('1.2.0');
    expect(pkgUtils.semverSanitize('v2')).toBe('2.0.0');
    expect(pkgUtils.semverSanitize('v2-alpha.1')).toBe('2.0.0-alpha.1');
  });
});

describe('getPackageJson', () => {
  test('@verdaccio/core', () => {
    const packageJson = pkgUtils.getPackageJson(__dirname, '..');
    expect(packageJson).toBeDefined();
    expect(packageJson.name).toBe('@verdaccio/core');
  });

  test('@verdaccio/test', () => {
    const packageJson = pkgUtils.getPackageJson(__dirname, '__partials__');
    expect(packageJson).toBeDefined();
    expect(packageJson.name).toBe('@verdaccio/test');
    expect(packageJson.version).toBe('8.0.0');
  });
});
