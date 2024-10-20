import fs from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';

import { lockFileNext, readFileNext, unlockFileNext } from '../src/index';
import { statDir, statFile } from '../src/utils';

const getFilePath = (filename: string): string => {
  return path.resolve(__dirname, `assets/${filename}`);
};

const removeTempFile = (filename: string): void => {
  const filepath = getFilePath(filename);
  fs.unlink(filepath, (error) => {
    if (error) {
      throw error;
    }
  });
};

describe('testing locking', () => {
  describe('lockFile', () => {
    test('file should be found to be locked', async () => {
      await lockFileNext(getFilePath('package.json'));
      removeTempFile('package.json.lock');
    });

    test('file should fail to be found to be locked', async () => {
      await expect(lockFileNext(getFilePath('package.fail.json'))).rejects.toThrow(
        'ENOENT: no such file or directory'
      );
    });
  });

  describe('unlockFile', () => {
    test('file should to be found to be unLock', async () => {
      await expect(unlockFileNext(getFilePath('package.json.lock'))).resolves.toBeUndefined();
    });
  });

  describe('statDir', () => {
    test('error on missing dir', async () => {
      await expect(statDir(getFilePath('package.json/package.json'))).rejects.toThrow(
        'is not a directory'
      );
    });
  });

  describe('statFile', () => {
    test('error on missing dir', async () => {
      await expect(statFile(getFilePath(''))).rejects.toThrow('is not a file');
    });
  });

  describe('readFile', () => {
    test('read file with no options should to be found to be read it as string', async () => {
      const data = await readFileNext(getFilePath('package.json'), {});
      expect(data).toMatchInlineSnapshot(`
        "{
          "name": "assets",
          "version": "0.0.1"
        }
        "
      `);
    });

    test('read file with no options should to be found to be read it as object', async () => {
      const options = {
        parse: true,
      };
      const data = await readFileNext(getFilePath('package.json'), options);
      expect(data).toMatchInlineSnapshot(`
        {
          "name": "assets",
          "version": "0.0.1",
        }
      `);
    });

    test('read file with options (parse) should to be not found to be read it', async () => {
      const options = {
        parse: true,
      };
      await expect(readFileNext(getFilePath('package.fail.json'), options)).rejects.toThrow();
    });

    test('read file with options should be found to be read it and fails to be parsed', async () => {
      const options = {
        parse: true,
      };
      await expect(readFileNext(getFilePath('wrong.package.json'), options)).rejects.toThrow();
    });

    test('read file with options (parse, lock) should be found to be read it as object', async () => {
      const options = {
        parse: true,
        lock: true,
      };
      await expect(readFileNext(getFilePath('package2.json'), options)).resolves
        .toMatchInlineSnapshot(`
        {
          "name": "assets",
          "version": "0.0.1",
        }
      `);
      removeTempFile('package2.json.lock');
    });

    test.skip(
      'read file with options (parse, lock) should be found to be read and ' + 'fails to be parsed',
      async () => {
        const options = {
          parse: true,
          lock: true,
        };
        await expect(readFileNext(getFilePath('wrong.package.json'), options)).rejects.toThrow(
          'Unexpected token } in JSON at position 44'
        );
        removeTempFile('wrong.package.json.lock');
      }
    );
  });
});
