import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { extractTarballMetadata } from '@verdaccio/tarball';
import type * as TarballModule from '@verdaccio/tarball';
import type { TarballMetadata } from '@verdaccio/tarball';
import {
  generatePackageMetadata,
  generatePackageMetadataWithTarball,
  generateTarball,
} from '@verdaccio/test-helper';
import type { Logger, Manifest, Version } from '@verdaccio/types';

import { Storage } from '../src';

vi.mock('@verdaccio/tarball', async (importOriginal) => {
  const original = await importOriginal<typeof TarballModule>();
  return { ...original, extractTarballMetadata: vi.fn(original.extractTarballMetadata) };
});

type StorageInternals = {
  saveTarballStats: (name: string, filename: string, metadata: TarballMetadata) => Promise<void>;
  updatePackage: (
    name: string,
    update: (manifest: Manifest) => Promise<Manifest>
  ) => Promise<Manifest>;
};

const pkgName = 'foo';
const filename = 'foo-1.0.0.tgz';
const requestOptions = { host: 'localhost', protocol: 'http', headers: {} };
const roots: string[] = [];

afterEach(async () => {
  vi.mocked(extractTarballMetadata).mockClear();
  vi.restoreAllMocks();
  await Promise.all(roots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
});

function createLogger(): Logger {
  const logger = {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    http: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn(),
  } as unknown as Logger;
  vi.mocked(logger.child).mockReturnValue(logger);
  return logger;
}

async function createStorage({
  tarballMetadata = true,
  root,
}: { tarballMetadata?: boolean; root?: string } = {}) {
  if (!root) {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'verdaccio-tarball-metadata-'));
    roots.push(root);
  }
  const logger = createLogger();
  const config = new Config({
    ...getDefaultConfig(),
    storage: root,
    uplinks: {},
    packages: { '**': { access: '$all', publish: '$all' } },
    flags: { tarballMetadata },
  });
  const storage = new Storage(config, logger);
  await storage.init(config);
  return { storage, logger, root };
}

async function publish(storage: Storage, readme: string): Promise<void> {
  const tarball = await generateTarball({
    'package/package.json': JSON.stringify({ name: pkgName, version: '1.0.0' }),
    'package/README.md': readme,
  });
  const manifest = generatePackageMetadataWithTarball(pkgName, '1.0.0', tarball, '# manifest');
  await storage.updateManifest(manifest, {
    signal: new AbortController().signal,
    name: pkgName,
    uplinksLook: false,
    revision: '1',
    requestOptions,
  });
}

const storedVersion = async (storage: Storage): Promise<Version> =>
  (await storage.getPackageLocalMetadata(pkgName)).versions['1.0.0'];

const createCachedVersion = async (storage: Storage, dist: Partial<Version['dist']>) => {
  const manifest = generatePackageMetadata(pkgName, '1.0.0');
  Object.assign(manifest.versions['1.0.0'].dist, dist);
  const plugin = storage.localStorage.getStoragePlugin();
  await plugin.getPackageStorage(pkgName)!.createPackage(pkgName, manifest);
  return manifest.versions['1.0.0'];
};

describe('Storage.getTarballReadme', () => {
  test('publishing unpacks the tarball once in the background and caches its README', async () => {
    const { storage, logger } = await createStorage();
    await publish(storage, '# from the tarball');
    await vi.waitFor(() =>
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({ name: pkgName, filename, readme: 'yes' }),
        expect.stringContaining('tarball metadata for')
      )
    );

    await expect(storage.getTarballReadme(pkgName, await storedVersion(storage))).resolves.toBe(
      '# from the tarball'
    );
    expect(extractTarballMetadata).toHaveBeenCalledTimes(1);
  });

  test('reads the README of a stored tarball on demand', async () => {
    const { storage: publisher, root } = await createStorage({ tarballMetadata: false });
    await publish(publisher, '# from the tarball');
    expect(extractTarballMetadata).not.toHaveBeenCalled();

    const { storage } = await createStorage({ root });
    await expect(storage.getTarballReadme(pkgName, await storedVersion(storage))).resolves.toBe(
      '# from the tarball'
    );
    expect(extractTarballMetadata).toHaveBeenCalledTimes(1);
  });

  test('returns undefined while the flag is off', async () => {
    const { storage } = await createStorage({ tarballMetadata: false });
    await publish(storage, '# from the tarball');

    await expect(
      storage.getTarballReadme(pkgName, await storedVersion(storage))
    ).resolves.toBeUndefined();
    expect(extractTarballMetadata).not.toHaveBeenCalled();
  });

  test('returns undefined for a version without a tarball URL', async () => {
    const { storage } = await createStorage();
    const version = { ...(await createCachedVersion(storage, {})), dist: {} } as unknown as Version;

    await expect(storage.getTarballReadme(pkgName, version)).resolves.toBeUndefined();
    expect(extractTarballMetadata).not.toHaveBeenCalled();
  });

  test('returns undefined and logs when the tarball cannot be read', async () => {
    const { storage, logger } = await createStorage();
    const version = await createCachedVersion(storage, {});

    await expect(storage.getTarballReadme(pkgName, version)).resolves.toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ name: pkgName, filename, err: expect.any(Error) }),
      expect.stringContaining('tarball metadata for')
    );
  });
});

describe('Storage.saveTarballStats', () => {
  const metadata: TarballMetadata = { fileCount: 2, unpackedSize: 999, readme: '# foo' };

  async function createStorageWithVersion(dist: Partial<Version['dist']>) {
    const { storage } = await createStorage();
    await createCachedVersion(storage, dist);
    const internals = storage as unknown as StorageInternals;
    const updatePackage = vi.spyOn(internals, 'updatePackage');
    return { storage, internals, updatePackage };
  }

  test('fills only the stats the version lacks', async () => {
    const { storage, internals } = await createStorageWithVersion({ unpackedSize: 12345 });

    await internals.saveTarballStats(pkgName, filename, metadata);

    expect((await storedVersion(storage)).dist).toMatchObject({
      fileCount: 2,
      unpackedSize: 12345,
    });
  });

  test('does not rewrite a version that already has both stats', async () => {
    const { storage, internals, updatePackage } = await createStorageWithVersion({
      fileCount: 7,
      unpackedSize: 12345,
    });

    await internals.saveTarballStats(pkgName, filename, metadata);

    expect(updatePackage).not.toHaveBeenCalled();
    expect((await storedVersion(storage)).dist).toMatchObject({
      fileCount: 7,
      unpackedSize: 12345,
    });
  });

  test('ignores a tarball that no version references', async () => {
    const { storage, internals, updatePackage } = await createStorageWithVersion({});

    await internals.saveTarballStats(pkgName, 'foo-9.9.9.tgz', metadata);

    expect(updatePackage).not.toHaveBeenCalled();
    expect((await storedVersion(storage)).dist).not.toHaveProperty('fileCount');
  });
});
