import fs from 'fs';
import os from 'os';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { findConfigFile } from '../src/config-path';

describe('config-path', () => {
  let statSyncMock;
  let mkdirSyncMock;
  let writeFileSyncMock;
  let accessSyncMock;
  let fakeStats = {
    isDirectory: vi.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    // Mock only statSync method
    statSyncMock = vi.spyOn(fs, 'statSync');
    mkdirSyncMock = vi.spyOn(fs, 'mkdirSync');
    writeFileSyncMock = vi.spyOn(fs, 'writeFileSync');
    accessSyncMock = vi.spyOn(fs, 'accessSync');
  });

  afterEach(() => {
    // Restore the original implementation after each test
    statSyncMock.mockRestore();
    vi.unstubAllEnvs();
  });

  function platformPath(path: string): string {
    return path.replace(/\//g, os.platform() === 'win32' ? '\\' : '/');
  }

  describe('findConfigFile', () => {
    describe('using file location from arguments', () => {
      test('with custom location', () => {
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        // Note: on Windows, path contains drive letter
        expect(findConfigFile('/home/user/custom/location/config.yaml')).toMatch(
          platformPath('/home/user/custom/location/config.yaml')
        );
        expect(writeFileSyncMock).not.toHaveBeenCalled();
        expect(mkdirSyncMock).not.toHaveBeenCalled();
      });
    });

    describe('with env variables', () => {
      test('the env XDG_CONFIG_HOME is defined and the directory exist but config file is missing', async () => {
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        // node env variable
        vi.stubEnv('XDG_CONFIG_HOME', '/home/user');

        expect(findConfigFile()).toEqual(platformPath('/home/user/verdaccio/config.yaml'));
        expect(writeFileSyncMock).toHaveBeenCalledWith(
          platformPath('/home/user/verdaccio/config.yaml'),
          expect.stringContaining('packages')
        );
      });

      test('with HOME if directory exist but config file is missing', () => {
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        vi.stubEnv('XDG_CONFIG_HOME', '');
        vi.stubEnv('HOME', '/home/user');
        expect(findConfigFile()).toEqual(platformPath('/home/user/.config/verdaccio/config.yaml'));
        expect(writeFileSyncMock).toHaveBeenCalledWith(
          platformPath('/home/user/.config/verdaccio/config.yaml'),
          expect.stringContaining('packages')
        );
        expect(mkdirSyncMock).toHaveBeenCalledWith(
          platformPath('/home/user/.config/verdaccio'),
          expect.anything()
        );
      });

      describe('error handling', () => {
        test('XDG_CONFIG_HOME is not directory fallback to default', () => {
          // mock
          statSyncMock.mockReturnValue({
            isDirectory: vi.fn().mockReturnValue(false),
          });
          mkdirSyncMock.mockReturnValue(true);
          writeFileSyncMock.mockReturnValue(undefined);
          // node env variable
          vi.stubEnv('XDG_CONFIG_HOME', '/home/user/fail');

          expect(findConfigFile()).toMatch(platformPath('packages/config/verdaccio/config.yaml'));
        });

        // Does not work on Windows
        if (os.platform() !== 'win32') {
          test('no permissions on read default config file', () => {
            vi.stubEnv('XDG_CONFIG_HOME', '/home/user');
            accessSyncMock.mockImplementation(() => {
              throw new Error('error on write file');
            });

            expect(function () {
              findConfigFile();
            }).toThrow(/configuration file does not have enough permissions for reading/);
          });
        }
      });
    });

    // Note: Trying to mock Windows platform leads to different results (incorrect slashes)
    if (os.platform() === 'win32') {
      describe('with Windows env variables', () => {
        test('with relative location', () => {
          // mock
          statSyncMock.mockReturnValue(fakeStats);
          mkdirSyncMock.mockReturnValue(true);
          writeFileSyncMock.mockReturnValue(undefined);
          accessSyncMock.mockImplementation(() => {});
          // delete process.env.XDG_CONFIG_HOME;
          vi.stubEnv('XDG_CONFIG_HOME', '');
          vi.stubEnv('HOME', '');
          vi.stubEnv('APPDATA', 'C:\\Users\\Tester\\AppData\\');
          expect(findConfigFile()).toEqual('C:\\Users\\Tester\\AppData\\verdaccio\\config.yaml');
          expect(writeFileSyncMock).toHaveBeenCalled();
          expect(mkdirSyncMock).toHaveBeenCalled();
        });
      });
    }
  });
});
