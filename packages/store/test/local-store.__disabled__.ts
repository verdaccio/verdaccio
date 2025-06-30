// import path from 'node:path';
// import rimRaf from 'rimraf';

// import { Config as AppConfig } from '@verdaccio/config';
// import { API_ERROR, DIST_TAGS, HTTP_STATUS, fileUtils } from '@verdaccio/core';
// import { VerdaccioError } from '@verdaccio/core';
// import { logger, setup } from '@verdaccio/logger';
// import { configExample, generateNewVersion } from '@verdaccio/mock';
// import { Config, MergeTags, Package } from '@verdaccio/types';

// import { LocalStorage, PROTO_NAME } from '../src/local-storage';
// import { generatePackageTemplate } from '../src/storage-utils';
// import { readFile } from './fixtures/test.utils';

// const readMetadata = (fileName = 'metadata') => readFile(`../fixtures/${fileName}`).toString();

// setup([]);

// describe('LocalStorage', () => {
//   let storage: LocalStorage;
//   const pkgName = 'npm_test';
//   const pkgNameScoped = `@scope/${pkgName}-scope`;
//   const tarballName = `${pkgName}-add-tarball-1.0.4.tgz`;
//   const tarballName2 = `${pkgName}-add-tarball-1.0.5.tgz`;

//   const getStorage = (tmpFolder, LocalStorageClass = LocalStorage) => {
//     const config: Config = new AppConfig(
//       configExample({
//         config_path: path.join(tmpFolder, 'storage'),
//       })
//     );

//     return new LocalStorageClass(config, logger);
//   };

//   const getPackageMetadataFromStore = (pkgName: string): Promise<Package> => {
//     return new Promise((resolve) => {
//       storage.getPackageMetadata(pkgName, (err, data) => {
//         resolve(data);
//       });
//     });
//   };

//   const addNewVersion = (pkgName: string, version: string) => {
//     return new Promise((resolve) => {
//       storage.addVersion(
//         pkgName,
//         version,
//         generateNewVersion(pkgName, version),
//         '',
//         (_err, data) => {
//           if (_err) {
//             throw new Error(`Error adding new version: ${_err}`);
//           }
//           resolve(data);
//         }
//       );
//     });
//   };
//   const addTarballToStore = (pkgName: string, tarballName: string) => {
//     return new Promise((resolve, reject) => {
//       const tarballData = JSON.parse(readMetadata('addTarball').toString());
//       const stream = storage.addTarball(pkgName, tarballName);

//       stream.on('error', (err) => {
//         reject(err);
//       });
//       stream.on('success', () => {
//         resolve(true);
//       });

//       stream.end(Buffer.from(tarballData.data, 'base64'));
//       stream.done();
//     });
//   };

//   // const addPackageToStore = (pkgName, metadata) => {
//   //   return new Promise((resolve, reject) => {
//   //     // @ts-ignore
//   //     const pkgStoragePath = storage._getLocalStorage(pkgName);
//   //     // @ts-expect-error
//   //     rimRaf(pkgStoragePath.path, (err) => {
//   //       expect(err).toBeNull();
//   //       storage.addPackage(pkgName, metadata, async (err, data) => {
//   //         if (err) {
//   //           reject(err);
//   //         }

//   //         resolve(data);
//   //       });
//   //     });
//   //   });
//   // };

//   let tmpFolder;

//   beforeEach(async () => {
//     // FIXME: remove tmp folder on afterEach
//     tmpFolder = await fileUtils.createTempFolder('foo');
//     storage = getStorage(tmpFolder);
//     await storage.init();
//   });

//   // describe('LocalStorage', () => {
//   //   // test('should add a package', (done) => {
//   //   //   const metadata = JSON.parse(readMetadata().toString());
//   //   //   // @ts-ignore
//   //   //   const pkgStoragePath = storage._getLocalStorage(pkgName);
//   //   //   // @ts-expect-error
//   //   //   rimRaf(pkgStoragePath.path, (err) => {
//   //   //     expect(err).toBeNull();
//   //   //     storage.addPackage(pkgName, metadata, (_err, data) => {
//   //   //       expect(data.version).toMatch(/1.0.0/);
//   //   //       expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
//   //   //       expect(data.name).toEqual(pkgName);
//   //   //       done();
//   //   //     });
//   //   //   });
//   //   // });

