import path from 'path';
import fs from 'fs';

import { lockFile, unlockFile, readFile } from '../src/index';

interface Error {
  message: string;
}

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
    test('file should be found to be locked', (done) => {
      lockFile(getFilePath('package.json'), (error: Error) => {
        expect(error).toBeNull();
        removeTempFile('package.json.lock');
        done();
      });
    });

    test('file should fail to be found to be locked', (done) => {
      lockFile(getFilePath('package.fail.json'), (error: Error) => {
        expect(error.message).toMatch(/ENOENT: no such file or directory, stat '(.*)package.fail.json'/);
        done();
      });
    });
  });

  describe('unlockFile', () => {
    test('file should to be found to be unLock', (done) => {
      unlockFile(getFilePath('package.json.lock'), (error: Error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe('readFile', () => {
    test('read file with no options should to be found to be read it as string', (done) => {
      readFile(getFilePath('package.json'), {}, (error: Error, data: string) => {
        expect(error).toBeNull();
        expect(data).toMatchInlineSnapshot(`
            "{
              \\"name\\": \\"assets\\",
              \\"version\\": \\"0.0.1\\"
            }
            "
          `);
        done();
      });
    });

    test('read file with no options should to be found to be read it as object', (done) => {
      const options = {
        parse: true,
      };
      readFile(getFilePath('package.json'), options, (error: Error, data: string) => {
        expect(error).toBeNull();
        expect(data).toMatchInlineSnapshot(`
            Object {
              "name": "assets",
              "version": "0.0.1",
            }
          `);
        done();
      });
    });

    test('read file with options (parse) should to be not found to be read it', (done) => {
      const options = {
        parse: true,
      };
      readFile(getFilePath('package.fail.json'), options, (error: Error) => {
        expect(error.message).toMatch(/ENOENT: no such file or directory, open '(.*)package.fail.json'/);
        done();
      });
    });

    test('read file with options should to be found to be read it and fails to be parsed', (done) => {
      const options = {
        parse: true,
      };
      const errorMessage = process.platform === 'win32' ? 'Unexpected token } in JSON at position 47' : 'Unexpected token } in JSON at position 44';
      readFile(getFilePath('wrong.package.json'), options, (error: Error) => {
        expect(error.message).toEqual(errorMessage);
        done();
      });
    });

    test('read file with  options (parse, lock) should to be found to be read it as object', (done) => {
      const options = {
        parse: true,
        lock: true,
      };
      readFile(getFilePath('package2.json'), options, (error: Error, data: string) => {
        expect(error).toBeNull();
        expect(data).toMatchInlineSnapshot(`
            Object {
              "name": "assets",
              "version": "0.0.1",
            }
          `);
        removeTempFile('package2.json.lock');
        done();
      });
    });

    test('read file with options (parse, lock) should to be found to be read it and fails to be parsed', (done) => {
      const options = {
        parse: true,
        lock: true,
      };
      const errorMessage = process.platform === 'win32' ? 'Unexpected token } in JSON at position 47' : 'Unexpected token } in JSON at position 44';
      readFile(getFilePath('wrong.package.json'), options, (error: Error) => {
        expect(error.message).toEqual(errorMessage);
        removeTempFile('wrong.package.json.lock');
        done();
      });
    });
  });
});
