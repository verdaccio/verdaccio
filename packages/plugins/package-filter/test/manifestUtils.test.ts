import { describe, expect, test } from 'vitest';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import {
  cleanupDistFiles,
  cleanupTags,
  cleanupTime,
  getLatestVersion,
  getManifestClone,
  setupCreatedAndModified,
  setupLatestTag,
} from '../src/utils/manifestUtils';

function createManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    name: 'test-pkg',
    [DIST_TAGS]: { latest: '1.0.0' },
    versions: {},
    time: {},
    _distfiles: {},
    _attachments: {},
    _uplinks: {},
    _rev: '1-abc',
    readme: 'readme',
    ...overrides,
  } as unknown as Manifest;
}

describe('cleanupTags', () => {
  test('removes dist-tags pointing to missing versions', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { latest: '1.0.0', beta: '2.0.0-beta', stale: '0.0.1' },
      versions: { '1.0.0': {}, '2.0.0-beta': {} } as any,
    });
    cleanupTags(manifest);
    expect(manifest[DIST_TAGS]).toEqual({ latest: '1.0.0', beta: '2.0.0-beta' });
  });

  test('keeps every tag when all targets exist', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { latest: '2.0.0', next: '3.0.0-rc.1' },
      versions: { '2.0.0': {}, '3.0.0-rc.1': {} } as any,
    });
    cleanupTags(manifest);
    expect(manifest[DIST_TAGS]).toEqual({ latest: '2.0.0', next: '3.0.0-rc.1' });
  });

  test('removes every tag when no versions remain', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { latest: '1.0.0', beta: '2.0.0' },
      versions: {} as any,
    });
    cleanupTags(manifest);
    expect(manifest[DIST_TAGS]).toEqual({});
  });

  test('handles an empty dist-tags object', () => {
    const manifest = createManifest({ [DIST_TAGS]: {} as any, versions: { '1.0.0': {} } as any });
    expect(() => cleanupTags(manifest)).not.toThrow();
    expect(manifest[DIST_TAGS]).toEqual({});
  });
});

describe('cleanupTime', () => {
  test('removes time entries for versions that no longer exist', () => {
    const manifest = createManifest({
      versions: { '1.0.0': {} } as any,
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2021-01-01T00:00:00.000Z',
      },
    });
    cleanupTime(manifest);
    expect(manifest.time).toEqual({ '1.0.0': '2020-01-01T00:00:00.000Z' });
  });

  test('strips the synthetic created/modified keys (re-added later by setupCreatedAndModified)', () => {
    const manifest = createManifest({
      versions: { '1.0.0': {} } as any,
      time: {
        created: '2019-01-01T00:00:00.000Z',
        modified: '2022-01-01T00:00:00.000Z',
        '1.0.0': '2020-01-01T00:00:00.000Z',
      },
    });
    cleanupTime(manifest);
    expect(Object.keys(manifest.time as object)).toEqual(['1.0.0']);
  });

  test('removes all time entries when there are no versions', () => {
    const manifest = createManifest({
      versions: {} as any,
      time: { '1.0.0': '2020-01-01T00:00:00.000Z' },
    });
    cleanupTime(manifest);
    expect(manifest.time).toEqual({});
  });

  test('handles manifest without time property', () => {
    const manifest = createManifest({ time: undefined });
    expect(() => cleanupTime(manifest)).not.toThrow();
  });
});

