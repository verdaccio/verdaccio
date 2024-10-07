import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { fileUtils, pluginUtils } from '@verdaccio/core';

import HTPasswd, { HTPasswdConfig } from '../src/htpasswd';

const options = {
  logger: { warn: vi.fn(), info: vi.fn() },
  config: new Config(parseConfigFile(path.join(__dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions;

const config = {
  file: './htpasswd',
  max_users: 1000,
} as HTPasswdConfig;

vi.mock('../src/crypto-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/crypto-utils')>()),
  randomBytes: (): { toString: () => string } => {
    return {
      toString: (): string => '$6',
    };
  },
}));

describe('HTPasswd', () => {
  let wrapper;
  let file;
  beforeEach(async () => {
    const tempPath = await fileUtils.createTempFolder('htpasswd');
    file = path.join(tempPath, './htpasswd');
    wrapper = new HTPasswd({ ...config, file }, options);
    vi.resetModules();
    vi.clearAllMocks();
    await new Promise((done) => {
      wrapper.adduser('sanityCheck', 'test', () => {
        done(true);
      });
    });
  });

  test('changePassword - it should throw an error for user not found', () => {
    return new Promise((done) => {
      const callback = (error, isSuccess): void => {
        expect(error).not.toBeNull();
        expect(error.message).toBe(
          `Unable to change password for user 'usernotpresent': user does not currently exist`
        );
        expect(isSuccess).toBeFalsy();
        done(true);
      };
      wrapper.changePassword('usernotpresent', 'oldPassword', 'newPassword', callback);
    });
  });

  test('changePassword - it should throw an error for wrong password', () => {
    return new Promise((done) => {
      const callback = (error, isSuccess): void => {
        expect(error).not.toBeNull();
        expect(error.message).toBe(
          `Unable to change password for user 'sanityCheck': invalid old password`
        );
        expect(isSuccess).toBeFalsy();
        done(true);
      };
      wrapper.changePassword('sanityCheck', 'wrongPassword', 'newPassword', callback);
    });
  });

  test('changePassword - it should change password', async () => {
    let dataToWrite: any;
    vi.doMock('fs', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('fs')>()),
        writeFile: vi.fn((_name, data, callback) => {
          dataToWrite = data;
          callback();
        }),
      };
    });
    const HTPasswd = (await import('../src/htpasswd')).default;
    const localWrapper = new HTPasswd({ ...config, file }, options);
    await new Promise((done) => {
      const callback = (error, isSuccess): void => {
        expect(error).toBeNull();
        expect(isSuccess).toBeTruthy();
        expect(dataToWrite.indexOf('sanityCheck')).not.toEqual(-1);
        done(true);
      };

      localWrapper.changePassword('sanityCheck', 'test', 'newPassword', callback);
    });
  });
});
