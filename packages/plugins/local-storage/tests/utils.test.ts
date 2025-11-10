import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Logger } from '@verdaccio/types';

import * as readFile from '../src/fs';
import { noSuchFile } from '../src/local-fs';
import { loadPrivatePackages } from '../src/pkg-utils';
import { _dbGenPath, findPackages } from '../src/utils';

const logger: Logger = {
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(),
  warn: vi.fn(),
  http: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn(),
};

describe('Utitlies', () => {
  const loadDb = (name): string => path.join(__dirname, '__fixtures__/databases', `${name}.json`);

  beforeEach(() => {
    vi.resetModules();
  });

  test('should load private packages', async () => {
    const database = loadDb('ok');
    const db = await loadPrivatePackages(database, logger);

    expect(db.list).toHaveLength(15);
  });

  test('should load and empty private packages if database file is valid and empty', async () => {
    const database = loadDb('empty');
    const db = await loadPrivatePackages(database, logger);

    expect(db.list).toHaveLength(0);
  });

  test('should fails on load private packages', async () => {
    const database = loadDb('corrupted');

    await expect(loadPrivatePackages(database, logger)).rejects.toThrow();
  });

  test('should handle null read values and return empty database', async () => {
    const spy = vi.spyOn(readFile, 'readFilePromise');
    spy.mockResolvedValue(null);
    const database = loadDb('ok');
    const db = await loadPrivatePackages(database, logger);

    expect(db.list).toHaveLength(0);

    spy.mockRestore();
  });

  describe('find packages', () => {
    test('should fails on wrong storage path', async () => {
      try {
        await findPackages(
          './no_such_folder_fake',
          vi.fn(() => true)
        );
      } catch (e: any) {
        expect(e.code).toEqual(noSuchFile);
      }
    });

    test('should fetch all packages from valid storage', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      const validator = vi.fn((file) => file.indexOf('.') === -1);
      const pkgs = await findPackages(storage, validator);
      // the result is 7 due number of packages on "findPackages" directory
      expect(pkgs).toHaveLength(5);
      expect(validator).toHaveBeenCalledTimes(8);
    });
  });

  describe('dbGenPath', () => {
    test('should generate a storage path', () => {
      expect(
        _dbGenPath('local.db', {
          storage: './storage',
          configPath: '/etc/foo/config.yaml',
        })
      ).toMatch('local.db');
    });

    test('should verify with empty storage', () => {
      expect(
        _dbGenPath('local.db', {
          storage: '',
          configPath: '/etc/foo/config.yaml',
        })
      ).toMatch('local.db');
    });

    test('should verify with undefined storage', () => {
      expect(
        _dbGenPath('local.db', {
          storage: '',
          configPath: '/etc/foo/config.yaml',
        })
      ).toMatch('local.db');
    });

    test('should verify with config path is invalid', () => {
      expect(
        _dbGenPath('local.db', {
          storage: './storage',
          // @ts-expect-error
          configPath: undefined,
        })
      ).toMatch('local.db');
    });
  });
});
