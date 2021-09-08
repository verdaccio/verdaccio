/* eslint-disable jest/no-mocks-import */
import path from 'path';
import { dirSync } from 'tmp-promise';

import { IPluginStorage, PluginOptions } from '@verdaccio/types';

import LocalDatabase, { ERROR_DB_LOCKED } from '../src/local-database';

const mockWrite = jest.fn(() => Promise.resolve());
const mockmkdir = jest.fn(() => Promise.resolve());
const mockRead = jest.fn(() => Promise.resolve());

jest.mock('../src/fs', () => ({
  mkdirPromise: () => mockRead(),
  readFilePromise: () => mockmkdir(),
  writeFilePromise: () => mockWrite(),
}));

// FIXME: remove this mocks imports
import logger from './__mocks__/Logger';

// @ts-expect-error
const optionsPlugin: PluginOptions<{}> = {
  logger,
};

let locaDatabase: IPluginStorage<{}>;

describe('Local Database', () => {
  let tmpFolder;
  beforeEach(async () => {
    tmpFolder = dirSync({ unsafeCleanup: true });
    const tempFolder = path.join(tmpFolder.name, 'verdaccio-test.yaml');
    // @ts-expect-error
    locaDatabase = new LocalDatabase(
      // @ts-expect-error
      {
        storage: 'storage',
        config_path: tempFolder,
        checkSecretKey: () => 'fooX',
      },
      optionsPlugin.logger
    );
    await (locaDatabase as any).init();
    (locaDatabase as any).clean();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    // tmpFolder.removeCallback();
  });

  test('should create an instance', () => {
    expect(optionsPlugin.logger.error).not.toHaveBeenCalled();
    expect(locaDatabase).toBeDefined();
  });

  test('should display log error if fails on load database', async () => {
    mockmkdir.mockImplementation(() => {
      throw Error();
    });
    const tmpFolder = dirSync({ unsafeCleanup: true });
    const tempFolder = path.join(tmpFolder.name, 'verdaccio-test.yaml');
    const instance = new LocalDatabase(
      // @ts-expect-error
      {
        storage: 'storage',
        config_path: tempFolder,
      },
      optionsPlugin.logger
    );

    await expect(instance.init()).rejects.toEqual(new Error(ERROR_DB_LOCKED));
    expect(optionsPlugin.logger.error).toHaveBeenCalled();
    tmpFolder.removeCallback();
  });

  describe('should handle secret', () => {
    test('should create get secret', async () => {
      const secretKey = await locaDatabase.getSecret();
      expect(secretKey).toBeDefined();
      expect(typeof secretKey === 'string').toBeTruthy();
    });

    test('should create set secret', async () => {
      await locaDatabase.setSecret('foooo');
      const fetchedSecretKey = await locaDatabase.getSecret();
      expect('foooo').toBe(fetchedSecretKey);
    });
  });

  test.todo('write tarball');
  test.todo('read tarball');

  // describe('getPackageStorage', () => {
  // test('should get default storage', () => {
  //   const pkgName = 'someRandomePackage';
  //   const storage = locaDatabase.getPackageStorage(pkgName);
  //   expect(storage).toBeDefined();

  //   if (storage) {
  //     const storagePath = path.normalize((storage as ILocalFSPackageManager).path).toLowerCase();
  //     expect(storagePath).toBe(
  //       path
  //         .normalize(
  //           path.join(__dirname, '__fixtures__', optionsPlugin.config.storage || '', pkgName)
  //         )
  //         .toLowerCase()
  //     );
  //   }
  // });

  //   test('should use custom storage', () => {
  //     const pkgName = 'local-private-custom-storage';
  //     const storage = locaDatabase.getPackageStorage(pkgName);

  //     expect(storage).toBeDefined();

  //     if (storage) {
  //       const storagePath = path.normalize((storage as ILocalFSPackageManager).path).toLowerCase();
  //       expect(storagePath).toBe(
  //         path
  //           .normalize(
  //             path.join(
  //               __dirname,
  //               '__fixtures__',
  //               optionsPlugin.config.storage || '',
  //               'private_folder',
  //               pkgName
  //             )
  //           )
  //           .toLowerCase()
  //       );
  //     }
  //   });
  // });

  // describe('Database CRUD', () => {
  //   test('should add an item to database', (done) => {
  //     const pgkName = 'jquery';
  //     locaDatabase.get((err, data) => {
  //       expect(err).toBeNull();
  //       expect(data).toHaveLength(0);

  //       locaDatabase.add(pgkName, (err) => {
  //         expect(err).toBeNull();
  //         locaDatabase.get((err, data) => {
  //           expect(err).toBeNull();
  //           expect(data).toHaveLength(1);
  //           done();
  //         });
  //       });
  //     });
  //   });

  //   test('should remove an item to database', (done) => {
  //     const pgkName = 'jquery';
  //     locaDatabase.get((err, data) => {
  //       expect(err).toBeNull();
  //       expect(data).toHaveLength(0);
  //       locaDatabase.add(pgkName, (err) => {
  //         expect(err).toBeNull();
  //         locaDatabase.remove(pgkName, (err) => {
  //           expect(err).toBeNull();
  //           locaDatabase.get((err, data) => {
  //             expect(err).toBeNull();
  //             expect(data).toHaveLength(0);
  //             done();
  //           });
  //         });
  //       });
  //     });
  //   });
  // });

  // describe('search', () => {
  //   const onPackageMock = jest.fn((item, cb) => cb());
  //   const validatorMock = jest.fn(() => true);
  //   const callSearch = (db, numberTimesCalled, cb): void => {
  //     db.search(
  //       onPackageMock,
  //       function onEnd() {
  //         expect(onPackageMock).toHaveBeenCalledTimes(numberTimesCalled);
  //         cb();
  //       },
  //       validatorMock
  //     );
  //   };

  //   test('should find scoped packages', (done) => {
  //     const scopedPackages = ['@pkg1/test'];
  //     const stats = { mtime: new Date() };
  //     jest.spyOn(fs, 'stat').mockImplementation((_, cb) => cb(null, stats as fs.Stats));
  //     jest
  //       .spyOn(fs, 'readdir')
  //       .mockImplementation((storePath, cb) =>
  //         cb(null, storePath.match('test-storage') ? scopedPackages : [])
  //       );

  //     callSearch(locaDatabase, 1, done);
  //   });

  //   test('should find non scoped packages', (done) => {
  //     const nonScopedPackages = ['pkg1', 'pkg2'];
  //     const stats = { mtime: new Date() };
  //     jest.spyOn(fs, 'stat').mockImplementation((_, cb) => cb(null, stats as fs.Stats));
  //     jest
  //       .spyOn(fs, 'readdir')
  //       .mockImplementation((storePath, cb) =>
  //         cb(null, storePath.match('test-storage') ? nonScopedPackages : [])
  //       );

  //     const db = new LocalDatabase(
  //       assign({}, optionsPlugin.config, {
  //         // clean up this, it creates noise
  //         packages: {},
  //       }),
  //       optionsPlugin.logger
  //     );

  //     callSearch(db, 2, done);
  //   });

  //   test('should fails on read the storage', (done) => {
  //     const spyInstance = jest
  //       .spyOn(fs, 'readdir')
  //       .mockImplementation((_, cb) => cb(Error('fails'), null));

  //     const db = new LocalDatabase(
  //       assign({}, optionsPlugin.config, {
  //         // clean up this, it creates noise
  //         packages: {},
  //       }),
  //       optionsPlugin.logger
  //     );

  //     callSearch(db, 0, done);
  //     spyInstance.mockRestore();
  //   });
  // });
});

// NOTE: Crear test para verificar que se crea el storage file
