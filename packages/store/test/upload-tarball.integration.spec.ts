import { createHash } from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PassThrough, Readable } from 'node:stream';
import type { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { setImmediate } from 'node:timers/promises';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Manifest } from '@verdaccio/types';

import * as fileUtils from '../../plugins/local-storage/src/fs';
import { Storage } from '../src';

// Exercise Store and LocalFS together from source, including real filesystem I/O.
vi.mock('@verdaccio/local-storage', () => import('../../plugins/local-storage/src'));

const cleanups: Array<() => Promise<void>> = [];
const previousContent = Buffer.from('previously published tarball');
const firstChunk = Buffer.from([0x1f, 0x8b, 0x08, 0x00, 0xff, 0x80]);
const lastChunk = Buffer.from([0x00, 0x01, 0xfe, 0x7f]);
const hash = (content: Buffer) => createHash('sha1').update(content).digest('hex');

type UploadInternals = {
  uploadTarballAsStream: (
    name: string,
    filename: string,
    options: { signal: AbortSignal }
  ) => Promise<PassThrough>;
  updatePackage: (
    name: string,
    update: (manifest: Manifest) => Promise<Manifest>
  ) => Promise<Manifest>;
};

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup();
  vi.restoreAllMocks();
});

async function createUploadFixture(pkgName = 'upload-integration') {
  const root = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'verdaccio-upload-integration-'));
  const logger: Logger = {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(),
    warn: vi.fn(),
    http: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  };
  vi.mocked(logger.child).mockReturnValue(logger);
  const config = new Config({ ...getDefaultConfig(), storage: root, uplinks: {} });
  const storage = new Storage(config, logger);
  await storage.init(config);
  const plugin = storage.localStorage.getStoragePlugin();
  const packageStorage = plugin.getPackageStorage(pkgName)!;
  vi.spyOn(plugin, 'getPackageStorage').mockReturnValue(packageStorage);
  const fileName = `${path.basename(pkgName)}-1.0.1.tgz`;
  const previousFile = `${path.basename(pkgName)}-1.0.0.tgz`;
  const manifest = generatePackageMetadata(pkgName, '1.0.0');
  manifest._attachments = { [previousFile]: { shasum: hash(previousContent) } };
  await packageStorage.createPackage(pkgName, manifest);
  const packagePath = path.join(root, pkgName);
  await fsPromises.writeFile(path.join(packagePath, previousFile), previousContent);
  const manifestPath = path.join(packagePath, 'package.json');
  const originalManifest = await fsPromises.readFile(manifestPath, 'utf8');
  const rename = vi.spyOn(fileUtils, 'renamePromise');
  const unlink = vi.spyOn(fileUtils, 'unlinkPromise');
  const internals = storage as unknown as UploadInternals;
  const updatePackage = vi.spyOn(internals, 'updatePackage');
  const success = vi.fn();
  const uploadTarballAsStream = internals.uploadTarballAsStream.bind(storage);
  vi.spyOn(internals, 'uploadTarballAsStream').mockImplementation(async (...args) => {
    const stream = await uploadTarballAsStream(...args);
    stream.on('success', success);
    return stream;
  });
  const sources: Readable[] = [];
  const destinations: Writable[] = [];
  const completions: Promise<unknown>[] = [];
  const writeTarball = packageStorage.writeTarball.bind(packageStorage);

  function start(source: Readable = new PassThrough()) {
    const controller = new AbortController();
    const ready = Promise.withResolvers<Writable>();
    const wrote = Promise.withResolvers<void>();
    let writeError: Error | undefined;
    vi.spyOn(packageStorage, 'writeTarball').mockImplementationOnce(async (...args) => {
      const destination = await writeTarball(...args);
      destinations.push(destination);
      completions.push(finished(destination, { cleanup: true }).catch((error) => error));
      const write = destination._write.bind(destination);
      // Keep real descriptors and disk writes; fail only the selected write.
      vi.spyOn(destination, '_write').mockImplementation((chunk, encoding, callback) => {
        if (writeError) return callback(writeError);
        write(chunk, encoding, (error) => {
          callback(error);
          wrote.resolve();
        });
      });
      ready.resolve(destination);
      return destination;
    });
    sources.push(source);
    completions.push(finished(source, { cleanup: true }).catch((error) => error));
    const outcome = storage
      .uploadTarball(pkgName, fileName, source, { signal: controller.signal })
      .then(
        () => undefined,
        (error: NodeJS.ErrnoException) => error
      );
    completions.push(outcome);
    return {
      source,
      controller,
      ready,
      outcome,
      async writeFirstChunk() {
        const destination = await ready.promise;
        (source as PassThrough).write(firstChunk);
        await wrote.promise;
        expect(await fsPromises.readFile((destination as fs.WriteStream).path)).toEqual(firstChunk);
        return destination;
      },
      failNextWrite(error: Error) {
        writeError = error;
      },
    };
  }

  async function settle() {
    await Promise.all(completions);
    // Await actual side effects even if a rejected upload has queued close work.
    await Promise.allSettled([
      ...updatePackage.mock.results.map((result) => result.value),
      ...rename.mock.results.map((result) => result.value),
      ...unlink.mock.results.map((result) => result.value),
    ]);
  }

  cleanups.push(async () => {
    sources.forEach((source) => source.destroy());
    destinations.forEach((destination) => destination.destroy());
    await settle();
    await fsPromises.rm(root, { recursive: true, force: true });
  });

  async function expectPreviousFiles() {
    expect(await fsPromises.readFile(path.join(packagePath, previousFile))).toEqual(
      previousContent
    );
  }

  async function expectFailed(outcome: ReturnType<typeof start>['outcome'], code: string) {
    expect(await outcome).toMatchObject({ code });
    await settle();
    expect(success).not.toHaveBeenCalled();
    expect(updatePackage).not.toHaveBeenCalled();
    expect(await fsPromises.readFile(manifestPath, 'utf8')).toBe(originalManifest);
    expect((await fsPromises.readdir(packagePath)).sort()).toEqual(
      ['package.json', previousFile].sort()
    );
    expect(await packageStorage.hasTarball(fileName)).toBe(false);
    await expectPreviousFiles();
  }

  async function expectSuccessful(content: Buffer) {
    expect(success).toHaveBeenCalledTimes(1);
    expect(updatePackage).toHaveBeenCalledTimes(1);
    const saved = JSON.parse(await fsPromises.readFile(manifestPath, 'utf8'));
    expect(saved._attachments).toEqual({
      [previousFile]: { shasum: hash(previousContent) },
      [fileName]: { shasum: hash(content) },
    });
    expect(saved.versions).toEqual(manifest.versions);
    expect(saved['dist-tags']).toEqual(manifest['dist-tags']);
    expect((await fsPromises.readdir(packagePath)).sort()).toEqual(
      ['package.json', previousFile, fileName].sort()
    );
    expect(await packageStorage.hasTarball(fileName)).toBe(true);
    const downloaded: Buffer[] = [];
    const download = await packageStorage.readTarball(fileName, {
      signal: new AbortController().signal,
    });
    for await (const chunk of download) downloaded.push(Buffer.from(chunk));
    expect(Buffer.concat(downloaded)).toEqual(content);
    await expectPreviousFiles();
  }

  return {
    start,
    settle,
    expectFailed,
    expectSuccessful,
    packageStorage,
    packagePath,
    manifestPath,
    originalManifest,
    fileName,
    rename,
    updatePackage,
    success,
  };
}

