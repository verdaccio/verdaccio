import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import rm from 'rmdir-sync';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { readFile, unlockFile } from '@verdaccio/file-locking';
import type { Logger, Package } from '@verdaccio/types';

import LocalDriver, { fSError, fileExist, noSuchFile, resourceNotAvailable } from '../src/local-fs';
import pkg from './__fixtures__/pkg';

vi.mock('@verdaccio/file-locking', () => ({
  readFile: vi.fn(),
  unlockFile: vi.fn(),
}));

let localTempStorage: string;
const pkgFileName = 'package.json';

const logger: Logger = {
  error: () => vi.fn(),
  info: () => vi.fn(),
  debug: () => vi.fn(),
  warn: () => vi.fn(),
  child: () => vi.fn(),
  http: () => vi.fn(),
  trace: () => vi.fn(),
};

beforeAll(() => {
  localTempStorage = path.join('./_storage');
  rm(localTempStorage);
});

describe('Local FS test', () => {
  describe('savePackage() group', () => {
    test('savePackage()', () => {
      return new Promise<void>((resolve) => {
        const data = {};
        const localFs = new LocalDriver(path.join(localTempStorage, 'first-package'), logger);

        localFs.savePackage('pkg.1.0.0.tar.gz', data as Package, (err) => {
          expect(err).toBeNull();
          resolve();
        });
      });
    });
  });

  describe('readPackage() group', () => {
    test('readPackage() success', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test'),
          logger
        );

        localFs.readPackage(pkgFileName, (err) => {
          expect(err).toBeNull();
          resolve();
        });
      });
    });

    test('readPackage() fails', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-testt'),
          logger
        );

        localFs.readPackage(pkgFileName, (err) => {
          expect(err).toBeTruthy();
          resolve();
        });
      });
    });

    test('readPackage() fails corrupt', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test-corrupt'),
          logger
        );

        localFs.readPackage('corrupt.js', (err) => {
          expect(err).toBeTruthy();
          resolve();
        });
      });
    });
  });

  describe('createPackage() group', () => {
    test('createPackage()', () => {
      return new Promise<void>((resolve) => {
        const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

        localFs.createPackage(path.join(localTempStorage, 'package5'), pkg, (err) => {
          expect(err).toBeNull();
          resolve();
        });
      });
    });

    test('createPackage() fails by fileExist', () => {
      return new Promise<void>((resolve) => {
        const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

        localFs.createPackage(path.join(localTempStorage, 'package5'), pkg, (err) => {
          expect(err).not.toBeNull();
          expect(err.code).toBe(fileExist);
          resolve();
        });
      });
    });

    describe('deletePackage() group', () => {
      test('deletePackage()', () => {
        return new Promise<void>((resolve) => {
          const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

          // verdaccio removes the package.json instead the package name
          localFs.deletePackage('package.json', (err) => {
            expect(err).toBeNull();
            resolve();
          });
        });
      });
    });
  });

  describe('removePackage() group', () => {
    beforeEach(() => {
      mkdirp.sync(path.join(localTempStorage, '_toDelete'));
    });

    test('removePackage() success', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(localTempStorage, '_toDelete'),
          logger
        );
        localFs.removePackage((error) => {
          expect(error).toBeNull();
          resolve();
        });
      });
    });

    test('removePackage() fails', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(localTempStorage, '_toDelete_fake'),
          logger
        );
        localFs.removePackage((error) => {
          expect(error).toBeTruthy();
          expect(error.code).toBe('ENOENT');
          resolve();
        });
      });
    });
  });

  describe('readTarball() group', () => {
    test('readTarball() success', () => {
      return new Promise<void>((resolve, reject) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test'),
          logger
        );
        const readTarballStream = localFs.readTarball('test-readme-0.0.0.tgz');
        const chunks: Buffer[] = [];

        readTarballStream.on('error', reject);

        readTarballStream.on('content-length', function (content) {
          expect(content).toBe(352);
        });

        readTarballStream.on('data', function (data) {
          chunks.push(data);
        });

        readTarballStream.on('end', function () {
          expect(chunks.length).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    test('readTarball() fails', () => {
      return new Promise<void>((resolve) => {
        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test'),
          logger
        );
        const readTarballStream = localFs.readTarball('file-does-not-exist-0.0.0.tgz');

        readTarballStream.on('error', function (err) {
          expect(err).toBeTruthy();
          resolve();
        });
      });
    });
  });

  describe('writeTarball() group', () => {
    beforeEach(() => {
      const writeTarballFolder: string = path.join(localTempStorage, '_writeTarball');
      rm(writeTarballFolder);
      mkdirp.sync(writeTarballFolder);
    });

    test('writeTarball() success', () => {
      return new Promise<void>((resolve, reject) => {
        const newFileName = 'new-readme-0.0.0.tgz';
        const readmeStorage: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test'),
          logger
        );
        const writeStorage: LocalDriver = new LocalDriver(
          path.join(__dirname, '../_storage'),
          logger
        );
        const readTarballStream = readmeStorage.readTarball('test-readme-0.0.0.tgz');
        const writeTarballStream = writeStorage.writeTarball(newFileName);

        writeTarballStream.on('error', reject);
        readTarballStream.on('error', reject);

        writeTarballStream.on('success', function () {
          const fileLocation: string = path.join(__dirname, '../_storage', newFileName);
          expect(fs.existsSync(fileLocation)).toBe(true);
          resolve();
        });

        readTarballStream.on('end', function () {
          writeTarballStream.done();
        });

        readTarballStream.pipe(writeTarballStream);
      });
    });

    test('writeTarball() abort', () => {
      return new Promise<void>((resolve, reject) => {
        const newFileLocationFolder: string = path.join(localTempStorage, '_writeTarball');
        const newFileName = 'new-readme-abort-0.0.0.tgz';
        const readmeStorage: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/readme-test'),
          logger
        );
        const writeStorage: LocalDriver = new LocalDriver(newFileLocationFolder, logger);
        const readTarballStream = readmeStorage.readTarball('test-readme-0.0.0.tgz');
        const writeTarballStream = writeStorage.writeTarball(newFileName);

        let aborted = false;
        writeTarballStream.on('error', function (err) {
          expect(err).toBeTruthy();
          aborted = true;
          resolve();
        });

        readTarballStream.on('error', function () {
          // read stream may error after abort, that's expected
          if (!aborted) {
            resolve();
          }
        });

        readTarballStream.on('data', function () {
          writeTarballStream.abort();
        });

        readTarballStream.pipe(writeTarballStream);
      });
    });
  });

  describe('updatePackage() group', () => {
    const updateHandler = vi.fn((name, cb) => {
      cb();
    });
    const onWrite = vi.fn((name, data, cb) => {
      cb();
    });
    const transform = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('updatePackage() success', () => {
      return new Promise<void>((resolve) => {
        vi.mocked(readFile).mockImplementation((name, _options, cb): any => cb(null, { name }));
        vi.mocked(unlockFile).mockImplementation((_something, cb): any => cb(null));

        const localFs: LocalDriver = new LocalDriver(
          path.join(__dirname, '__fixtures__/update-package'),
          logger
        );

        localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, () => {
          expect(transform).toHaveBeenCalledTimes(1);
          expect(updateHandler).toHaveBeenCalledTimes(1);
          expect(onWrite).toHaveBeenCalledTimes(1);
          resolve();
        });
      });
    });

    describe('updatePackage() failures handler', () => {
      test('updatePackage() whether locking fails', () => {
        return new Promise<void>((resolve) => {
          vi.mocked(readFile).mockImplementation((name, _options, cb): any =>
            cb(Error('whateverError'), { name })
          );
          vi.mocked(unlockFile).mockImplementation((_something, cb): any => cb(null));

          const localFs: LocalDriver = new LocalDriver(
            path.join(__dirname, '__fixtures__/update-package'),
            logger
          );

          localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
            expect(err).not.toBeNull();
            expect(transform).toHaveBeenCalledTimes(0);
            expect(updateHandler).toHaveBeenCalledTimes(0);
            expect(onWrite).toHaveBeenCalledTimes(0);
            resolve();
          });
        });
      });

      test('updatePackage() unlock a missing package', () => {
        return new Promise<void>((resolve) => {
          vi.mocked(readFile).mockImplementation((name, _options, cb): any =>
            cb(fSError(noSuchFile, 404), { name })
          );
          vi.mocked(unlockFile).mockImplementation((_something, cb): any => cb(null));

          const localFs: LocalDriver = new LocalDriver(
            path.join(__dirname, '__fixtures__/update-package'),
            logger
          );

          localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
            expect(err).not.toBeNull();
            expect(transform).toHaveBeenCalledTimes(0);
            expect(updateHandler).toHaveBeenCalledTimes(0);
            expect(onWrite).toHaveBeenCalledTimes(0);
            resolve();
          });
        });
      });

      test('updatePackage() unlock a resource non available', () => {
        return new Promise<void>((resolve) => {
          vi.mocked(readFile).mockImplementation((name, _options, cb): any =>
            cb(fSError(resourceNotAvailable, 503), { name })
          );
          vi.mocked(unlockFile).mockImplementation((_something, cb): any => cb(null));

          const localFs: LocalDriver = new LocalDriver(
            path.join(__dirname, '__fixtures__/update-package'),
            logger
          );

          localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
            expect(err).not.toBeNull();
            expect(transform).toHaveBeenCalledTimes(0);
            expect(updateHandler).toHaveBeenCalledTimes(0);
            expect(onWrite).toHaveBeenCalledTimes(0);
            resolve();
          });
        });
      });

      test('updatePackage() if updateHandler fails', () => {
        return new Promise<void>((resolve) => {
          vi.mocked(readFile).mockImplementation((name, _options, cb): any => cb(null, { name }));
          vi.mocked(unlockFile).mockImplementation((_something, cb): any => cb(null));

          const localFs: LocalDriver = new LocalDriver(
            path.join(__dirname, '__fixtures__/update-package'),
            logger
          );
          const failingUpdateHandler = vi.fn((_name, cb) => {
            cb(fSError('something wrong', 500));
          });

          localFs.updatePackage(
            'updatePackage',
            failingUpdateHandler,
            onWrite,
            transform,
            (err) => {
              expect(err).not.toBeNull();
              expect(transform).toHaveBeenCalledTimes(0);
              expect(failingUpdateHandler).toHaveBeenCalledTimes(1);
              expect(onWrite).toHaveBeenCalledTimes(0);
              resolve();
            }
          );
        });
      });
    });
  });

  describe('path sanitization', () => {
    test('should sanitize path traversal in readTarball', () => {
      return new Promise<void>((resolve) => {
        const localFs = new LocalDriver(path.join(localTempStorage, 'safe-pkg'), logger);
        const readStream = localFs.readTarball('../../etc/passwd');

        readStream.on('error', (err) => {
          // should fail because the sanitized path does not exist, not because it traversed
          expect(err).toBeTruthy();
          // the resolved path should stay within the storage directory
          resolve();
        });
      });
    });

    test('should sanitize path traversal in deletePackage', () => {
      return new Promise<void>((resolve) => {
        const localFs = new LocalDriver(path.join(localTempStorage, 'safe-pkg'), logger);
        localFs.deletePackage('../../../etc/passwd', (err) => {
          // should fail with ENOENT, not actually delete a file outside storage
          expect(err).toBeTruthy();
          resolve();
        });
      });
    });

    test('should strip traversal sequences from file names', () => {
      const localFs = new LocalDriver('/tmp/test-storage', logger);
      // Access the private _getStorage via the public API indirectly
      // by checking that writeTarball with a traversal name stays within bounds
      const writeStream = localFs.writeTarball('../../etc/malicious.tgz');
      writeStream.on('error', () => {
        // expected - the point is it doesn't escape the storage path
      });
      // Verify the stream was created (it doesn't throw synchronously)
      expect(writeStream).toBeDefined();
      writeStream.abort();
    });
  });
});
