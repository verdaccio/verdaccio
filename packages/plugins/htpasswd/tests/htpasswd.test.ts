import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { pluginUtils } from '@verdaccio/core';

import HTPasswd, { DEFAULT_SLOW_VERIFY_MS, HTPasswdConfig } from '../src/htpasswd';

const options = {
  logger: { warn: vi.fn(), info: vi.fn() },
  config: new Config(parseConfigFile(path.join(__dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions;

const config = {
  file: './htpasswd',
  max_users: 1000,
} as HTPasswdConfig;

describe('HTPasswd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = new HTPasswd(config, options);
    vi.resetModules();
    vi.clearAllMocks();

    // @ts-ignore
    crypto.randomBytes = vi.fn(() => {
      return {
        toString: (): string => '$6',
      };
    });
  });

  describe('constructor()', () => {
    const error = vi.fn();
    const warn = vi.fn();
    const info = vi.fn();
    const emptyPluginOptions = {
      config: {
        configPath: '',
      },
      logger: { warn, info, error },
    } as any as pluginUtils.PluginOptions;

    test('should ensure file path configuration exists', () => {
      expect(function () {
        new HTPasswd({} as HTPasswdConfig, emptyPluginOptions);
      }).toThrow(/should specify "file" in config/);
    });

    test('should switch to bcrypt if incorrect algorithm is set', () => {
      let invalidConfig = { algorithm: 'invalid', ...config } as HTPasswdConfig;
      new HTPasswd(invalidConfig, emptyPluginOptions);
      expect(warn).toHaveBeenCalledWith(
        'The algorithm selected %s is invalid, switching to to default one "bcrypt", password validation can be affected',
        'invalid'
      );
      expect(info).toHaveBeenCalled();
    });
  });

  describe('authenticate()', () => {
    test.each([
      { username: 'test1111', password: 'test1111' },
      { username: 'username', password: 'password' },
      { username: 'bcrypt', password: 'password' },
    ])('it should authenticate user $username with given credentials', ({ username, password }) => {
      return new Promise((done) => {
        const generateCallback = (username) => (error, userGroups) => {
          expect(error).toBeNull();
          expect(userGroups).toContain(username);
          done();
        };
        wrapper.adduser(username, password, () => {
          wrapper.authenticate(username, password, generateCallback(username));
        });
      });
    });

    test.each([
      { username: 'test1111', password: 'test1111' },
      { username: 'username', password: 'password' },
      { username: 'bcrypt', password: 'password' },
    ])('it should not authenticate use $username with given credentials', ({ username }) => {
      return new Promise((done) => {
        const generateCallback = () => (error) => {
          expect(error).toBeNull();
          // expect(userGroups).toBeFalsy();
          done();
        };
        wrapper.authenticate(username, 'somerandompassword', generateCallback());
      });
    });

    // TODO: flakes on CI
    test.skip('it should warn on slow password verification', () => {
      return new Promise((done) => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        bcrypt.compare = vi.fn((_passwd, _hash) => {
          return new Promise((resolve) => setTimeout(resolve, DEFAULT_SLOW_VERIFY_MS + 1)).then(
            () => true
          );
        });
        const callback = (a, b): void => {
          expect(a).toBeNull();
          expect(b).toContain('bcrypt');
          const mockWarn = options.logger.warn as any;
          expect(mockWarn.mock.calls.length).toBe(1);
          const [{ user, durationMs }, message] = mockWarn.mock.calls[0];
          expect(user).toEqual('bcrypt');
          expect(durationMs).toBeGreaterThan(DEFAULT_SLOW_VERIFY_MS);
          expect(message).toEqual('Password for user "@{user}" took @{durationMs}ms to verify');
          done(true);
        };
        wrapper.authenticate('bcrypt', 'password', callback);
      });
    });
  });
});