describe.each(['upload-integration', '@scope/upload-integration'])(
  'real tarball uploads for %s',
  (pkgName) => {
    test.each(['disk full', 'source error', 'source close', 'destination close', 'abort'] as const)(
      'cleans partial data after %s, preserves previous files and permits a retry',
      async (failure) => {
        const fixture = await createUploadFixture(pkgName);
        const upload = fixture.start();
        const destination = await upload.writeFirstChunk();
        let code: string;
        switch (failure) {
          case 'disk full':
            code = 'ENOSPC';
            upload.failNextWrite(Object.assign(new Error('disk full'), { code }));
            (upload.source as PassThrough).end(lastChunk);
            break;
          case 'source error':
            code = 'ECONNRESET';
            upload.source.destroy(Object.assign(new Error('client disconnected'), { code }));
            break;
          case 'source close':
            code = 'ERR_STREAM_PREMATURE_CLOSE';
            upload.source.destroy();
            break;
          case 'destination close':
            code = 'ERR_STREAM_PREMATURE_CLOSE';
            destination.destroy();
            break;
          case 'abort':
            code = 'ABORT_ERR';
            upload.controller.abort();
            break;
        }
        await fixture.expectFailed(upload.outcome, code);
        const content = Buffer.concat([firstChunk, lastChunk]);
        const retry = fixture.start(Readable.from([firstChunk, lastChunk]));
        expect(await retry.outcome).toBeUndefined();
        await fixture.expectSuccessful(content);
      }
    );

    test.each([
      { name: 'one binary chunk', chunks: [Buffer.concat([firstChunk, lastChunk])] },
      {
        name: 'many binary chunks exceeding the stream buffer',
        chunks: Array.from({ length: 97 }, (_, index) => Buffer.alloc(4093, index + 128)),
      },
      { name: 'an empty stream', chunks: [] as Buffer[] },
    ])(
      'stores and reads $name with the complete hash and exactly one success',
      async ({ chunks }) => {
        const fixture = await createUploadFixture(pkgName);
        const content = Buffer.concat(chunks);
        const upload = fixture.start(Readable.from(chunks));
        expect(await upload.outcome).toBeUndefined();
        // No extra wait for a rename: success must mean the final file can be read.
        await fixture.expectSuccessful(content);
        await fixture.settle();
        expect(fixture.success).toHaveBeenCalledTimes(1);
        expect(fixture.updatePackage).toHaveBeenCalledTimes(1);
      }
    );

    test('rejects a duplicate upload without overwriting its file or metadata', async () => {
      const fixture = await createUploadFixture(pkgName);
      expect(await fixture.start(Readable.from([firstChunk])).outcome).toBeUndefined();
      await fixture.expectSuccessful(firstChunk);
      const originalManifest = await fsPromises.readFile(fixture.manifestPath, 'utf8');
      const duplicate = fixture.start(Readable.from([lastChunk]));
      expect(await duplicate.outcome).toMatchObject({ statusCode: 409 });
      await fixture.settle();
      expect(await fsPromises.readFile(fixture.manifestPath, 'utf8')).toBe(originalManifest);
      await fixture.expectSuccessful(firstChunk);
    });
  }
);

