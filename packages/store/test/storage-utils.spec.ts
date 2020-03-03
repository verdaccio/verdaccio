import {normalizePackage, mergeUplinkTimeIntoLocal} from '../src/storage-utils';
import {Package} from '@verdaccio/types';
import { STORAGE, DIST_TAGS } from '@verdaccio/dev-commons';

import {readFile} from "./fixtures/test.utils";

describe('Storage Utils', () => {
  describe('normalizePackage', () => {
    test('normalizePackage clean', () => {
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
      "1.0.15": "2018-06-12T23:15:05.864Z",
      "1.0.16": "2018-06-12T23:17:46.578Z",
      "1.0.17": "2018-06-12T23:20:59.106Z"
    };
    const vGroup2 = {
      "1.0.6": "2018-06-07T05:50:21.505Z",
      "1.0.7": "2018-06-12T20:35:07.621Z"
    };
    test('mergeTime basic', () => {
      const pkg1: Package = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        time: {
          "modified": "2018-06-13T06:44:45.747Z",
          "created": "2018-06-07T05:50:21.505Z",
          ...vGroup1
        },
        name: '',
        versions: {},
        [DIST_TAGS]: {},
      };

      const pkg2: Package = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        time: {
          "modified": "2019-06-13T06:44:45.747Z",
          "created": "2019-06-07T05:50:21.505Z",
          ...vGroup2
        },
        versions: {},
        [DIST_TAGS]: {},
      };

      const mergedPkg = mergeUplinkTimeIntoLocal(pkg1, pkg2);
      expect(Object.keys(mergedPkg)).toEqual(["modified", "created",
        ...Object.keys(vGroup1), ...Object.keys(vGroup2)]);
    });

    test('mergeTime remote empty', () => {
      const pkg1: Package = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        time: {
          "modified": "2018-06-13T06:44:45.747Z",
          "created": "2018-06-07T05:50:21.505Z",
          ...vGroup1
        },
        versions: {},
        [DIST_TAGS]: {},
      };

      const pkg2: Package = {
        _attachments: {},
        _distfiles: {},
        _rev: '',
        _uplinks: {},
        name: '',
        versions: {},
        [DIST_TAGS]: {},
      };
      const mergedPkg = mergeUplinkTimeIntoLocal(pkg1, pkg2);
      expect(Object.keys(mergedPkg)).toEqual(["modified", "created", ...Object.keys(vGroup1)]);
    });
  });
});