//   //   // test.only('should add a @scope package', (done) => {
//   //   //   const metadata = JSON.parse(readMetadata());
//   //   //   // @ts-ignore
//   //   //   const pkgStoragePath = storage._getLocalStorage(pkgNameScoped);
//   //   //   // @ts-expect-error
//   //   //   rimRaf(pkgStoragePath.path, (err) => {
//   //   //     expect(err).toBeNull();
//   //   //     storage.addPackage(pkgNameScoped, metadata, (err, data) => {
//   //   //       expect(err).toBeNull();
//   //   //       expect(data.version).toMatch(/1.0.0/);
//   //   //       expect(data.dist.tarball).toMatch(/npm_test-1.0.0.tgz/);
//   //   //       expect(data.name).toEqual(pkgName);
//   //   //       done();
//   //   //     });
//   //   //   });
//   //   // });

//   //   // test('should fails on add a package', async () => {
//   //   //   const metadata = JSON.parse(readMetadata());
//   //   //   await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //   //   return new Promise((resolve) => {
//   //   //     storage.addPackage(pkgName, metadata, (err) => {
//   //   //       expect(err).not.toBeNull();
//   //   //       expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
//   //   //       expect(err.message).toMatch(API_ERROR.PACKAGE_EXIST);
//   //   //       resolve(true);
//   //   //     });
//   //   //   });
//   //   // });

//   //   describe('LocalStorage::mergeTags', () => {
//   //     test('should mergeTags', async () => {
//   //       const pkgName = 'merge-tags-test-1';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       await addNewVersion(pkgName, '1.0.0');
//   //       await addNewVersion(pkgName, '2.0.0');
//   //       await addNewVersion(pkgName, '3.0.0');
//   //       const tags: MergeTags = {
//   //         beta: '3.0.0',
//   //         latest: '2.0.0',
//   //       };

//   //       return new Promise((resolve) => {
//   //         storage.mergeTags(pkgName, tags, async (err, data) => {
//   //           expect(err).toBeNull();
//   //           expect(data).toBeUndefined();
//   //           const metadata: Package = await getPackageMetadataFromStore(pkgName);
//   //           expect(metadata[DIST_TAGS]).toBeDefined();
//   //           expect(metadata[DIST_TAGS]['beta']).toBeDefined();
//   //           expect(metadata[DIST_TAGS]['beta']).toBe('3.0.0');
//   //           expect(metadata[DIST_TAGS]['latest']).toBe('2.0.0');
//   //           resolve(data);
//   //         });
//   //       });
//   //     });

//   //     test('should fails mergeTags version not found', async () => {
//   //       const pkgName = 'merge-tags-test-1';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       // const tarballName: string = `${pkgName}-${version}.tgz`;
//   //       await addNewVersion(pkgName, '1.0.0');
//   //       await addNewVersion(pkgName, '2.0.0');
//   //       await addNewVersion(pkgName, '3.0.0');
//   //       const tags: MergeTags = {
//   //         beta: '9999.0.0',
//   //       };

//   //       return new Promise((resolve) => {
//   //         storage.mergeTags(pkgName, tags, async (err) => {
//   //           expect(err).not.toBeNull();
//   //           expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
//   //           expect(err.message).toMatch(API_ERROR.VERSION_NOT_EXIST);
//   //           resolve(tags);
//   //         });
//   //       });
//   //     });

//   //     test('should fails on mergeTags', (done) => {
//   //       const tags: MergeTags = {
//   //         beta: '3.0.0',
//   //         latest: '2.0.0',
//   //       };

//   //       storage.mergeTags('not-found', tags, (err) => {
//   //         expect(err).not.toBeNull();
//   //         expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
//   //         expect(err.message).toMatch(API_ERROR.NO_PACKAGE);
//   //         done();
//   //       });
//   //     });
//   //   });

//   //   describe('LocalStorage::addVersion', () => {
//   //     test('should add new version without tag', async () => {
//   //       const pkgName = 'add-version-test-1';
//   //       const version = '1.0.1';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       const tarballName = `${pkgName}-${version}.tgz`;
//   //       await addNewVersion(pkgName, '9.0.0');
//   //       await addTarballToStore(pkgName, `${pkgName}-9.0.0.tgz`);
//   //       await addTarballToStore(pkgName, tarballName);

