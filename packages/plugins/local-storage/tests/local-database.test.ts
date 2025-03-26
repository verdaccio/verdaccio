/* eslint-disable jest/no-mocks-import */
import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { fileUtils, pluginUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import LocalDatabase, { ERROR_DB_LOCKED } from '../src/local-database';
import { ILocalFSPackageManager } from '../src/local-fs';

const TEMP_FOLDER = 'local-storage-plugin';
const STORAGE_FOLDER = 'storage';
const PRIVATE_FOLDER = 'private';

const mockWrite = vi.fn(() => Promise.resolve());
const mockmkdir = vi.fn(() => Promise.resolve());
const mockRead = vi.fn(() => Promise.resolve());

vi.mock('../src/fs', () => ({
  mkdirPromise: () => mockRead(),
  readFilePromise: () => mockmkdir(),
  writeFilePromise: () => mockWrite(),
}));

setup({});

const optionsPlugin: pluginUtils.PluginOptions = {
  logger,
  // @ts-expect-error
  config: null,
};

let locaDatabase: pluginUtils.Storage<{}>;

describe('Local Database', () => {
  let tmpFolder;
  beforeEach(async () => {
    tmpFolder = await fileUtils.createTempFolder(TEMP_FOLDER);
    const tempFolder = path.join(tmpFolder, 'verdaccio-test.yaml');
    locaDatabase = new LocalDatabase(
      // @ts-expect-error
      {
        storage: STORAGE_FOLDER,
        configPath: tempFolder,
        checkSecretKey: () => 'fooX',
        packages: {
          'local-private-package': {
            access: ['$all'],
            publish: ['$authenticated'],
            storage: PRIVATE_FOLDER,
          },
          '**': {
            access: ['$all'],
            publish: ['$authenticated'],
          },
        },
      },
      optionsPlugin.logger
    );
    await (locaDatabase as any).init();
    (locaDatabase as any).clean();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  test('should create an instance', () => {
    expect(locaDatabase).toBeDefined();
  });

  test('should display log error if fails on load database', async () => {
    mockmkdir.mockImplementation(() => {
      throw Error();
    });
    const tmpFolder = await fileUtils.createTempFolder(TEMP_FOLDER);
    const tempFolder = path.join(tmpFolder, 'verdaccio-test.yaml');
    const instance = new LocalDatabase(
      // @ts-expect-error
      {
        storage: STORAGE_FOLDER,
        config_path: tempFolder,
      },
      optionsPlugin.logger
    );

    await expect(instance.init()).rejects.toEqual(new Error(ERROR_DB_LOCKED));
    // expect(optionsPlugin.logger.error).toHaveBeenCalled();
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

  describe('getPackageStorage', () => {
    test('should get default storage', () => {
      const pkgName = 'some-random-package';
      const storage = locaDatabase.getPackageStorage(pkgName);
      expect(storage).toBeDefined();

      if (storage) {
        const storagePath = path
          .normalize((storage as ILocalFSPackageManager).path)
          .toLowerCase()
          .replace(/\\/g, '/');
        expect(storagePath).toMatch(
          new RegExp(`\/verdaccio-${TEMP_FOLDER}-.*\/${STORAGE_FOLDER}\/${pkgName}`)
        );
      }
    });

    test('should use custom storage', () => {
      const pkgName = 'local-private-package';
      const storage = locaDatabase.getPackageStorage(pkgName);

      expect(storage).toBeDefined();

      if (storage) {
        const storagePath = path
          .normalize((storage as ILocalFSPackageManager).path)
          .toLowerCase()
          .replace(/\\/g, '/');
        expect(storagePath).toMatch(
          new RegExp(
            `\/verdaccio-${TEMP_FOLDER}-.*\/${STORAGE_FOLDER}\/${PRIVATE_FOLDER}\/${pkgName}`
          )
        );
      }
    });
  });

  describe('Database CRUD', () => {
    test('should add an item to database', async () => {
      const pgkName = 'jquery';
      const before = await locaDatabase.get();
      expect(before).toHaveLength(0);

      await locaDatabase.add(pgkName);
      const after = await locaDatabase.get();
      expect(after).toHaveLength(1);
    });

    test('should remove an item to database', async () => {
      const pgkName = 'jquery';
      await locaDatabase.add(pgkName);
      await locaDatabase.remove(pgkName);
      const after = await locaDatabase.get();
      expect(after).toHaveLength(0);
    });

    test('should do nothing if an item does not exist', async () => {
      const pgkName = 'jquery';
      await locaDatabase.add(pgkName);
      await expect(locaDatabase.remove('other-package')).resolves.not.toThrow();
      const after = await locaDatabase.get();
      expect(after).toHaveLength(1);
    });
  });

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
