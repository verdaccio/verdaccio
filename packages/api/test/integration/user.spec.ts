import { Secret, TOTP } from 'otpauth';
import supertest from 'supertest';
import { describe, expect, test, vi } from 'vitest';

import { API_ERROR, HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';

import { buildToken, createUser, getPackage, initializeServer } from './_helper';

const FORBIDDEN_VUE = 'authorization required to access package vue';

vi.setConfig({ testTimeout: 20000 });

function codeFor(otpauthUrl: string): string {
  const secret = new URL(otpauthUrl).searchParams.get('secret') as string;
  return new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  }).generate();
}

async function enableTfa(app: any, token: string, password: string): Promise<void> {
  const started = await supertest(app)
    .post('/-/npm/v1/user')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify({ tfa: { mode: 'auth-only', password } }))
    .expect(HTTP_STATUS.OK);

  await supertest(app)
    .post('/-/npm/v1/user')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify({ tfa: [codeFor(started.body.tfa)] }))
    .expect(HTTP_STATUS.OK);
}

describe('token', () => {
  describe('basics', () => {
    const FAKE_TOKEN = 'fake';
    test.each([['user.yaml'], ['user.jwt.yaml']])('should test add a new user', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'JotaJWT', password: 'secretPass' };
      const response = await createUser(app, credentials.name, credentials.password);
      expect(response.body.ok).toMatch(`user '${credentials.name}' created`);

      const vueResponse = await getPackage(app, response.body.token, 'vue');
      expect(vueResponse.body).toBeDefined();
      expect(vueResponse.body.name).toMatch('vue');

      const vueFailResp = await getPackage(app, FAKE_TOKEN, 'vue', HTTP_STATUS.UNAUTHORIZED);
      expect([API_ERROR.BAD_USERNAME_PASSWORD, FORBIDDEN_VUE]).toContain(vueFailResp.body.error);
    });

    test.each([['user.yaml'], ['user.jwt.yaml']])('should login an user', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      expect(response.body.ok).toMatch(`user '${credentials.name}' created`);

      await supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .send({
          name: credentials.name,
          password: credentials.password,
        })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.CREATED);
    });

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should fails login a valid user',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'test', password: 'test' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);

        await supertest(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send({
            name: credentials.name,
            password: 'failPassword',
          })
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED);
      }
    );

    test('should reject a bad password before requiring an OTP on login', async () => {
      const app = await initializeServer('tfa-publish.yaml');
      const credentials = { name: 'user_bad_password_tfa', password: 'secretPass' };
      const response = await createUser(app, credentials.name, credentials.password);
      await enableTfa(app, response.body.token, credentials.password);

      const loginResponse = await supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .send({
          name: credentials.name,
          password: 'wrongPassword',
        })
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(loginResponse.body.error).toBe(API_ERROR.BAD_USERNAME_PASSWORD);
      expect(loginResponse.headers['www-authenticate'].toLowerCase()).not.toContain('otp');
    });

    test('should require an OTP after accepting the login password', async () => {
      const app = await initializeServer('tfa-publish.yaml');
      const credentials = { name: 'user_login_tfa', password: 'secretPass' };
      const response = await createUser(app, credentials.name, credentials.password);
      await enableTfa(app, response.body.token, credentials.password);

      const loginResponse = await supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .send({
          name: credentials.name,
          password: credentials.password,
        })
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(loginResponse.headers['www-authenticate'].toLowerCase()).toContain('otp');
    });

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should test conflict create new user',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'JotaJWT', password: 'secretPass' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
        const response2 = await supertest(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send({
            name: credentials.name,
            password: credentials.password,
          })
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CONFLICT);
        expect(response2.body.error).toBe(API_ERROR.USERNAME_ALREADY_REGISTERED);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should fails on login if user credentials are invalid',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'newFailsUser', password: 'secretPass' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
        const response2 = await supertest(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send({
            name: credentials.name,
            password: 'BAD_PASSWORD',
          })
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(response2.body.error).toBe(API_ERROR.UNAUTHORIZED_ACCESS);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should fails password validation',
      async (conf) => {
        const credentials = { name: 'test', password: '12' };
        const app = await initializeServer(conf);
        const response = await supertest(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send({
            name: credentials.name,
            password: credentials.password,
          })
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe(API_ERROR.PASSWORD_SHORT);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should fails missing password validation',
      async (conf) => {
        const credentials = { name: 'test' };
        const app = await initializeServer(conf);
        const response = await supertest(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send({
            name: credentials.name,
            password: undefined,
          })
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe(API_ERROR.PASSWORD_SHORT);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should verify if user is logged',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota', password: 'secretPass' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
        const response2 = await supertest(app)
          .get(`/-/user/org.couchdb.user:${credentials.name}`)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK);
        expect(response2.body.ok).toBe(`you are authenticated as '${credentials.name}'`);
        expect(response2.body.name).toBe(credentials.name);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should return name of requested user',
      async (conf) => {
        const app = await initializeServer(conf);
        const username = 'yeti';
        const credentials = { name: 'jota', password: 'secretPass' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
        const response3 = await supertest(app)
          .get(`/-/user/org.couchdb.user:${username}`)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK);
        expect(response3.body.ok).toBe(`you are authenticated as '${credentials.name}'`);
        expect(response3.body.name).toBe(username);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])('should logout user', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota', password: 'secretPass' };
      const response = await createUser(app, credentials.name, credentials.password);
      await supertest(app)
        .get(`/-/user/org.couchdb.user:${credentials.name}`)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      await supertest(app)
        .delete(`/-/user/token/someSecretToken:${response.body.token}`)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
    });

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should return 401 when Basic Auth credentials are invalid',
      async (conf) => {
        const app = await initializeServer(conf);
        const basicToken = Buffer.from('admin:admin').toString('base64');
        const response = await supertest(app)
          .get('/-/user/org.couchdb.user:admin')
          .set(HEADERS.AUTHORIZATION, `Basic ${basicToken}`)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body.error).toBe(API_ERROR.BAD_USERNAME_PASSWORD);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should return 401 when Bearer credentials are invalid',
      async (conf) => {
        const app = await initializeServer(conf);
        const response = await supertest(app)
          .get('/-/user/org.couchdb.user:admin')
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, 'invalidToken'))
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body.error).toBe(API_ERROR.BAD_USERNAME_PASSWORD);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should return 400 when Authorization header is malformed',
      async (conf) => {
        const app = await initializeServer(conf);
        const response = await supertest(app)
          .get('/-/user/org.couchdb.user:admin')
          .set(HEADERS.AUTHORIZATION, 'invalidToken')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.error).toBe(API_ERROR.BAD_AUTH_HEADER);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should return "false" if user is not logged in',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota', password: '' };
        const response = await supertest(app)
          .get(`/-/user/org.couchdb.user:${credentials.name}`)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK);
        expect(response.body.ok).toBe(false);
      }
    );

    test.each([['user.yaml'], ['user.jwt.yaml']])(
      'should fail if URL does not match user in request body',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota', password: 'secretPass' };
        const response = await createUser(app, credentials.name, credentials.password);
        expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
        const response2 = await supertest(app)
          .put('/-/user/org.couchdb.user:yeti') // different user
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .send({
            name: credentials.name,
            password: credentials.password,
          })
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST);
        expect(response2.body.error).toBe(API_ERROR.USERNAME_MISMATCH);
      }
    );
  });
});
