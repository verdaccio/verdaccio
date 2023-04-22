import path from 'path';

import { Config as AppConfig, ROLES, getDefaultConfig } from '@verdaccio/config';
import { errorUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { Config } from '@verdaccio/types';

import { Auth } from '../src';
import { authPluginFailureConf, authPluginPassThrougConf, authProfileConf } from './helper/plugin';

setup({ level: 'debug', type: 'stdout' });

describe('AuthTest', () => {
  test('should init correctly', async () => {
    const config: Config = new AppConfig({ ...authProfileConf });
    config.checkSecretKey('12345');

    const auth: Auth = new Auth(config);
    await auth.init();
    expect(auth).toBeDefined();
  });

  test('should load default auth plugin', async () => {
    const config: Config = new AppConfig({ ...authProfileConf, auth: undefined });
    config.checkSecretKey('12345');

    const auth: Auth = new Auth(config);
    await auth.init();
    expect(auth).toBeDefined();
  });

  test('should load custom algorithm', async () => {
    const config: Config = new AppConfig({
      ...authProfileConf,
      auth: { htpasswd: { algorithm: 'sha1', file: './foo' } },
    });
    config.checkSecretKey('12345');

    const auth: Auth = new Auth(config);
    await auth.init();
    expect(auth).toBeDefined();
  });

  describe('test authenticate method', () => {
    describe('test authenticate states', () => {
      test('should be a success login', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = ['test'];

        auth.authenticate('foo', 'bar', callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null, {
          groups: [
            'test',
            ROLES.$ALL,
            ROLES.$AUTH,
            ROLES.DEPRECATED_ALL,
            ROLES.DEPRECATED_AUTH,
            ROLES.ALL,
          ],
          name: 'foo',
          real_groups: groups,
        });
      });

      test('should be a fail on login', async () => {
        const config: Config = new AppConfig(authPluginFailureConf);
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();

        auth.authenticate('foo', 'bar', callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(errorUtils.getInternalError());
      });
    });

    // plugins are free to send whatever they want, so, we need to test some scenarios
    // that might make break the request
    // the @ts-ignore below are intended
    describe('test authenticate out of control inputs from plugins', () => {
      test('should skip falsy values', async () => {
        const config: Config = new AppConfig({ ...authPluginPassThrougConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        let index = 0;

        // as defined by https://developer.mozilla.org/en-US/docs/Glossary/Falsy
        for (const value of [false, 0, '', null, undefined, NaN]) {
          // @ts-ignore
          auth.authenticate(null, value, callback);
          const call = callback.mock.calls[index++];
          expect(call[0]).toBeDefined();
          expect(call[1]).toBeUndefined();
        }
      });

      test('should error truthy non-array', async () => {
        const config: Config = new AppConfig({ ...authPluginPassThrougConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();

        for (const value of [true, 1, 'test', {}]) {
          expect(function () {
            // @ts-ignore
            auth.authenticate(null, value, callback);
          }).toThrow(TypeError);
          expect(callback).not.toHaveBeenCalled();
        }
      });

      test('should skip empty array', async () => {
        const config: Config = new AppConfig({ ...authPluginPassThrougConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const value = [];

        // @ts-ignore
        auth.authenticate(null, value, callback);
        expect(callback.mock.calls).toHaveLength(1);
        expect(callback.mock.calls[0][0]).toBeDefined();
        expect(callback.mock.calls[0][1]).toBeUndefined();
      });

      test('should accept valid array', async () => {
        const config: Config = new AppConfig({ ...authPluginPassThrougConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        let index = 0;

        for (const value of [[''], ['1'], ['0'], ['000']]) {
          // @ts-ignore
          auth.authenticate(null, value, callback);
          const call = callback.mock.calls[index++];
          expect(call[0]).toBeNull();
          expect(call[1].real_groups).toBe(value);
        }
      });
    });
  });

  describe('test multiple authenticate methods', () => {
    test('should skip falsy values', async () => {
      const config: Config = new AppConfig({
        ...getDefaultConfig(),
        plugins: path.join(__dirname, './partials/plugin'),
        auth: {
          success: {},
          'fail-invalid-method': {},
        },
      });
      config.checkSecretKey('12345');
      const auth: Auth = new Auth(config);
      await auth.init();

      return new Promise((resolve) => {
        auth.authenticate('foo', 'bar', (err, value) => {
          expect(value).toEqual({
            name: 'foo',
            groups: ['test', '$all', '$authenticated', '@all', '@authenticated', 'all'],
            real_groups: ['test'],
          });
          resolve(value);
        });
      });
    });
  });
});
