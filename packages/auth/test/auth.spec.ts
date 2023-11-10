import express, { NextFunction } from 'express';
import path from 'path';
import supertest from 'supertest';

import { Config as AppConfig, ROLES, getDefaultConfig } from '@verdaccio/config';
import { API_ERROR, HEADERS, HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { Config } from '@verdaccio/types';

import { $RequestExtend, $ResponseExtend, Auth } from '../src';
import { authPluginFailureConf, authPluginPassThrougConf, authProfileConf } from './helper/plugin';

setup({});

describe('AuthTest', () => {
  describe('default', () => {
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
  });

  describe('utils', () => {
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
  });

  describe('authenticate', () => {
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
              groups: ['test', ROLES.$ALL, '$authenticated', '@all', '@authenticated', 'all'],
              real_groups: ['test'],
            });
            resolve(value);
          });
        });
      });
    });
  });

  describe('allow_access', () => {
    describe('no custom allow_access implementation provided', () => {
      // when allow_access is not implemented, the groups must match
      // exactly with the packages access group
      test('should fails if groups do not match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = ['test'];

        auth.allow_access(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getForbidden('user foo is not allowed to access package foo')
        );
      });

      test('should success if groups do not match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        // $all comes from configuration file
        const groups = [ROLES.$ALL];

        auth.allow_access(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null, true);
      });
    });
  });

  describe('allow_publish', () => {
    describe('no custom allow_publish implementation provided', () => {
      // when allow_access is not implemented, the groups must match
      // exactly with the packages access group
      test('should fails if groups do not match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = ['test'];

        auth.allow_publish(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getForbidden('user foo is not allowed to publish package foo')
        );
      });

      test('should success if groups do match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        // $all comes from configuration file
        const groups = [ROLES.$AUTH];

        auth.allow_publish(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null, true);
      });
    });
  });
  describe('allow_unpublish', () => {
    describe('no custom allow_unpublish implementation provided', () => {
      test('should fails if groups do not match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');

        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = ['test'];

        auth.allow_unpublish(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getForbidden('user foo is not allowed to unpublish package foo')
        );
      });

      test('should handle missing unpublish method (special case to handle legacy configurations)', async () => {
        const config: Config = new AppConfig({
          ...authProfileConf,
          packages: {
            ...authProfileConf.packages,
            '**': {
              access: ['$all'],
              publish: ['$authenticated'],
              // it forces publish handle the access
              unpublish: undefined,
              proxy: ['npmjs'],
            },
          },
        });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = ['test'];

        auth.allow_unpublish(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getForbidden('user foo is not allowed to publish package foo')
        );
      });

      test('should success if groups do match exactly', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });

        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();
        // $all comes from configuration file
        const groups = [ROLES.$AUTH];

        auth.allow_unpublish(
          { packageName: 'foo' },
          { name: 'foo', groups, real_groups: groups },
          callback
        );

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null, true);
      });
    });
  });

  describe('add_user', () => {
    describe('error handling', () => {
      // when allow_access is not implemented, the groups must match
      // exactly with the packages access group
      test('should fails with bad password if adduser is not implemented', async () => {
        const config: Config = new AppConfig({ ...authProfileConf });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();

        auth.add_user('juan', 'password', callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getConflict(API_ERROR.BAD_USERNAME_PASSWORD)
        );
      });

      test('should fails if adduser fails internally (exception)', async () => {
        const config: Config = new AppConfig({
          ...getDefaultConfig(),
          plugins: path.join(__dirname, './partials/plugin'),
          auth: {
            adduser: {},
          },
        });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();

        // note: fail uas username make plugin fails
        auth.add_user('fail', 'password', callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(new Error('bad username'));
      });

      test('should skip to the next plugin and fails', async () => {
        const config: Config = new AppConfig({
          ...getDefaultConfig(),
          plugins: path.join(__dirname, './partials/plugin'),
          auth: {
            adduser: {},
            // plugin implement adduser with fail auth
            fail: {},
          },
        });
        config.checkSecretKey('12345');
        const auth: Auth = new Auth(config);
        await auth.init();
        expect(auth).toBeDefined();

        const callback = jest.fn();

        // note: fail uas username make plugin fails
        auth.add_user('skip', 'password', callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(
          errorUtils.getConflict(API_ERROR.BAD_USERNAME_PASSWORD)
        );
      });
    });
    test('should success if adduser', async () => {
      const config: Config = new AppConfig({
        ...getDefaultConfig(),
        plugins: path.join(__dirname, './partials/plugin'),
        auth: {
          adduser: {},
        },
      });
      config.checkSecretKey('12345');
      const auth: Auth = new Auth(config);
      await auth.init();
      expect(auth).toBeDefined();

      const callback = jest.fn();

      auth.add_user('something', 'password', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, {
        groups: ['test', '$all', '$authenticated', '@all', '@authenticated', 'all'],
        name: 'something',
        real_groups: ['test'],
      });
    });
    test('should handle legacy add_user method', async () => {
      const config: Config = new AppConfig({
        ...getDefaultConfig(),
        plugins: path.join(__dirname, './partials/plugin'),
        auth: {
          'adduser-legacy': {},
        },
      });
      config.checkSecretKey('12345');
      const auth: Auth = new Auth(config);
      await auth.init();
      expect(auth).toBeDefined();

      const callback = jest.fn();

      auth.add_user('something', 'password', callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, {
        groups: ['test', '$all', '$authenticated', '@all', '@authenticated', 'all'],
        name: 'something',
        real_groups: ['test'],
      });
    });
  });
  describe('middleware', () => {
    test('should init correctly', async () => {
      const app = express();
      const config: Config = new AppConfig({ ...authProfileConf });
      config.checkSecretKey('12345');
      const auth: Auth = new Auth(config);
      await auth.init();

      app.use(express.json());
      app.use(auth.apiJWTmiddleware());
      app.get('/*', (req: $RequestExtend, res: $ResponseExtend, next: NextFunction) => {
        if (req.remote_user.error) {
          next(new Error(req.remote_user.error));
        } else {
          next({ ok: true });
        }
      });

      return supertest(app)
        .get(`/`)
        .set(HEADERS.AUTHORIZATION, 'Bearer foo')
        .expect(HTTP_STATUS.INTERNAL_ERROR);
    });
  });
});
