import { DIST_TAGS } from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from '../../api/node_modules/@verdaccio/test-helper/build';
import {
  STORAGE,
  hasInvalidPublishBody,
  isDeprecatedManifest,
  isDifferentThanOne,
  mergeUplinkTimeIntoLocal,
  normalizeDistTags,
  normalizePackage,
} from '../src/lib/storage-utils';
import { readFile } from './fixtures/test.utils';

describe('Storage Utils', () => {
  describe('normalizeDistTags', () => {
    const dist = (version) => ({
      tarball: `http://registry.org/npm_test/-/npm_test-${version}.tgz`,
      shasum: `sha1-${version}`,
    });
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
    const cloneMetadata: Manifest | any = (pkg = metadata) => Object.assign({}, pkg);

    describe('tag as arrays [deprecated]', () => {
      test('should delete a invalid latest version', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: '20000',
        };

        normalizeDistTags(pkg);

        expect(Object.keys(pkg[DIST_TAGS])).toHaveLength(0);
      });

      test('should define last published version as latest', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {};

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });

      test('should define last published version as latest with a custom dist-tag', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          beta: '1.0.1',
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ beta: '1.0.1', latest: '1.0.1' });
      });

      test('should convert any array of dist-tags to a plain string', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: ['1.0.1'],
        };

        normalizeDistTags(pkg);

        expect(pkg[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      });

      test('should convert any empty array to empty list of dist-tags', () => {
        const pkg = cloneMetadata();
        pkg[DIST_TAGS] = {
          latest: [],
        };

        expect(normalizeDistTags(pkg)[DIST_TAGS]).toEqual({});
      });
    });

    test('should clean up a invalid latest version', () => {
      const pkg = cloneMetadata();
      pkg[DIST_TAGS] = {
        latest: '20000',
      };

      expect(Object.keys(normalizeDistTags(pkg)[DIST_TAGS])).toHaveLength(0);
    });

    test('should handle empty dis-tags and define last published version as latest', () => {
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
  });

  describe('normalizePackage', () => {
    test('normalizePackage clean', () => {
      // @ts-expect-error
      const pkg = normalizePackage({
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        versions: {},
        [DIST_TAGS]: {},
      });
      expect(pkg).toBeDefined();
      expect(pkg.time).toBeInstanceOf(Object);
      expect(pkg.versions).toBeInstanceOf(Object);
      expect(pkg[DIST_TAGS]).toBeInstanceOf(Object);
      expect(pkg._distfiles).toBeInstanceOf(Object);
      expect(pkg._attachments).toBeInstanceOf(Object);
      expect(pkg._uplinks).toBeInstanceOf(Object);
    });

    test('normalizePackage partial metadata', () => {
      // @ts-ignore
      const pkg = normalizePackage(readFile('metadata'));
      expect(pkg).toBeDefined();
      expect(pkg.time).toBeInstanceOf(Object);
      expect(pkg.versions).toBeInstanceOf(Object);
      expect(pkg[DIST_TAGS]).toBeInstanceOf(Object);
      expect(pkg._distfiles).toBeInstanceOf(Object);
      expect(pkg._attachments).toBeInstanceOf(Object);
      expect(pkg._uplinks).toBeInstanceOf(Object);
    });

    test('normalizePackage partial default revision', () => {
      // @ts-ignore
      const pkg = normalizePackage(readFile('metadata'));
      expect(pkg).toBeDefined();
      expect(pkg._rev).toBeDefined();
      expect(pkg._rev).toBe(STORAGE.DEFAULT_REVISION);
    });
  });

  describe('mergeTime', () => {
    const vGroup1 = {
      '1.0.15': '2018-06-12T23:15:05.864Z',
      '1.0.16': '2018-06-12T23:17:46.578Z',
      '1.0.17': '2018-06-12T23:20:59.106Z',
    };
    const vGroup2 = {
      '1.0.6': '2018-06-07T05:50:21.505Z',
      '1.0.7': '2018-06-12T20:35:07.621Z',
    };
    test('mergeTime basic', () => {
      const pkg1: Manifest = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        time: {
          modified: '2018-06-13T06:44:45.747Z',
          created: '2018-06-07T05:50:21.505Z',
          ...vGroup1,
        },
        name: '',
        versions: {},
        [DIST_TAGS]: {},
      };

      const pkg2: Manifest = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        time: {
          modified: '2019-06-13T06:44:45.747Z',
          created: '2019-06-07T05:50:21.505Z',
          ...vGroup2,
        },
        versions: {},
        [DIST_TAGS]: {},
      };

      const mergedPkg = mergeUplinkTimeIntoLocal(pkg1, pkg2);
      expect(Object.keys(mergedPkg)).toEqual([
        'modified',
        'created',
        ...Object.keys(vGroup1),
        ...Object.keys(vGroup2),
      ]);
    });

    test('mergeTime remote empty', () => {
      const pkg1: Manifest = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        time: {
          modified: '2018-06-13T06:44:45.747Z',
          created: '2018-06-07T05:50:21.505Z',
          ...vGroup1,
        },
        versions: {},
        [DIST_TAGS]: {},
      };

      const pkg2: Manifest = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        versions: {},
        time: {},
        [DIST_TAGS]: {},
      };
      const mergedPkg = mergeUplinkTimeIntoLocal(pkg1, pkg2);
      expect(Object.keys(mergedPkg)).toEqual(['modified', 'created', ...Object.keys(vGroup1)]);
    });
  });

  describe('isDeprecatedManifest', () => {
    test('is not deprecated manifest', () => {
      const pkg = generatePackageMetadata('foo');
      expect(isDeprecatedManifest(pkg)).toBe(false);
    });

    test('is not deprecated manifest no _attachments', () => {
      const pkg = generatePackageMetadata('foo');
      // @ts-ignore
      delete pkg._attachments;
      expect(isDeprecatedManifest(pkg)).toBe(false);
    });

    test('is deprecated manifest', () => {
      const pkg = generatePackageMetadata('foo', '2.0.0');
      // @ts-ignore
      pkg.versions['2.0.0'].deprecated = 'some reason';
      pkg._attachments = {};
      expect(isDeprecatedManifest(pkg)).toBe(true);
    });

    test('is not deprecated manifest if _attachment contains data', () => {
      const pkg = generatePackageMetadata('foo', '2.0.0');
      // @ts-ignore
      pkg.versions['2.0.0'].deprecated = 'some reason';
      pkg._attachments = {
        ['2.0.0']: {
          data: 'fooData',
        },
      };
      expect(isDeprecatedManifest(pkg)).toBe(false);
    });
  });

  describe('isDifferentThanOne', () => {
    test('isDifferentThanOne is true', () => {
      expect(isDifferentThanOne({})).toBeTruthy();
    });
    test('isDifferentThanOne is false', () => {
      expect(
        isDifferentThanOne({
          foo: 'bar',
        })
      ).toBeFalsy();
    });
    test('isDifferentThanOne with two items is true', () => {
      expect(
        isDifferentThanOne({
          foo: 'bar',
          foo1: 'bar',
        })
      ).toBeTruthy();
    });
  });

  describe('hasInvalidPublishBody', () => {
    test('should be valid', () => {
      expect(
        hasInvalidPublishBody({
          _attachments: {
            'forbidden-place-1.0.6.tgz': {
              content_type: 'application/octet-stream',
              data: 'foo',
              length: 512,
            },
          },
          versions: {
            // @ts-expect-error
            '1.0.0': {},
          },
        })
      ).toBeFalsy();
    });

    test('should be invalid due missing versions', () => {
      expect(
        hasInvalidPublishBody({
          _attachments: {},
          versions: {},
        })
      ).toBeTruthy();
    });

    test('should be invalid due missing _attachments', () => {
      expect(
        hasInvalidPublishBody({
          _attachments: {},
          versions: {},
        })
      ).toBeTruthy();
    });

    test('should be invalid due invalid empty versions  object', () => {
      expect(
        hasInvalidPublishBody({
          _attachments: {
            'forbidden-place-1.0.6.tgz': {
              content_type: 'application/octet-stream',
              data: 'foo',
              length: 512,
            },
          },
          versions: {},
        })
      ).toBeTruthy();
    });

    test('should be invalid due empty _attachments object', () => {
      expect(
        hasInvalidPublishBody({
          _attachments: {},
          versions: {
            // @ts-expect-error
            '1.0.0': {},
            // @ts-expect-error
            '1.0.1': {},
          },
        })
      ).toBeTruthy();
    });
  });
});
