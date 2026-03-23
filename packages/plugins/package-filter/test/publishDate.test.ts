import { describe, expect, test } from 'vitest';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import { filterVersionsByPublishDate } from '../src/filtering/publishDate';

function createManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    name: 'test-pkg',
    [DIST_TAGS]: { latest: '1.0.0' },
    versions: {
      '1.0.0': { name: 'test-pkg', version: '1.0.0' },
    },
    _distfiles: {},
    _attachments: {},
    _uplinks: {},
    _rev: '1-abc',
    ...overrides,
  } as unknown as Manifest;
}

describe('filterVersionsByPublishDate', () => {
  test('throws when manifest has no time property', () => {
    const manifest = createManifest({ time: undefined });
    const allowRules = new Map();

    expect(() => filterVersionsByPublishDate(manifest, new Date('2024-01-01'), allowRules)).toThrow(
      'Time of publication was not provided for package test-pkg'
    );
  });

  test('throws when a version has no publish time entry', () => {
    const manifest = createManifest({
      time: {
        // '1.0.0' is missing
      },
    });
    const allowRules = new Map();

    expect(() => filterVersionsByPublishDate(manifest, new Date('2024-01-01'), allowRules)).toThrow(
      'Time of publication was not provided for package test-pkg, version 1.0.0'
    );
  });
});
