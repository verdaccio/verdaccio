import os from 'os';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { findConfigFile } from '../src/config-path';

const mockmkDir = vi.fn();
const mockaccessSync = vi.fn();
const mockwriteFile = vi.fn();

// vi.mock('fs', () => {
//   // const fsOri = await vi.importActual('fs');
//   return {
//     // ...fsOri,/
//     statSync: (path) => ({
//       isDirectory: () => {
//         if (path.match(/fail/)) {
//           throw Error('file does not exist');
//         }
//         return true;
//       },
//     }),
//     mkdirSync: () => {},
//     accessSync: (a) => mockaccessSync(a),
//     // mkdirSync: (a) => mockmkDir(a),
//     writeFileSync: (a) => mockwriteFile(a),
//   };
// });

vi.mock('fs');

describe('config-path', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('findConfigFile', () => {
    if (os.platform() !== 'win32') {
      describe('using defiled location from arguments', () => {
        test('with custom location', () => {
          expect(findConfigFile('/home/user/custom/location/config.yaml')).toEqual(
            '/home/user/custom/location/config.yaml'
          );
          expect(mockwriteFile).not.toHaveBeenCalled();
          expect(mockmkDir).not.toHaveBeenCalled();
        });
      });

      // FIXME: need to verify if the mock works fine.
      describe.skip('whith env variables', () => {
        test('with XDG_CONFIG_HOME if directory exist but config file is missing', () => {
          process.env.XDG_CONFIG_HOME = '/home/user';
          expect(findConfigFile()).toEqual('/home/user/verdaccio/config.yaml');
          expect(mockwriteFile).toHaveBeenCalledWith('/home/user/verdaccio/config.yaml');
          expect(mockmkDir).toHaveBeenCalledWith('/home/user/verdaccio');
        });

        test('with HOME if directory exist but config file is missing', () => {
          delete process.env.XDG_CONFIG_HOME;
          process.env.HOME = '/home/user';
          expect(findConfigFile()).toEqual('/home/user/.config/verdaccio/config.yaml');
          expect(mockwriteFile).toHaveBeenCalledWith('/home/user/.config/verdaccio/config.yaml');
          expect(mockmkDir).toHaveBeenCalledWith('/home/user/.config/verdaccio');
        });

        describe('error handling', () => {
          test('XDG_CONFIG_HOME is not directory fallback to default', () => {
            process.env.XDG_CONFIG_HOME = '/home/user/fail';
            mockaccessSync.mockImplementation(() => {});
            mockwriteFile.mockImplementation(() => {});
            expect(findConfigFile()).toMatch('packages/config/verdaccio/config.yaml');
          });

          test('no permissions on read default config file', () => {
            process.env.XDG_CONFIG_HOME = '/home/user';
            mockaccessSync.mockImplementation(() => {
              throw new Error('error on write file');
            });

            expect(function () {
              findConfigFile();
            }).toThrow(/configuration file does not have enough permissions for reading/);
          });
        });
      });

      describe('with no env variables', () => {
        test('with relative location', () => {
          mockaccessSync.mockImplementation(() => {});
          delete process.env.XDG_CONFIG_HOME;
          delete process.env.HOME;
          process.env.APPDATA = '/app/data/';
          expect(findConfigFile()).toMatch('packages/config/verdaccio/config.yaml');
          // expect(mockwriteFile).toHaveBeenCalled();
          // expect(mockmkDir).toHaveBeenCalled();
        });
      });
    } else {
      test('with windows as directory exist but config file is missing', () => {
        delete process.env.XDG_CONFIG_HOME;
        delete process.env.HOME;
        process.env.APPDATA = '/app/data/';
        expect(findConfigFile()).toMatch('\\app\\data\\verdaccio\\config.yaml');
        // expect(mockwriteFile).toHaveBeenCalled();
        // expect(mockmkDir).toHaveBeenCalled();
      });
    }
  });
});
