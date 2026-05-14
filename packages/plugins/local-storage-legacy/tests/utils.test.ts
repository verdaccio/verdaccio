import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { noSuchFile } from '../src/local-fs';
import { loadPrivatePackages } from '../src/pkg-utils';
import { findPackages, getFileStats } from '../src/utils';
import logger from './helpers/Logger';

describe('Utitlies', () => {
  const loadDb = (name): string => path.join(__dirname, '__fixtures__/databases', `${name}.json`);

  beforeEach(() => {
    vi.resetModules();
  });

  test('should load private packages', () => {
    const database = loadDb('ok');
    const db = loadPrivatePackages(database, logger);

    expect(db.list).toHaveLength(15);
  });

  test('should load and empty private packages if database file is valid and empty', () => {
    const database = loadDb('empty');
    const db = loadPrivatePackages(database, logger);

    expect(db.list).toHaveLength(0);
  });

  test('should fails on load private packages', () => {
    const database = loadDb('corrupted');

    expect(() => {
      loadPrivatePackages(database, logger);
    }).toThrow();
  });

  test('should handle null read values and return empty database', () => {
    const spy = vi.spyOn(fs, 'readFileSync');
    spy.mockReturnValue(null);

    const database = loadDb('ok');
    const db = loadPrivatePackages(database, logger);

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
      } catch (e) {
        expect(e.code).toEqual(noSuchFile);
      }
    });

    test('should fetch all packages from valid storage', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      const validator = vi.fn((file) => file.indexOf('.') === -1);
      const pkgs = await findPackages(storage, validator);
      expect(pkgs).toHaveLength(5);
      expect(validator).toHaveBeenCalledTimes(5);
    });

    test('should filter packages by validator', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      // only accept packages named 'pkg1'
      const validator = vi.fn((name) => name === 'pkg1');
      const pkgs = await findPackages(storage, validator);
      // @scoped_test/pkg1 + @scoped_second/pkg1 = 2
      expect(pkgs).toHaveLength(2);
      expect(pkgs.every((p) => p.name.endsWith('pkg1'))).toBe(true);
    });

    test('should return empty array when validator rejects all', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      const validator = vi.fn(() => false);
      const pkgs = await findPackages(storage, validator);
      expect(pkgs).toHaveLength(0);
    });

    test('should include correct path for scoped packages', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      const validator = vi.fn(() => true);
      const pkgs = await findPackages(storage, validator);
      const scoped = pkgs.find((p) => p.name === '@scoped_test/pkg1');
      expect(scoped).toBeDefined();
      expect(scoped.path).toBe(path.resolve(storage, '@scoped_test', 'pkg1'));
    });
  });

  describe('getFileStats', () => {
    test('should return stats for an existing file', async () => {
      const fixturePath = path.join(__dirname, '__fixtures__/databases/ok.json');
      const stats = await getFileStats(fixturePath);
      expect(stats).toBeDefined();
      expect(stats.mtime).toBeInstanceOf(Date);
      expect(stats.size).toBeGreaterThan(0);
    });

    test('should reject for a non-existent file', async () => {
      await expect(getFileStats('./does-not-exist')).rejects.toThrow();
    });
  });
});
