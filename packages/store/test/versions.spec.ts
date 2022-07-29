import assert from 'assert';

import { getVersion, sortVersionsAndFilterInvalid, tagVersion } from '../src/index';

describe('versions-utils', () => {
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

  describe('sortVersionsAndFilterInvalid', () => {
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

  describe('tagVersion', () => {
    test('add new one', () => {
      let pkg = {
        versions: {},
        'dist-tags': {},
      };

      // @ts-ignore
      assert(tagVersion(pkg, '1.1.1', 'foo', {}));
      assert.deepEqual(pkg, {
        versions: {},
        'dist-tags': { foo: '1.1.1' },
      });
    });

    test('add (compat)', () => {
      const x = {
        versions: {},
        'dist-tags': { foo: '1.1.0' },
      };

      // @ts-ignore
      assert(tagVersion(x, '1.1.1', 'foo'));
      assert.deepEqual(x, {
        versions: {},
        'dist-tags': { foo: '1.1.1' },
      });
    });

    test('add fresh tag', () => {
      let x = {
        versions: {},
        'dist-tags': { foo: '1.1.0' },
      };

      // @ts-ignore
      assert(tagVersion(x, '1.1.1', 'foo'));
      assert.deepEqual(x, {
        versions: {},
        'dist-tags': { foo: '1.1.1' },
      });
    });
  });
});
