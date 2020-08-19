import path from 'path';
import fs from 'fs';

import { findPackages } from '../src/utils';
import { loadPrivatePackages } from '../src/pkg-utils';
import { noSuchFile } from '../src/local-fs';

// FIXME: remove this mocks imports
// eslint-disable-next-line jest/no-mocks-import
import logger from './__mocks__/Logger';

describe('Utitlies', () => {
  const loadDb = (name): string => path.join(__dirname, '__fixtures__/databases', `${name}.json`);

  beforeEach(() => {
    jest.resetModules();
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
    const spy = jest.spyOn(fs, 'readFileSync');
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
          jest.fn(() => true)
        );
      } catch (e) {
        expect(e.code).toEqual(noSuchFile);
      }
    });

    test('should fetch all packages from valid storage', async () => {
      const storage = path.join(__dirname, '__fixtures__/findPackages');
      const validator = jest.fn((file) => file.indexOf('.') === -1);
      const pkgs = await findPackages(storage, validator);
      // the result is 7 due number of packages on "findPackages" directory
      expect(pkgs).toHaveLength(5);
      expect(validator).toHaveBeenCalledTimes(8);
    });
  });
});
