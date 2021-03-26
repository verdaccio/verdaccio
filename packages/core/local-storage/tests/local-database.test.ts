/* eslint-disable jest/no-mocks-import */
import fs from 'fs';
import path from 'path';

import { assign } from 'lodash';
import { IPluginStorage, PluginOptions } from '@verdaccio/types';

import LocalDatabase from '../src/local-database';
import { ILocalFSPackageManager } from '../src/local-fs';
import * as pkgUtils from '../src/pkg-utils';

// FIXME: remove this mocks imports
import Config from './__mocks__/Config';
import logger from './__mocks__/Logger';

const optionsPlugin: PluginOptions<{}> = {
  logger,
  config: new Config(),
};

let locaDatabase: IPluginStorage<{}>;
let loadPrivatePackages;

describe('Local Database', () => {
  beforeEach(async () => {
    const writeMock = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    loadPrivatePackages = jest
      .spyOn(pkgUtils, 'loadPrivatePackages')
      .mockResolvedValue({ list: [], secret: '' });
    locaDatabase = new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);
    await (locaDatabase as LocalDatabase).init();
    (locaDatabase as LocalDatabase).clean();
    writeMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an instance', () => {
    expect(optionsPlugin.logger.error).not.toHaveBeenCalled();
    expect(locaDatabase).toBeDefined();
  });

  test('should display log error if fails on load database', async () => {
    loadPrivatePackages.mockImplementation(() => {
      throw Error();
    });

    const instance = new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);
    await instance.init();

    expect(optionsPlugin.logger.error).toHaveBeenCalled();
    expect(optionsPlugin.logger.error).toHaveBeenCalledTimes(2);
  });

  describe('should create set secret', () => {
    test('should create get secret', async () => {
      const secretKey = await locaDatabase.getSecret();

      expect(secretKey).toBeDefined();
      expect(typeof secretKey === 'string').toBeTruthy();
    });

    test('should create set secret', async () => {
      await locaDatabase.setSecret(optionsPlugin.config.checkSecretKey(''));

      expect(optionsPlugin.config.secret).toBeDefined();
      expect(typeof optionsPlugin.config.secret === 'string').toBeTruthy();

      const fetchedSecretKey = await locaDatabase.getSecret();
      expect(optionsPlugin.config.secret).toBe(fetchedSecretKey);
    });
  });

  describe('getPackageStorage', () => {
    test('should get default storage', () => {
      const pkgName = 'someRandomePackage';
      const storage = locaDatabase.getPackageStorage(pkgName);
      expect(storage).toBeDefined();

      if (storage) {
        const storagePath = path.normalize((storage as ILocalFSPackageManager).path).toLowerCase();
        expect(storagePath).toBe(
          path
            .normalize(
              path.join(__dirname, '__fixtures__', optionsPlugin.config.storage || '', pkgName)
            )
            .toLowerCase()
        );
      }
    });

    test('should use custom storage', () => {
      const pkgName = 'local-private-custom-storage';
      const storage = locaDatabase.getPackageStorage(pkgName);

      expect(storage).toBeDefined();

      if (storage) {
        const storagePath = path.normalize((storage as ILocalFSPackageManager).path).toLowerCase();
        expect(storagePath).toBe(
          path
            .normalize(
              path.join(
                __dirname,
                '__fixtures__',
                optionsPlugin.config.storage || '',
                'private_folder',
                pkgName
              )
            )
            .toLowerCase()
        );
      }
    });
  });

  describe('Database CRUD', () => {
    test('should add an item to database', (done) => {
      const pgkName = 'jquery';
      locaDatabase.get((err, data) => {
        expect(err).toBeNull();
        expect(data).toHaveLength(0);

        locaDatabase.add(pgkName, (err) => {
          expect(err).toBeNull();
          locaDatabase.get((err, data) => {
            expect(err).toBeNull();
            expect(data).toHaveLength(1);
            done();
          });
        });
      });
    });

    test('should remove an item to database', (done) => {
      const pgkName = 'jquery';
      locaDatabase.get((err, data) => {
        expect(err).toBeNull();
        expect(data).toHaveLength(0);
        locaDatabase.add(pgkName, (err) => {
          expect(err).toBeNull();
          locaDatabase.remove(pgkName, (err) => {
            expect(err).toBeNull();
            locaDatabase.get((err, data) => {
              expect(err).toBeNull();
              expect(data).toHaveLength(0);
              done();
            });
          });
        });
      });
    });
  });

  describe('search', () => {
    const onPackageMock = jest.fn((item, cb) => cb());
    const validatorMock = jest.fn(() => true);
    const callSearch = (db, numberTimesCalled, cb): void => {
      db.search(
        onPackageMock,
        function onEnd() {
          expect(onPackageMock).toHaveBeenCalledTimes(numberTimesCalled);
          expect(validatorMock).toHaveBeenCalledTimes(numberTimesCalled);
          cb();
        },
        validatorMock
      );
    };

    test('should find scoped packages', (done) => {
      const scopedPackages = ['@pkg1/test'];
      const stats = { mtime: new Date() };
      jest.spyOn(fs, 'stat').mockImplementation((_, cb) => cb(null, stats as fs.Stats));
      jest
        .spyOn(fs, 'readdir')
        .mockImplementation((storePath, cb) =>
          cb(null, storePath.match('test-storage') ? scopedPackages : [])
        );

      callSearch(locaDatabase, 1, done);
    });

    test('should find non scoped packages', (done) => {
      const nonScopedPackages = ['pkg1', 'pkg2'];
      const stats = { mtime: new Date() };
      jest.spyOn(fs, 'stat').mockImplementation((_, cb) => cb(null, stats as fs.Stats));
      jest
        .spyOn(fs, 'readdir')
        .mockImplementation((storePath, cb) =>
          cb(null, storePath.match('test-storage') ? nonScopedPackages : [])
        );

      const db = new LocalDatabase(
        assign({}, optionsPlugin.config, {
          // clean up this, it creates noise
          packages: {},
        }),
        optionsPlugin.logger
      );

      callSearch(db, 2, done);
    });

    test('should fails on read the storage', (done) => {
      const spyInstance = jest
        .spyOn(fs, 'readdir')
        .mockImplementation((_, cb) => cb(Error('fails'), null));

      const db = new LocalDatabase(
        assign({}, optionsPlugin.config, {
          // clean up this, it creates noise
          packages: {},
        }),
        optionsPlugin.logger
      );

      callSearch(db, 0, done);
      spyInstance.mockRestore();
    });
  });
});

// NOTE: Crear test para verificar que se crea el storage file