//   //       return new Promise((resolve) => {
//   //         storage.addVersion(
//   //           pkgName,
//   //           version,
//   //           generateNewVersion(pkgName, version),
//   //           '',
//   //           (err, data) => {
//   //             expect(err).toBeNull();
//   //             expect(data).toBeUndefined();
//   //             resolve(data);
//   //           }
//   //         );
//   //       });
//   //     });

//   //     test('should fails on add a duplicated version without tag', async () => {
//   //       const pkgName = 'add-version-test-2';
//   //       const version = '1.0.1';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       await addNewVersion(pkgName, version);

//   //       return new Promise((resolve) => {
//   //         storage.addVersion(pkgName, version, generateNewVersion(pkgName, version), '', (err) => {
//   //           expect(err).not.toBeNull();
//   //           expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
//   //           expect(err.message).toMatch(API_ERROR.PACKAGE_EXIST);
//   //           resolve(err);
//   //         });
//   //       });
//   //     });

//   //     test('should fails add new version wrong shasum', async () => {
//   //       const pkgName = 'add-version-test-4';
//   //       const version = '4.0.0';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       const tarballName = `${pkgName}-${version}.tgz`;
//   //       await addTarballToStore(pkgName, tarballName);

//   //       return new Promise((resolve) => {
//   //         storage.addVersion(
//   //           pkgName,
//   //           version,
//   //           generateNewVersion(pkgName, version, 'fake'),
//   //           '',
//   //           (err) => {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.BAD_REQUEST);
//   //             expect(err.message).toMatch(/shasum error/);
//   //             resolve(err);
//   //           }
//   //         );
//   //       });
//   //     });

//   //     test('should add new second version without tag', async () => {
//   //       const pkgName = 'add-version-test-3';
//   //       const version = '1.0.2';
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       await addNewVersion(pkgName, '1.0.1');
//   //       await addNewVersion(pkgName, '1.0.3');
//   //       return new Promise((resolve) => {
//   //         storage.addVersion(
//   //           pkgName,
//   //           version,
//   //           generateNewVersion(pkgName, version),
//   //           'beta',
//   //           (err, data) => {
//   //             expect(err).toBeNull();
//   //             expect(data).toBeUndefined();
//   //             resolve(data);
//   //           }
//   //         );
//   //       });
//   //     });
//   //   });

//   //   describe('LocalStorage::updateVersions', () => {
//   //     const metadata = JSON.parse(readMetadata('metadata-update-versions-tags'));
//   //     const pkgName = 'add-update-versions-test-1';
//   //     const version = '1.0.2';
//   //     let _storage;
//   //     beforeEach(async () => {
//   //       const tmpFolder = await fileUtils.createTempFolder('updateVersions');
//   //       class MockLocalStorage extends LocalStorage {}
//   //       // @ts-ignore
//   //       MockLocalStorage.prototype._writePackage = jest.fn(LocalStorage.prototype._writePackage);
//   //       _storage = getStorage(tmpFolder, MockLocalStorage);
//   //       await _storage.init();
//   //       return new Promise((resolve) => {
//   //         // @ts-expect-error
//   //         rimRaf(path.join(configExample().storage, pkgName), async () => {
//   //           await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //           await addNewVersion(pkgName, '1.0.1');
//   //           await addNewVersion(pkgName, version);
//   //           resolve(pkgName);
//   //         });
//   //       });
//   //     });

//   //     test('should update versions from external source', (done) => {
//   //       _storage.updateVersions(pkgName, metadata, (err, data) => {
//   //         expect(err).toBeNull();
//   //         expect(_storage._writePackage).toHaveBeenCalledTimes(1);
//   //         expect(data.versions['1.0.1']).toBeDefined();
//   //         expect(data.versions[version]).toBeDefined();
//   //         expect(data.versions['1.0.4']).toBeDefined();
//   //         expect(data[DIST_TAGS]['latest']).toBeDefined();
//   //         expect(data[DIST_TAGS]['latest']).toBe('1.0.1');
//   //         expect(data[DIST_TAGS]['beta']).toBeDefined();
//   //         expect(data[DIST_TAGS]['beta']).toBe('1.0.2');
//   //         expect(data[DIST_TAGS]['next']).toBeDefined();
//   //         expect(data[DIST_TAGS]['next']).toBe('1.0.4');
//   //         expect(data['_rev'] === metadata['_rev']).toBeFalsy();
//   //         expect(data.readme).toBe('readme 1.0.4');
//   //         done();
//   //       });
//   //     });

