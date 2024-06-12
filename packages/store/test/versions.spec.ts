import assert from 'assert';

import {
  getVersion,
  removeLowerVersions,
  sortVersionsAndFilterInvalid,
  tagVersion,
} from '../src/index';

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
      // @ts-ignore
      expect(getVersion({ ...metadata } as any, undefined)).toBeUndefined();
      // @ts-ignore
      expect(getVersion({ ...metadata } as any, null)).toBeUndefined();
      // @ts-ignore
      expect(getVersion({ ...metadata } as any, 8)).toBeUndefined();
    });

    test('should handle no versions', () => {
      // @ts-ignore
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
      // @ts-ignore
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

  describe('removeLowerVersions', () => {
    it('should remove lower semantic versions', () => {
      const inputArray = [
        { package: { name: 'object1', version: '1.0.0' } },
        { package: { name: 'object1', version: '2.0.0' } }, // Duplicate name 'object1'
        { package: { name: 'object2', version: '2.0.0' } }, // Duplicate name 'object2'
        { package: { name: 'object2', version: '2.0.0' } },
        { package: { name: 'object3', version: '3.0.0' } },
        { package: { name: 'object4', version: '1.0.0' } },
      ];

      const expectedOutput = [
        { package: { name: 'object1', version: '2.0.0' } },
        { package: { name: 'object2', version: '2.0.0' } },
        { package: { name: 'object3', version: '3.0.0' } },
        { package: { name: 'object4', version: '1.0.0' } },
      ];

      // @ts-expect-error
      const result = removeLowerVersions(inputArray);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove lower semantic versions 2', () => {
      const inputArray = [
        { package: { name: 'object1', version: '1.0.0' } },
        { package: { name: 'object1', version: '2.0.0' } }, // Duplicate name 'object1'
        { package: { name: 'object2', version: '2.0.3' } }, // Duplicate name 'object2'
        { package: { name: 'object2', version: '2.0.0' } },
        { package: { name: 'object3', version: '3.0.0' } },
        { package: { name: 'object4', version: '1.0.0' } },
      ];

      const expectedOutput = [
        { package: { name: 'object1', version: '2.0.0' } },
        { package: { name: 'object2', version: '2.0.3' } },
        { package: { name: 'object3', version: '3.0.0' } },
        { package: { name: 'object4', version: '1.0.0' } },
      ];

      // @ts-expect-error
      const result = removeLowerVersions(inputArray);

      expect(result).toEqual(expectedOutput);
    });
  });
});
