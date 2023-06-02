import path from 'path';
import supertest from 'supertest';

import { API_ERROR, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
jest.mock('@verdaccio/ui-theme', () => mockManifest());

describe('test web server', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should get 401', async () => {
    return supertest(await initializeServer('default-test.yaml'))
      .post('/-/verdaccio/sec/login')
      .send(
        JSON.stringify({
          username: 'test',
          password: 'password1',
        })
      )
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .then((response) => {
        expect(response.body.error).toEqual(API_ERROR.BAD_USERNAME_PASSWORD);
      });
  });

  test('should log in', async () => {
    return supertest(await initializeServer('default-test.yaml'))
      .post('/-/verdaccio/sec/login')
      .send(
        JSON.stringify({
          username: 'test',
          password: 'test',
        })
      )
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HEADERS.CACHE_CONTROL, 'no-cache, no-store')
      .expect(HTTP_STATUS.OK)
      .then((res) => {
        expect(res.body.error).toBeUndefined();
        expect(res.body.token).toBeDefined();
        expect(res.body.token).toBeTruthy();
        expect(res.body.username).toMatch('test');
      });
  });

  test('log in should be disabled', async () => {
    return supertest(await initializeServer('login-disabled.yaml'))
      .post('/-/verdaccio/sec/login')
      .send(
        JSON.stringify({
          username: 'test',
          password: 'test',
        })
      )
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CANNOT_HANDLE, JSON.stringify({ error: 'cannot handle this' }));
  });

  test('should not change password if flag is disabled', async () => {
    const oldPass = 'test';
    const newPass = 'new-pass';

    const api = supertest(await initializeServer('change-password-disabled.yaml'));

    // Login with the old password.
    const loginRes = await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: oldPass,
        })
      )
      .expect(HTTP_STATUS.OK);

    // Try changing the password.
    await api
      .put('/-/verdaccio/sec/reset_password')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.AUTHORIZATION, `Bearer ${loginRes.body.token}`)
      .send(
        JSON.stringify({
          password: {
            old: oldPass,
            new: newPass,
          },
        })
      )
      .expect(HTTP_STATUS.CANNOT_HANDLE);

    // Verify that you cannot login with the new (rejected) password.
    await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: newPass,
        })
      )
      .expect(HTTP_STATUS.UNAUTHORIZED);

    // Verify that you can still login with the old password.
    await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: oldPass,
        })
      )
      .expect(HTTP_STATUS.OK);
  });

  test.todo('should change password');
});
