import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { finished, pipeline } from 'node:stream/promises';
import { setImmediate } from 'node:timers/promises';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { Logger } from '@verdaccio/types';

import * as fileUtils from '../src/fs';
import LocalFS from '../src/local-fs';

const cleanups: Array<() => Promise<void>> = [];
const firstChunk = Buffer.from('written before the failure');
const fileName = 'upload-1.0.0.tgz';

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) {
    await cleanup();
  }
  vi.restoreAllMocks();
});

async function createWriteFixture({
  holdOpen = false,
  openError = undefined as NodeJS.ErrnoException | undefined,
  pipeToDestination = true,
  alreadyAborted = false,
} = {}) {
  const root = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'verdaccio-upload-cleanup-'));
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
  const localFs = new LocalFS(root, logger);
  const opening = Promise.withResolvers<void>();
  const wrote = Promise.withResolvers<void>();
  let releaseOpen = () => {};
  let writeError: NodeJS.ErrnoException | undefined;
  const createWriteStream = fs.createWriteStream;
  // Inject errors at the OS boundary while preserving the real WriteStream,
  // file descriptors, partial files, close ordering and LocalFS cleanup.
  vi.spyOn(fs, 'createWriteStream').mockImplementation((filename, options) =>
    createWriteStream(filename, {
      ...(typeof options === 'object' ? options : {}),
      fs: {
        open(filename, flags, mode, callback) {
          releaseOpen = () => {
            if (openError) {
              callback(openError, -1);
            } else {
              fs.open(filename, flags, mode, callback);
            }
            releaseOpen = () => {};
          };
          opening.resolve();
          if (!holdOpen) releaseOpen();
        },
        write(fd, buffer, offset, length, position, callback) {
          if (writeError) {
            callback(writeError, 0, buffer);
            return;
          }
          fs.write(fd, buffer, offset, length, position, (error, written, data) => {
            callback(error, written, data);
            wrote.resolve();
          });
        },
        close(fd, callback) {
          const close = typeof options === 'object' ? options.fs?.close : undefined;
          (close ?? fs.close)(fd, callback);
        },
      },
    })
  );
  const unlink = vi.spyOn(fileUtils, 'unlinkPromise');
  const rename = vi.spyOn(fileUtils, 'renamePromise');
  const controller = new AbortController();
  if (alreadyAborted) controller.abort();
  const destination = await localFs.writeTarball(fileName, { signal: controller.signal });
  const destinationClosed = new Promise<void>((resolve) => destination.once('close', resolve));
  const destinationDone = finished(destination, { cleanup: true }).catch((error) => error);
  const source = new PassThrough();
  const operation = pipeToDestination
    ? pipeline(source, destination, { signal: controller.signal })
    : finished(destination, { cleanup: true });
  const outcome = operation.then(
    () => undefined,
    (error: NodeJS.ErrnoException) => error
  );

  async function settleFiles() {
    await Promise.allSettled([
      ...unlink.mock.results.map((result) => result.value),
      ...rename.mock.results.map((result) => result.value),
    ]);
  }

  cleanups.push(async () => {
    source.destroy();
    destination.destroy();
    releaseOpen();
    await Promise.all([outcome, destinationDone, destinationClosed]);
    await settleFiles();
    await fsPromises.rm(root, { recursive: true, force: true });
  });

  async function writeFirstChunk() {
    source.write(firstChunk);
    await wrote.promise;
    expect(fs.readFileSync((destination as fs.WriteStream).path)).toEqual(firstChunk);
  }

  async function expectCleanFailure(code?: string) {
    const error = await outcome;
    expect(error).toBeInstanceOf(Error);
    if (code) expect(error?.code).toBe(code);
    await Promise.all([destinationDone, destinationClosed]);
    // close launches asynchronous unlink/rename operations. Await those actual
    // operations instead of sleeping before checking the directory.
    await settleFiles();
    expect(rename).not.toHaveBeenCalled();
    expect(await fsPromises.readdir(root)).toEqual([]);
    expect(logger.warn).not.toHaveBeenCalled();
  }

  return {
    root,
    source,
    destination,
    destinationDone,
    controller,
    opening,
    outcome,
    rename,
    unlink,
    logger,
    writeFirstChunk,
    expectCleanFailure,
    settleFiles,
    releaseOpen() {
      releaseOpen();
    },
    failNextWrite(error: NodeJS.ErrnoException) {
      writeError = error;
    },
  };
}

