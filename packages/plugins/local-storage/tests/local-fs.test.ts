import fs from 'fs';
import path from 'path';
import { dirSync } from 'tmp-promise';
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { ILocalPackageManager, Logger, Package } from '@verdaccio/types';

import LocalDriver, { fSError, fileExist, noSuchFile, resourceNotAvailable } from '../src/local-fs';
import pkg from './__fixtures__/pkg';

let localTempStorage: string;
const pkgFileName = 'package.json';

const logger: Logger = {
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(),
  warn: vi.fn(),
  http: vi.fn(),
  trace: vi.fn(),
};

describe('Local FS test', () => {
  let tmpFolder;
  beforeAll(() => {
    tmpFolder = dirSync({ unsafeCleanup: true });
    localTempStorage = path.join(tmpFolder.name, './_storage');
  });

  afterAll(() => {
    // tmpFolder.removeCallback();
  });

  describe('savePackage() group', () => {
    test('savePackage()', (done) => {
      const data = {};
      const localFs = new LocalDriver(path.join(localTempStorage, 'first-package'), logger);

      localFs.savePackage('pkg.1.0.0.tar.gz', data as Package, (err) => {
        expect(err).toBeNull();
        done();
      });
    });
  });

  describe('readPackage() group', () => {
    test('readPackage() success', (done) => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test'),
        logger
      );

      localFs.readPackage(pkgFileName, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    test('readPackage() fails', (done) => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-testt'),
        logger
      );

      localFs.readPackage(pkgFileName, (err) => {
        expect(err).toBeTruthy();
        done();
      });
    });

    test('readPackage() fails corrupt', (done) => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test-corrupt'),
        logger
      );

      localFs.readPackage('corrupt.js', (err) => {
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  describe('createPackage() group', () => {
    test('createPackage()', (done) => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

      localFs.createPackage(path.join(localTempStorage, 'package5'), pkg, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    test('createPackage() fails by fileExist', (done) => {
      const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

      localFs.createPackage(path.join(localTempStorage, 'package5'), pkg, (err) => {
        expect(err).not.toBeNull();
        expect(err.code).toBe(fileExist);
        done();
      });
    });

    describe('deletePackage() group', () => {
      test('deletePackage()', async () => {
        const localFs = new LocalDriver(path.join(localTempStorage, 'createPackage'), logger);

        // verdaccio removes the package.json instead the package name
        await localFs.deletePackage('package.json');
      });
    });
  });

  describe('removePackage() group', () => {
    beforeEach(() => {
      fs.mkdirSync(path.join(localTempStorage, '_toDelete'), { recursive: true });
    });

    test('should successfully remove the package', async () => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(localTempStorage, '_toDelete'),
        logger
      );

      await expect(localFs.removePackage()).resolves.toBeUndefined();
    });

    test('removePackage() fails', async () => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(localTempStorage, '_toDelete_fake'),
        logger
      );
      await expect(localFs.removePackage()).rejects.toThrow(/ENOENT/);
    });
  });

  describe('readTarball', () => {
    test('should read tarball successfully', (done) => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test'),
        logger
      );
      const readTarballStream = localFs.readTarball('test-readme-0.0.0.tgz');

      readTarballStream.on('error', function (err) {
        expect(err).toBeNull();
      });

      readTarballStream.on('content-length', function (content) {
        expect(content).toBe(352);
      });

      readTarballStream.on('end', function () {
        done();
      });

      readTarballStream.on('data', function (data) {
        expect(data).toBeDefined();
      });
    });

    test('readTarball() fails', (done) => {
      const localFs: ILocalPackageManager = new LocalDriver(
        path.join(__dirname, '__fixtures__/readme-test'),
        logger
      );
      const readTarballStream = localFs.readTarball('file-does-not-exist-0.0.0.tgz');

      readTarballStream.on('error', function (err) {
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  // describe('updatePackage() group', () => {
  //   const updateHandler = vi.fn((name, cb) => {
  //     cb();
  //   });
  //   const onWrite = vi.fn((name, data, cb) => {
  //     cb();
  //   });
  //   const transform = vi.fn();

  //   beforeEach(() => {
  //     vi.clearAllMocks();
  //     vi.resetAllMocks();
  //   });

  //   test('updatePackage() success', (done) => {
  //     jest.doMock('@verdaccio/file-locking', () => {
  //       return {
  //         readFile: (name, _options, cb): any => cb(null, { name }),
  //         unlockFile: (_something, cb): any => cb(null),
  //       };
  //     });

  //     const LocalDriver = require('../src/local-fs').default;
  //     const localFs: ILocalPackageManager = new LocalDriver(
  //       path.join(__dirname, '__fixtures__/update-package'),
  //       logger
  //     );

  //     localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, () => {
  //       expect(transform).toHaveBeenCalledTimes(1);
  //       expect(updateHandler).toHaveBeenCalledTimes(1);
  //       expect(onWrite).toHaveBeenCalledTimes(1);
  //       done();
  //     });
  //   });

  //   describe('updatePackage() failures handler', () => {
  //     test('updatePackage() whether locking fails', (done) => {
  //       jest.doMock('@verdaccio/file-locking', () => {
  //         return {
  //           readFile: (name, _options, cb): any => cb(Error('whateverError'), { name }),
  //           unlockFile: (_something, cb): any => cb(null),
  //         };
  //       });
  //       require('../src/local-fs').default;
  //       const localFs: ILocalPackageManager = new LocalDriver(
  //         path.join(__dirname, '__fixtures__/update-package'),
  //         logger
  //       );

  //       localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
  //         expect(err).not.toBeNull();
  //         expect(transform).toHaveBeenCalledTimes(0);
  //         expect(updateHandler).toHaveBeenCalledTimes(0);
  //         expect(onWrite).toHaveBeenCalledTimes(0);
  //         done();
  //       });
  //     });

  //     test('updatePackage() unlock a missing package', (done) => {
  //       jest.doMock('@verdaccio/file-locking', () => {
  //         return {
  //           readFile: (name, _options, cb): any => cb(fSError(noSuchFile, 404), { name }),
  //           unlockFile: (_something, cb): any => cb(null),
  //         };
  //       });
  //       const LocalDriver = require('../src/local-fs').default;
  //       const localFs: ILocalPackageManager = new LocalDriver(
  //         path.join(__dirname, '__fixtures__/update-package'),
  //         logger
  //       );

  //       localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
  //         expect(err).not.toBeNull();
  //         expect(transform).toHaveBeenCalledTimes(0);
  //         expect(updateHandler).toHaveBeenCalledTimes(0);
  //         expect(onWrite).toHaveBeenCalledTimes(0);
  //         done();
  //       });
  //     });

  //     test('updatePackage() unlock a resource non available', (done) => {
  //       jest.doMock('@verdaccio/file-locking', () => {
  //         return {
  //           readFile: (name, _options, cb): any => cb(fSError(resourceNotAvailable, 503), { name }),
  //           unlockFile: (_something, cb): any => cb(null),
  //         };
  //       });
  //       const LocalDriver = require('../src/local-fs').default;
  //       const localFs: ILocalPackageManager = new LocalDriver(
  //         path.join(__dirname, '__fixtures__/update-package'),
  //         logger
  //       );

  //       localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
  //         expect(err).not.toBeNull();
  //         expect(transform).toHaveBeenCalledTimes(0);
  //         expect(updateHandler).toHaveBeenCalledTimes(0);
  //         expect(onWrite).toHaveBeenCalledTimes(0);
  //         done();
  //       });
  //     });

  //     test('updatePackage() if updateHandler fails', (done) => {
  //       jest.doMock('@verdaccio/file-locking', () => {
  //         return {
  //           readFile: (name, _options, cb): any => cb(null, { name }),
  //           unlockFile: (_something, cb): any => cb(null),
  //         };
  //       });

  //       const LocalDriver = require('../src/local-fs').default;
  //       const localFs: ILocalPackageManager = new LocalDriver(
  //         path.join(__dirname, '__fixtures__/update-package'),
  //         logger
  //       );
  //       const updateHandler = jest.fn((_name, cb) => {
  //         cb(fSError('something wrong', 500));
  //       });

  //       localFs.updatePackage('updatePackage', updateHandler, onWrite, transform, (err) => {
  //         expect(err).not.toBeNull();
  //         expect(transform).toHaveBeenCalledTimes(0);
  //         expect(updateHandler).toHaveBeenCalledTimes(1);
  //         expect(onWrite).toHaveBeenCalledTimes(0);
  //         done();
  //       });
  //     });
  //   });
  // });
});