describe('getLatestVersion', () => {
  test('falls back to semver sort when no time data', () => {
    const manifest = createManifest({ time: undefined });
    const result = getLatestVersion(manifest, ['1.0.0', '3.0.0', '2.0.0']);
    expect(result).toBe('3.0.0');
  });

  test('picks the most recently published version, not the highest semver', () => {
    const manifest = createManifest({
      time: {
        '1.0.0': '2024-01-01T00:00:00.000Z', // newest by time
        '2.0.0': '2020-01-01T00:00:00.000Z', // highest semver, but older
      },
    });
    expect(getLatestVersion(manifest, ['1.0.0', '2.0.0'])).toBe('1.0.0');
  });

  test('ignores versions without a time entry', () => {
    const manifest = createManifest({
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2023-01-01T00:00:00.000Z',
      },
    });
    // 9.9.9 has no time; latest timed version wins.
    expect(getLatestVersion(manifest, ['1.0.0', '2.0.0', '9.9.9'])).toBe('2.0.0');
  });

  test('returns undefined when none of the versions have time data', () => {
    const manifest = createManifest({ time: { '1.0.0': '2020-01-01' } });
    expect(getLatestVersion(manifest, ['9.9.9'])).toBeUndefined();
  });

  test('returns the only timed version', () => {
    const manifest = createManifest({ time: { '1.2.3': '2021-05-05T00:00:00.000Z' } });
    expect(getLatestVersion(manifest, ['1.2.3'])).toBe('1.2.3');
  });
});

describe('setupLatestTag', () => {
  test('does nothing when latest is already set', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { latest: '1.0.0', next: '2.0.0' },
      versions: { '1.0.0': {}, '2.0.0': {} } as any,
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('does nothing when there are no versions', () => {
    const manifest = createManifest({ [DIST_TAGS]: {} as any, versions: {} as any });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBeUndefined();
  });

  test('prefers the latest stable version (by time) over higher semver', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {} as any,
      versions: { '1.0.0': {}, '2.0.0': {}, '1.5.0-beta': {} } as any,
      time: {
        '1.0.0': '2024-01-01T00:00:00.000Z', // newest stable
        '2.0.0': '2020-01-01T00:00:00.000Z',
        '1.5.0-beta': '2025-01-01T00:00:00.000Z', // newest overall, but prerelease
      },
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('prefers a stable version even when a prerelease is newer', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {} as any,
      versions: { '1.0.0': {}, '2.0.0-beta': {} } as any,
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0-beta': '2024-01-01T00:00:00.000Z',
      },
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('falls back to a prerelease when no stable versions exist', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {} as any,
      versions: { '1.0.0-alpha': {}, '2.0.0-beta': {} } as any,
      time: {
        '1.0.0-alpha': '2020-01-01T00:00:00.000Z',
        '2.0.0-beta': '2021-01-01T00:00:00.000Z',
      },
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('2.0.0-beta');
  });

  test('falls back to a prerelease without time data (semver order)', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {} as any,
      versions: { '1.0.0-alpha': {}, '2.0.0-beta': {} } as any,
      time: undefined,
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('2.0.0-beta');
  });

  test('excludes versions already referenced by another dist-tag', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { next: '2.0.0' } as any,
      versions: { '1.0.0': {}, '2.0.0': {} } as any,
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2024-01-01T00:00:00.000Z',
      },
    });
    // 2.0.0 is tagged `next`, so the untagged 1.0.0 becomes latest.
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('ignores invalid semver versions', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {} as any,
      versions: { '1.0.0': {}, 'not-a-version': {} } as any,
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        'not-a-version': '2030-01-01T00:00:00.000Z',
      },
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
  });

  test('leaves latest unset when every version is already tagged', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { beta: '1.0.0-beta' } as any,
      versions: { '1.0.0-beta': {} } as any,
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBeUndefined();
  });
});

