import getPort from 'get-port';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
} from '@verdaccio/core';
import { buildUserBuffer } from '@verdaccio/utils';
import { buildToken } from '@verdaccio/utils';

import endPointAPI from '../../../../src/api';
import { setup } from '../../../../src/lib/logger';
import { addUser, getPackage, loginUserToken } from '../../__helper/api';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';

setup({});

const credentials = { name: 'JotaJWT', password: 'secretPass' };

const FORBIDDEN_VUE = 'authorization required to access package vue';

describe('endpoint user auth JWT unit test', () => {
  vi.setConfig({ testTimeout: 20000 });
  let app;
  let mockRegistry;
  const FAKE_TOKEN: string = buildToken(TOKEN_BEARER, 'fake');

  beforeAll(async function () {
    const store = await fileUtils.createTempStorageFolder('test-jwt-storage');
    const mockServerPort = await getPort();

    const configForTest = configDefault(
      {
        storage: store,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
        },
        self_path: store,
        auth: {
          htpasswd: {
            file: './htpasswd_jwt_auth',
          },
        },
        log: { type: 'stdout', format: 'pretty', level: 'debug' },
      },
      'api-jwt/jwt.yaml'
    );

    app = await endPointAPI(configForTest);
    mockRegistry = await mockServer(mockServerPort).init();
  });

  afterAll(function () {
    mockRegistry[0].stop();
  });

  test('should test add a new user with JWT enabled', async () => {
    const [err, res] = await addUser(request(app), credentials.name, credentials);
    expect(err).toBeNull();
    expect(res.body.ok).toBeDefined();
    expect(res.body.token).toBeDefined();

    const { token } = res.body;
    expect(typeof token).toBe('string');
    expect(res.body.ok).toMatch(`user '${credentials.name}' created`);

    // testing JWT auth headers with token
    // we need it here, because token is required
    const [err1, resp1] = await getPackage(request(app), token, 'vue');
    expect(err1).toBeNull();
    expect(resp1.body).toBeDefined();
    expect(resp1.body.name).toMatch('vue');

    const [err2, resp2] = await getPackage(
      request(app),
      FAKE_TOKEN,
      'vue',
      HTTP_STATUS.UNAUTHORIZED
    );

    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(FORBIDDEN_VUE);
  });

  test('should emulate npm login when user already exist', async () => {
    const credentials = { name: 'jwtUser2', password: 'secretPass' };
    // creates an user
    await addUser(request(app), credentials.name, credentials);
    // it should fails conflict 409
    await addUser(request(app), credentials.name, credentials, HTTP_STATUS.CONFLICT);

    // npm will try to sign in sending credentials via basic auth header
    const token = buildUserBuffer(credentials.name, credentials.password).toString('base64');
    // put should exist in request
    // @ts-ignore
    const res = await request(app)
      .put(`/-/user/org.couchdb.user:${credentials.name}/-rev/undefined`)
      .send(credentials)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BASIC, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED);

    expect(res.body.ok).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  test('should fails on try to access with corrupted token', async () => {
    const [err2, resp2] = await getPackage(
      request(app),
      FAKE_TOKEN,
      'vue',
      HTTP_STATUS.UNAUTHORIZED
    );
    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(FORBIDDEN_VUE);
  });

  test('should fails on login if user credentials are invalid even if jwt valid token is provided', async () => {
    const credentials = { name: 'newFailsUser', password: 'secretPass' };
    const [err, res] = await addUser(request(app), credentials.name, credentials);
    expect(err).toBeNull();
    expect(res.body.ok).toBeDefined();
    expect(res.body.token).toBeDefined();

    const { token } = res.body;
    expect(typeof token).toBe('string');
    expect(res.body.ok).toMatch(`user '${credentials.name}' created`);

    // we login when token is valid
    const newCredentials = { name: 'newFailsUser', password: 'BAD_PASSWORD' };
    const [err2, resp2] = await loginUserToken(
      request(app),
      newCredentials.name,
      newCredentials,
      token,
      HTTP_STATUS.UNAUTHORIZED
    );
    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(API_ERROR.BAD_USERNAME_PASSWORD);
  });
});
