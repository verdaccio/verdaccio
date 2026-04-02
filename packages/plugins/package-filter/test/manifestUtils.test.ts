import { describe, expect, test } from 'vitest';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import {
  cleanupTime,
  getLatestVersion,
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
    ...overrides,
  } as unknown as Manifest;
}

describe('cleanupTime', () => {
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

  test('returns undefined when timedVersions is empty', () => {
    const manifest = createManifest({
      time: { '1.0.0': '2020-01-01' },
    });
    // Pass versions that have no time entries
    const result = getLatestVersion(manifest, ['9.9.9']);
    expect(result).toBeUndefined();
  });
});

describe('setupLatestTag', () => {
  test('returns early when all versions are already tagged', () => {
    const manifest = createManifest({
      [DIST_TAGS]: { beta: '1.0.0-beta' },
      versions: {
        '1.0.0-beta': { name: 'test-pkg', version: '1.0.0-beta' },
      } as any,
    });
    // The only version is already tagged as 'beta', so untaggedVersions is empty
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBeUndefined();
  });

  test('assigns latest to pre-release when no stable versions exist', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {},
      versions: {
        '1.0.0-alpha': { name: 'test-pkg', version: '1.0.0-alpha' },
        '2.0.0-beta': { name: 'test-pkg', version: '2.0.0-beta' },
      } as any,
      time: {
        '1.0.0-alpha': '2020-01-01T00:00:00.000Z',
        '2.0.0-beta': '2021-01-01T00:00:00.000Z',
      },
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('2.0.0-beta');
  });

  test('assigns latest to pre-release without time data', () => {
    const manifest = createManifest({
      [DIST_TAGS]: {},
      versions: {
        '1.0.0-alpha': { name: 'test-pkg', version: '1.0.0-alpha' },
        '2.0.0-beta': { name: 'test-pkg', version: '2.0.0-beta' },
      } as any,
      time: undefined,
    });
    setupLatestTag(manifest);
    expect(manifest[DIST_TAGS].latest).toBe('2.0.0-beta');
  });
});

describe('setupCreatedAndModified', () => {
  test('handles manifest without time property', () => {
    const manifest = createManifest({ time: undefined });
    expect(() => setupCreatedAndModified(manifest)).not.toThrow();
  });
});
