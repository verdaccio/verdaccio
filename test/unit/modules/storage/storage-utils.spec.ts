import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import type { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from '@verdaccio/test-helper';

import { DIST_TAGS, STORAGE } from '../../../../src/lib/constants';
import {
  distFileFromVersion,
  lookupDistFile,
  mergeUplinkTimeIntoLocal,
  normalizePackage,
  prepareSearchPackage,
  tarballMatchesFilename,
} from '../../../../src/lib/storage-utils';

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, `/${filePath}`));
}

const readMetadata = (fileName = 'metadata') => readFile(`../../partials/${fileName}`);

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
      const pkg = normalizePackage(readMetadata('metadata'));
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
      const pkg = normalizePackage(readMetadata('metadata'));
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
      expect(Object.keys(mergedPkg.time)).toEqual([
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
        [DIST_TAGS]: {},
      };
      const mergedPkg = mergeUplinkTimeIntoLocal(pkg1, pkg2);
      expect(Object.keys(mergedPkg.time)).toEqual(['modified', 'created', ...Object.keys(vGroup1)]);
    });
  });

  describe('prepareSearchPackage', () => {
    const time = '2018-01-14T11:17:40.712Z';

    test('should map packument maintainers to the npm search username format', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.versions['1.0.0'].maintainers = [
        { name: 'jota', email: 'jota@verdaccio.org' },
      ] as any;

      const pkg = prepareSearchPackage(manifest, time);
      // the npm CLI reads `maintainers[].username` and crashes when missing
      expect(pkg.maintainers).toEqual([
        { name: 'jota', email: 'jota@verdaccio.org', username: 'jota' },
      ]);
      // generatePackageMetadata includes _npmUser: { name: 'foo' }
      expect(pkg.publisher).toEqual({ username: 'foo', email: '' });
    });

    test('should fall back to the first maintainer as publisher without _npmUser', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      delete (manifest.versions['1.0.0'] as any)._npmUser;
      manifest.versions['1.0.0'].maintainers = [
        { name: 'jota', email: 'jota@verdaccio.org' },
      ] as any;

      const pkg = prepareSearchPackage(manifest, time);
      expect(pkg.publisher).toEqual({
        name: 'jota',
        email: 'jota@verdaccio.org',
        username: 'jota',
      });
    });

    test('should fall back to the version author when maintainers are missing', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      delete (manifest.versions['1.0.0'] as any)._npmUser;
      delete manifest.versions['1.0.0'].maintainers;

      const pkg = prepareSearchPackage(manifest, time);
      expect(pkg.maintainers).toEqual([
        { name: 'User NPM', email: 'user@domain.com', username: 'User NPM' },
      ]);
      expect(pkg.publisher).toEqual({
        name: 'User NPM',
        email: 'user@domain.com',
        username: 'User NPM',
      });
    });

    test('should map missing maintainers and author to an empty list', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      delete (manifest.versions['1.0.0'] as any)._npmUser;
      delete manifest.versions['1.0.0'].maintainers;
      delete (manifest.versions['1.0.0'] as any).author;

      const pkg = prepareSearchPackage(manifest, time);
      expect(pkg.maintainers).toEqual([]);
      expect(pkg.publisher).toEqual({});
    });
  });

  describe('tarballMatchesFilename', () => {
    test('should match when the url path basename equals the filename', () => {
      expect(
        tarballMatchesFilename('https://registry.domain.test/pkg/-/pkg-1.0.0.tgz', 'pkg-1.0.0.tgz')
      ).toBe(true);
    });

    test('should ignore query strings', () => {
      expect(
        tarballMatchesFilename(
          'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz?token=abc',
          'pkg-1.0.0.tgz'
        )
      ).toBe(true);
    });

    test('should not match a partial basename', () => {
      // 'other-pkg-1.0.0.tgz' ends with 'pkg-1.0.0.tgz' as a plain string,
      // but the path segment boundary must be respected
      expect(
        tarballMatchesFilename(
          'https://registry.domain.test/pkg/-/other-pkg-1.0.0.tgz',
          'pkg-1.0.0.tgz'
        )
      ).toBe(false);
    });

    test('should not match a different filename', () => {
      expect(
        tarballMatchesFilename('https://registry.domain.test/pkg/-/pkg-2.0.0.tgz', 'pkg-1.0.0.tgz')
      ).toBe(false);
    });
  });

  describe('distFileFromVersion', () => {
    test('should build a distfile record from a matching version', () => {
      const version = {
        dist: {
          tarball: 'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz',
          shasum: 'sha-1.0.0',
        },
      } as any;

      expect(distFileFromVersion(version, 'pkg-1.0.0.tgz')).toEqual({
        url: 'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz',
        sha: 'sha-1.0.0',
      });
    });

    test('should return null when the tarball does not match', () => {
      const version = {
        dist: {
          tarball: 'https://registry.domain.test/pkg/-/pkg-2.0.0.tgz',
          shasum: 'sha-2.0.0',
        },
      } as any;

      expect(distFileFromVersion(version, 'pkg-1.0.0.tgz')).toBeNull();
    });

    test('should return null for versions without dist metadata', () => {
      expect(distFileFromVersion({} as any, 'pkg-1.0.0.tgz')).toBeNull();
      expect(distFileFromVersion({ dist: {} } as any, 'pkg-1.0.0.tgz')).toBeNull();
      expect(distFileFromVersion(undefined as any, 'pkg-1.0.0.tgz')).toBeNull();
    });
  });

  describe('lookupDistFile', () => {
    const manifest = {
      name: 'pkg',
      versions: {
        '1.0.0': {
          name: 'pkg',
          version: '1.0.0',
          dist: {
            tarball: 'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz',
            shasum: 'sha-from-version',
          },
        },
      },
      _distfiles: {
        'pkg-2.0.0.tgz': {
          url: 'https://registry.domain.test/pkg/-/pkg-2.0.0.tgz',
          sha: 'sha-from-distfiles',
          registry: 'npmjs',
        },
      },
    } as any as Manifest;

    test('should prefer the _distfiles record when present', () => {
      expect(lookupDistFile(manifest, 'pkg-2.0.0.tgz')).toEqual({
        url: 'https://registry.domain.test/pkg/-/pkg-2.0.0.tgz',
        sha: 'sha-from-distfiles',
        registry: 'npmjs',
      });
    });

    test('should fall back to the version dist when the record is missing', () => {
      expect(lookupDistFile(manifest, 'pkg-1.0.0.tgz')).toEqual({
        url: 'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz',
        sha: 'sha-from-version',
      });
    });

    test('should return null when the tarball is unknown', () => {
      expect(lookupDistFile(manifest, 'pkg-9.9.9.tgz')).toBeNull();
    });

    test('should resolve scoped and dashed package names via the filename fast path', () => {
      const scoped = {
        name: '@scope/my-pkg',
        versions: {
          '2.0.0-next.1': {
            dist: {
              tarball: 'https://registry.domain.test/@scope/my-pkg/-/my-pkg-2.0.0-next.1.tgz',
              shasum: 'sha-scoped',
            },
          },
        },
        _distfiles: {},
      } as any as Manifest;

      expect(lookupDistFile(scoped, 'my-pkg-2.0.0-next.1.tgz')).toEqual({
        url: 'https://registry.domain.test/@scope/my-pkg/-/my-pkg-2.0.0-next.1.tgz',
        sha: 'sha-scoped',
      });
    });

    test('should resolve unconventional tarball names via the scan', () => {
      const odd = {
        name: 'pkg',
        versions: {
          '1.0.0': {
            dist: {
              // tarball name does not follow <name>-<version>.tgz
              tarball: 'https://registry.domain.test/pkg/-/custom-build.tgz?token=abc',
              shasum: 'sha-odd',
            },
          },
        },
        _distfiles: {},
      } as any as Manifest;

      expect(lookupDistFile(odd, 'custom-build.tgz')).toEqual({
        url: 'https://registry.domain.test/pkg/-/custom-build.tgz?token=abc',
        sha: 'sha-odd',
      });
    });

    test('should resolve GitHub Packages style digest tarball urls via the scan', () => {
      const digest = '0e2c8dab83ed0775cd6d17e73b351f0d573fbb0b47f0e79f723e4b6ceff9eab3';
      const github = {
        name: '@owner/gh-pkg',
        versions: {
          '1.0.0': {
            dist: {
              tarball: `https://npm.pkg.github.com/download/@owner/gh-pkg/1.0.0/${digest}`,
              shasum: 'sha-gh',
            },
          },
        },
        _distfiles: {},
      } as any as Manifest;

      // the advertised local tarball filename is the url path basename,
      // ie. the digest — not <name>-<version>.tgz
      expect(lookupDistFile(github, digest)).toEqual({
        url: `https://npm.pkg.github.com/download/@owner/gh-pkg/1.0.0/${digest}`,
        sha: 'sha-gh',
      });
      // and the digest of another version must not match
      expect(lookupDistFile(github, 'a'.repeat(64))).toBeNull();
    });
  });
});