//   //     test('should not update if the metadata match', (done) => {
//   //       _storage.updateVersions(pkgName, metadata, (e) => {
//   //         expect(e).toBeNull();
//   //         _storage.updateVersions(pkgName, metadata, (err) => {
//   //           expect(err).toBeNull();
//   //           expect(_storage._writePackage).toHaveBeenCalledTimes(1);
//   //           done();
//   //         });
//   //       });
//   //     });
//   //   });

//   //   describe('LocalStorage::changePackage', () => {
//   //     const pkgName = 'change-package';

//   //     test('should unpublish a version', async () => {
//   //       await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //       await addNewVersion(pkgName, '1.0.1');
//   //       await addNewVersion(pkgName, '1.0.2');
//   //       await addNewVersion(pkgName, '1.0.3');
//   //       const metadata = JSON.parse(readMetadata('changePackage/metadata-change'));
//   //       const rev: string = metadata['_rev'];

//   //       return new Promise((resolve) => {
//   //         storage.changePackage(pkgName, metadata, rev, (err) => {
//   //           expect(err).toBeUndefined();
//   //           storage.getPackageMetadata(pkgName, (err, data) => {
//   //             expect(err).toBeNull();
//   //             expect(data.versions['1.0.1']).toBeDefined();
//   //             expect(data.versions['1.0.2']).toBeUndefined();
//   //             expect(data.versions['1.0.3']).toBeUndefined();
//   //             resolve(data);
//   //           });
//   //         });
//   //       });
//   //     });
//   //   });

//   //   describe('LocalStorage::tarball operations', () => {
//   //     describe('LocalStorage::addTarball', () => {
//   //       test('should add a new tarball', async () => {
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         const tarballData = JSON.parse(readMetadata('addTarball'));
//   //         const stream = storage.addTarball(pkgName, tarballName);
//   //         stream.end(Buffer.from(tarballData.data, 'base64'));
//   //         stream.done();
//   //         return new Promise((resolve, reject) => {
//   //           stream.on('error', (err) => {
//   //             reject(err);
//   //           });
//   //           stream.on('success', function () {
//   //             resolve(true);
//   //           });
//   //         });
//   //       });

//   //       test('should fails on add a duplicated new tarball', async () => {
//   //         const tarballData = JSON.parse(readMetadata('addTarball'));
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         await addNewVersion(pkgName, '9.0.0');
//   //         const tarballName = `${pkgName}-9.0.0.tgz`;
//   //         await addTarballToStore(pkgName, tarballName);
//   //         const stream = storage.addTarball(pkgName, tarballName);
//   //         stream.end(Buffer.from(tarballData.data, 'base64'));
//   //         stream.done();
//   //         return new Promise((resolve, reject) => {
//   //           stream.on('error', (err: VerdaccioError) => {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.CONFLICT);
//   //             expect(err.message).toMatch(/this package is already present/);
//   //             resolve(true);
//   //           });
//   //           stream.on('succes', (err) => {
//   //             reject(err);
//   //           });
//   //         });
//   //       });

//   //       test('should fails on add a new tarball on missing package', async () => {
//   //         const tarballData = JSON.parse(readMetadata('addTarball'));
//   //         const stream = storage.addTarball('unexsiting-package', tarballName);
//   //         stream.end(Buffer.from(tarballData.data, 'base64'));
//   //         stream.done();
//   //         return new Promise((resolve) => {
//   //           stream.on('error', (err: VerdaccioError) => {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
//   //             expect(err.message).toMatch(/no such package available/);
//   //             resolve(true);
//   //           });

//   //           stream.on('success', () => {
//   //             resolve(true);
//   //           });
//   //         });
//   //       });

//   //       test('should fails on use invalid content-legnth on add a new tarball', async () => {
//   //         // FIXME: there is a race condition here that and slow down the test
//   //         // might be the related with stream.done(); call.
//   //         const pkgName = 'pkg-name';
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         await addNewVersion(pkgName, '9.0.0');
//   //         const stream = storage.addTarball(pkgName, `${pkgName}-9.0.0.tgz`);

//   //         return new Promise((resolve) => {
//   //           stream.on('error', function (err: VerdaccioError) {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.BAD_DATA);
//   //             expect(err.message).toMatch(/refusing to accept zero-length file/);
//   //             resolve(true);
//   //           });
//   //           // to make this fail we avoid feed the stream
//   //           stream.done();
//   //         });
//   //       });