describe('setupCreatedAndModified', () => {
  test('sets created to the earliest and modified to the latest publish time', () => {
    const manifest = createManifest({
      time: {
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2022-06-01T00:00:00.000Z',
        '3.0.0': '2021-01-01T00:00:00.000Z',
      },
    });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBe('2020-01-01T00:00:00.000Z');
    expect(manifest.time!.modified).toBe('2022-06-01T00:00:00.000Z');
  });

  test('is order-independent (single-pass min/max)', () => {
    const manifest = createManifest({
      time: {
        '3.0.0': '2021-01-01T00:00:00.000Z',
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2022-06-01T00:00:00.000Z',
      },
    });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBe('2020-01-01T00:00:00.000Z');
    expect(manifest.time!.modified).toBe('2022-06-01T00:00:00.000Z');
  });

  test('honours millisecond precision', () => {
    const manifest = createManifest({
      time: {
        '1.0.0': '2024-01-01T00:00:00.000Z',
        '1.0.1': '2024-01-01T00:00:00.123Z',
      },
    });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBe('2024-01-01T00:00:00.000Z');
    expect(manifest.time!.modified).toBe('2024-01-01T00:00:00.123Z');
  });

  test('created equals modified for a single entry', () => {
    const manifest = createManifest({ time: { '1.0.0': '2021-05-05T00:00:00.000Z' } });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBe('2021-05-05T00:00:00.000Z');
    expect(manifest.time!.modified).toBe('2021-05-05T00:00:00.000Z');
  });

  test('existing created/modified participate in the bounds', () => {
    const manifest = createManifest({
      time: {
        created: '2019-01-01T00:00:00.000Z',
        modified: '2025-01-01T00:00:00.000Z',
        '1.0.0': '2020-01-01T00:00:00.000Z',
        '2.0.0': '2022-01-01T00:00:00.000Z',
      },
    });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBe('2019-01-01T00:00:00.000Z');
    expect(manifest.time!.modified).toBe('2025-01-01T00:00:00.000Z');
  });

  test('does not set created/modified for an empty time object', () => {
    const manifest = createManifest({ time: {} });
    setupCreatedAndModified(manifest);
    expect(manifest.time!.created).toBeUndefined();
    expect(manifest.time!.modified).toBeUndefined();
  });

  test('handles manifest without time property', () => {
    const manifest = createManifest({ time: undefined });
    expect(() => setupCreatedAndModified(manifest)).not.toThrow();
  });
});

describe('cleanupDistFiles', () => {
  test('removes _distfiles entries not referenced by any version', () => {
    const manifest = createManifest({
      versions: {
        '1.0.0': { dist: { tarball: 'https://registry.npmjs.org/test-pkg/-/test-pkg-1.0.0.tgz' } },
      } as any,
      _distfiles: {
        'test-pkg-1.0.0.tgz': {
          url: 'https://registry.npmjs.org/test-pkg/-/test-pkg-1.0.0.tgz',
          sha: '',
        },
        'test-pkg-0.9.0.tgz': {
          url: 'https://registry.npmjs.org/test-pkg/-/test-pkg-0.9.0.tgz',
          sha: '',
        },
      } as any,
    });
    cleanupDistFiles(manifest);
    expect(Object.keys(manifest._distfiles)).toEqual(['test-pkg-1.0.0.tgz']);
  });

  test('retains _distfiles entries referenced by a version', () => {
    const url = 'https://registry.npmjs.org/test-pkg/-/test-pkg-2.0.0.tgz';
    const manifest = createManifest({
      versions: { '2.0.0': { dist: { tarball: url } } } as any,
      _distfiles: { 'test-pkg-2.0.0.tgz': { url, sha: '' } } as any,
    });
    cleanupDistFiles(manifest);
    expect(manifest._distfiles['test-pkg-2.0.0.tgz'].url).toBe(url);
  });

  test('handles multiple versions sharing the same tarball URL', () => {
    const sharedUrl = 'https://registry.npmjs.org/test-pkg/-/test-pkg-1.0.0.tgz';
    const manifest = createManifest({
      versions: {
        '1.0.0': { dist: { tarball: sharedUrl } },
        '1.0.0-alias': { dist: { tarball: sharedUrl } },
      } as any,
      _distfiles: {
        'test-pkg-1.0.0.tgz': { url: sharedUrl, sha: '' },
        'test-pkg-orphan.tgz': {
          url: 'https://registry.npmjs.org/test-pkg/-/test-pkg-orphan.tgz',
          sha: '',
        },
      } as any,
    });
    cleanupDistFiles(manifest);
    expect(Object.keys(manifest._distfiles)).toEqual(['test-pkg-1.0.0.tgz']);
  });

  test('removes every entry when no version has a matching tarball', () => {
    const manifest = createManifest({
      versions: { '1.0.0': { dist: { tarball: 'https://example.com/a.tgz' } } } as any,
      _distfiles: { 'orphan.tgz': { url: 'https://example.com/orphan.tgz', sha: '' } } as any,
    });
    cleanupDistFiles(manifest);
    expect(manifest._distfiles).toEqual({});
  });

  test('treats versions without a dist/tarball as referencing nothing', () => {
    const manifest = createManifest({
      versions: { '1.0.0': {}, '2.0.0': { dist: {} } } as any,
      _distfiles: { 'a.tgz': { url: 'https://example.com/a.tgz', sha: '' } } as any,
    });
    cleanupDistFiles(manifest);
    expect(manifest._distfiles).toEqual({});
  });

  test('handles an empty _distfiles object', () => {
    const manifest = createManifest({
      versions: { '1.0.0': { dist: { tarball: 'https://example.com/a.tgz' } } } as any,
      _distfiles: {} as any,
    });
    expect(() => cleanupDistFiles(manifest)).not.toThrow();
    expect(manifest._distfiles).toEqual({});
  });
});

