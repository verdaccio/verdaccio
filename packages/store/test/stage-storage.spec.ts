import { pseudoRandomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { UUID_PATTERN } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import type { Logger } from '@verdaccio/types';

import { STAGE_NAMESPACE, type StageStorage, Storage, toStagePackageVersion } from '../src';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'fatal' });
});

function generateRandomStorage(): string {
  const tempStorage = pseudoRandomBytes(5).toString('hex');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-stage-'));

  return path.join(tempRoot, tempStorage);
}

/**
 * Builds a `StageStorage` backed by the real `@verdaccio/local-storage` plugin
 * on a throwaway folder, so the stream/rename behaviour of a production plugin
 * is exercised rather than mocked.
 */
async function buildStageStorage(): Promise<{
  stage: StageStorage;
  storagePath: string;
  storage: Storage;
}> {
  const storagePath = generateRandomStorage();
  const config = new Config({ ...getDefaultConfig(), storage: storagePath } as any);
  const storage = new Storage(config, logger);
  await storage.init(config);

  return { stage: storage.getStageStorage(), storagePath, storage };
}

/**
 * Make the storage plugin behave like one that never emits `'open'`.
 *
 * `StorageHandler.writeTarball` only promises a Writable; the two bundled
 * plugins emit `'open'` but the interface does not require it, and a plugin
 * that does not must still be able to stage. Writes still reach the real
 * stream, so only the event is withheld.
 */
function withholdOpenEvent(storage: Storage): void {
  const plugin: any = (storage as any).localStorage.getStoragePlugin();
  const getPackageStorage = plugin.getPackageStorage.bind(plugin);

  plugin.getPackageStorage = (name: string) => {
    const handler = getPackageStorage(name);
    if (!handler) {
      return handler;
    }
    const writeTarball = handler.writeTarball.bind(handler);
    handler.writeTarball = async (...args: unknown[]) => {
      const stream: any = await writeTarball(...args);
      const on = stream.on.bind(stream);
      stream.on = (event: string, listener: (...a: any[]) => void) =>
        event === 'open' ? stream : on(event, listener);
      return stream;
    };
    return handler;
  };
}

const tarball = Buffer.from('a-tarball-payload');

function addInput(overrides: Partial<Parameters<StageStorage['add']>[0]> = {}) {
  return {
    packageName: 'foo',
    version: '1.0.0',
    tag: 'latest',
    actor: 'jota',
    access: 'public' as const,
    shasum: 'aaaabbbbccccddddeeeeffff0000111122223333',
    tarballFilename: 'foo-1.0.0.tgz',
    packument: { name: 'foo', versions: { '1.0.0': { name: 'foo', version: '1.0.0' } } } as any,
    ...overrides,
  };
}

const signal = new AbortController().signal;

