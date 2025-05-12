import _ from 'lodash';
import path from 'path';
import { describe, expect, test, vi } from 'vitest';

import {
  Config as AppConfig,
  createAnonymousRemoteUser,
  createRemoteUser,
  parseConfigFile,
} from '@verdaccio/config';
import { getDefaultConfig } from '@verdaccio/config';
import { TOKEN_BEARER } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import { signPayload } from '@verdaccio/signature';
import { Config, RemoteUser, Security } from '@verdaccio/types';
import { buildToken, buildUserBuffer } from '@verdaccio/utils';

import { Auth, getApiToken, getMiddlewareCredentials, verifyJWTPayload } from '../src';

setup({});

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
        const auth: Auth = new Auth(config, logger);
        await auth.init();
        // @ts-expect-error
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
        const config: Config = getConfig('security-jwt', '12345');
        expect(
          verifyJWTPayload('fakeToken', 'b2df428b9929d3ace7c598bbf4e496b2', config.security)
        ).toEqual(createAnonymousRemoteUser());
      });

      test('should verify the token and return a remote user', async () => {
        const remoteUser = createRemoteUser('foo', []);
        const token = await signPayload(remoteUser, '12345');
        const config: Config = getConfig('security-jwt', '12345');
        const verifiedToken = verifyJWTPayload(token, '12345', config.security);
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
        ) as RemoteUser;

        expect(credentials).toBeDefined();
        expect(credentials.name).not.toBeDefined();
        expect(credentials.real_groups).toBeDefined();

        expect(credentials.groups).toEqual(['$all', '$anonymous', '@all', '@anonymous']);
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
        ) as RemoteUser;
        expect(credentials).toBeDefined();

        expect(credentials.name).toEqual(user);
        expect(credentials.real_groups).toBeDefined();
        expect(credentials.real_groups).toEqual([
          'test',
          '$all',
          '$authenticated',
          '@all',
          '@authenticated',
          'all',
        ]);
        expect(credentials.groups).toEqual([
          'company-role1',
          'company-role2',
          'test',
          '$all',
          '$authenticated',
          '@all',
          '@authenticated',
          'all',
        ]);
      });
    });
  });
});
