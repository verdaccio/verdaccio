import path from 'path';
import fs from 'fs';

import { S3 } from 'aws-sdk';
import rReadDir from 'recursive-readdir';
import { Package } from '@verdaccio/types';

import S3PackageManager from '../src/s3PackageManager';
import { deleteKeyPrefix } from '../src/deleteKeyPrefix';
import { create404Error, create409Error, is404Error } from '../src/s3Errors';
import { S3Config } from '../src/config';

import logger from './__mocks__/Logger';
import pkg from './__fixtures__/pkg';

const pkgFileName = 'package.json';

describe.skip('S3 package manager', () => {
  // random key for testing
  const keyPrefix = `test/${Math.floor(Math.random() * Math.pow(10, 8))}`;

  const bucket = process.env.VERDACCIO_TEST_BUCKET;
  if (!bucket) {
    throw new Error('no bucket specified via VERDACCIO_TEST_BUCKET env var');
  }

  const config: S3Config = {
    bucket,
    keyPrefix: `${keyPrefix}/`,
  } as S3Config;

  afterEach(async () => {
    const s3 = new S3();
    // snapshot test the final state of s3
    await new Promise((resolve, reject): void => {
      s3.listObjectsV2({ Bucket: bucket, Prefix: config.keyPrefix }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        // none of the tests we do should create this much data
        expect(data.IsTruncated).toBe(false);
        // remove the stuff that changes from the results
        expect(
          data.Contents.map(({ Key, Size }) => ({
            Key: Key.split(keyPrefix)[1],
            Size,
          }))
        ).toMatchSnapshot();
        resolve();
      });
    });
    // clean up s3
    try {
      await new Promise((resolve, reject): void => {
        deleteKeyPrefix(
          s3,
          {
            Bucket: bucket,
            Prefix: keyPrefix,
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } catch (err) {
      if (is404Error(err)) {
        // ignore
      } else {
        throw err;
      }
    }
  });

  describe('savePackage() group', () => {
    test('savePackage()', (done) => {
      const data = ('{data:5}' as unknown) as Package;
      const packageManager = new S3PackageManager(config, 'first-package', logger);

      packageManager.savePackage('pkg.1.0.0.tar.gz', data, (err) => {
        expect(err).toBeNull();
        done();
      });
    });
  });

  async function syncFixtureDir(fixture): Promise<void> {
    const s3 = new S3();
    const dir = path.join(__dirname, '__fixtures__');

    const filenames = await new Promise<string[]>((resolve, reject): void =>
      rReadDir(path.join(dir, fixture), (err, filenames) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(filenames);
      })
    );

    await Promise.all(
      filenames.map(
        (filename) =>
          new Promise((resolve, reject): void => {
            const key = `${config.keyPrefix}${path.relative(dir, filename)}`;
            fs.readFile(filename, (err, data) => {
              if (err) {
                reject(err);
                return;
              }
              s3.upload({ Bucket: bucket, Key: key, Body: data }).send((err) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve();
              });
            });
          })
      )
    );
  }

  describe('readPackage() group', () => {
    test('readPackage() success', async (done) => {
      await syncFixtureDir('readme-test');

      const packageManager = new S3PackageManager(config, 'readme-test', logger);

      packageManager.readPackage(pkgFileName, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    test('readPackage() fails', async (done) => {
      await syncFixtureDir('readme-test');

      const packageManager = new S3PackageManager(config, 'readme-test', logger);

      packageManager.readPackage(pkgFileName, (err) => {
        expect(err).toBeTruthy();
        done();
      });
    });

    test('readPackage() fails corrupt', async (done) => {
      await syncFixtureDir('readme-test-corrupt');

      const packageManager = new S3PackageManager(config, 'readme-test-corrupt', logger);

      packageManager.readPackage('corrupt.js', (err) => {
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  describe('createPackage() group', () => {
    test('createPackage()', (done) => {
      const packageManager = new S3PackageManager(config, 'createPackage', logger);

      packageManager.createPackage('package5', pkg, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    test('createPackage() fails by fileExist', (done) => {
      const packageManager = new S3PackageManager(config, 'createPackage', logger);

      packageManager.createPackage('package5', pkg, (err) => {
        expect(err).toBeNull();
        packageManager.createPackage('package5', pkg, (err) => {
          expect(err).not.toBeNull();
          expect(err.code).toBe(create409Error().code); // file exists
          done();
        });
      });
    });

    describe('deletePackage() group', () => {
      test('deletePackage()', (done) => {
        const packageManager = new S3PackageManager(config, 'createPackage', logger);

        // verdaccio removes the package.json instead the package name
        packageManager.deletePackage('package.json', (err) => {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });

  describe('removePackage() group', () => {
    test('removePackage() success', (done) => {
      const packageManager = new S3PackageManager(config, '_toDelete', logger);
      packageManager.createPackage('package5', pkg, (err) => {
        expect(err).toBeNull();
        packageManager.removePackage((error) => {
          expect(error).toBeNull();
          done();
        });
      });
    });

    test('removePackage() fails', (done) => {
      const packageManager = new S3PackageManager(config, '_toDelete_fake', logger);
      packageManager.removePackage((error) => {
        expect(error).toBeTruthy();
        expect(error.code).toBe(create404Error().code); // file exists
        done();
      });
    });
  });

  describe('readTarball() group', () => {
    test('readTarball() success', async (done) => {
      await syncFixtureDir('readme-test');

      const packageManager = new S3PackageManager(config, 'readme-test', logger);
      const readTarballStream = packageManager.readTarball('test-readme-0.0.0.tgz');

      readTarballStream.on('error', (err) => {
        expect(err).toBeNull();
      });

      readTarballStream.on('content-length', (content) => {
        expect(content).toBe(352);
      });

      readTarballStream.on('end', () => {
        done();
      });

      readTarballStream.on('data', (data) => {
        expect(data).toBeDefined();
      });
    });

    test('readTarball() fails', async (done) => {
      await syncFixtureDir('readme-test');

      const packageManager = new S3PackageManager(config, 'readme-test', logger);
      const readTarballStream = packageManager.readTarball('file-does-not-exist-0.0.0.tgz');

      readTarballStream.on('error', function (err) {
        expect(err).toBeTruthy();
        done();
      });
    });
  });

  describe('writeTarball() group', () => {
    test('writeTarball() success', async (done) => {
      await syncFixtureDir('readme-test');

      const newFileName = 'new-readme-0.0.0.tgz';
      const readmeStorage = new S3PackageManager(config, 'readme-test', logger);
      const writeStorage = new S3PackageManager(config, 'write-storage', logger);
      const readTarballStream = readmeStorage.readTarball('test-readme-0.0.0.tgz');
      const writeTarballStream = writeStorage.writeTarball(newFileName);

      writeTarballStream.on('error', function (err) {
        expect(err).toBeNull();
        done.fail(new Error("shouldn't have errored"));
      });

      writeTarballStream.on('success', () => {
        done();
      });

      readTarballStream.on('end', () => {
        writeTarballStream.done();
      });

      writeTarballStream.on('data', (data) => {
        expect(data).toBeDefined();
      });

      readTarballStream.on('error', (err) => {
        expect(err).toBeNull();
        done.fail(new Error("shouldn't have errored"));
      });

      readTarballStream.pipe(writeTarballStream);
    });

    test('writeTarball() fails on existing file', async (done) => {
      await syncFixtureDir('readme-test');

      const newFileName = 'test-readme-0.0.0.tgz';
      const storage = new S3PackageManager(config, 'readme-test', logger);
      const readTarballStream = storage.readTarball('test-readme-0.0.0.tgz');
      const writeTarballStream = storage.writeTarball(newFileName);

      writeTarballStream.on('error', (err) => {
        expect(err).toBeTruthy();
        expect(err.code).toBe('EEXISTS');
        done();
      });

      readTarballStream.pipe(writeTarballStream);
    });

    test('writeTarball() abort', async (done) => {
      await syncFixtureDir('readme-test');

      const newFileName = 'new-readme-abort-0.0.0.tgz';
      const readmeStorage = new S3PackageManager(config, 'readme-test', logger);
      const writeStorage = new S3PackageManager(config, 'write-storage', logger);
      const readTarballStream = readmeStorage.readTarball('test-readme-0.0.0.tgz');
      const writeTarballStream = writeStorage.writeTarball(newFileName);

      writeTarballStream.on('error', (err) => {
        expect(err).toBeTruthy();
        done();
      });

      writeTarballStream.on('data', (data) => {
        expect(data).toBeDefined();
        writeTarballStream.abort();
      });

      readTarballStream.pipe(writeTarballStream);
    });
  });
});
