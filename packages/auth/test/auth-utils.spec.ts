import _ from 'lodash';
import path from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import {
  Config as AppConfig,
  ROLES,
  createAnonymousRemoteUser,
  createRemoteUser,
  getDefaultConfig,
  parseConfigFile,
} from '@verdaccio/config';
import {
  API_ERROR,
  CHARACTER_ENCODING,
  VerdaccioError,
  authUtils,
  errorUtils,
} from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import { aesDecrypt, verifyPayload } from '@verdaccio/signature';
import { Config, RemoteUser } from '@verdaccio/types';

import {
  ActionsAllowed,
  AllowActionCallbackResponse,
  Auth,
  allow_action,
  getApiToken,
  getDefaultPlugins,
} from '../src';

await setup({});

const parseConfigurationFile = (conf) => {
  const { name, ext } = path.parse(conf);
  const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

  return path.join(__dirname, `./partials/config/${format}/security/${name}.${format}`);
};

describe('Auth utilities', () => {
  vi.setConfig({ testTimeout: 20000 });

  const parseConfigurationSecurityFile = (name) => {
    return parseConfigurationFile(`security/${name}`);
  };

  function getConfig(configFileName: string, secret: string) {
    const conf = parseConfigFile(parseConfigurationSecurityFile(configFileName));
    // @ts-ignore
    const secConf = _.merge(getDefaultConfig(), conf);
    // @ts-expect-error
    secConf.secret = secret;
    const config: Config = new AppConfig(secConf);

    return config;
  }

  async function getTokenByConfiguration(
    configFileName: string,
    username: string,
    password: string,
    secret = '12345',
    methodToSpy: string,
    methodNotBeenCalled: string
  ): Promise<string> {
    const config: Config = getConfig(configFileName, secret);
    const auth: Auth = new Auth(config, logger);
    await auth.init();
    // @ts-ignore
    const spy = vi.spyOn(auth, methodToSpy);
    // @ts-ignore
    const spyNotCalled = vi.spyOn(auth, methodNotBeenCalled);
    const user: RemoteUser = {
      name: username,
      real_groups: ['test', '$all', '$authenticated', '@all', '@authenticated', 'all'],
      groups: ['company-role1', 'company-role2'],
    };
    const token = await getApiToken(auth, config, user, password);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyNotCalled).not.toHaveBeenCalled();
    expect(token).toBeDefined();

    return token as string;
  }

  const verifyJWT = (token: string, user: string, password: string, secret: string) => {
    const payload = verifyPayload(token, secret);
    expect(payload.name).toBe(user);
    expect(payload.groups).toBeDefined();
    expect(payload.groups).toEqual([
      'company-role1',
      'company-role2',
      'test',
      '$all',
      '$authenticated',
      '@all',
      '@authenticated',
      'all',
    ]);
    expect(payload.real_groups).toBeDefined();
    expect(payload.real_groups).toEqual([
      'test',
      '$all',
      '$authenticated',
      '@all',
      '@authenticated',
      'all',
    ]);
  };

  const verifyAES = (token: string, user: string, password: string, secret: string) => {
    // @ts-ignore
    const payload = aesDecrypt(token, secret).toString(CHARACTER_ENCODING.UTF8);
    const content = payload.split(':');

    expect(content[0]).toBe(user);
    expect(content[0]).toBe(password);
  };

  describe('getDefaultPlugins', () => {
    test('authentication should fail by default (default)', () => {
      const plugin = getDefaultPlugins({ trace: vi.fn() });
      plugin.authenticate('foo', 'bar', (error: any) => {
        expect(error).toEqual(errorUtils.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      });
    });

    test('add user should not fail by default (default)', () => {
      const plugin = getDefaultPlugins({ trace: vi.fn() });
      // @ts-ignore
      plugin.adduser('foo', 'bar', (error: any, access: any) => {
        expect(error).toEqual(null);
        expect(access).toEqual(true);
      });
    });
  });

  describe('allow_action', () => {
    describe('access/publish/unpublish and anonymous', () => {
      const packageAccess = {
        name: 'foo',
        version: undefined,
        access: ['foo'],
        unpublish: false,
      };

      // const type = 'access';
      test.each(['access', 'publish', 'unpublish'])(
        'should restrict %s to anonymous users',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: vi.fn() })(
            createAnonymousRemoteUser(),
            {
              ...packageAccess,
              [type]: ['foo'],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s to anonymous users',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: vi.fn() })(
            createAnonymousRemoteUser(),
            {
              ...packageAccess,
              [type]: [ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).toBeNull();
              expect(allowed).toBe(true);
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s only if user is anonymous if the logged user has groups',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: vi.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: [ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s only if user is anonymous match any other groups',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: vi.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: ['admin', 'some-other-group', ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).toBeNull();
              expect(allowed).toBe(true);
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should not allow %s anonymous if other groups are defined and does not match',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: vi.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: ['bla-bla-group', 'some-other-group', ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );
    });
  });

  describe('createRemoteUser', () => {
    test('create remote user', () => {
      expect(createRemoteUser('test', [])).toEqual({
        name: 'test',
        real_groups: [],
        groups: ['$all', '$authenticated', '@all', '@authenticated', 'all'],
      });
    });
    test('create remote user with groups', () => {
      expect(createRemoteUser('test', ['group1', 'group2'])).toEqual({
        name: 'test',
        real_groups: ['group1', 'group2'],
        groups: ['group1', 'group2', '$all', '$authenticated', '@all', '@authenticated', 'all'],
      });
    });
    test('create anonymous remote user', () => {
      expect(createAnonymousRemoteUser()).toEqual({
        name: undefined,
        real_groups: [],
        groups: ['$all', '$anonymous', '@all', '@anonymous'],
      });
    });
  });

  describe('getApiToken test', () => {
    test('should sign token with aes and security missing', async () => {
      const token = await getTokenByConfiguration(
        'security-missing',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'aesEncrypt',
        'jwtEncrypt'
      );

      verifyAES(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with aes and security empty', async () => {
      const token = await getTokenByConfiguration(
        'security-empty',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'aesEncrypt',
        'jwtEncrypt'
      );

      verifyAES(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with aes', async () => {
      const token = await getTokenByConfiguration(
        'security-basic',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'aesEncrypt',
        'jwtEncrypt'
      );

      verifyAES(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with legacy and jwt disabled', async () => {
      const token = await getTokenByConfiguration(
        'security-no-legacy',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'aesEncrypt',
        'jwtEncrypt'
      );

      expect(_.isString(token)).toBeTruthy();
      verifyAES(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
    });

    test('should sign token with legacy enabled and jwt enabled', async () => {
      const token = await getTokenByConfiguration(
        'security-jwt-legacy-enabled',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'jwtEncrypt',
        'aesEncrypt'
      );

      verifyJWT(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with jwt enabled', async () => {
      const token = await getTokenByConfiguration(
        'security-jwt',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'jwtEncrypt',
        'aesEncrypt'
      );

      expect(_.isString(token)).toBeTruthy();
      verifyJWT(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
    });

    test('should sign with jwt whether legacy is disabled', async () => {
      const token = await getTokenByConfiguration(
        'security-legacy-disabled',
        'test',
        'test',
        'b2df428b9929d3ace7c598bbf4e496b2',
        'jwtEncrypt',
        'aesEncrypt'
      );

      expect(_.isString(token)).toBeTruthy();
      verifyJWT(token, 'test', 'test', 'b2df428b9929d3ace7c598bbf4e496b2');
    });
  });

  describe('getAuthenticatedMessage test', () => {
    test('should sign token with jwt enabled', () => {
      expect(authUtils.getAuthenticatedMessage('test')).toBe("you are authenticated as 'test'");
    });
  });
});
