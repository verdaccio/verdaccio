/* eslint-disable jest/no-mocks-import */
import fs from 'fs';
import path from 'path';

import { assign } from 'lodash';
import { ILocalData, PluginOptions, Token } from '@verdaccio/types';

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

let locaDatabase: ILocalData<{}>;
let loadPrivatePackages;

describe('Local Database', () => {
  beforeEach(() => {
    const writeMock = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    loadPrivatePackages = jest
      .spyOn(pkgUtils, 'loadPrivatePackages')
      .mockReturnValue({ list: [], secret: '' });
    locaDatabase = new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);
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

  test('should display log error if fails on load database', () => {
    loadPrivatePackages.mockImplementation(() => {
      throw Error();
    });

    new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);

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

  describe('token', () => {
    let token: Token;

    beforeEach(() => {
      (locaDatabase as LocalDatabase).tokenDb = {
        put: jest.fn().mockImplementation((key, value, cb) => cb()),
        del: jest.fn().mockImplementation((key, cb) => cb()),
        createReadStream: jest.fn(),
      };

      token = {
        user: 'someUser',
        viewToken: 'viewToken',
        key: 'someHash',
        readonly: true,
        createdTimestamp: new Date().getTime(),
      };
    });

    test('should save token', async (done) => {
      const db = (locaDatabase as LocalDatabase).tokenDb;

      await locaDatabase.saveToken(token);

      expect(db.put).toHaveBeenCalledWith('someUser:someHash', token, expect.anything());
      done();
    });

    test('should delete token', async (done) => {
      const db = (locaDatabase as LocalDatabase).tokenDb;

      await locaDatabase.deleteToken('someUser', 'someHash');

      expect(db.del).toHaveBeenCalledWith('someUser:someHash', expect.anything());
      done();
    });

    test('should get tokens', async () => {
      const db = (locaDatabase as LocalDatabase).tokenDb;
      const events = { on: {}, once: {} };
      const stream = {
        on: (event, cb): void => {
          events.on[event] = cb;
        },
        once: (event, cb): void => {
          events.once[event] = cb;
        },
      };
      db.createReadStream.mockImplementation(() => stream);
      setTimeout(() => events.on['data']({ value: token }));
      setTimeout(() => events.once['end']());

      const tokens = await locaDatabase.readTokens({ user: 'someUser' });

      expect(db.createReadStream).toHaveBeenCalledWith({
        gte: 'someUser:',
        lte: 't',
      });
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toBe(token);
    });

    test('should fail getting tokens if something goes wrong', async () => {
      const db = (locaDatabase as LocalDatabase).tokenDb;
      const events = { on: {}, once: {} };
      const stream = {
        on: (event, cb): void => {
          events.on[event] = cb;
        },
        once: (event, cb): void => {
          events.once[event] = cb;
        },
      };
      db.createReadStream.mockImplementation(() => stream);
      setTimeout(() => events.once['error'](new Error('Unexpected error!')));

      await expect(locaDatabase.readTokens({ user: 'someUser' })).rejects.toThrow(
        'Unexpected error!'
      );
    });
  });
});