describe('LocalFS upload failure cleanup', () => {
  test('removes a partial file after an ENOSPC write error', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.failNextWrite(Object.assign(new Error('disk full'), { code: 'ENOSPC' }));
    fixture.source.end('remaining data');
    await fixture.expectCleanFailure('ENOSPC');
  });

  test('handles EACCES before the file opens', async () => {
    const fixture = await createWriteFixture({
      openError: Object.assign(new Error('permission denied'), { code: 'EACCES' }),
    });
    await fixture.expectCleanFailure('EACCES');
  });

  test('cleans up when cancellation happens before the file is created', async () => {
    const fixture = await createWriteFixture({ holdOpen: true });
    await fixture.opening.promise;
    fixture.controller.abort();
    // Exercise the race where an eager unlink finishes before the pending open.
    await fixture.settleFiles();
    fixture.releaseOpen();
    await fixture.expectCleanFailure('ABORT_ERR');
  });

  test('removes partial data after cancellation during a write', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.controller.abort();
    await fixture.expectCleanFailure('ABORT_ERR');
  });

  test('honors cancellation before open without relying on the caller to destroy the stream', async () => {
    const fixture = await createWriteFixture({ holdOpen: true, pipeToDestination: false });
    await fixture.opening.promise;
    fixture.controller.abort();
    await fixture.settleFiles();
    fixture.releaseOpen();
    await fixture.expectCleanFailure('ABORT_ERR');
  });

  test('honors an already aborted signal and leaves no temporary file', async () => {
    const fixture = await createWriteFixture({ alreadyAborted: true, pipeToDestination: false });
    await fixture.expectCleanFailure('ABORT_ERR');
  });

  test('never renames a file after a premature close', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.destination.destroy();
    await fixture.expectCleanFailure('ERR_STREAM_PREMATURE_CLOSE');
  });

  test('removes partial data after a source error', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.source.destroy(new Error('client disconnected'));
    await fixture.expectCleanFailure();
  });

  test('removes partial data when the source closes without an explicit error', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.source.destroy();
    await fixture.expectCleanFailure('ERR_STREAM_PREMATURE_CLOSE');
  });

  test('handles a write error and cancellation together without cleanup errors', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.destination.destroy(Object.assign(new Error('disk full'), { code: 'ENOSPC' }));
    fixture.controller.abort();
    await fixture.expectCleanFailure();
  });

  test('preserves a complete file on a successful upload', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    fixture.source.end('remaining data');
    expect(await fixture.outcome).toBeUndefined();
    await fixture.destinationDone;
    await fixture.settleFiles();
    expect(await fsPromises.readdir(fixture.root)).toEqual([fileName]);
    expect(await fsPromises.readFile(path.join(fixture.root, fileName))).toEqual(
      Buffer.concat([firstChunk, Buffer.from('remaining data')])
    );
    expect(fixture.rename).toHaveBeenCalledTimes(1);
  });

  test('does not complete the pipeline until the final file is available', async () => {
    const fixture = await createWriteFixture();
    const renaming = Promise.withResolvers<void>();
    const releaseRename = Promise.withResolvers<void>();
    fixture.rename.mockImplementationOnce(async (...args) => {
      renaming.resolve();
      await releaseRename.promise;
      await fsPromises.rename(...args);
    });
    const completed = vi.fn();
    void fixture.outcome.then(completed);
    try {
      fixture.source.end(firstChunk);
      await renaming.promise;
      // Flush close/pipeline callbacks while the rename is deliberately blocked.
      await setImmediate();
      expect(completed).not.toHaveBeenCalled();
      expect(fs.existsSync(path.join(fixture.root, fileName))).toBe(false);
    } finally {
      releaseRename.resolve();
    }
    expect(await fixture.outcome).toBeUndefined();
    expect(await fsPromises.readFile(path.join(fixture.root, fileName))).toEqual(firstChunk);
    expect(await fsPromises.readdir(fixture.root)).toEqual([fileName]);
  });

  test('rejects a failed rename and removes the temporary file', async () => {
    const fixture = await createWriteFixture();
    const error = Object.assign(new Error('cannot move tarball into place'), { code: 'EACCES' });
    fixture.rename.mockRejectedValueOnce(error);
    fixture.source.end(firstChunk);
    expect(await fixture.outcome).toBe(error);
    await fixture.destinationDone;
    await fixture.settleFiles();
    expect(await fsPromises.readdir(fixture.root)).toEqual([]);
    expect(fixture.rename).toHaveBeenCalledTimes(1);
    expect(fixture.unlink).toHaveBeenCalledTimes(1);
  });

  test('rejects a descriptor close error without keeping a final or temporary file', async () => {
    const fixture = await createWriteFixture();
    const close = fs.close;
    const error = Object.assign(new Error('disk error while closing'), { code: 'EIO' });
    vi.spyOn(fs, 'close').mockImplementationOnce((fd, callback) => {
      close(fd, (closeError) => callback?.(closeError ?? error));
    });
    fixture.source.end(firstChunk);
    await fixture.expectCleanFailure('EIO');
  });

  test('preserves the upload error if temporary-file cleanup also fails', async () => {
    const fixture = await createWriteFixture();
    await fixture.writeFirstChunk();
    const error = Object.assign(new Error('disk full'), { code: 'ENOSPC' });
    fixture.unlink.mockRejectedValueOnce(
      Object.assign(new Error('cannot remove temporary file'), { code: 'EACCES' })
    );
    fixture.failNextWrite(error);
    fixture.source.end('remaining data');
    expect(await fixture.outcome).toBe(error);
    await fixture.destinationDone;
    await fixture.settleFiles();
    expect(fixture.rename).not.toHaveBeenCalled();
    expect(fs.existsSync(path.join(fixture.root, fileName))).toBe(false);
    expect(fixture.logger.warn).toHaveBeenCalledTimes(1);
    expect(fixture.logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ err: 'cannot remove temporary file' }),
      expect.any(String)
    );
  });
});
