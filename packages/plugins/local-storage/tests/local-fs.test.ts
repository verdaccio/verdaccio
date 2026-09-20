import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import type { Logger, Manifest } from '@verdaccio/types';

import LocalDriver from '../src/local-fs';
import pkg from './__fixtures__/pkg';

let localTempStorage: string;

// returns a promise which resolves true if file exists:
function checkFileExists(filepath) {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error);
    });
  });
}

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

vi.setConfig({ testTimeout: 20000 });

describe('Local FS test', () => {
  let tmpFolder;
  beforeEach(async () => {
    tmpFolder = await fileUtils.createTempFolder('local-fs');
    localTempStorage = path.join(tmpFolder, './_storage');
  });

  describe.skip('deletePackage() group', () => {
    test('should delete a package', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);
      await localFs.createPackage('createPackage', pkg as unknown as Manifest);
      // verdaccio removes the package.json instead the package name
      await localFs.deletePackage('package.json');
      // verify if the `package.json` does not exist anymore
      // note: the folder still remains
      await expect(checkFileExists(localFs._getStorage('package.json'))).resolves.toBeFalsy();
    });
    test('should fails on delete a package', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);
      // verdaccio removes the package.json instead the package name
      await expect(localFs.deletePackage('package.json')).rejects.toThrow('ENOENT');
    });
  });

  describe('removePackage() group', () => {
    beforeEach(() => {
      fs.mkdirSync(path.join(localTempStorage, '_toDelete'), { recursive: true });
    });

    test('should successfully remove the package', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, '_toDelete'), logger);

      await expect(localFs.removePackage()).resolves.toBeUndefined();
    });

    test('removePackage() fails', async () => {
      const localFs = new LocalDriver(path.join(localTempStorage, '_toDelete_fake'), logger);
      await expect(localFs.removePackage()).rejects.toThrow(/ENOENT/);
    });
  });

  describe('writeTarballNext', () => {
    test('should write a tarball', () =>
      new Promise((done) => {
        const abort = new AbortController();
        fileUtils.createTempFolder('local-fs-write-tarball').then((tmp) => {
          const localFs = new LocalDriver(tmp, logger);
          const readableStream = Readable.from('foooo');
          // TODO: verify file exist
          localFs.writeTarball('juan-1.0.0.tgz', { signal: abort.signal }).then((stream) => {
            stream.on('finish', () => {
              done(true);
            });
            readableStream.pipe(stream);
          });
        });
      }));
  });

  describe('writeTarballNextNoFolder', () => {
    test('should write a tarball even if folder does not exist', () =>
      new Promise((done) => {
        const abort = new AbortController();
        const tmp = path.join(localTempStorage, 'local-fs-write-tarball-new-folder');
        const localFs = new LocalDriver(tmp, logger);
        const readableStream = Readable.from('foooo');
        localFs.writeTarball('juan-1.0.0.tgz', { signal: abort.signal }).then((stream) => {
          stream.on('finish', () => {
            done(true);
          });
          readableStream.pipe(stream);
        });
      }));
  });

  describe('writeTarball failure cleanup', () => {
    const waitEvent = (stream, event): Promise<unknown> =>
      new Promise((resolve) => stream.once(event, resolve));
    const settle = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 50));

    test('an errored write removes the temporal file and never renames it', async () => {
      const tmp = await fileUtils.createTempFolder('local-fs-write-error');
      const localFs = new LocalDriver(tmp, logger);
      const stream = await localFs.writeTarball('bad-1.0.0.tgz', {
        signal: new AbortController().signal,
      });
      await waitEvent(stream, 'open');
      stream.write('partial download');
      stream.destroy(new Error('uplink timed out'));
      await waitEvent(stream, 'close');
      await settle();
      // neither a truncated final tarball nor a temporal leftover
      expect(fs.readdirSync(tmp)).toEqual([]);
    });

    test('an aborted write removes the temporal file', async () => {
      const abort = new AbortController();
      const tmp = await fileUtils.createTempFolder('local-fs-write-abort');
      const localFs = new LocalDriver(tmp, logger);
      const stream = await localFs.writeTarball('bad-1.0.0.tgz', { signal: abort.signal });
      await waitEvent(stream, 'open');
      stream.write('partial download');
      abort.abort();
      stream.destroy();
      await waitEvent(stream, 'close');
      await settle();
      expect(fs.readdirSync(tmp)).toEqual([]);
    });

    test('error and abort together do not raise an unhandled rejection', async () => {
      // both paths clean the same temporal file: the second unlink hits
      // ENOENT and used to escape as an uncaught exception
      const abort = new AbortController();
      const tmp = await fileUtils.createTempFolder('local-fs-write-double');
      const localFs = new LocalDriver(tmp, logger);
      const stream = await localFs.writeTarball('bad-1.0.0.tgz', { signal: abort.signal });
      await waitEvent(stream, 'open');
      stream.write('partial download');
      abort.abort();
      stream.destroy(new Error('uplink timed out'));
      await waitEvent(stream, 'close');
      await settle();
      expect(fs.readdirSync(tmp)).toEqual([]);
    });
  });

  describe('readTarballNext', () => {
    test('should read a tarball', () =>
      new Promise((done) => {
        const abort = new AbortController();
        const localFs = new LocalDriver(
          path.join(import.meta.dirname, '__fixtures__/readme-test-next'),
          logger
        );
        localFs.readTarball('test-readme-0.0.1.tgz', { signal: abort.signal }).then((stream) => {
          stream.on('data', (data) => {
            expect(data.length).toEqual(352);
          });
          stream.on('end', () => {
            done(true);
          });
        });
      }));

    test('should abort read a tarball', () =>
      new Promise((done) => {
        const abort = new AbortController();
        const localFs = new LocalDriver(
          path.join(import.meta.dirname, '__fixtures__/readme-test-next'),
          logger
        );
        localFs.readTarball('test-readme-0.0.3.tgz', { signal: abort.signal }).then((stream) => {
          stream.on('error', (error: any) => {
            // FIXME: might be different results sometimes, need research
            // expect(error.code).toEqual('ABORT_ERR');
            expect(error).toBeDefined();
            done(true);
          });
          abort.abort();
        });
      }));

    test('fails on read a tarball doex not exist', () =>
      new Promise((done) => {
        const abort = new AbortController();

        const localFs = new LocalDriver(
          path.join(import.meta.dirname, '__fixtures__/readme-test-next'),
          logger
        );
        localFs.readTarball('does-not-exist-0.0.0.tgz', { signal: abort.signal }).then((stream) => {
          stream.on('error', (error: any) => {
            expect(error.code).toEqual('ENOENT');
            done(true);
          });
        });
      }));

    test('should return content-length', () =>
      new Promise((done) => {
        const localFs = new LocalDriver(
          path.join(import.meta.dirname, '__fixtures__/readme-test-next'),
          logger
        );
        const abort = new AbortController();
        localFs.readTarball('test-readme-0.0.0.tgz', { signal: abort.signal }).then((stream) => {
          stream.on('data', (data) => {
            expect(data.length).toEqual(352);
          });

          stream.on('content-length', (content) => {
            expect(content).toEqual(352);
            done(true);
          });
        });
      }));
  });
});
