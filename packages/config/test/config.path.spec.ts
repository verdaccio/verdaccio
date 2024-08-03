import fs from 'fs';
import os from 'os';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { findConfigFile } from '../src/config-path';

describe('config-path', () => {
  let statSyncMock;
  let mkdirSyncMock;
  let writeFileSyncMock;
  let platformMock;
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
    platformMock = vi.spyOn(os, 'platform');
    platformMock.mockReturnValue('linux');
  });

  afterEach(() => {
    // Restore the original implementation after each test
    statSyncMock.mockRestore();
    vi.unstubAllEnvs();
  });

  describe('findConfigFile', () => {
    describe('using defiled location from arguments', () => {
      test('with custom location', () => {
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        expect(findConfigFile('/home/user/custom/location/config.yaml')).toEqual(
          '/home/user/custom/location/config.yaml'
        );
        expect(writeFileSyncMock).not.toHaveBeenCalled();
        expect(mkdirSyncMock).not.toHaveBeenCalled();
      });
    });

    describe('whith env variables', () => {
      test('the env XDG_CONFIG_HOME is defined and the directory exist but config file is missing', async () => {
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        // node env variable
        vi.stubEnv('XDG_CONFIG_HOME', '/home/user');

        expect(findConfigFile()).toEqual('/home/user/verdaccio/config.yaml');
        expect(writeFileSyncMock).toHaveBeenCalledWith(
          '/home/user/verdaccio/config.yaml',
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
        expect(findConfigFile()).toEqual('/home/user/.config/verdaccio/config.yaml');
        expect(writeFileSyncMock).toHaveBeenCalledWith(
          '/home/user/.config/verdaccio/config.yaml',
          expect.stringContaining('packages')
        );
        expect(mkdirSyncMock).toHaveBeenCalledWith(
          '/home/user/.config/verdaccio',
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

          expect(findConfigFile()).toMatch('packages/config/verdaccio/config.yaml');
        });

        test('no permissions on read default config file', () => {
          vi.stubEnv('XDG_CONFIG_HOME', '/home/user');
          accessSyncMock.mockImplementation(() => {
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
        // mock
        statSyncMock.mockReturnValue(fakeStats);
        mkdirSyncMock.mockReturnValue(true);
        writeFileSyncMock.mockReturnValue(undefined);
        accessSyncMock.mockImplementation(() => {});
        platformMock.mockReturnValue('win32');
        // delete process.env.XDG_CONFIG_HOME;
        vi.stubEnv('XDG_CONFIG_HOME', '');
        vi.stubEnv('HOME', '');
        vi.stubEnv('APPDATA', '/app/data/');
        expect(findConfigFile()).toMatch('/app/data/verdaccio/config.yaml');
        expect(writeFileSyncMock).toHaveBeenCalled();
        expect(mkdirSyncMock).toHaveBeenCalled();
      });
    });
  });
});
