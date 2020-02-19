import _ from 'lodash';
import Auth from '../../../../src/lib/auth';
import { authProfileConf, authPluginFailureConf, authPluginPassThrougConf, authPluginAllow, authPluginDisallow } from './helper/plugin';
import AppConfig from '../../../../src/lib/config';
import {setup} from '../../../../src/lib/logger';

import {IAuth} from '../../../../types';
import {Config, RemoteUser, AuthPluginPackage} from '@verdaccio/types';

import { ROLES } from '../../../../src/lib/constants';
import { getInternalError, getForbidden } from '@verdaccio/commons-api';

setup([]);

describe('AuthTest', () => {
  test('should be defined', () => {
    const config: Config = new AppConfig(_.cloneDeep(authProfileConf));
    const auth: IAuth = new Auth(config);

    expect(auth).toBeDefined();
  });

  describe('test authenticate method', () => {
    describe('test authenticate states', () => {
      test('should be a success login', () => {
        const config: Config = new AppConfig(_.cloneDeep(authProfileConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();
        const groups = [ "test" ];

        auth.authenticate('foo', 'bar', callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(null,
          {"groups":
            [
            "test", ROLES.$ALL, ROLES.$AUTH, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_AUTH, ROLES.ALL],
            "name": 'foo',
            "real_groups": groups
          });
      });

      test('should be a fail on login', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginFailureConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();

        auth.authenticate('foo', 'bar', callback);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(getInternalError());
      });
    });

    describe('test publish/unpublish permissions from plugins based on package data', () => {

      test('auth plugin can allow publish based on package data', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginAllow));
        const auth: IAuth = new Auth(config);
        const callback = jest.fn();

        const user: RemoteUser = {
          real_groups: [],
          groups: [],
          name: 'allow-user'
        };

        const pkg: AuthPluginPackage = {
          packageName: 'allow-package',
          packageVersion: '2.0.1',
          tag: 'allow'
        };

        auth.allow_publish(pkg, user, callback);

        // auth plugin was able to allow on package name, version and tag
        expect(callback).toHaveBeenCalledWith(null, true);
      });

      test('auth plugin can disallow publish based on package data', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginDisallow));
        const auth: IAuth = new Auth(config);
        const callback = jest.fn();

        const user: RemoteUser = {
          real_groups: [],
          groups: [],
          name: 'disallow-user'
        };

        const pkg: AuthPluginPackage = {
          packageName: 'disallow-package',
          packageVersion: '2.0.0',
          tag: 'disallow'
        };

        auth.allow_publish(pkg, user, callback);

        // auth plugin was able to disallow on package name, version and tag
        expect(callback).toHaveBeenCalledWith(getForbidden(`user ${user.name} is not allowed to publish package ${pkg.packageName}`));
      });

      test('auth plugin can allow unpublish based on package data', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginAllow));
        const auth: IAuth = new Auth(config);
        const callback = jest.fn();

        const user: RemoteUser = {
          real_groups: [],
          groups: [],
          name: 'allow-user'
        };

        const pkg: AuthPluginPackage = {
          packageName: 'allow-package',
          packageVersion: '2.0.1',
          tag: 'allow'
        };

        auth.allow_unpublish(pkg, user, callback);

        // auth plugin was able to allow on package name, version and tag
        expect(callback).toHaveBeenCalledWith(null, true);
      });


      test('auth plugin can disallow unpublish based on package data', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginDisallow));
        const auth: IAuth = new Auth(config);
        const callback = jest.fn();

        const user: RemoteUser = {
          real_groups: [],
          groups: [],
          name: 'disallow-user'
        };

        const pkg: AuthPluginPackage = {
          packageName: 'disallow-package',
          packageVersion: '2.0.0',
          tag: 'disallow'
        };

        auth.allow_unpublish(pkg, user, callback);

        // auth plugin was able to disallow on package name, version and tag
        expect(callback).toHaveBeenCalledWith(getForbidden(`user ${user.name} is not allowed to publish package ${pkg.packageName}`));
      });
    });

    // plugins are free to send whatever they want, so, we need to test some scenarios
    // that might make break the request
    // the @ts-ignore below are intended
    describe('test authenticate out of control inputs from plugins', () => {
      test('should skip falsy values', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginPassThrougConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();
        let index = 0;

        // as defined by https://developer.mozilla.org/en-US/docs/Glossary/Falsy
        for (const value of [ false, 0, "",  null, undefined, NaN ]) {
          // @ts-ignore
          auth.authenticate(null, value, callback);
          const call = callback.mock.calls[index++];
          expect(call[0]).toBeDefined();
          expect(call[1]).toBeUndefined();
        }
      });

      test('should error truthy non-array', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginPassThrougConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();

        for (const value of [ true, 1, "test", { } ]) {
          expect(function ( ) {
            // @ts-ignore
            auth.authenticate(null, value, callback);
          }).toThrow(TypeError);
          expect(callback).not.toHaveBeenCalled();
        }
      });

      test('should skip empty array', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginPassThrougConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();
        const value = [ ];

        // @ts-ignore
        auth.authenticate(null, value, callback);
        expect(callback.mock.calls).toHaveLength(1);
        expect(callback.mock.calls[0][0]).toBeDefined();
        expect(callback.mock.calls[0][1]).toBeUndefined();
      });

      test('should accept valid array', () => {
        const config: Config = new AppConfig(_.cloneDeep(authPluginPassThrougConf));
        const auth: IAuth = new Auth(config);

        expect(auth).toBeDefined();

        const callback = jest.fn();
        let index = 0;

        for (const value of [ [ "" ], [ "1" ], [ "0" ], ["000"] ]) {
          // @ts-ignore
          auth.authenticate(null, value, callback);
          const call = callback.mock.calls[index++];
          expect(call[0]).toBeNull();
          expect(call[1].real_groups).toBe(value);
        }
      });
    });
  })
});
