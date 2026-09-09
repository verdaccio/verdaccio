import { describe, expect, test } from 'vitest';

import { destPathFor } from '../src/commands/storage/storage-copy';

describe('destPathFor', () => {
  test('unscoped package', () => {
    expect(destPathFor('/dest', 'lodash')).toBe('/dest/lodash');
  });
  test('scoped package keeps the @scope segment', () => {
    expect(destPathFor('/dest', '@babel/core')).toBe('/dest/@babel/core');
  });
});

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { listPackagesOnDisk } from '../src/commands/storage/storage-copy';

describe('listPackagesOnDisk', () => {
  test('finds top-level and scoped packages, ignores non-packages', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-storage-'));
    await fs.mkdir(path.join(root, 'react'));
    await fs.writeFile(path.join(root, 'react', 'package.json'), '{}');
    await fs.mkdir(path.join(root, '@scope', 'a'), { recursive: true });
    await fs.writeFile(path.join(root, '@scope', 'a', 'package.json'), '{}');
    await fs.mkdir(path.join(root, 'not-a-package')); // no package.json
    await fs.writeFile(path.join(root, '.verdaccio-db.json'), '{}');

    const names = (await listPackagesOnDisk(root)).sort();
    expect(names).toEqual(['@scope/a', 'react']);
    await fs.rm(root, { recursive: true, force: true });
  });

  test('returns empty for a missing directory', async () => {
    expect(await listPackagesOnDisk('/no/such/dir/at/all')).toEqual([]);
  });
});

import { isFilesystemBackend } from '../src/commands/storage/storage-copy';

describe('isFilesystemBackend', () => {
  test('true when the handler exposes a path (local-storage)', () => {
    const plugin = { getPackageStorage: () => ({ path: '/data/storage/pkg' }) };
    expect(isFilesystemBackend(plugin, 'pkg')).toBe(true);
  });

  test('false when the handler has no path (e.g. S3/GCS plugin)', () => {
    const plugin = {
      getPackageStorage: () => ({ deletePackage: () => {}, removePackage: () => {} }),
    };
    expect(isFilesystemBackend(plugin, 'pkg')).toBe(false);
  });

  test('false when the plugin returns no handler (empty-registry probe)', () => {
    const plugin = { getPackageStorage: () => undefined };
    expect(isFilesystemBackend(plugin, 'verdaccio-probe')).toBe(false);
  });
});

import { vi } from 'vitest';
import { copyPackage, emptyDirProblem } from '../src/commands/storage/storage-copy';

describe('emptyDirProblem', () => {
  test('null for a missing target or an empty directory', async () => {
    expect(await emptyDirProblem('/no/such/dir/at/all')).toBe(null);
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-empty-'));
    expect(await emptyDirProblem(dir)).toBe(null);
    await fs.rm(dir, { recursive: true, force: true });
  });

  test('reports a regular file and a non-empty directory', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-full-'));
    const file = path.join(dir, 'a-file');
    await fs.writeFile(file, 'x');
    expect(await emptyDirProblem(file)).toBe('not a directory');
    expect(await emptyDirProblem(dir)).toBe('not empty');
    await fs.rm(dir, { recursive: true, force: true });
  });
});

