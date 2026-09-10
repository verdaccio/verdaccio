import { describe, expect, test } from 'vitest';

import { isVersionValid, resolveVersion, sortByName } from '../src/web-utils';

describe('Utilities', () => {
  describe('Sort packages', () => {
    const packages = [
      {
        name: 'ghc',
      },
      {
        name: 'abc',
      },
      {
        name: 'zxy',
      },
    ];
    test('should order ascending', () => {
      expect(sortByName(packages)).toEqual([
        {
          name: 'abc',
        },
        {
          name: 'ghc',
        },
        {
          name: 'zxy',
        },
      ]);
    });

    test('should order descending', () => {
      expect(sortByName(packages, false)).toEqual([
        {
          name: 'zxy',
        },
        {
          name: 'ghc',
        },
        {
          name: 'abc',
        },
      ]);
    });
  });

  describe('isVersionValid', () => {
    const manifest = {
      versions: {
        '1.0.0': {},
        '2.0.0': {},
      },
    };

    test('should return true for a valid version', () => {
      // @ts-ignore: partial manifest for test
      expect(isVersionValid(manifest, '1.0.0')).toBe(true);
    });

    test('should return false for an invalid version', () => {
      // @ts-ignore: partial manifest for test
      expect(isVersionValid(manifest, '3.0.0')).toBe(false);
    });

    test('should return false if version is undefined', () => {
      // @ts-ignore: partial manifest for test
      expect(isVersionValid(manifest, undefined)).toBe(false);
    });
  });

  describe('resolveVersion', () => {
    const manifest = {
      versions: {
        '1.0.0': {},
        '2.0.0': {},
      },
      'dist-tags': {
        latest: '2.0.0',
        beta: '1.0.0',
        broken: '9.9.9',
      },
    } as any;

    test('should return a concrete version as is', () => {
      expect(resolveVersion(manifest, '1.0.0')).toBe('1.0.0');
    });

    test('should resolve a dist-tag to its version', () => {
      expect(resolveVersion(manifest, 'beta')).toBe('1.0.0');
      expect(resolveVersion(manifest, 'latest')).toBe('2.0.0');
    });

    test('should return undefined for an unknown version or tag', () => {
      expect(resolveVersion(manifest, '3.0.0')).toBeUndefined();
      expect(resolveVersion(manifest, 'next')).toBeUndefined();
    });

    test('should return undefined for a dist-tag pointing to a missing version', () => {
      expect(resolveVersion(manifest, 'broken')).toBeUndefined();
    });

    test('should never resolve inherited properties', () => {
      expect(resolveVersion(manifest, '__proto__')).toBeUndefined();
      expect(resolveVersion(manifest, 'constructor')).toBeUndefined();
    });
  });
});
