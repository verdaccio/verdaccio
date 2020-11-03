import rimRaf from 'rimraf';
import path from 'path';

import LocalStorage from '../../../../src/lib/local-storage';
import AppConfig from '../../../../src/lib/config';
// @ts-ignore
import configExample from '../../partials/config';
import { logger, setup} from '../../../../src/lib/logger';
import {readFile} from '../../../functional/lib/test.utils';
import {generatePackageTemplate} from '../../../../src/lib/storage-utils';
import {generateNewVersion} from '../../../lib/utils-test';

const readMetadata = (fileName = 'metadata') => readFile(`../../unit/partials/${fileName}`).toString();

import {Config, MergeTags, Package} from '@verdaccio/types';
import {IStorage} from '../../../../types';
import { API_ERROR, HTTP_STATUS, DIST_TAGS} from '../../../../src/lib/constants';
import { VerdaccioError } from '@verdaccio/commons-api';

setup([]);

describe('LocalStorage', () => {
  let storage: IStorage;
  const pkgName = 'npm_test';
  const pkgNameScoped = `@scope/${pkgName}-scope`;
  const tarballName = `${pkgName}-add-tarball-1.0.4.tgz`;
  const tarballName2 = `${pkgName}-add-tarball-1.0.5.tgz`;

  const getStorage = (LocalStorageClass = LocalStorage) => {
    const config: Config = new AppConfig(configExample({
      self_path: path.join('../partials/store')
    }));

    return new LocalStorageClass(config, logger);
  }

  const getPackageMetadataFromStore = (pkgName: string): Promise<Package> => {
    return new Promise((resolve) => {
      storage.getPackageMetadata(pkgName, (err, data ) => {
        resolve(data);
      });
    });
  };

  const addNewVersion = (pkgName: string, version: string) => {
    return new Promise((resolve) => {
      storage.addVersion(pkgName, version, generateNewVersion(pkgName, version), '', (err, data) => {
        resolve(data);
      });
    });
  };
  const addTarballToStore = (pkgName: string, tarballName) => {
    return new Promise((resolve, reject) => {
      const tarballData = JSON.parse(readMetadata('addTarball').toString());
      const stream = storage.addTarball(pkgName, tarballName);

      stream.on('error', (err) => {
        expect(err).toBeNull();
        reject();
      });
      stream.on('success', () => {
        resolve();
      });

      stream.end(Buffer.from(tarballData.data, 'base64'));
      stream.done();
    });
  };

  const addPackageToStore = (pkgName, metadata) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const pkgStoragePath = storage._getLocalStorage(pkgName);
      rimRaf(pkgStoragePath.path, (err) => {
        expect(err).toBeNull();
        storage.addPackage(pkgName, metadata, async (err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
      });
    });
  };

  beforeAll(() => {
    storage = getStorage();
  });

  test('should be defined', () => {
    expect(storage).toBeDefined();
  });

  describe('LocalStorage::preparePackage', () => {
    test('should add a package', (done) => {
      const metadata = JSON.parse(readMetadata().toString());
      // @ts-ignore
      const pkgStoragePath = storage._getLocalStorage(pkgName);
      rimRaf(pkgStoragePath.path, (err) => {
        expect(err).toBeNull();
        storage.addPackage(pkgName, metadata, (err, data) => {
          expect(data.version).toMatch(/1.0.0/);
          expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
          expect(data.name).toEqual(pkgName);
          done();
        });
      });
    });

    test('should add a @scope package', (done) => {
      const metadata = JSON.parse(readMetadata());
      // @ts-ignore
      const pkgStoragePath = storage._getLocalStorage(pkgNameScoped);

      rimRaf(pkgStoragePath.path, (err) => {
        expect(err).toBeNull();
        storage.addPackage(pkgNameScoped, metadata, (err, data) => {
          expect(data.version).toMatch(/1.0.0/);
          expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
          expect(data.name).toEqual(pkgName);
          done();
        });
      });
    });

    test('should fails on add a package', (done) => {
      const metadata = JSON.parse(readMetadata());

      storage.addPackage(pkgName, metadata, (err) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
        expect(err.message).toMatch(API_ERROR.PACKAGE_EXIST);
        done();
      });
    });

    describe('LocalStorage::mergeTags', () => {
      test('should mergeTags', async (done) => {
        const pkgName = 'merge-tags-test-1';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        await addNewVersion(pkgName, '1.0.0');
        await addNewVersion(pkgName, '2.0.0');
        await addNewVersion(pkgName, '3.0.0');
        const tags: MergeTags = {
          beta: '3.0.0',
          latest: '2.0.0'
        };

        storage.mergeTags(pkgName, tags, async (err, data) => {
          expect(err).toBeNull();
          expect(data).toBeUndefined();
          const metadata: Package = await getPackageMetadataFromStore(pkgName);
          expect(metadata[DIST_TAGS]).toBeDefined();
          expect(metadata[DIST_TAGS]['beta']).toBeDefined();
          expect(metadata[DIST_TAGS]['beta']).toBe('3.0.0');
          expect(metadata[DIST_TAGS]['latest']).toBe('2.0.0');
          done();
        });
      });

      test('should fails mergeTags version not found', async (done) => {
        const pkgName = 'merge-tags-test-1';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        // const tarballName: string = `${pkgName}-${version}.tgz`;
        await addNewVersion(pkgName, '1.0.0');
        await addNewVersion(pkgName, '2.0.0');
        await addNewVersion(pkgName, '3.0.0');
        const tags: MergeTags = {
          beta: '9999.0.0'
        };

        storage.mergeTags(pkgName, tags, async (err) => {
          expect(err).not.toBeNull();
          expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
          expect(err.message).toMatch(API_ERROR.VERSION_NOT_EXIST);
          done();
        });
      });

      test('should fails on mergeTags', async (done) => {
        const tags: MergeTags = {
          beta: '3.0.0',
          latest: '2.0.0'
        };

        storage.mergeTags('not-found', tags, async (err) => {
          expect(err).not.toBeNull();
          expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
          expect(err.message).toMatch(API_ERROR.NO_PACKAGE);
          done();
        });
      });
    });

    describe('LocalStorage::addVersion', () => {
      test('should add new version without tag', async (done) => {
        const pkgName = 'add-version-test-1';
        const version = '1.0.1';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        const tarballName = `${pkgName}-${version}.tgz`;
        await addNewVersion(pkgName, '9.0.0');
        await addTarballToStore(pkgName, `${pkgName}-9.0.0.tgz`);
        await addTarballToStore(pkgName, tarballName);

        storage.addVersion(pkgName, version, generateNewVersion(pkgName, version), '', (err, data) => {
          expect(err).toBeNull();
          expect(data).toBeUndefined();
          done();
        });
      });

      test('should fails on add a duplicated version without tag', async (done) => {
        const pkgName = 'add-version-test-2';
        const version = '1.0.1';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        await addNewVersion(pkgName, version);

        storage.addVersion(pkgName, version, generateNewVersion(pkgName, version), '', err => {
          expect(err).not.toBeNull();
          expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
          expect(err.message).toMatch(API_ERROR.PACKAGE_EXIST);
          done();
        });
      });

      test('should fails add new version wrong shasum', async (done) => {
        const pkgName = 'add-version-test-4';
        const version = '4.0.0';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        const tarballName = `${pkgName}-${version}.tgz`;
        await addTarballToStore(pkgName, tarballName);

        storage.addVersion(pkgName, version, generateNewVersion(pkgName, version, 'fake'), '', err => {
          expect(err).not.toBeNull();
          expect(err.statusCode).toEqual(HTTP_STATUS.BAD_REQUEST);
          expect(err.message).toMatch(/shasum error/);
          done();
        });
      });

      test('should add new second version without tag', async (done) => {
        const pkgName = 'add-version-test-3';
        const version = '1.0.2';
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        await addNewVersion(pkgName, '1.0.1');
        await addNewVersion(pkgName, '1.0.3');

        storage.addVersion(pkgName, version, generateNewVersion(pkgName, version), 'beta', (err, data) => {
          expect(err).toBeNull();
          expect(data).toBeUndefined();
          done();
        });
      });
    });

    describe('LocalStorage::updateVersions', () => {
      const metadata = JSON.parse(readMetadata('metadata-update-versions-tags'));
      const pkgName = 'add-update-versions-test-1';
      const version = '1.0.2';
      let _storage;
      beforeEach(done => {
        class MockLocalStorage extends LocalStorage {}
        // @ts-ignore
        MockLocalStorage.prototype._writePackage = jest.fn(LocalStorage.prototype._writePackage)
        _storage = getStorage(MockLocalStorage);
        rimRaf(path.join(configExample().storage, pkgName), async () => {
          await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
          await addNewVersion(pkgName, '1.0.1');
          await addNewVersion(pkgName, version);
          done();
        })
      })

      test('should update versions from external source', async (done) => {
        _storage.updateVersions(pkgName, metadata, (err, data) => {
          expect(err).toBeNull();
          expect(_storage._writePackage).toHaveBeenCalledTimes(1);
          expect(data.versions['1.0.1']).toBeDefined();
          expect(data.versions[version]).toBeDefined();
          expect(data.versions['1.0.4']).toBeDefined();
          expect(data[DIST_TAGS]['latest']).toBeDefined();
          expect(data[DIST_TAGS]['latest']).toBe('1.0.1');
          expect(data[DIST_TAGS]['beta']).toBeDefined();
          expect(data[DIST_TAGS]['beta']).toBe('1.0.2');
          expect(data[DIST_TAGS]['next']).toBeDefined();
          expect(data[DIST_TAGS]['next']).toBe('1.0.4');
          expect(data['_rev'] === metadata['_rev']).toBeFalsy();
          expect(data.readme).toBe('readme 1.0.4');
          done();
        });
      });

      test('should not update if the metadata match', done => {
        _storage.updateVersions(pkgName, metadata, e => {
          expect(e).toBeNull()
          _storage.updateVersions(pkgName, metadata, err => {
            expect(err).toBeNull()
            expect(_storage._writePackage).toHaveBeenCalledTimes(1);
            done()
          })
        })
      })
    });

    describe('LocalStorage::changePackage', () => {
      const pkgName = 'change-package';

      test('should unpublish a version', async done => {
        await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
        await addNewVersion(pkgName, '1.0.1');
        await addNewVersion(pkgName, '1.0.2');
        await addNewVersion(pkgName, '1.0.3');
        const metadata = JSON.parse(readMetadata('changePackage/metadata-change'));
        const rev: string = metadata['_rev'];

        storage.changePackage(pkgName, metadata, rev, (err) => {
          expect(err).toBeUndefined();
          storage.getPackageMetadata(pkgName, (err, data ) => {
            expect(err).toBeNull();
            expect(data.versions['1.0.1']).toBeDefined();
            expect(data.versions['1.0.2']).toBeUndefined();
            expect(data.versions['1.0.3']).toBeUndefined();
            done();
          });
        });
      });
    });

    describe('LocalStorage::tarball operations', () => {

      describe('LocalStorage::addTarball', () => {

        test('should add a new tarball', (done) => {
          const tarballData = JSON.parse(readMetadata('addTarball'));
          const stream = storage.addTarball(pkgName, tarballName);

          stream.on('error', (err) => {
            expect(err).toBeNull();
            done();
          });
          stream.on('success', function() {
            done();
          });

          stream.end(Buffer.from(tarballData.data, 'base64'));
          stream.done();
        });

        test('should add a new second tarball', (done) => {
          const tarballData = JSON.parse(readMetadata('addTarball'));
          const stream = storage.addTarball(pkgName, tarballName2);
          stream.on('error', (err) => {
            expect(err).toBeNull();
            done();
          });
          stream.on('success', function() {
            done();
          });

          stream.end(Buffer.from(tarballData.data, 'base64'));
          stream.done();
        });

        test('should fails on add a duplicated new tarball ', (done) => {
          const tarballData = JSON.parse(readMetadata('addTarball'));
          const stream = storage.addTarball(pkgName, tarballName);
          stream.on('error', (err: VerdaccioError) => {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
            expect(err.message).toMatch(/this package is already present/);
            done();
          });
          stream.end(Buffer.from(tarballData.data, 'base64'));
          stream.done();
        });

        test('should fails on add a new tarball on missing package', (done) => {
          const tarballData = JSON.parse(readMetadata('addTarball'));
          const stream = storage.addTarball('unexsiting-package', tarballName);
          stream.on('error', (err: VerdaccioError) => {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
            expect(err.message).toMatch(/no such package available/);
            done();
          });

          stream.on('success', () => {
            done();
          });

          stream.end(Buffer.from(tarballData.data, 'base64'));
          stream.done();
        });

        test('should fails on use invalid package name on add a new tarball', (done) => {
          const stream = storage.addTarball(pkgName, `${pkgName}-fails-add-tarball-1.0.4.tgz`);
          stream.on('error', function(err: VerdaccioError) {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.BAD_DATA);
            expect(err.message).toMatch(/refusing to accept zero-length file/);
            done();
          });

          stream.done();
        });

        test('should fails on abort on add a new tarball', (done) => {
          const stream = storage.addTarball('__proto__', `${pkgName}-fails-add-tarball-1.0.4.tgz`);
          stream.abort();
          stream.on('error', function(err: VerdaccioError) {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.FORBIDDEN);
            expect(err.message).toMatch(/can't use this filename/);
            done();
          });

          stream.done();
        });

      });
      describe('LocalStorage::removeTarball', () => {

        test('should remove a tarball', (done) => {
          storage.removeTarball(pkgName, tarballName2, 'rev', (err, pkg) => {
            expect(err).toBeNull();
            expect(pkg).toBeUndefined();
            done();
          });
        });

        test('should remove a tarball that does not exist', (done) => {
          storage.removeTarball(pkgName, tarballName2, 'rev', (err) => {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
            expect(err.message).toMatch(/no such file available/);
            done();
          });
        });
      });

      describe('LocalStorage::getTarball', () => {
        test('should get a existing tarball', (done) => {
          const stream = storage.getTarball(pkgName, tarballName);
          stream.on('content-length', function(contentLength) {
            expect(contentLength).toBe(279);
            done();
          });
          stream.on('open', function() {
            done();
          });
        });

        test('should fails on get a tarball that does not exist', (done) => {
          const stream = storage.getTarball('fake', tarballName);
          stream.on('error', function(err: VerdaccioError) {
            expect(err).not.toBeNull();
            expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
            expect(err.message).toMatch(/no such file available/);
            done();
          });
        });
      });

      describe('LocalStorage::search', () => {
        test('should find a tarball', (done) => {
          // @ts-ignore
          const stream = storage.search('99999');

          stream.on('data', function each(pkg) {
            expect(pkg.name).toEqual(pkgName);
          });

          stream.on('error', function(err) {
            expect(err).not.toBeNull();
            done();
          });

          stream.on('end', function() {
            done();
          });
        });

      });
    });

    describe('LocalStorage::removePackage', () => {
      test.skip('should remove completely package', (done) => {
        storage.removePackage(pkgName, (err, data) => {
          expect(err).toBeNull();
          expect(data).toBeUndefined();
          done();
        });
      });

      test('should remove completely @scoped package', (done) => {
        storage.removePackage(pkgNameScoped, (err, data) => {
          expect(err).toBeNull();
          expect(data).toBeUndefined();
          done();
        });
      });

      test('should fails with package not found', (done) => {
        const pkgName = 'npm_test_fake';
        storage.removePackage(pkgName, err => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/no such package available/);
          done();
        });
      });

      test('should fails with @scoped package not found', (done) => {
        storage.removePackage(pkgNameScoped, err => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(API_ERROR.NO_PACKAGE);
          done();
        });
      });
    });
  });

});