describe('getManifestClone', () => {
  function richManifest(): Manifest {
    return createManifest({
      versions: { '1.0.0': { name: 'test-pkg', version: '1.0.0' } } as any,
      [DIST_TAGS]: { latest: '1.0.0' },
      time: { '1.0.0': '2020-01-01T00:00:00.000Z' },
      _distfiles: { 'a.tgz': { url: 'https://example.com/a.tgz', sha: '' } } as any,
    });
  }

  test('returns a new object that preserves scalar fields', () => {
    const manifest = richManifest();
    const clone = getManifestClone(manifest);
    expect(clone).not.toBe(manifest);
    expect(clone.name).toBe(manifest.name);
    expect(clone._rev).toBe(manifest._rev);
    expect(clone.readme).toBe(manifest.readme);
  });

  test('clones versions/dist-tags/time/_distfiles as independent maps', () => {
    const manifest = richManifest();
    const clone = getManifestClone(manifest);
    expect(clone.versions).not.toBe(manifest.versions);
    expect(clone[DIST_TAGS]).not.toBe(manifest[DIST_TAGS]);
    expect(clone.time).not.toBe(manifest.time);
    expect(clone._distfiles).not.toBe(manifest._distfiles);
  });

  test('mutating the cloned maps does not affect the original', () => {
    const manifest = richManifest();
    const clone = getManifestClone(manifest);

    delete clone.versions['1.0.0'];
    clone.versions['2.0.0'] = { name: 'test-pkg', version: '2.0.0' } as any;
    clone[DIST_TAGS].latest = '2.0.0';
    clone.time!['2.0.0'] = '2021-01-01T00:00:00.000Z';
    delete clone._distfiles['a.tgz'];

    expect(Object.keys(manifest.versions)).toEqual(['1.0.0']);
    expect(manifest[DIST_TAGS].latest).toBe('1.0.0');
    expect(Object.keys(manifest.time as object)).toEqual(['1.0.0']);
    expect(Object.keys(manifest._distfiles)).toEqual(['a.tgz']);
  });

  test('keeps version objects shared by reference (shallow clone)', () => {
    const manifest = richManifest();
    const clone = getManifestClone(manifest);
    expect(clone.versions['1.0.0']).toBe(manifest.versions['1.0.0']);
  });

  test('normalises a missing time map to an empty object', () => {
    const manifest = createManifest({ time: undefined });
    const clone = getManifestClone(manifest);
    expect(clone.time).toEqual({});
  });
});
