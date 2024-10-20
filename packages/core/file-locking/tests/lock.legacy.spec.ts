import fs from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';

import { lockFile, readFile, unlockFile } from '../src/index';

interface Error {
  message: string;
}

const getFilePath = (filename: string): string => {
  return path.resolve(__dirname, `assets/legacy/${filename}`);
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
    test('file should be found to be locked', () => {
      return new Promise((done) => {
        lockFile(getFilePath('package.json'), (error: Error) => {
          expect(error).toBeNull();
          removeTempFile('package.json.lock');
          done(true);
        });
      });
    });

    test('file should fail to be found to be locked', () => {
      return new Promise((done) => {
        lockFile(getFilePath('package.fail.json'), (error: Error) => {
          expect(error.message).toMatch(
            /ENOENT: no such file or directory, stat '(.*)package.fail.json'/
          );
          done(true);
        });
      });
    });
  });

  describe('unlockFile', () => {
    test('file should to be found to be unLock', () => {
      return new Promise((done) => {
        unlockFile(getFilePath('package.json.lock'), (error: Error) => {
          expect(error).toBeNull();
          done(true);
        });
      });
    });
  });

  describe('readFile', () => {
    test('read file with no options should to be found to be read it as string', () => {
      return new Promise((done) => {
        readFile(getFilePath('package.json'), {}, (error: Error, data: string) => {
          expect(error).toBeNull();
          expect(data).toMatchInlineSnapshot(`
          "{
            "name": "assets",
            "version": "0.0.1"
          }
          "
        `);
          done(true);
        });
      });
    });

    test('read file with no options should to be found to be read it as object', () => {
      const options = {
        parse: true,
      };
      return new Promise((done) => {
        readFile(getFilePath('package.json'), options, (error: Error, data: string) => {
          expect(error).toBeNull();
          expect(data).toMatchInlineSnapshot(`
          {
            "name": "assets",
            "version": "0.0.1",
          }
        `);
          done(true);
        });
      });
    });

    test('read file with options (parse) should to be not found to be read it', () => {
      const options = {
        parse: true,
      };
      return new Promise((done) => {
        readFile(getFilePath('package.fail.json'), options, (error: Error) => {
          expect(error.message).toMatch(/ENOENT/);
          done(true);
        });
      });
    });

    test('read file with options should be found to be read it and fails to be parsed', () => {
      const options = {
        parse: true,
      };
      return new Promise((done) => {
        readFile(getFilePath('wrong.package.json'), options, (error: Error) => {
          expect(error.message).toBeDefined();
          done(true);
        });
      });
    });

    test('read file with options (parse, lock) should be found to be read it as object', () => {
      const options = {
        parse: true,
        lock: true,
      };
      return new Promise((done) => {
        readFile(getFilePath('package2.json'), options, (error: Error, data: string) => {
          expect(error).toBeNull();
          expect(data).toMatchInlineSnapshot(`
          {
            "name": "assets",
            "version": "0.0.1",
          }
        `);
          removeTempFile('package2.json.lock');
          done(true);
        });
      });
    });

    test.skip(
      'read file with options (parse, lock) should be found to be read and ' + 'fails to be parsed',
      () => {
        const options = {
          parse: true,
          lock: true,
        };
        return new Promise((done) => {
          readFile(getFilePath('wrong.package.json'), options, (error: Error) => {
            expect(error.message).toMatch(/Unexpected token } in JSON at position \d+/);
            removeTempFile('wrong.package.json.lock');
            done(true);
          });
        });
      }
    );
  });
});
