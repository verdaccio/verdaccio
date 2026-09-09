import { describe, expect, test, vi } from 'vitest';

import type { Manifest } from '@verdaccio/types';

import {
  getCachedTarballNames,
  isCachedPackage,
  removeCachedPackage,
} from '../src/commands/storage/access';

function manifest(partial: Partial<Manifest>): Manifest {
  return { _uplinks: {}, _attachments: {}, versions: {}, ...partial } as Manifest;
}

describe('isCachedPackage', () => {
  test('true when synced from an uplink and no local tarballs', () => {
    expect(isCachedPackage(manifest({ _uplinks: { npmjs: { etag: 'x', fetched: 1 } } }))).toBe(
      true
    );
  });

  test('false for a locally published package', () => {
    expect(
      isCachedPackage(manifest({ _attachments: { 'pkg-1.0.0.tgz': { shasum: 'a' } as any } }))
    ).toBe(false);
  });

  test('false when it has both uplinks and local attachments', () => {
    expect(
      isCachedPackage(
        manifest({
          _uplinks: { npmjs: { etag: 'x', fetched: 1 } },
          _attachments: { 'pkg-1.0.0.tgz': { shasum: 'a' } as any },
        })
      )
    ).toBe(false);
  });

  test('false when neither uplinks nor attachments', () => {
    expect(isCachedPackage(manifest({}))).toBe(false);
  });
});

describe('getCachedTarballNames', () => {
  test('collects tarball basenames across versions, deduped', () => {
    const manifest = {
      versions: {
        '1.0.0': { dist: { tarball: 'https://registry.npmjs.org/p/-/p-1.0.0.tgz' } },
        '1.1.0': { dist: { tarball: 'https://registry.npmjs.org/p/-/p-1.1.0.tgz' } },
      },
    } as unknown as Manifest;
    expect(getCachedTarballNames(manifest)).toEqual(['p-1.0.0.tgz', 'p-1.1.0.tgz']);
  });

  test('empty when no versions', () => {
    expect(getCachedTarballNames({ versions: {} } as unknown as Manifest)).toEqual([]);
  });
});

describe('removeCachedPackage', () => {
  test('deletes every tarball, package.json, folder and db entry', async () => {
    const deletePackage = vi.fn().mockResolvedValue(undefined);
    const removePackage = vi.fn().mockResolvedValue(undefined);
    const remove = vi.fn().mockResolvedValue(undefined);
    const plugin = { getPackageStorage: () => ({ deletePackage, removePackage }), remove };

    await removeCachedPackage(plugin, 'p', ['p-1.0.0.tgz', 'p-1.1.0.tgz']);

    expect(deletePackage.mock.calls.map((c) => c[0])).toEqual([
      'p-1.0.0.tgz',
      'p-1.1.0.tgz',
      'package.json',
    ]);
    expect(removePackage).toHaveBeenCalledWith('p');
    expect(remove).toHaveBeenCalledWith('p');
  });

  test('ignores ENOENT on a missing file but still removes the rest', async () => {
    const deletePackage = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'ENOENT' }))
      .mockResolvedValue(undefined);
    const removePackage = vi.fn().mockResolvedValue(undefined);
    const remove = vi.fn().mockResolvedValue(undefined);
    const plugin = { getPackageStorage: () => ({ deletePackage, removePackage }), remove };

    await expect(removeCachedPackage(plugin, 'p', ['gone.tgz'])).resolves.toBeUndefined();
    expect(removePackage).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  test('rethrows non-ENOENT errors', async () => {
    const deletePackage = vi
      .fn()
      .mockRejectedValue(Object.assign(new Error('EACCES'), { code: 'EACCES' }));
    const plugin = {
      getPackageStorage: () => ({ deletePackage, removePackage: vi.fn() }),
      remove: vi.fn(),
    };
    await expect(removeCachedPackage(plugin, 'p', ['x.tgz'])).rejects.toThrow('EACCES');
  });
});
