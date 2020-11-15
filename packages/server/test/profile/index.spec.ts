import path from 'path';
import request from 'supertest';

import { mockServer } from '@verdaccio/mock';
import { API_ERROR, HTTP_STATUS, SUPPORT_ERRORS } from '@verdaccio/commons-api';
import { setup, logger } from '@verdaccio/logger';

import {
  generateRamdonStorage,
  getNewToken,
  getProfile,
  postProfile,
  configExample,
  DOMAIN_SERVERS,
} from '@verdaccio/mock';

import endPointAPI from '../../src';

setup([]);

describe('endpoint user profile', () => {
  let app;
  let mockRegistry;
  jest.setTimeout(20000);

  beforeAll(async (done) => {
    const store = generateRamdonStorage();
    const mockServerPort = 55544;
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
      'profile.yaml',
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

  test('should fetch a profile of logged user', async (done) => {
    const credentials = { name: 'JotaJWT', password: 'secretPass' };
    const token = await getNewToken(request(app), credentials);
    const [err1, res1] = await getProfile(request(app), token);
    expect(err1).toBeNull();
    expect(res1.body.name).toBe(credentials.name);
    done();
  });

  describe('change password', () => {
    test('should change password successfully', async (done) => {
      const credentials = { name: 'userTest2000', password: 'secretPass000' };
      const body = {
        password: {
          new: '12345678',
          old: credentials.password,
        },
      };
      const token = await getNewToken(request(app), credentials);
      const [err1, res1] = await postProfile(request(app), body, token);

      expect(err1).toBeNull();
      expect(res1.body.name).toBe(credentials.name);
      done();
    });

    test('should change password is too short', async (done) => {
      const credentials = { name: 'userTest2001', password: 'secretPass001' };
      const body = {
        password: {
          new: 'p1',
          old: credentials.password,
        },
      };
      const token = await getNewToken(request(app), credentials);
      const [, resp] = await postProfile(request(app), body, token, HTTP_STATUS.UNAUTHORIZED);

      expect(resp.error).not.toBeNull();
      /* eslint new-cap: 0 */
      expect(resp.error.text).toMatch(API_ERROR.PASSWORD_SHORT());
      done();
    });
  });

  describe('change tfa', () => {
    test('should report TFA is disabled', async (done) => {
      const credentials = { name: 'userTest2002', password: 'secretPass002' };
      const body = {
        tfa: {},
      };
      const token = await getNewToken(request(app), credentials);
      const [, resp] = await postProfile(
        request(app),
        body,
        token,
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );

      expect(resp.error).not.toBeNull();
      expect(resp.error.text).toMatch(SUPPORT_ERRORS.TFA_DISABLED);
      done();
    });
  });

  describe('error handling', () => {
    test('should forbid to fetch a profile with invalid token', async (done) => {
      const [, resp] = await getProfile(request(app), `fakeToken`, HTTP_STATUS.UNAUTHORIZED);

      expect(resp.error).not.toBeNull();
      expect(resp.error.text).toMatch(API_ERROR.MUST_BE_LOGGED);
      done();
    });

    test('should forbid to update a profile with invalid token', async (done) => {
      const [, resp] = await postProfile(request(app), {}, `fakeToken`, HTTP_STATUS.UNAUTHORIZED);

      expect(resp.error).not.toBeNull();
      expect(resp.error.text).toMatch(API_ERROR.MUST_BE_LOGGED);
      done();
    });
  });
});
