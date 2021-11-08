import { DIST_TAGS } from '@verdaccio/core';
import { Package } from '@verdaccio/types';

import { getVersion, normalizeDistTags, sortVersionsAndFilterInvalid } from '../src/index';

describe('Utilities', () => {
  const dist = (version) => ({
    tarball: `http://registry.org/npm_test/-/npm_test-${version}.tgz`,
    shasum: `sha1-${version}`,
  });

  describe('getVersion', () => {
    const metadata = {
      '1.0.0': { dist: dist('1.0.0') },
      '1.0.1': { dist: dist('1.0.1') },
      '0.2.1-1': { dist: dist('0.2.1-1') },
      '0.2.1-alpha': { dist: dist('0.2.1-alpha') },
      '0.2.1-alpha.0': { dist: dist('0.2.1-alpha.0') },
    };

    test('should get the right version', () => {
      expect(getVersion({ ...metadata } as any, '1.0.0')).toEqual({ dist: dist('1.0.0') });
      expect(getVersion({ ...metadata } as any, 'v1.0.0')).toEqual({ dist: dist('1.0.0') });
      expect(getVersion({ ...metadata } as any, 'v0.2.1-1')).toEqual({ dist: dist('0.2.1-1') });
      expect(getVersion({ ...metadata } as any, '0.2.1-alpha')).toEqual({
        dist: dist('0.2.1-alpha'),
      });
      expect(getVersion({ ...metadata } as any, '0.2.1-alpha.0')).toEqual({
        dist: dist('0.2.1-alpha.0'),
      });
    });

    test('should return nothing on get non existing version', () => {
      expect(getVersion({ ...metadata } as any, '0')).toBeUndefined();
      expect(getVersion({ ...metadata } as any, '2.0.0')).toBeUndefined();
      expect(getVersion({ ...metadata } as any, 'v2.0.0')).toBeUndefined();
    });

    test('should return nothing on get invalid versions', () => {
      expect(getVersion({ ...metadata } as any, undefined)).toBeUndefined();
      expect(getVersion({ ...metadata } as any, null)).toBeUndefined();
      expect(getVersion({ ...metadata } as any, 8)).toBeUndefined();
    });

    test('should handle no versions', () => {
      expect(getVersion(undefined, undefined)).toBeUndefined();
    });
  });

  describe('semverSort', () => {
    test('should sort versions', () => {
      expect(sortVersionsAndFilterInvalid(['1.0.0', '5.0.0', '2.0.0'])).toEqual([
        '1.0.0',
        '2.0.0',
        '5.0.0',
      ]);
    });
    test('should sort versions and filter out invalid', () => {
      expect(sortVersionsAndFilterInvalid(['1.0.0', '5.0.0', '2.0.0', '', null])).toEqual([
        '1.0.0',
        '2.0.0',
        '5.0.0',
      ]);
    });
  });

  describe('normalizeDistTags', () => {
    const metadata = {
      name: 'npm_test',
      versions: {
        '1.0.0': { dist: dist('1.0.0') },
        '1.0.1': { dist: dist('1.0.1') },
        '0.2.1-1': { dist: dist('0.2.1-1') },
        '0.2.1-alpha': { dist: dist('0.2.1-alpha') },
        '0.2.1-alpha.0': { dist: dist('0.2.1-alpha.0') },
      },
    };
    const cloneMetadata: Package | any = (pkg = metadata) => Object.assign({}, pkg);

    test('should delete a invalid latest version', () => {
      const pkg = cloneMetadata();
      pkg[DIST_TAGS] = {
        latest: '20000',
      };

      expect(Object.keys(normalizeDistTags(pkg)[DIST_TAGS])).toHaveLength(0);
    });

    test('should define last published version as latest', () => {
      const pkg = cloneMetadata();
      pkg[DIST_TAGS] = {};

      expect(normalizeDistTags(pkg)[DIST_TAGS]).toEqual({ latest: '1.0.1' });
    });

    test('should define last published version as latest with a custom dist-tag', () => {
      const pkg = cloneMetadata();
      pkg[DIST_TAGS] = {
        beta: '1.0.1',
      };

      expect(normalizeDistTags(pkg)[DIST_TAGS]).toEqual({ beta: '1.0.1', latest: '1.0.1' });
    });

    test('should convert any array of dist-tags to a plain string', () => {
      const pkg = cloneMetadata();
      pkg[DIST_TAGS] = {
        latest: ['1.0.1'],
      };

      expect(normalizeDistTags(pkg)[DIST_TAGS]).toEqual({ latest: '1.0.1' });
    });
  });
});