describe('StageStorage', () => {
  describe('add', () => {
    test('should stage against a plugin that never emits open', async () => {
      const { stage, storage } = await buildStageStorage();
      withholdOpenEvent(storage);

      const record = await stage.add(addInput(), tarball, { signal });

      const stream = await stage.readTarball(record.id, { signal });
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
      }
      expect(Buffer.concat(chunks)).toEqual(tarball);
    });

    test('should persist a record with a uuid id', async () => {
      const { stage } = await buildStageStorage();

      const record = await stage.add(addInput(), tarball, { signal });

      // the npm CLI validates the id format before it even calls the registry
      expect(record.id).toMatch(UUID_PATTERN);
      expect(record.packageName).toBe('foo');
      expect(record.version).toBe('1.0.0');
      expect(record.actorType).toBe('user');
      expect(record.createdAt).toEqual(expect.any(String));
    });

    test('should store the staged item under the stage namespace', async () => {
      const { stage, storagePath } = await buildStageStorage();

      const record = await stage.add(addInput(), tarball, { signal });

      const itemFolder = path.join(storagePath, STAGE_NAMESPACE, record.id);
      expect(fs.existsSync(path.join(itemFolder, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(itemFolder, 'foo-1.0.0.tgz'))).toBe(true);
    });

    test('should refuse a tarball name that escapes the item folder', async () => {
      const { stage } = await buildStageStorage();

      // the name comes from the `_attachments` key of the request, so it is
      // attacker controlled; `..` used to reach the plugin and crash the process
      for (const bad of ['..', '../escape.tgz', '../../../evil.tgz', '']) {
        await expect(
          stage.add(addInput({ tarballFilename: bad }), tarball, { signal })
        ).rejects.toMatchObject({ code: 400 });
      }
    });

    test('should keep the tarball byte identical', async () => {
      const { stage } = await buildStageStorage();
      const record = await stage.add(addInput(), tarball, { signal });

      const stream = await stage.readTarball(record.id, { signal });
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
      }

      expect(Buffer.concat(chunks).equals(tarball)).toBe(true);
    });

    test('should reject concurrent duplicates for the same package version', async () => {
      const { stage } = await buildStageStorage();

      const results = await Promise.allSettled([
        stage.add(addInput(), tarball, { signal }),
        stage.add(addInput(), tarball, { signal }),
      ]);

      expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
      const rejected = results.find((result) => result.status === 'rejected');
      expect(rejected).toMatchObject({
        reason: { code: 409 },
      });
      await expect(stage.list()).resolves.toHaveLength(1);
    });
  });

  describe('list', () => {
    test('should return an empty list when nothing was staged', async () => {
      const { stage } = await buildStageStorage();

      await expect(stage.list()).resolves.toEqual([]);
    });

    test('should return the newest staged item first', async () => {
      const { stage } = await buildStageStorage();

      await stage.add(addInput({ version: '1.0.0' }), tarball, { signal });
      await stage.add(addInput({ version: '2.0.0' }), tarball, { signal });

      const items = await stage.list();
      expect(items.map((item) => item.version)).toEqual(['2.0.0', '1.0.0']);
    });

    test('should narrow the list to a single package name', async () => {
      const { stage } = await buildStageStorage();

      await stage.add(addInput({ packageName: 'foo' }), tarball, { signal });
      await stage.add(addInput({ packageName: 'bar' }), tarball, { signal });

      const items = await stage.list({ packageName: 'bar' });
      expect(items).toHaveLength(1);
      expect(items[0].packageName).toBe('bar');
    });

    test('should not lose entries when items are staged concurrently', async () => {
      const { stage } = await buildStageStorage();

      // a read-modify-write on the index would drop entries here
      await Promise.all(
        ['1.0.0', '2.0.0', '3.0.0', '4.0.0', '5.0.0'].map((version) =>
          stage.add(addInput({ version }), tarball, { signal })
        )
      );

      const items = await stage.list();
      expect(items).toHaveLength(5);
      expect(new Set(items.map((item) => item.version)).size).toBe(5);
    });
  });

  describe('get', () => {
    test('should read back a staged item by id', async () => {
      const { stage } = await buildStageStorage();
      const record = await stage.add(addInput(), tarball, { signal });

      await expect(stage.get(record.id)).resolves.toEqual(record);
    });

    test('should resolve undefined for an unknown id', async () => {
      const { stage } = await buildStageStorage();

      await expect(stage.get('does-not-exist')).resolves.toBeUndefined();
    });

    test('should find a staged item by package and version', async () => {
      const { stage } = await buildStageStorage();
      await stage.add(addInput(), tarball, { signal });

      await expect(stage.findByVersion('foo', '1.0.0')).resolves.toMatchObject({
        packageName: 'foo',
        version: '1.0.0',
      });
      await expect(stage.findByVersion('foo', '9.9.9')).resolves.toBeUndefined();
    });

    test('should keep the publish payload for approval', async () => {
      const { stage } = await buildStageStorage();
      const record = await stage.add(addInput(), tarball, { signal });

      await expect(stage.getPackument(record.id)).resolves.toMatchObject({ name: 'foo' });
    });

    test('should resolve undefined asking for the payload of an unknown id', async () => {
      const { stage } = await buildStageStorage();

      await expect(stage.getPackument('does-not-exist')).resolves.toBeUndefined();
    });
  });

  describe('remove', () => {
    test('should drop the item, its tarball and its index entry', async () => {
      const { stage, storagePath } = await buildStageStorage();
      const record = await stage.add(addInput(), tarball, { signal });

      await expect(stage.remove(record.id)).resolves.toBe(true);

      await expect(stage.get(record.id)).resolves.toBeUndefined();
      await expect(stage.list()).resolves.toEqual([]);
      expect(fs.existsSync(path.join(storagePath, STAGE_NAMESPACE, record.id))).toBe(false);
    });

    test('should report false for an unknown id', async () => {
      const { stage } = await buildStageStorage();

      await expect(stage.remove('does-not-exist')).resolves.toBe(false);
    });

    test('should leave the other staged items untouched', async () => {
      const { stage } = await buildStageStorage();
      const removed = await stage.add(addInput({ version: '1.0.0' }), tarball, { signal });
      const kept = await stage.add(addInput({ version: '2.0.0' }), tarball, { signal });

      await stage.remove(removed.id);

      await expect(stage.list()).resolves.toEqual([kept]);
    });
  });

  describe('readTarball', () => {
    test('should reject an unknown id with 404', async () => {
      const { stage } = await buildStageStorage();

      await expect(stage.readTarball('does-not-exist', { signal })).rejects.toMatchObject({
        code: 404,
      });
    });
  });

  describe('visibility', () => {
    test('should not register the stage namespace in the plugin database', async () => {
      const storagePath = generateRandomStorage();
      const config = new Config({ ...getDefaultConfig(), storage: storagePath } as any);
      const storage = new Storage(config, logger);
      await storage.init(config);

      await storage.getStageStorage().add(addInput(), tarball, { signal });

      // registering it would leak the staged items into search and the web UI
      const packages = await storage.localStorage.getStoragePlugin().get();
      expect(packages).not.toContain(STAGE_NAMESPACE);
      expect(packages.some((name) => name.startsWith(STAGE_NAMESPACE))).toBe(false);
    });
  });

  describe('toStagePackageVersion', () => {
    test('should strip the internal tarball filename', async () => {
      const { stage } = await buildStageStorage();
      const record = await stage.add(addInput(), tarball, { signal });

      const serialized = toStagePackageVersion(record);

      expect(serialized).not.toHaveProperty('tarballFilename');
      expect(serialized).toMatchObject({ id: record.id, packageName: 'foo', version: '1.0.0' });
    });
  });

  describe('Storage.getStageStorage', () => {
    test('should memoize the instance so index writes stay serialized', async () => {
      const config = new Config({ ...getDefaultConfig(), storage: generateRandomStorage() } as any);
      const storage = new Storage(config, logger);
      await storage.init(config);

      expect(storage.getStageStorage()).toBe(storage.getStageStorage());
    });
  });
});