describe('upload completion ordering', () => {
  test('waits for the final rename before updating metadata or announcing success', async () => {
    const fixture = await createUploadFixture();
    const renaming = Promise.withResolvers<void>();
    const releaseRename = Promise.withResolvers<void>();
    fixture.rename.mockImplementationOnce(async (...args) => {
      renaming.resolve();
      await releaseRename.promise;
      await fsPromises.rename(...args);
    });
    const upload = fixture.start(Readable.from([firstChunk, lastChunk]));
    try {
      await renaming.promise;
      await setImmediate();
      expect(fixture.updatePackage).not.toHaveBeenCalled();
      expect(fixture.success).not.toHaveBeenCalled();
      expect(fs.existsSync(path.join(fixture.packagePath, fixture.fileName))).toBe(false);
    } finally {
      releaseRename.resolve();
    }
    expect(await upload.outcome).toBeUndefined();
    await fixture.expectSuccessful(Buffer.concat([firstChunk, lastChunk]));
  });

  test('rejects a rename failure without recording an attachment and allows a retry', async () => {
    const fixture = await createUploadFixture();
    fixture.rename.mockRejectedValueOnce(
      Object.assign(new Error('rename denied'), { code: 'EACCES' })
    );
    const upload = fixture.start(Readable.from([firstChunk]));
    await fixture.expectFailed(upload.outcome, 'EACCES');
    expect(await fixture.start(Readable.from([firstChunk, lastChunk])).outcome).toBeUndefined();
    await fixture.expectSuccessful(Buffer.concat([firstChunk, lastChunk]));
  });

  test('waits for metadata persistence before announcing success', async () => {
    const fixture = await createUploadFixture();
    const saving = Promise.withResolvers<void>();
    const releaseSave = Promise.withResolvers<void>();
    const savePackage = fixture.packageStorage.savePackage.bind(fixture.packageStorage);
    vi.spyOn(fixture.packageStorage, 'savePackage').mockImplementationOnce(async (...args) => {
      saving.resolve();
      await releaseSave.promise;
      await savePackage(...args);
    });
    const upload = fixture.start(Readable.from([firstChunk]));
    const completed = vi.fn();
    void upload.outcome.then(completed);
    try {
      await saving.promise;
      await setImmediate();
      expect(completed).not.toHaveBeenCalled();
      expect(fixture.success).not.toHaveBeenCalled();
      expect(await fsPromises.readFile(fixture.manifestPath, 'utf8')).toBe(
        fixture.originalManifest
      );
    } finally {
      releaseSave.resolve();
    }
    expect(await upload.outcome).toBeUndefined();
    await fixture.expectSuccessful(firstChunk);
  });

  test('rejects a metadata write failure without announcing success', async () => {
    const fixture = await createUploadFixture();
    const error = Object.assign(new Error('metadata disk full'), { code: 'ENOSPC' });
    vi.spyOn(fixture.packageStorage, 'savePackage').mockRejectedValueOnce(error);
    const upload = fixture.start(Readable.from([firstChunk]));
    expect(await upload.outcome).toBe(error);
    await fixture.settle();
    expect(fixture.updatePackage).toHaveBeenCalledTimes(1);
    expect(fixture.success).not.toHaveBeenCalled();
    expect(await fsPromises.readFile(fixture.manifestPath, 'utf8')).toBe(fixture.originalManifest);
  });
});
