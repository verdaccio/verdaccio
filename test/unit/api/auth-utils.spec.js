// @flow

import _ from 'lodash';
import Auth from '../../../src/lib/auth';
import {CHARACTER_ENCODING} from '../../../src/lib/constants';
// $FlowFixMe
import configExample from '../partials/config/index';
import AppConfig from '../../../src/lib/config';
import {setup} from '../../../src/lib/logger';

import {convertPayloadToBase64, parseConfigFile} from '../../../src/lib/utils';
import {
  buildUserBuffer,
  getApiToken,
  getAuthenticatedMessage,
  getMiddlewareCredentials,
  getSecurity
} from '../../../src/lib/auth-utils';
import {aesDecrypt, verifyPayload} from '../../../src/lib/crypto-utils';
import {parseConfigurationFile} from '../__helper';

import type {IAuth, } from '../../../types/index';
import type {Config, Security, RemoteUser} from '@verdaccio/types';

setup(configExample.logs);

describe('Auth utilities', () => {
  const parseConfigurationSecurityFile = (name) => {
    return parseConfigurationFile(`security/${name}`);
  };

  function getConfig(configFileName: string, secret: string) {
    const conf = parseConfigFile(parseConfigurationSecurityFile(configFileName));
    const secConf= _.merge(configExample, conf);
    secConf.secret = secret;
    const config: Config = new AppConfig(secConf);

    return config;
  }

  async function signCredentials(
    configFileName: string,
    username: string,
    password: string,
    secret = '12345',
    methodToSpy: string,
    methodNotBeenCalled: string): Promise<string> {
      const config: Config = getConfig(configFileName, secret);
      const auth: IAuth = new Auth(config);
      const spy = jest.spyOn(auth, methodToSpy);
      const spyNotCalled = jest.spyOn(auth, methodNotBeenCalled);
      const user: RemoteUser = {
        name: username,
        real_groups: [],
        groups: []
      };
      const token = await getApiToken(auth, config, user, password);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyNotCalled).not.toHaveBeenCalled();
      expect(token).toBeDefined();

      return token;
  }

  const verifyJWT = (token: string, user: string, password: string, secret: string) => {
    const payload = verifyPayload(token, secret);
    expect(payload.name).toBe(user);
    expect(payload.groups).toBeDefined();
    expect(payload.real_groups).toBeDefined();
  };

  const verifyAES = (token: string, user: string, password: string, secret: string) => {
    const payload = aesDecrypt(convertPayloadToBase64(token), secret).toString(CHARACTER_ENCODING.UTF8);
    const content = payload.split(':');

    expect(content[0]).toBe(user);
    expect(content[0]).toBe(password);
  };

  describe('getApiToken test', () => {
    test('should sign token with aes and security missing', async () => {
      const token = await signCredentials('security-missing',
        'test', 'test', '1234567', 'aesEncrypt', 'jwtEncrypt');

      verifyAES(token, 'test', 'test', '1234567');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with aes and security empty', async () => {
      const token = await signCredentials('security-empty',
        'test', 'test', '123456', 'aesEncrypt', 'jwtEncrypt');

      verifyAES(token, 'test', 'test', '123456');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with aes', async () => {
      const token = await signCredentials('security-basic',
        'test', 'test', '123456', 'aesEncrypt', 'jwtEncrypt');

      verifyAES(token, 'test', 'test', '123456');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with legacy and jwt disabled', async () => {
      const token = await signCredentials('security-no-legacy',
        'test', 'test', 'x8T#ZCx=2t', 'aesEncrypt', 'jwtEncrypt');

      expect(_.isString(token)).toBeTruthy();
      verifyAES(token, 'test', 'test', 'x8T#ZCx=2t');
    });

    test('should sign token with legacy enabled and jwt enabled', async () => {
      const token = await signCredentials('security-jwt-legacy-enabled',
        'test', 'test', 'secret', 'jwtEncrypt', 'aesEncrypt');

      verifyJWT(token, 'test', 'test', 'secret');
      expect(_.isString(token)).toBeTruthy();
    });

    test('should sign token with jwt enabled', async () => {
      const token = await signCredentials('security-jwt',
        'test', 'test', 'secret', 'jwtEncrypt', 'aesEncrypt');

        expect(_.isString(token)).toBeTruthy();
        verifyJWT(token, 'test', 'test', 'secret');
    });

    test('should sign with jwt whether legacy is disabled', async () => {
      const token = await signCredentials('security-legacy-disabled',
        'test', 'test', 'secret', 'jwtEncrypt', 'aesEncrypt');

      expect(_.isString(token)).toBeTruthy();
      verifyJWT(token, 'test', 'test', 'secret');
    });
  });

  describe('getAuthenticatedMessage test', () => {
    test('should sign token with jwt enabled', () => {
      expect(getAuthenticatedMessage('test')).toBe('you are authenticated as \'test\'');
    });
  });

  describe('getMiddlewareCredentials test', () => {
    describe('should get AES credentials', () => {
      test.concurrent('should unpack aes token and credentials', async () => {
        const secret: string = 'secret';
        const user: string = 'test';
        const pass: string = 'test';
        const token = await signCredentials('security-legacy',
          user, pass, secret, 'aesEncrypt', 'jwtEncrypt');
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, secret, `Bearer ${token}`);
        expect(credentials).toBeDefined();
        // $FlowFixMe
        expect(credentials.user).toEqual(user);
        // $FlowFixMe
        expect(credentials.password).toEqual(pass);
      });

      test.concurrent('should unpack aes token and credentials', async () => {
        const secret: string = 'secret';
        const user: string = 'test';
        const pass: string = 'test';
        const token = buildUserBuffer(user, pass).toString('base64');
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, secret, `Basic ${token}`);
        expect(credentials).toBeDefined();
        // $FlowFixMe
        expect(credentials.user).toEqual(user);
        // $FlowFixMe
        expect(credentials.password).toEqual(pass);
      });

      test.concurrent('should return empty credential wrong secret key', async () => {
        const secret: string = 'secret';
        const token = await signCredentials('security-legacy',
          'test', 'test', secret, 'aesEncrypt', 'jwtEncrypt');
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, 'BAD_SECRET', `Bearer ${token}`);
        expect(credentials).not.toBeDefined();
      });

      test.concurrent('should return empty credential wrong scheme', async () => {
        const secret: string = 'secret';
        const token = await signCredentials('security-legacy',
          'test', 'test', secret, 'aesEncrypt', 'jwtEncrypt');
        const config: Config = getConfig('security-legacy', secret);
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, secret, `BAD_SCHEME ${token}`);
        expect(credentials).not.toBeDefined();
      });

      test.concurrent('should return empty credential corrupted payload', async () => {
        const secret: string = 'secret';
        const config: Config = getConfig('security-legacy', secret);
        const auth: IAuth = new Auth(config);
        const token = auth.aesEncrypt(new Buffer(`corruptedBuffer`)).toString('base64');
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, secret, `Bearer ${token}`);
        expect(credentials).not.toBeDefined();
      });
    });

    describe('should get JWT credentials', () => {
      test('should return anonymous whether token is corrupted', () => {
        const config: Config = getConfig('security-jwt', '12345');
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, '12345', 'Bearer fakeToken');

        expect(credentials).toBeDefined();
        // $FlowFixMe
        expect(credentials.name).not.toBeDefined();
        // $FlowFixMe
        expect(credentials.real_groups).toBeDefined();
        // $FlowFixMe
        expect(credentials.real_groups).toEqual([]);
      });

      test('should return anonymous whether token and scheme are corrupted', () => {
        const config: Config = getConfig('security-jwt', '12345');
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, '12345', 'FakeScheme fakeToken');

        expect(credentials).not.toBeDefined();
      });

      test('should verify succesfully a JWT token', async () => {
        const secret: string = 'secret';
        const user: string = 'test';
        const config: Config = getConfig('security-jwt', secret);
        const token = await signCredentials('security-jwt',
          user, 'secretTest', secret, 'jwtEncrypt', 'aesEncrypt');
        const security: Security = getSecurity(config);
        const credentials = getMiddlewareCredentials(security, secret, `Bearer ${token}`);
        expect(credentials).toBeDefined();
        // $FlowFixMe
        expect(credentials.name).toEqual(user);
        // $FlowFixMe
        expect(credentials.real_groups).toBeDefined();
        // $FlowFixMe
        expect(credentials.real_groups).toEqual([]);
      });
    });
  });
});