describe('copyPackage', () => {
  test('rejects when source and destination are the same directory', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-same-'));
    await fs.writeFile(path.join(dir, 'package.json'), '{}');
    await expect(copyPackage(dir, dir)).rejects.toThrow(/same directory/);
    // the source must still be intact
    expect(await fs.readdir(dir)).toEqual(['package.json']);
    await fs.rm(dir, { recursive: true, force: true });
  });

  test('a failed overwrite keeps the existing destination package', async () => {
    const src = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-fail-src-'));
    const dest = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-fail-dest-'));
    const destPkg = path.join(dest, 'pkg');
    await fs.writeFile(path.join(src, 'package.json'), '{"v":"new"}');
    await fs.mkdir(destPkg);
    await fs.writeFile(path.join(destPkg, 'package.json'), '{"v":"old"}');

    vi.spyOn(fs, 'cp').mockRejectedValueOnce(new Error('disk full'));
    await expect(copyPackage(src, destPkg)).rejects.toThrow('disk full');
    expect(await fs.readFile(path.join(destPkg, 'package.json'), 'utf8')).toBe('{"v":"old"}');
    vi.restoreAllMocks();
    await fs.rm(src, { recursive: true, force: true });
    await fs.rm(dest, { recursive: true, force: true });
  });

  test('overwriting replaces the destination — stale files do not survive', async () => {
    const src = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-cp-src-'));
    const dest = await fs.mkdtemp(path.join(os.tmpdir(), 'vc-cp-dest-'));
    const destPkg = path.join(dest, 'pkg');
    await fs.writeFile(path.join(src, 'package.json'), '{"v":"new"}');
    await fs.writeFile(path.join(src, 'pkg-2.0.0.tgz'), 'T2');
    await fs.mkdir(destPkg);
    await fs.writeFile(path.join(destPkg, 'package.json'), '{"v":"old"}');
    await fs.writeFile(path.join(destPkg, 'pkg-1.0.0.tgz'), 'T1'); // only in dest

    await copyPackage(src, destPkg);
    expect((await fs.readdir(destPkg)).sort()).toEqual(['package.json', 'pkg-2.0.0.tgz']);
    expect(await fs.readFile(path.join(destPkg, 'package.json'), 'utf8')).toBe('{"v":"new"}');
    await fs.rm(src, { recursive: true, force: true });
    await fs.rm(dest, { recursive: true, force: true });
  });
});

import { promises as fsp } from 'node:fs';
import {
  copyState,
  isDefaultLocalStorage,
  resolveStorageRoot,
} from '../src/commands/storage/storage-copy';

describe('isDefaultLocalStorage', () => {
  test('true when no store plugin is configured', () => {
    expect(isDefaultLocalStorage({})).toBe(true);
    expect(isDefaultLocalStorage({ store: {} })).toBe(true);
  });
  test('false when a storage plugin is configured', () => {
    expect(isDefaultLocalStorage({ store: { 'aws-s3-storage': {} } })).toBe(false);
  });
});

describe('resolveStorageRoot', () => {
  test('absolute storage is returned as-is', () => {
    expect(resolveStorageRoot({ storage: '/data/storage', configPath: '/etc/config.yaml' })).toBe(
      '/data/storage'
    );
  });
  test('relative storage resolves against the config directory', () => {
    expect(
      resolveStorageRoot({ storage: './storage', configPath: '/etc/verdaccio/config.yaml' })
    ).toBe('/etc/verdaccio/storage');
  });
  test('null when storage is missing', () => {
    expect(resolveStorageRoot({ configPath: '/etc/config.yaml' })).toBe(null);
  });
});

describe('copyState', () => {
  test('copies db/token/stage when absent, preserves them when present', async () => {
    const src = await fsp.mkdtemp(path.join(os.tmpdir(), 'vc-src-'));
    const dest = await fsp.mkdtemp(path.join(os.tmpdir(), 'vc-dest-'));
    await fsp.writeFile(path.join(src, '.verdaccio-db.json'), 'SRC-DB');
    await fsp.writeFile(path.join(src, '.token-db.json'), 'SRC-TOKEN');
    await fsp.mkdir(path.join(src, '.stage'));
    await fsp.writeFile(path.join(src, '.stage', 'x'), 'S');
    // dest already has a db that must be preserved
    await fsp.writeFile(path.join(dest, '.verdaccio-db.json'), 'DEST-DB');

    const result = await copyState(src, dest);
    expect(result.preserved).toContain('.verdaccio-db.json');
    expect(result.copied.sort()).toEqual(['.stage', '.token-db.json']);
    expect(await fsp.readFile(path.join(dest, '.verdaccio-db.json'), 'utf8')).toBe('DEST-DB');
    expect(await fsp.readFile(path.join(dest, '.token-db.json'), 'utf8')).toBe('SRC-TOKEN');
    await fsp.rm(src, { recursive: true, force: true });
    await fsp.rm(dest, { recursive: true, force: true });
  });
});
