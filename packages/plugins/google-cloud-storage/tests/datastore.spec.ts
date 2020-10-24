import _ from 'lodash';
import { Logger, ILocalPackageManager } from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';
import { HTTP_STATUS } from '@verdaccio/commons-api/lib';

import { ERROR_MISSING_CONFIG } from '../src/data-storage';
import { VerdaccioConfigGoogleStorage } from '../src/types';

import storageConfig from './partials/config';

const loggerDefault: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  child: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
  trace: jest.fn(),
};

describe.skip('Google Cloud Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const getCloudDatabase = (storageConfig, logger = loggerDefault): any => {
    const GoogleCloudDatabase = require('../src/index').default;
    const cloudDatabase = new GoogleCloudDatabase(storageConfig, { logger });

    return cloudDatabase;
  };

  describe('Google Cloud DataStore', () => {
    // **** DataStore

    describe('should test create instances', () => {
      test('should create an instance', () => {
        const cloudDatabase = getCloudDatabase(storageConfig);

        expect(cloudDatabase).toBeDefined();
      });

      test('should fails on create an instance due to bucket name invalid', () => {
        expect(() => {
          const testConf: VerdaccioConfigGoogleStorage = _.clone(storageConfig);
          delete testConf.bucket;

          getCloudDatabase(testConf);
        }).toThrow(new Error('Google Cloud Storage requires a bucket name, please define one.'));
      });

      test('should fails on create an instance fails due projectId invalid', () => {
        expect(() => {
          const testConf: VerdaccioConfigGoogleStorage = _.clone(storageConfig);
          delete testConf.projectId;

          getCloudDatabase(testConf);
        }).toThrow(new Error('Google Cloud Storage requires a ProjectId.'));
      });

      test('should fails on config is not to be provided', () => {
        expect(() => {
          getCloudDatabase(undefined);
        }).toThrow(new Error(ERROR_MISSING_CONFIG));
      });
    });

    describe('DataStore basic calls', () => {
      const pkgName = 'dataBasicItem1';

      test('should add an Entity', (done) => {
        // ** add, remove, get, getPackageStorage
        jest.doMock('../src/storage-helper', () => {
          const originalModule = jest.requireActual('../src/storage-helper').default;

          return {
            __esModule: true,
            default: class Foo extends originalModule {
              public datastore: object;
              public constructor(props) {
                super(props);
                this.datastore = {
                  key: jest.fn(),
                  save: (): Promise<[]> => Promise.resolve([]),
                  createQuery: (): string => 'query',
                  runQuery: (): Promise<object[]> =>
                    Promise.resolve([
                      [
                        {
                          name: pkgName,
                        },
                      ],
                      {},
                    ]),
                };
              }
            },
          };
        });

        const cloudDatabase = getCloudDatabase(storageConfig);
        cloudDatabase.add(pkgName, (err: VerdaccioError) => {
          expect(err).toBeNull();

          cloudDatabase.get((err: VerdaccioError, results: string[]) => {
            expect(results).not.toBeNull();
            expect(err).toBeNull();
            expect(results).toHaveLength(1);
            expect(results[0]).toBe(pkgName);
            done();
          });
        });
      });

      test('should fails add an Entity', (done) => {
        // ** add, remove, get, getPackageStorage
        jest.doMock('../src/storage-helper', () => {
          const originalModule = jest.requireActual('../src/storage-helper').default;

          return {
            __esModule: true,
            default: class Foo extends originalModule {
              public datastore: object;
              public constructor(props) {
                super(props);
                this.datastore = {
                  key: jest.fn(),
                  save: (): Promise<never> => Promise.reject(new Error('')),
                  createQuery: (): string => 'query',
                  runQuery: (): Promise<object[]> =>
                    Promise.resolve([
                      [
                        {
                          name: pkgName,
                        },
                      ],
                      {},
                    ]),
                };
              }
            },
          };
        });

        const cloudDatabase = getCloudDatabase(storageConfig);
        cloudDatabase.add(pkgName, (err: VerdaccioError) => {
          expect(err).not.toBeNull();
          expect(err.code).toEqual(HTTP_STATUS.INTERNAL_ERROR);
          done();
        });
      });

      test('should delete an entity', (done) => {
        const deleteDataStore = jest.fn();

        jest.doMock('../src/storage-helper', () => {
          const originalModule = jest.requireActual('../src/storage-helper').default;

          return {
            __esModule: true,
            default: class Foo extends originalModule {
              public datastore: object;
              public constructor(props) {
                super(props);
                // gcloud sdk uses Symbols for metadata in entities
                const sym = Symbol('name');
                this.datastore = {
                  KEY: sym,
                  key: jest.fn(() => true),
                  int: jest.fn(() => 1),
                  delete: deleteDataStore,
                  createQuery: (): string => 'query',
                  runQuery: (): Promise<object[]> => {
                    const entity = {
                      name: pkgName,
                      id: 1,
                    };
                    entity[sym] = entity;

                    return Promise.resolve([[entity], {}]);
                  },
                };
              }
            },
          };
        });

        const cloudDatabase = getCloudDatabase(storageConfig);

        cloudDatabase.remove(pkgName, (err, result) => {
          expect(err).toBeNull();
          expect(result).not.toBeNull();
          expect(deleteDataStore).toHaveBeenCalled();
          expect(deleteDataStore).toHaveBeenCalledTimes(1);
          done();
        });
      });
      //
      // test('should fails on delete remove an entity', () => {
      //   const cloudDatabase: ILocalData = new GoogleCloudDatabase(storageConfig, { logger });
      //
      //   cloudDatabase.remove('fakeName', err => {
      //     expect(err).not.toBeNull();
      //     expect(err.message).toMatch(/not found/);
      //   });
      // });

      test('should get a new instance package storage', () => {
        const cloudDatabase = getCloudDatabase(storageConfig);
        const store: ILocalPackageManager = cloudDatabase.getPackageStorage('newInstance');
        expect(store).not.toBeNull();
        expect(store).toBeDefined();
      });
    });

    describe('should test non implemented methods', () => {
      test('should test saveToken', (done) => {
        const warn = jest.fn();
        const cloudDatabase = getCloudDatabase(storageConfig, { ...loggerDefault, warn });
        cloudDatabase.saveToken({}).catch(() => {
          expect(warn).toHaveBeenCalled();
          done();
        });
      });

      test('should test deleteToken', (done) => {
        const warn = jest.fn();
        const cloudDatabase = getCloudDatabase(storageConfig, { ...loggerDefault, warn });
        cloudDatabase.deleteToken({}).catch(() => {
          expect(warn).toHaveBeenCalled();
          done();
        });
      });

      test('should test readTokens', (done) => {
        const warn = jest.fn();
        const cloudDatabase = getCloudDatabase(storageConfig, { ...loggerDefault, warn });
        cloudDatabase.readTokens({}).catch(() => {
          expect(warn).toHaveBeenCalled();
          done();
        });
      });

      test('should test search', (done) => {
        const warn = jest.fn();
        const cloudDatabase = getCloudDatabase(storageConfig, { ...loggerDefault, warn });
        cloudDatabase.search(null, () => {
          expect(warn).toHaveBeenCalled();
          done();
        });
      });

      test('should test sync', (done) => {
        const warn = jest.fn();
        const cloudDatabase = getCloudDatabase(storageConfig, { ...loggerDefault, warn });
        cloudDatabase.sync();
        expect(warn).toHaveBeenCalled();
        done();
      });
    });
  });
});
