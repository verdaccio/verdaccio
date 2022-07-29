import _ from 'lodash';
import supertest from 'supertest';

import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  TOKEN_BEARER,
} from '@verdaccio/core';
import { buildToken } from '@verdaccio/utils';

import { deleteTokenCLI, generateTokenCLI, getNewToken, initializeServer } from './_helper';

describe('token', () => {
  describe('basics', () => {
    test.each([['token.yaml'], ['token.jwt.yaml']])('should list empty tokens', async (conf) => {
      const app = await initializeServer(conf);
      const token = await getNewToken(app, { name: 'jota_token', password: 'secretPass' });
      const response = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.objects).toHaveLength(0);
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])('should generate one token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });
      const response = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects, urls } = response.body;

      expect(objects).toHaveLength(1);
      const [tokenGenerated] = objects;
      expect(tokenGenerated.user).toEqual(credentials.name);
      expect(tokenGenerated.readonly).toBeFalsy();
      expect(tokenGenerated.token).toMatch(/.../);
      expect(_.isString(tokenGenerated.created)).toBeTruthy();

      // we don't support pagination yet
      expect(urls.next).toEqual('');
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])('should delete a token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const response = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });

      const key = response.body.key;
      await deleteTokenCLI(app, token, key);
      const response2 = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects } = response2.body;
      expect(objects).toHaveLength(0);
    });
  });

  describe('handle errors', () => {
    test.each([['token.yaml'], ['token.jwt.yaml']])('should delete a token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: 'wrongPassword',
        readonly: false,
        cidr_whitelist: [],
      });
      expect(resp.body.error).toEqual(API_ERROR.BAD_USERNAME_PASSWORD);
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should fail if readonly is missing',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const resp = await generateTokenCLI(app, token, {
          password: credentials.password,
          cidr_whitelist: [],
        });
        expect(resp.body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
      }
    );
  });

  test.each([['token.yaml'], ['token.jwt.yaml']])(
    'should fail if cidr_whitelist is missing',
    async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
      });
      expect(resp.body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
    }
  );

  test.todo('handle failure if delete token');
  test.todo('handle failure if getApiToken fails');
  test.todo('handle failure if token creating fails');
  test.todo('handle failure if token list fails');
});
