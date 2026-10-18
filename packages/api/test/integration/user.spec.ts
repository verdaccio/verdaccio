import { Secret, TOTP } from 'otpauth';
import supertest from 'supertest';
import { describe, expect, test, vi } from 'vitest';

import { Auth } from '@verdaccio/auth';

import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  errorUtils,
} from '@verdaccio/core';

import {
  buildToken,
  createUser,
  getPackage,
  initializeServer,
  initializeServerWithContext,
} from './_helper';

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

    test('should return 401 when the Bearer token is valid but expired', async () => {
      const { app, auth } = await initializeServerWithContext('user.jwt.yaml');
      const expiredToken = await auth.jwtEncrypt(
        { name: 'test', real_groups: [], groups: [] } as any,
        { expiresIn: '-1s' }
      );
      const response = await supertest(app)
        .get('/-/user/org.couchdb.user:test')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, expiredToken))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.error).toBe(API_ERROR.BAD_USERNAME_PASSWORD);
    });

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

describe('basic login', () => {
  const basic = (name: string, password: string) =>
    buildToken(TOKEN_BASIC, Buffer.from(`${name}:${password}`).toString('base64'));

  describe.each([['user.yaml'], ['user.jwt.yaml']])('%s', (conf) => {
    test('should log in an existing user the way npm does, retrying with Basic after the 409', async () => {
      const app = await initializeServer(conf);
      const credentials = { name: 'basic_login', password: 'secretPass' };
      await createUser(app, credentials.name, credentials.password);

      await supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .send({ name: credentials.name, password: credentials.password })
        .expect(HTTP_STATUS.CONFLICT);

      const response = await supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}/-rev/undefined`)
        .set(HEADERS.AUTHORIZATION, basic(credentials.name, credentials.password))
        .send({ name: credentials.name, password: credentials.password })
        .expect(HTTP_STATUS.CREATED);

      expect(response.body.ok).toMatch(`you are authenticated as '${credentials.name}'`);
      const vueResponse = await getPackage(app, response.body.token, 'vue');
      expect(vueResponse.body.name).toMatch('vue');
    });

    test('should log in an existing user the way Yarn does, sending Basic on the GET and the PUT', async () => {
      const app = await initializeServer(conf);
      const credentials = { name: 'basic_yarn', password: 'secretPass' };
      await createUser(app, credentials.name, credentials.password);
      const authorization = basic(credentials.name, credentials.password);
      const userPath = `/-/user/org.couchdb.user:${credentials.name}`;

      await supertest(app)
        .put(userPath)
        .send({ name: credentials.name, password: credentials.password })
        .expect(HTTP_STATUS.CONFLICT);

      const current = await supertest(app)
        .get(userPath)
        .set(HEADERS.AUTHORIZATION, authorization)
        .expect(HTTP_STATUS.OK);
      expect(current.body.ok).toMatch(`you are authenticated as '${credentials.name}'`);

      const response = await supertest(app)
        .put(`${userPath}/-rev/undefined`)
        .set(HEADERS.AUTHORIZATION, authorization)
        .send({ name: credentials.name, password: credentials.password })
        .expect(HTTP_STATUS.CREATED);
      expect(response.body.token).toBeDefined();
    });

    test('should answer the GET without credentials the way npm sends it', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_npm_get', 'secretPass');

      const response = await supertest(app)
        .get('/-/user/org.couchdb.user:basic_npm_get?write=true')
        .expect(HTTP_STATUS.OK);
      expect(response.body).toEqual({ ok: false });
    });

    test('should reject a wrong password sent with Basic on the GET', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_get_wrong', 'secretPass');

      await supertest(app)
        .get('/-/user/org.couchdb.user:basic_get_wrong')
        .set(HEADERS.AUTHORIZATION, basic('basic_get_wrong', 'otherPass'))
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should log in an existing user with a single PUT carrying Basic, the way pnpm does', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_pnpm', 'secretPass');

      const response = await supertest(app)
        .put('/-/user/org.couchdb.user:basic_pnpm')
        .set(HEADERS.AUTHORIZATION, basic('basic_pnpm', 'secretPass'))
        .send({ name: 'basic_pnpm', password: 'secretPass', email: 'p@test.io', type: 'user' })
        .expect(HTTP_STATUS.CREATED);
      expect(response.body.ok).toMatch("you are authenticated as 'basic_pnpm'");
    });

    test('should register a new user when the PUT carries Basic, the way pnpm does', async () => {
      const app = await initializeServer(conf);

      const response = await supertest(app)
        .put('/-/user/org.couchdb.user:basic_new')
        .set(HEADERS.AUTHORIZATION, basic('basic_new', 'secretPass'))
        .send({ name: 'basic_new', password: 'secretPass', email: 'n@test.io', type: 'user' })
        .expect(HTTP_STATUS.CREATED);
      expect(response.body.ok).toMatch("user 'basic_new' created");
    });

    test('should reject a wrong password sent with Basic', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_wrong', 'secretPass');

      const response = await supertest(app)
        .put('/-/user/org.couchdb.user:basic_wrong')
        .set(HEADERS.AUTHORIZATION, basic('basic_wrong', 'otherPass'))
        .send({ name: 'basic_wrong', password: 'otherPass' })
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.body.token).toBeUndefined();
    });

    test('should not issue a token when Basic belongs to another user than the body', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_owner', 'secretPass');
      await createUser(app, 'basic_other', 'secretPass');

      await supertest(app)
        .put('/-/user/org.couchdb.user:basic_other')
        .set(HEADERS.AUTHORIZATION, basic('basic_owner', 'secretPass'))
        .send({ name: 'basic_other', password: 'secretPass' })
        .expect(HTTP_STATUS.CONFLICT);
    });

    test('should keep rejecting Basic on every other route', async () => {
      const app = await initializeServer(conf);
      await createUser(app, 'basic_routes', 'secretPass');
      const authorization = basic('basic_routes', 'secretPass');

      await supertest(app)
        .get('/-/whoami')
        .set(HEADERS.AUTHORIZATION, authorization)
        .expect(HTTP_STATUS.UNAUTHORIZED);
      await supertest(app)
        .get('/vue')
        .set(HEADERS.AUTHORIZATION, authorization)
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  test('should still require an OTP after accepting the Basic password', async () => {
    const app = await initializeServer('tfa-publish.yaml');
    const credentials = { name: 'basic_login_tfa', password: 'secretPass' };
    const created = await createUser(app, credentials.name, credentials.password);
    await enableTfa(app, created.body.token, credentials.password);

    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${credentials.name}`)
      .set(HEADERS.AUTHORIZATION, basic(credentials.name, credentials.password))
      .send({ name: credentials.name, password: credentials.password })
      .expect(HTTP_STATUS.UNAUTHORIZED);

    expect(response.headers['www-authenticate'].toLowerCase()).toContain('otp');
  });

  test.each([
    ['an internal error', () => errorUtils.getInternalError('backend down')],
    ['an error without status', () => new Error('backend down')],
  ])(
    'should report a failing auth backend instead of registering the user (%s)',
    async (_, failure) => {
      const app = await initializeServer('user.yaml');
      const authenticate = vi
        .spyOn(Auth.prototype, 'authenticate')
        .mockImplementation((_user, _password, cb) => cb(failure() as any));
      const addUser = vi.spyOn(Auth.prototype, 'add_user');
      try {
        const authorization = basic('basic_down', 'secretPass');

        await supertest(app)
          .put('/-/user/org.couchdb.user:basic_down')
          .set(HEADERS.AUTHORIZATION, authorization)
          .send({ name: 'basic_down', password: 'secretPass', email: 'd@test.io', type: 'user' })
          .expect(HTTP_STATUS.INTERNAL_ERROR);
        await supertest(app)
          .get('/-/user/org.couchdb.user:basic_down')
          .set(HEADERS.AUTHORIZATION, authorization)
          .expect(HTTP_STATUS.INTERNAL_ERROR);
        expect(addUser).not.toHaveBeenCalled();
      } finally {
        authenticate.mockRestore();
        addUser.mockRestore();
      }
    }
  );

  // keep last: security settings leak into later configs of the same process
  test('should reject Basic on the login route when basicLogin is disabled', async () => {
    const app = await initializeServer('user.basic-login-off.yaml');
    await createUser(app, 'basic_off', 'secretPass');

    await supertest(app)
      .put('/-/user/org.couchdb.user:basic_off')
      .set(HEADERS.AUTHORIZATION, basic('basic_off', 'secretPass'))
      .send({ name: 'basic_off', password: 'secretPass' })
      .expect(HTTP_STATUS.UNAUTHORIZED);

    await supertest(app)
      .get('/-/user/org.couchdb.user:basic_off')
      .set(HEADERS.AUTHORIZATION, basic('basic_off', 'secretPass'))
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });
});
