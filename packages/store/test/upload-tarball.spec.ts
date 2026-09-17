import { createHash } from 'node:crypto';
import { finished } from 'node:stream/promises';
import { PassThrough, Writable } from 'node:stream';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Manifest } from '@verdaccio/types';

import { Storage } from '../src';

const pkgName = 'upload-failure';
const fileName = `${pkgName}-1.0.1.tgz`;
const firstChunk = Buffer.from('first part of the tarball');
const lastChunk = Buffer.from('remaining tarball content');

// Observe the real stream and metadata operation without replacing their behavior.
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

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) {
    await cleanup();
  }
  vi.restoreAllMocks();
});

async function createUploadFixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'verdaccio-upload-failure-'));
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
  await packageStorage.createPackage(pkgName, generatePackageMetadata(pkgName, '1.0.0'));
  vi.spyOn(plugin, 'getPackageStorage').mockReturnValue(packageStorage);

  const manifestPath = path.join(root, pkgName, 'package.json');
  const originalManifest = await fs.readFile(manifestPath, 'utf8');
  const chunks: Buffer[] = [];
  const firstWrite = Promise.withResolvers<void>();
  let writeError: Error | undefined;
  const destination = new Writable({
    write(chunk, _encoding, callback) {
      if (writeError) {
        callback(writeError);
        return;
      }
      chunks.push(Buffer.from(chunk));
      callback();
      firstWrite.resolve();
    },
  });
  const destinationClosed = new Promise<void>((resolve) => destination.once('close', resolve));
  const destinationDone = finished(destination, { cleanup: true }).catch((error) => error);
  const writeTarball = vi.spyOn(packageStorage, 'writeTarball').mockResolvedValue(destination);
  const source = new PassThrough();
  const sourceDone = finished(source, { cleanup: true }).catch((error) => error);
  const controller = new AbortController();
  const streamReady = Promise.withResolvers<PassThrough>();
  const success = vi.fn();
  const internals = storage as unknown as UploadInternals;
  const updatePackage = vi.spyOn(internals, 'updatePackage');
  const uploadTarballAsStream = internals.uploadTarballAsStream.bind(storage);
  vi.spyOn(internals, 'uploadTarballAsStream').mockImplementation(async (...args) => {
    const stream = await uploadTarballAsStream(...args);
    stream.on('success', success);
    streamReady.resolve(stream);
    return stream;
  });

  async function settleUpdates() {
    await Promise.allSettled(updatePackage.mock.results.map((result) => result.value));
  }

  cleanups.push(async () => {
    source.destroy();
    destination.destroy();
    await Promise.all([sourceDone, destinationDone, destinationClosed]);
    await settleUpdates();
    await fs.rm(root, { recursive: true, force: true });
  });

  function start() {
    const outcome = storage
      .uploadTarball(pkgName, fileName, source, { signal: controller.signal })
      .then(
        () => ({ ok: true as const }),
        (error: NodeJS.ErrnoException) => ({ ok: false as const, error })
      );
    return outcome;
  }

  async function openAndWrite() {
    await streamReady.promise;
    destination.emit('open');
    source.write(firstChunk);
    await firstWrite.promise;
  }

  async function expectFailed(outcome: ReturnType<typeof start>, code?: string) {
    const result = await outcome;
    expect(result.ok).toBe(false);
    if (!result.ok && code) {
      expect(result.error.code).toBe(code);
    }
    // A rejected upload may still have queued close/metadata work. Await it before
    // asserting that the failure never becomes a late success.
    await Promise.all([sourceDone, destinationDone, destinationClosed]);
    await settleUpdates();
    expect(updatePackage).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(await fs.readFile(manifestPath, 'utf8')).toBe(originalManifest);
  }

  return {
    start,
    source,
    destination,
    destinationDone,
    controller,
    streamReady,
    openAndWrite,
    expectFailed,
    success,
    updatePackage,
    manifestPath,
    chunks,
    writeTarball,
    failNextWrite(error: Error) {
      writeError = error;
    },
  };
}

describe('tarball upload failure finalization', () => {
  test('rejects a destination ENOSPC after data was written without recording the tarball', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.failNextWrite(Object.assign(new Error('disk full'), { code: 'ENOSPC' }));
    fixture.source.end(lastChunk);
    await fixture.expectFailed(outcome, 'ENOSPC');
    expect(fixture.chunks).toEqual([firstChunk]);
  });

  test('rejects a destination open error even when open is never emitted', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.streamReady.promise;
    fixture.destination.destroy(Object.assign(new Error('permission denied'), { code: 'EACCES' }));
    await fixture.expectFailed(outcome, 'EACCES');
    expect(fixture.chunks).toEqual([]);
  });

  test('rejects an error preparing the destination', async () => {
    const fixture = await createUploadFixture();
    fixture.writeTarball.mockRejectedValue(
      Object.assign(new Error('cannot create storage directory'), { code: 'EACCES' })
    );
    const outcome = fixture.start();
    const result = await outcome;
    expect(result).toMatchObject({ ok: false, error: { code: 'EACCES' } });
    expect(fixture.source.destroyed).toBe(true);
    expect(fixture.updatePackage).not.toHaveBeenCalled();
    expect(fixture.success).not.toHaveBeenCalled();
  });

  test('cancels the destination before open', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.streamReady.promise;
    fixture.controller.abort();
    await fixture.expectFailed(outcome, 'ABORT_ERR');
    expect(fixture.chunks).toEqual([]);
  });

  test('rejects an already cancelled upload and closes the destination', async () => {
    const fixture = await createUploadFixture();
    fixture.controller.abort();
    const outcome = fixture.start();
    await fixture.expectFailed(outcome, 'ABORT_ERR');
    expect(fixture.chunks).toEqual([]);
  });

  test('closes the destination when the source fails before open', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.streamReady.promise;
    fixture.source.destroy(Object.assign(new Error('client disconnected'), { code: 'ECONNRESET' }));
    await fixture.expectFailed(outcome, 'ECONNRESET');
    expect(fixture.chunks).toEqual([]);
  });

  test('cancels the destination after a partial write', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.controller.abort();
    await fixture.expectFailed(outcome, 'ABORT_ERR');
    expect(fixture.chunks).toEqual([firstChunk]);
  });

  test('rejects a premature destination close without a late success', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.destination.destroy();
    await fixture.expectFailed(outcome, 'ERR_STREAM_PREMATURE_CLOSE');
  });

  test('rejects a source error after a partial write', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.source.destroy(new Error('client disconnected'));
    await fixture.expectFailed(outcome);
  });

  test('rejects a source closing early without an explicit error', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.source.destroy();
    await fixture.expectFailed(outcome, 'ERR_STREAM_PREMATURE_CLOSE');
  });

  test('records a successful upload exactly once with the complete content hash', async () => {
    const fixture = await createUploadFixture();
    const outcome = fixture.start();
    await fixture.openAndWrite();
    fixture.source.end(lastChunk);
    expect(await outcome).toEqual({ ok: true });
    await fixture.destinationDone;
    const content = Buffer.concat([firstChunk, lastChunk]);
    expect(Buffer.concat(fixture.chunks)).toEqual(content);
    expect(fixture.updatePackage).toHaveBeenCalledTimes(1);
    expect(fixture.success).toHaveBeenCalledTimes(1);
    const manifest = JSON.parse(await fs.readFile(fixture.manifestPath, 'utf8'));
    expect(manifest._attachments[fileName].shasum).toBe(
      createHash('sha1').update(content).digest('hex')
    );
  });
});
