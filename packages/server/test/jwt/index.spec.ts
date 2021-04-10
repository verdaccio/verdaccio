import path from 'path';
import request from 'supertest';

import {
  HEADERS,
  HTTP_STATUS,
  HEADER_TYPE,
  TOKEN_BEARER,
  TOKEN_BASIC,
  API_ERROR,
} from '@verdaccio/commons-api';
import { mockServer, generateRamdonStorage } from '@verdaccio/mock';
import { buildUserBuffer, buildToken } from '@verdaccio/utils';
import {
  configExample,
  DOMAIN_SERVERS,
  addUser,
  getPackage,
  loginUserToken,
} from '@verdaccio/mock';

import { setup, logger } from '@verdaccio/logger';

import endPointAPI from '../../src';

setup([]);

const credentials = { name: 'JotaJWT', password: 'secretPass' };

const FORBIDDEN_VUE = 'authorization required to access package vue';

describe('endpoint user auth JWT unit test', () => {
  jest.setTimeout(20000);
  let app;
  let mockRegistry;
  const FAKE_TOKEN: string = buildToken(TOKEN_BEARER, 'fake');

  beforeAll(async function (done) {
    const mockServerPort = 55546;
    const store = generateRamdonStorage();
    const configForTest = configExample(
      {
        storage: store,
        uplinks: {
          remote: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          },
        },
        config_path: store,
      },
      'jwt.yaml',
      __dirname
    );

    app = await endPointAPI(configForTest);
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
    done();
  });

  afterAll(function (done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

    done();
  });

  test('should test add a new user with JWT enabled', async (done) => {
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
    done();
  });

  test('should emulate npm login when user already exist', async (done) => {
    const credentials = { name: 'jwtUser2', password: 'secretPass' };
    // creates an user
    await addUser(request(app), credentials.name, credentials);
    // it should fails conflict 409
    await addUser(request(app), credentials.name, credentials, HTTP_STATUS.CONFLICT);

    // npm will try to sign in sending credentials via basic auth header
    const token = buildUserBuffer(credentials.name, credentials.password).toString('base64');
    // put should exist in request
    // @ts-ignore
    request(app)
      .put(`/-/user/org.couchdb.user:${credentials.name}/-rev/undefined`)
      .send(credentials)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BASIC, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED)
      .end(function (err, res) {
        expect(err).toBeNull();
        expect(res.body.ok).toBeDefined();
        expect(res.body.token).toBeDefined();

        done();
      });
  });

  test('should fails on try to access with corrupted token', async (done) => {
    const [err2, resp2] = await getPackage(
      request(app),
      FAKE_TOKEN,
      'vue',
      HTTP_STATUS.UNAUTHORIZED
    );
    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(FORBIDDEN_VUE);
    done();
  });

  test(
    'should fails on login if user credentials are invalid even if jwt' +
      ' valid token is provided',
    async (done) => {
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

      done();
    }
  );
});
