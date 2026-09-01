import { describe, expect, test } from 'vitest';

import { DIST_TAGS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Manifest } from '@verdaccio/types';

import {
  STORAGE,
  cleanUpReadme,
  distFileFromVersion,
  lookupDistFile,
  tarballMatchesFilename,
  uplinkServesUrl,
  isDeprecatedManifest,
  mapManifestToSearchPackageBody,
  mergeUplinkTimeIntoLocal,
  mergeVersions,
  normalizeDistTags,
  normalizePackage,
} from '../src/lib/storage-utils';
import { readFile } from './fixtures/test.utils';

describe('Storage Utils', () => {
  describe('normalizeDistTags', () => {
    const dist = (version) => ({
      tarball: `http://fake.verdaccio.org/npm_test/-/npm_test-${version}.tgz`,
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

  describe('cleanUpReadme', () => {
    describe('should keep only latest readme', () => {
      test('should clean up readme (no dist-tags)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version);
        expect(cleanup.readme).toEqual('');
      });

      test('should clean up readme (latest in dist-tag)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version, manifest[DIST_TAGS]);
        expect(cleanup.readme).toEqual('');
      });
    });

    describe('should keep only tagged readme', () => {
      test('should clean up readme (no dist-tags)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version, undefined, 'tagged');
        expect(cleanup.readme).toEqual('');
      });

      test('should keep readme (version in dist-tag)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version, manifest[DIST_TAGS], 'tagged');
        expect(cleanup.readme).toEqual('# test');
      });
    });

    describe('should keep all readmes', () => {
      test('should keep readme (no dist-tags)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version, undefined, 'all');
        expect(cleanup.readme).toEqual('# test');
      });

      test('should keep readme (version in dist-tag)', () => {
        const manifest = generatePackageMetadata('foo');
        const version = manifest.versions['1.0.0'];
        const cleanup = cleanUpReadme(version, manifest[DIST_TAGS], 'all');
        expect(cleanup.readme).toEqual('# test');
      });
    });
  });

  describe('mergeVersions', () => {
    test('should merge two versions', () => {
      const pkg1 = generatePackageMetadata('foo');
      const pkg2 = generatePackageMetadata('foo', '1.0.1');
      const merged = mergeVersions(pkg1, pkg2);
      expect(Object.keys(merged.versions)).toEqual(['1.0.0', '1.0.1']);
    });

    test('should merge versions and deprecate status', () => {
      const pkg1 = generatePackageMetadata('foo');
      const pkg2 = generatePackageMetadata('foo', '1.0.1');
      const local = mergeVersions(pkg1, pkg2);
      expect(local.versions['1.0.1'].deprecated).toBeUndefined();
      const remoteDeprecated = structuredClone(local);
      remoteDeprecated.versions['1.0.1'].deprecated = 'some reason';
      const newMerged = mergeVersions(local, remoteDeprecated);
      expect(newMerged.versions['1.0.1'].deprecated).toEqual('some reason');
    });

    test('simple', () => {
      const pkg = {
        versions: { a: 1, b: 1, c: 1 },
        'dist-tags': {},
      };

      // @ts-ignore
      mergeVersions(pkg, { versions: { a: 2, q: 2 } });

      expect(pkg).toStrictEqual({
        versions: { a: 1, b: 1, c: 1, q: 2 },
        'dist-tags': {},
      });
    });

    test('dist-tags - compat', () => {
      const pkg = {
        versions: {},
        'dist-tags': { q: '1.1.1', w: '2.2.2' },
      };

      // @ts-ignore
      mergeVersions(pkg, { 'dist-tags': { q: '2.2.2', w: '3.3.3', t: '4.4.4' } });

      expect(pkg).toStrictEqual({
        versions: {},
        'dist-tags': { q: '2.2.2', w: '3.3.3', t: '4.4.4' },
      });
    });

    test('dist-tags - staging', () => {
      const pkg = {
        versions: {},
        // we've been locally publishing 1.1.x in preparation for the next
        // public release
        'dist-tags': { q: '1.1.10', w: '2.2.2' },
      };
      // 1.1.2 is the latest public release, but we want to continue testing
      // against our local 1.1.10, which may end up published as 1.1.3 in the
      // future

      // @ts-ignore
      mergeVersions(pkg, { 'dist-tags': { q: '1.1.2', w: '3.3.3', t: '4.4.4' } });

      expect(pkg).toStrictEqual({
        versions: {},
        'dist-tags': { q: '1.1.10', w: '3.3.3', t: '4.4.4' },
      });
    });
  });

  describe('mapManifestToSearchPackageBody', () => {
    const searchItem = {
      package: { name: 'npm_test' },
      score: { final: 1, detail: { maintenance: 0, popularity: 1, quality: 1 } },
    } as any;

    test('should map packument maintainers to the npm search username format', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      manifest.versions['1.0.0'].maintainers = [
        { name: 'jota', email: 'jota@verdaccio.org' },
      ] as any;

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      // the npm CLI reads `maintainers[].username` and crashes when missing
      expect(body.maintainers).toEqual([
        { name: 'jota', email: 'jota@verdaccio.org', username: 'jota' },
      ]);
      // generatePackageMetadata includes _npmUser: { name: 'foo' }
      expect(body.publisher).toEqual({ username: 'foo', email: '' });
    });

    test('should map the latest version license to the npm search package', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      manifest.versions['1.0.0'].license = 'Apache-2.0';

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.license).toBe('Apache-2.0');
    });

    test('should leave license undefined when the latest version has no license', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      delete manifest.versions['1.0.0'].license;

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.license).toBeUndefined();
    });

    test('should preserve compound SPDX license expressions', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      manifest.versions['1.0.0'].license = 'MIT OR Apache-2.0';

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.license).toBe('MIT OR Apache-2.0');
    });

    test('should use the license selected by the latest dist-tag instead of highest semver', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.versions['1.0.0'].license = 'MIT';
      manifest.versions['2.0.0'] = {
        ...manifest.versions['1.0.0'],
        _id: 'npm_test@2.0.0',
        version: '2.0.0',
        license: 'Apache-2.0',
      };
      manifest['dist-tags'].latest = '1.0.0';
      manifest.time = {
        '1.0.0': '2018-01-14T11:17:40.712Z',
        '2.0.0': '2019-01-14T11:17:40.712Z',
      };

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.version).toBe('1.0.0');
      expect(body.license).toBe('MIT');
    });

    test('should fall back to the first maintainer as publisher without _npmUser', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      delete (manifest.versions['1.0.0'] as any)._npmUser;
      manifest.versions['1.0.0'].maintainers = [
        { name: 'jota', email: 'jota@verdaccio.org' },
      ] as any;

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.publisher).toEqual({
        name: 'jota',
        email: 'jota@verdaccio.org',
        username: 'jota',
      });
    });

    test('should map missing maintainers to an empty list', () => {
      const manifest = generatePackageMetadata('npm_test', '1.0.0') as Manifest;
      manifest.time = { '1.0.0': '2018-01-14T11:17:40.712Z' };
      delete (manifest.versions['1.0.0'] as any)._npmUser;
      delete manifest.versions['1.0.0'].maintainers;

      const body = mapManifestToSearchPackageBody(manifest, searchItem);
      expect(body.maintainers).toEqual([]);
      expect(body.publisher).toEqual({});
    });
  });
  describe('tarballMatchesFilename', () => {
    test('should match when the url path basename equals the filename', () => {
      expect(
        tarballMatchesFilename('https://registry.domain.test/pkg/-/pkg-1.0.0.tgz', 'pkg-1.0.0.tgz')
      ).toBe(true);
    });

    test('should ignore query strings and fragments', () => {
      expect(
        tarballMatchesFilename(
          'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz?token=abc',
          'pkg-1.0.0.tgz'
        )
      ).toBe(true);
      expect(
        tarballMatchesFilename(
          'https://registry.domain.test/pkg/-/pkg-1.0.0.tgz#integrity',
          'pkg-1.0.0.tgz'
        )
      ).toBe(true);
    });

    test('should not match a partial basename or a different filename', () => {
      expect(
        tarballMatchesFilename(
          'https://registry.domain.test/pkg/-/other-pkg-1.0.0.tgz',
          'pkg-1.0.0.tgz'
        )
      ).toBe(false);
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

    test('should return null on mismatch or missing dist', () => {
      const version = {
        dist: {
          tarball: 'https://registry.domain.test/pkg/-/pkg-2.0.0.tgz',
          shasum: 'sha-2.0.0',
        },
      } as any;
      expect(distFileFromVersion(version, 'pkg-1.0.0.tgz')).toBeNull();
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

      expect(lookupDistFile(github, digest)).toEqual({
        url: `https://npm.pkg.github.com/download/@owner/gh-pkg/1.0.0/${digest}`,
        sha: 'sha-gh',
      });
      expect(lookupDistFile(github, 'a'.repeat(64))).toBeNull();
    });
  });

  describe('uplinkServesUrl', () => {
    test('matches same protocol, host and path prefix', () => {
      expect(
        uplinkServesUrl(
          new URL('https://registry.npmjs.org/'),
          'https://registry.npmjs.org/p/-/p-1.0.0.tgz'
        )
      ).toBe(true);
    });

    test('normalizes default ports', () => {
      expect(
        uplinkServesUrl(
          new URL('https://registry.npmjs.org:443/'),
          'https://registry.npmjs.org/p/-/p-1.0.0.tgz'
        )
      ).toBe(true);
    });

    test('rejects other hosts, protocols and paths', () => {
      expect(
        uplinkServesUrl(
          new URL('https://registry.npmjs.org/'),
          'https://cdn.example.com/p-1.0.0.tgz'
        )
      ).toBe(false);
      expect(
        uplinkServesUrl(
          new URL('https://registry.npmjs.org/'),
          'http://registry.npmjs.org/p-1.0.0.tgz'
        )
      ).toBe(false);
      expect(
        uplinkServesUrl(
          new URL('https://host.test/registry/'),
          'https://host.test/other/p-1.0.0.tgz'
        )
      ).toBe(false);
    });

    test('matches only on a path segment boundary', () => {
      // /registry (no trailing slash) must not match /registry2/... — a
      // sibling path would otherwise receive this uplink's credentials.
      expect(
        uplinkServesUrl(
          new URL('https://host.test/registry'),
          'https://host.test/registry2/p/-/p-1.0.0.tgz'
        )
      ).toBe(false);
      expect(
        uplinkServesUrl(
          new URL('https://host.test/registry'),
          'https://host.test/registry/p/-/p-1.0.0.tgz'
        )
      ).toBe(true);
    });

    test('returns false for garbage urls', () => {
      expect(uplinkServesUrl(new URL('https://registry.npmjs.org/'), '//no-protocol/p.tgz')).toBe(
        false
      );
      expect(uplinkServesUrl(new URL('https://registry.npmjs.org/'), 'not a url')).toBe(false);
    });
  });
});
