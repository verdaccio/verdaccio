import { describe, expect, test } from 'vitest';

import { isVersionValid, sortByName } from '../src/web-utils';

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
});
