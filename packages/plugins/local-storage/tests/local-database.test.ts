/* eslint-disable jest/no-mocks-import */
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { fileUtils, pluginUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import LocalDatabase, { ERROR_DB_LOCKED } from '../src/local-database';
import { ILocalFSPackageManager } from '../src/local-fs';

const TEMP_FOLDER = 'local-storage-plugin';
const STORAGE_FOLDER = 'storage';
const PRIVATE_FOLDER = 'private';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockWrite = vi.fn((path, data) => Promise.resolve());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockmkdir = vi.fn((path, options) => Promise.resolve());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockRead = vi.fn((path) => Promise.resolve());

vi.mock('../src/fs', () => ({
  mkdirPromise: (path: string, options?: any) => mockmkdir(path, options),
  readFilePromise: (path: string) => mockRead(path),
  writeFilePromise: (path: string, data: string) => mockWrite(path, data),
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

  test('should create an instance', async () => {
    expect(locaDatabase).toBeDefined();
    const data = await locaDatabase.get();
    expect(data).toEqual([]);
  });

  test('should create database file', async () => {
    const storage = locaDatabase.getPackageStorage('');
    expect(storage).toBeDefined();
    const databaseFile = path.join(
      (storage as ILocalFSPackageManager).path,
      fileUtils.Files.DatabaseName
    );
    expect(databaseFile).toBeDefined();
    expect(mockWrite).toHaveBeenCalledWith(databaseFile, expect.any(String));
  });

  test('should display log error if fails on load database', async () => {
    mockRead.mockImplementation(() => {
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

      const storagePath = path
        .normalize((storage as ILocalFSPackageManager).path)
        .toLowerCase()
        .replace(/\\/g, '/');
      expect(storagePath).toMatch(
        new RegExp(`\/verdaccio-${TEMP_FOLDER}-.*\/${STORAGE_FOLDER}\/${pkgName}`)
      );
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

    test('should prevent path traversal attacks', () => {
      // Create a new instance with malicious package configuration
      const maliciousConfig = {
        storage: STORAGE_FOLDER,
        configPath: path.join(tmpFolder, 'malicious-test.yaml'),
        checkSecretKey: () => 'fooX',
        packages: {
          'malicious-package': {
            access: ['$all'],
            publish: ['$authenticated'],
            storage: '../../../etc/passwd', // Path traversal attempt
          },
        },
      };

      const maliciousDatabase = new LocalDatabase(
        // @ts-expect-error
        maliciousConfig,
        optionsPlugin.logger
      );

      expect(() => {
        maliciousDatabase.getPackageStorage('malicious-package');
      }).toThrow('package-specific path is not under the configured storage directory');
    });

    test('should prevent absolute path attacks', () => {
      // Create a new instance with malicious package configuration using absolute path
      const maliciousConfig = {
        storage: STORAGE_FOLDER,
        configPath: path.join(tmpFolder, 'malicious-absolute-test.yaml'),
        checkSecretKey: () => 'fooX',
        packages: {
          'malicious-absolute-package': {
            access: ['$all'],
            publish: ['$authenticated'],
            storage: 'C:\\Windows\\System32', // Windows absolute path attempt
          },
        },
      };

      const maliciousDatabase = new LocalDatabase(
        // @ts-expect-error
        maliciousConfig,
        optionsPlugin.logger
      );

      expect(() => {
        maliciousDatabase.getPackageStorage('malicious-absolute-package');
      }).toThrow('package-specific path is not under the configured storage directory');
    });
  });

  describe('Database CRUD', () => {
    test('should add an item to database', async () => {
      const pkgName = 'jquery';
      const before = await locaDatabase.get();
      expect(before).toHaveLength(0);

      await locaDatabase.add(pkgName);
      const after = await locaDatabase.get();
      expect(after).toHaveLength(1);
    });

    test('should remove an item to database', async () => {
      const pkgName = 'jquery';
      await locaDatabase.add(pkgName);
      await locaDatabase.remove(pkgName);
      const after = await locaDatabase.get();
      expect(after).toHaveLength(0);
    });

    test('should do nothing if an item does not exist', async () => {
      const pkgName = 'jquery';
      await locaDatabase.add(pkgName);
      await expect(locaDatabase.remove('other-package')).resolves.not.toThrow();
      const after = await locaDatabase.get();
      expect(after).toHaveLength(1);
    });
  });

  test.todo('search');
});
