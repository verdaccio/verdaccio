import fs from 'fs';
import { assign } from 'lodash';
import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { Config as VerdaccioConfig } from '@verdaccio/types';

import LocalDatabase from '../src/local-database';
import type LocalFS from '../src/local-fs';
import * as pkgUtils from '../src/pkg-utils';
import MockConfig from './helpers/Config';
import logger from './helpers/Logger';

const optionsPlugin = {
  logger,
  config: new MockConfig() as unknown as VerdaccioConfig,
};

let locaDatabase: LocalDatabase;
let loadPrivatePackages;

describe('Local Database', () => {
  beforeEach(() => {
    const writeMock = vi.spyOn(fs, 'writeFileSync').mockImplementation();
    loadPrivatePackages = vi
      .spyOn(pkgUtils, 'loadPrivatePackages')
      .mockReturnValue({ list: [], secret: '' });
    locaDatabase = new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);
    (locaDatabase as LocalDatabase).clean();
    writeMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        const storagePath = path.normalize((storage as LocalFS).path).toLowerCase();
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
        const storagePath = path.normalize((storage as LocalFS).path).toLowerCase();
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

    test('should not allow path traversal in package name', () => {
      const maliciousName = '../../etc/passwd';
      const storage = locaDatabase.getPackageStorage(maliciousName);
      expect(storage).toBeDefined();

      if (storage) {
        const storagePath = (storage as LocalFS).path;
        const basePath = path.resolve(
          __dirname,
          '__fixtures__',
          optionsPlugin.config.storage || ''
        );
        // the resolved path must stay within the base storage directory
        expect(path.resolve(storagePath).startsWith(basePath)).toBe(true);
        // must not contain traversal sequences
        expect(storagePath).not.toContain('..');
      }
    });
  });

  describe('Database CRUD', () => {
    test('should add an item to database', () => {
      return new Promise<void>((resolve) => {
        const pgkName = 'jquery';
        locaDatabase.get((err, data) => {
          expect(err).toBeNull();
          expect(data).toHaveLength(0);

          locaDatabase.add(pgkName, (err) => {
            expect(err).toBeNull();
            locaDatabase.get((err, data) => {
              expect(err).toBeNull();
              expect(data).toHaveLength(1);
              resolve();
            });
          });
        });
      });
    });

    test('should remove an item to database', () => {
      return new Promise<void>((resolve) => {
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
                resolve();
              });
            });
          });
        });
      });
    });
  });

  describe('search', () => {
    const callSearch = (db, numberTimesCalled): Promise<void> => {
      const onPackageMock = vi.fn((item, cb) => cb());
      const validatorMock = vi.fn(() => true);
      return new Promise<void>((resolve) => {
        db.search(
          onPackageMock,
          function onEnd() {
            expect(onPackageMock).toHaveBeenCalledTimes(numberTimesCalled);
            resolve();
          },
          validatorMock
        );
      });
    };

    test('should find scoped packages', () => {
      // test-storage fixture contains @pkg1/test, pkg1, pkg2
      // with default config only test-storage is scanned, expects 3 packages total
      return callSearch(locaDatabase, 3);
    });

    test('should find non scoped packages', () => {
      const db = new LocalDatabase(
        assign({}, optionsPlugin.config, {
          packages: {},
        }),
        optionsPlugin.logger
      );

      // with no custom package storages, only base storage is scanned
      return callSearch(db, 3);
    });

    test('should fails on read the storage', () => {
      const db = new LocalDatabase(
        assign({}, optionsPlugin.config, {
          storage: './non-existent-storage-path',
          packages: {},
        }),
        optionsPlugin.logger
      );

      return callSearch(db, 0);
    });

    test('should filter packages using validator', () => {
      // validator rejects all names => onPackage should never be called
      const onPackageMock = vi.fn((item, cb) => cb());
      const validatorMock = vi.fn(() => false);
      return new Promise<void>((resolve) => {
        locaDatabase.search(
          onPackageMock,
          function onEnd() {
            expect(onPackageMock).toHaveBeenCalledTimes(0);
            // validator is called for non-scoped folders + scoped sub-folders
            expect(validatorMock).toHaveBeenCalled();
            resolve();
          },
          validatorMock
        );
      });
    });

    test('should emit correct item shape with name, path and time', () => {
      const items: any[] = [];
      const onPackageMock = vi.fn((item, cb) => {
        items.push(item);
        cb();
      });
      const validatorMock = vi.fn(() => true);
      return new Promise<void>((resolve) => {
        locaDatabase.search(
          onPackageMock,
          function onEnd() {
            expect(items.length).toBeGreaterThan(0);
            for (const item of items) {
              expect(item).toHaveProperty('name');
              expect(item).toHaveProperty('path');
              expect(item).toHaveProperty('time');
              expect(typeof item.name).toBe('string');
              expect(typeof item.path).toBe('string');
              expect(typeof item.time).toBe('number');
            }
            // verify scoped package name format
            const scoped = items.find((i) => i.name.startsWith('@'));
            expect(scoped).toBeDefined();
            expect(scoped.name).toMatch(/^@[^/]+\/.+/);
            resolve();
          },
          validatorMock
        );
      });
    });

    test('should propagate onPackage callback errors to onEnd', () => {
      const expectedError = new Error('onPackage failed');
      const onPackageMock = vi.fn((_item, cb) => cb(expectedError));
      const validatorMock = vi.fn(() => true);
      return new Promise<void>((resolve) => {
        locaDatabase.search(
          onPackageMock,
          function onEnd(err) {
            expect(err).toBe(expectedError);
            resolve();
          },
          validatorMock
        );
      });
    });

    test('should search with custom storage paths from packages config', () => {
      // The default config has 'local-private-custom-storage' with storage: 'private_folder'
      // This tests that multiple storage keys are iterated
      const items: any[] = [];
      const onPackageMock = vi.fn((item, cb) => {
        items.push(item);
        cb();
      });
      const validatorMock = vi.fn(() => true);
      return new Promise<void>((resolve) => {
        locaDatabase.search(
          onPackageMock,
          function onEnd() {
            // Should still find packages from test-storage (may error on private_folder but not crash)
            expect(onPackageMock).toHaveBeenCalled();
            resolve();
          },
          validatorMock
        );
      });
    });
  });
});
