import path from 'path';
import _ from 'lodash';
import { CHARACTER_ENCODING, TOKEN_BEARER, ROLES, API_ERROR } from '@verdaccio/dev-commons';

import { configExample } from '@verdaccio/mock';
import { Config as AppConfig, parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';

import {
  getAuthenticatedMessage,
  buildToken,
  createAnonymousRemoteUser,
  createRemoteUser,
  AllowActionCallbackResponse,
  buildUserBuffer,
} from '@verdaccio/utils';

import { Config, Security, RemoteUser } from '@verdaccio/types';
import { VerdaccioError, getForbidden } from '@verdaccio/commons-api';
import {
  IAuth,
  Auth,
  ActionsAllowed,
  allow_action,
  getDefaultPlugins,
  getMiddlewareCredentials,
  getApiToken,
  verifyJWTPayload,
  aesDecrypt,
  verifyPayload,
  signPayload,
} from '../src';

setup([]);

const parseConfigurationFile = (conf) => {
  const { name, ext } = path.parse(conf);
  const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

  return path.join(__dirname, `./partials/config/${format}/security/${name}.${format}`);
};

describe('Auth utilities', () => {
  jest.setTimeout(20000);

  const parseConfigurationSecurityFile = (name) => {
    return parseConfigurationFile(`security/${name}`);
  };

  function getConfig(configFileName: string, secret: string) {
    const conf = parseConfigFile(parseConfigurationSecurityFile(configFileName));
    // @ts-ignore
    const secConf = _.merge(configExample(), conf);
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
    const auth: IAuth = new Auth(config);
    // @ts-ignore
    const spy = jest.spyOn(auth, methodToSpy);
    // @ts-ignore
    const spyNotCalled = jest.spyOn(auth, methodNotBeenCalled);
    const user: RemoteUser = {
      name: username,
      real_groups: [],
      groups: [],
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
    expect(payload.real_groups).toBeDefined();
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
      const plugin = getDefaultPlugins({ trace: jest.fn() });
      plugin.authenticate('foo', 'bar', (error: any) => {
        expect(error).toEqual(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      });
    });

    test('add user should fail by default (default)', () => {
      const plugin = getDefaultPlugins({ trace: jest.fn() });
      // @ts-ignore
      plugin.adduser('foo', 'bar', (error: any) => {
        expect(error).toEqual(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
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
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
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
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
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
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
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
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
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
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
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
      expect(getAuthenticatedMessage('test')).toBe("you are authenticated as 'test'");
    });
  });

  describe('getMiddlewareCredentials test', () => {
    describe('should get AES credentials', () => {
      test.concurrent('should unpack aes token and credentials bearer auth', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const user = 'test';
        const pass = 'test';
        const token = await getTokenByConfiguration(
          'security-legacy',
          user,
          pass,
          secret,
          'aesEncrypt',
          'jwtEncrypt'
        );
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(security, secret, `Bearer ${token}`);
        expect(credentials).toBeDefined();
        // @ts-ignore
        expect(credentials.user).toEqual(user);
        // @ts-ignore
        expect(credentials.password).toEqual(pass);
      });

      test.concurrent('should unpack aes token and credentials basic auth', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const user = 'test';
        const pass = 'test';
        // basic authentication need send user as base64
        const token = buildUserBuffer(user, pass).toString('base64');
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(security, secret, `Basic ${token}`);
        expect(credentials).toBeDefined();
        // @ts-ignore
        expect(credentials.user).toEqual(user);
        // @ts-ignore
        expect(credentials.password).toEqual(pass);
      });

      test.concurrent('should return empty credential wrong secret key', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const token = await getTokenByConfiguration(
          'security-legacy',
          'test',
          'test',
          secret,
          'aesEncrypt',
          'jwtEncrypt'
        );
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          'b2df428b9929d3ace7c598bbf4e496_BAD_TOKEN',
          buildToken(TOKEN_BEARER, token)
        );
        expect(credentials).not.toBeDefined();
      });

      test.concurrent('should return empty credential wrong scheme', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const token = await getTokenByConfiguration(
          'security-legacy',
          'test',
          'test',
          secret,
          'aesEncrypt',
          'jwtEncrypt'
        );
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          secret,
          buildToken('BAD_SCHEME', token)
        );
        expect(credentials).not.toBeDefined();
      });

      test.concurrent('should return empty credential corrupted payload', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const config: Config = getConfig('security-legacy', secret);
        const auth: IAuth = new Auth(config);
        const token = auth.aesEncrypt(null);
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          secret,
          buildToken(TOKEN_BEARER, token as string)
        );
        expect(credentials).not.toBeDefined();
      });
    });

    describe('verifyJWTPayload', () => {
      test('should fail on verify the token and return anonymous users', () => {
        expect(verifyJWTPayload('fakeToken', 'b2df428b9929d3ace7c598bbf4e496b2')).toEqual(
          createAnonymousRemoteUser()
        );
      });

      test('should verify the token and return a remote user', async () => {
        const remoteUser = createRemoteUser('foo', []);
        const token = await signPayload(remoteUser, '12345');
        const verifiedToken = verifyJWTPayload(token, '12345');
        expect(verifiedToken.groups).toEqual(remoteUser.groups);
        expect(verifiedToken.name).toEqual(remoteUser.name);
      });
    });

    describe('should get JWT credentials', () => {
      test('should return anonymous whether token is corrupted', () => {
        const config: Config = getConfig('security-jwt', '12345');
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          '12345',
          buildToken(TOKEN_BEARER, 'fakeToken')
        );

        expect(credentials).toBeDefined();
        // @ts-ignore
        expect(credentials.name).not.toBeDefined();
        // @ts-ignore
        expect(credentials.real_groups).toBeDefined();
        // @ts-ignore
        expect(credentials.real_groups).toEqual([]);
      });

      test('should return anonymous whether token and scheme are corrupted', () => {
        const config: Config = getConfig('security-jwt', '12345');
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          '12345',
          buildToken('FakeScheme', 'fakeToken')
        );

        expect(credentials).not.toBeDefined();
      });

      test('should verify successfully a JWT token', async () => {
        const secret = 'b2df428b9929d3ace7c598bbf4e496b2';
        const user = 'test';
        const config: Config = getConfig('security-jwt', secret);
        const token = await getTokenByConfiguration(
          'security-jwt',
          user,
          'secretTest',
          secret,
          'jwtEncrypt',
          'aesEncrypt'
        );
        const security: Security = config.security;
        const credentials = getMiddlewareCredentials(
          security,
          secret,
          buildToken(TOKEN_BEARER, token)
        );
        expect(credentials).toBeDefined();
        // @ts-ignore
        expect(credentials.name).toEqual(user);
        // @ts-ignore
        expect(credentials.real_groups).toBeDefined();
        // @ts-ignore
        expect(credentials.real_groups).toEqual([]);
      });
    });
  });
});