//   //       test('should fails forbidden name on add tarball', async () => {
//   //         const pkgName = PROTO_NAME;
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         await addNewVersion(pkgName, '9.0.0');
//   //         const stream = storage.addTarball(pkgName, `${pkgName}-9.0.0.tgz`);
//   //         return new Promise((resolve) => {
//   //           stream.on('error', function (err: VerdaccioError) {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.FORBIDDEN);
//   //             resolve(true);
//   //           });
//   //           stream.done();
//   //         });
//   //       });

//   //       test.todo('should fails on update data afer add version');

//   //       // TODO: restore when abort signal is being handled correctly
//   //       test.skip('should fails on abort on add a new tarball', (done) => {
//   //         const stream = storage.addTarball('__proto__', `${pkgName}-fails-add-tarball-1.0.4.tgz`);
//   //         stream.abort();
//   //         stream.on('error', function (err: VerdaccioError) {
//   //           expect(err).not.toBeNull();
//   //           expect(err.statusCode).toEqual(HTTP_STATUS.FORBIDDEN);
//   //           expect(err.message).toMatch(/can't use this filename/);
//   //           done();
//   //         });

//   //         stream.done();
//   //       });
//   //     });

//   //     describe('removeTarball', () => {
//   //       test('should remove a tarball', async () => {
//   //         const pkgName = `remove-tarball-package`;
//   //         const tarballName = `${pkgName}-9.0.1.tgz`;
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         await addNewVersion(pkgName, '9.0.1');
//   //         await addTarballToStore(pkgName, tarballName);
//   //         return new Promise((resolve) => {
//   //           storage.removeTarball(pkgName, tarballName, 'rev', (err) => {
//   //             expect(err).toBeNull();
//   //             resolve(true);
//   //           });
//   //         });
//   //       });

//   //       test('should remove a tarball that does not exist', async () => {
//   //         const pkgName = `remove-tarball-package-does-not-exist`;
//   //         await addPackageToStore(pkgName, generatePackageTemplate(pkgName));
//   //         await addNewVersion(pkgName, '9.0.1');
//   //         return new Promise((resolve) => {
//   //           storage.removeTarball(pkgName, tarballName2, 'rev', (err) => {
//   //             expect(err).not.toBeNull();
//   //             expect(err.statusCode).toEqual(HTTP_STATUS.NOT_FOUND);
//   //             expect(err.message).toMatch(/no such file available/);
//   //             resolve(true);
//   //           });
//   //         });
//   //       });
//   //     });
//   //   });

//   //   describe('removePackage', () => {
//   //     test('should remove completely package', async () => {
//   //       const pkgNameScoped = `non-scoped-package`;
//   //       await addPackageToStore(pkgNameScoped, generatePackageTemplate(pkgNameScoped));
//   //       await addNewVersion(pkgNameScoped, '9.0.0');
//   //       await addNewVersion(pkgNameScoped, '9.0.1');
//   //       await addTarballToStore(pkgNameScoped, `package-9.0.0.tgz`);
//   //       await addTarballToStore(pkgNameScoped, `package-9.0.1.tgz`);
//   //       await storage.removePackage(pkgNameScoped);
//   //     });

//   //     test('should remove completely @scoped package', async () => {
//   //       const pkgNameScoped = `@remove/package`;
//   //       await addPackageToStore(pkgNameScoped, generatePackageTemplate(pkgNameScoped));
//   //       await addNewVersion(pkgNameScoped, '9.0.0');
//   //       await addNewVersion(pkgNameScoped, '9.0.1');
//   //       await addTarballToStore(pkgNameScoped, `package-9.0.0.tgz`);
//   //       await addTarballToStore(pkgNameScoped, `package-9.0.1.tgz`);
//   //       await storage.removePackage(pkgNameScoped);
//   //     });

//   //     test('should fails with package not found', async () => {
//   //       const pkgName = 'npm_test_fake';
//   //       await expect(storage.removePackage(pkgName)).rejects.toThrow(API_ERROR.NO_PACKAGE);
//   //     });

//   //     test('should fails with @scoped package not found', async () => {
//   //       const pkgNameScoped = `@remove/package`;
//   //       await expect(storage.removePackage(pkgNameScoped)).rejects.toThrow(API_ERROR.NO_PACKAGE);
//   //     });
//   //   });
//   // });
// });
