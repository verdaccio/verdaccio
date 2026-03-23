import { describe, expect, test, vi } from 'vitest';

import { DIST_TAGS } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import { applyManifestFilters } from '../src/filter-pipeline';

const noopLogger = {
  debug: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn(),
  http: vi.fn(),
  child: () => noopLogger,
} as any;

function createManifest(name: string, versions: string[]): Manifest {
  const manifest = {
    name,
    [DIST_TAGS]: { latest: versions[versions.length - 1] },
    versions: {},
    time: {},
    _distfiles: {},
    _attachments: {},
    _uplinks: {},
    _rev: '1-abc',
  } as unknown as Manifest;

  for (const v of versions) {
    manifest.versions[v] = { name, version: v } as any;
  }

  return manifest;
}

function createFilter(fn: (m: Manifest) => Manifest | Promise<Manifest>) {
  return { filter_metadata: fn } as any;
}

describe('applyManifestFilters', () => {
  test('returns manifest unchanged when filters array is empty', async () => {
    const manifest = createManifest('foo', ['1.0.0']);
    const [result, errors] = await applyManifestFilters(manifest, [], noopLogger);

    expect(result).toEqual(manifest);
    expect(errors).toEqual([]);
  });

  test('returns manifest unchanged when filters is null-ish', async () => {
    const manifest = createManifest('foo', ['1.0.0']);
    const [result, errors] = await applyManifestFilters(manifest, null as any, noopLogger);

    expect(result).toEqual(manifest);
    expect(errors).toEqual([]);
  });

  test('applies a single filter', async () => {
    const manifest = createManifest('foo', ['1.0.0', '2.0.0']);
    const filter = createFilter((m) => {
      const filtered = { ...m, versions: { ...m.versions } };
      delete filtered.versions['1.0.0'];
      return filtered;
    });

    const [result, errors] = await applyManifestFilters(manifest, [filter], noopLogger);

    expect(Object.keys(result.versions)).toEqual(['2.0.0']);
    expect(errors).toEqual([]);
  });

  test('chains multiple filters in sequence', async () => {
    const manifest = createManifest('foo', ['1.0.0', '2.0.0', '3.0.0']);

    const filterRemoveV1 = createFilter((m) => {
      const filtered = { ...m, versions: { ...m.versions } };
      delete filtered.versions['1.0.0'];
      return filtered;
    });

    const filterRemoveV2 = createFilter((m) => {
      const filtered = { ...m, versions: { ...m.versions } };
      delete filtered.versions['2.0.0'];
      return filtered;
    });

    const [result, errors] = await applyManifestFilters(
      manifest,
      [filterRemoveV1, filterRemoveV2],
      noopLogger
    );

    expect(Object.keys(result.versions)).toEqual(['3.0.0']);
    expect(errors).toEqual([]);
  });

  test('each filter receives the output of the previous filter', async () => {
    const manifest = createManifest('foo', ['1.0.0', '2.0.0']);
    const seen: string[][] = [];

    const spy = createFilter((m) => {
      seen.push(Object.keys(m.versions));
      const filtered = { ...m, versions: { ...m.versions } };
      delete filtered.versions['1.0.0'];
      return filtered;
    });

    const spy2 = createFilter((m) => {
      seen.push(Object.keys(m.versions));
      return m;
    });

    await applyManifestFilters(manifest, [spy, spy2], noopLogger);

    expect(seen[0]).toEqual(['1.0.0', '2.0.0']);
    expect(seen[1]).toEqual(['2.0.0']);
  });

  test('catches filter errors and continues with remaining filters', async () => {
    const manifest = createManifest('foo', ['1.0.0']);
    const logger = { ...noopLogger, error: vi.fn() };

    const failingFilter = createFilter(() => {
      throw new Error('filter broke');
    });

    const passingFilter = createFilter((m) => ({
      ...m,
      readme: 'modified',
    }));

    const [result, errors] = await applyManifestFilters(
      manifest,
      [failingFilter, passingFilter],
      logger
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('filter broke');
    expect(logger.error).toHaveBeenCalled();
    expect(result.readme).toBe('modified');
  });

  test('does not mutate top-level properties of the original manifest', async () => {
    const manifest = createManifest('foo', ['1.0.0', '2.0.0']);

    const filter = createFilter((m) => ({
      ...m,
      readme: 'changed',
    }));

    const [result] = await applyManifestFilters(manifest, [filter], noopLogger);

    expect(result.readme).toBe('changed');
    expect(manifest.readme).toBeUndefined();
  });

  test('handles async filters', async () => {
    const manifest = createManifest('foo', ['1.0.0', '2.0.0']);

    const asyncFilter = createFilter(async (m) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      const filtered = { ...m, versions: { ...m.versions } };
      delete filtered.versions['1.0.0'];
      return filtered;
    });

    const [result, errors] = await applyManifestFilters(manifest, [asyncFilter], noopLogger);

    expect(Object.keys(result.versions)).toEqual(['2.0.0']);
    expect(errors).toEqual([]);
  });
});
