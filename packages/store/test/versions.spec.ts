import assert from 'node:assert';
import { describe, expect, test } from 'vitest';

import {
  getVersion,
  isNewerVersion,
  removeLowerVersions,
  sortVersionsAndFilterInvalid,
  tagVersion,
} from '../src/index';

describe('versions-utils', () => {
  const dist = (version) => ({
    tarball: `http://fake.verdaccio.org/npm_test/-/npm_test-${version}.tgz`,
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
      const pkg = {
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
  });

  describe('isNewerVersion', () => {
    test.each([
      ['2.0.0', '1.0.0', true],
      ['1.0.0', '2.0.0', false],
      ['1.2.3', '1.2.3-beta.1', true],
      ['1.2.3-beta.1', '1.2.3', false],
      ['1.2.3-beta.2', '1.2.3-beta.1', true],
      ['1.2.3', '1.2.3', false],
      ['v1.2.3', '1.2.3', false],
      ['01.2.3', '1.2.3', false],
      ['1.2.3beta', '1.2.3-beta', false],
      ['1.2.3+build.2', '1.2.3', false],
    ])('isNewerVersion(%s, %s) is %s', (newVersion, oldVersion, expected) => {
      expect(isNewerVersion(newVersion, oldVersion)).toBe(expected);
    });
  });

  describe('removeLowerVersions', () => {
    test.each(['v1.0.0', '01.0.0', '1.0.0+build.2'])(
      'keeps the first entry when a later one has the equivalent version %s',
      (later) => {
        const input = [
          { package: { name: 'a', version: '1.0.0', description: 'first' } },
          { package: { name: 'a', version: later, description: 'later' } },
        ] as Parameters<typeof removeLowerVersions>[0];
        expect(removeLowerVersions(input)).toEqual([input[0]]);
      }
    );

    test.each([false, true])('filters invalid versions in either order (reverse=%s)', (reverse) => {
      const input = [
        { package: { name: 'a', version: 'latest' } },
        { package: { name: 'a', version: '1.0.0' } },
        { package: { name: 'invalid-only', version: '^1.0.0' } },
      ] as Parameters<typeof removeLowerVersions>[0];
      expect(removeLowerVersions(reverse ? input.reverse() : input)).toEqual([
        { package: { name: 'a', version: '1.0.0' } },
      ]);
    });

    test.each([false, true])(
      'compares legacy formats and keeps original spelling (reverse=%s)',
      (reverse) => {
        const input = ['1.0.0', '01.2.3', '1.2.3beta'].map((version) => ({
          package: { name: 'a', version },
        })) as Parameters<typeof removeLowerVersions>[0];
        expect(removeLowerVersions(reverse ? input.reverse() : input)).toEqual([
          { package: { name: 'a', version: '01.2.3' } },
        ]);
      }
    );

    test('should remove lower semantic versions', () => {
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

    test('should remove lower semantic versions 2', () => {
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
