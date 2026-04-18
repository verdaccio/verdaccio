import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { API_ERROR, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { initializeServer } from './helper';

beforeAll(async () => {
  await setup({});
});

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

const validSessionId = '12345678-1234-1234-1234-123456789012';

describe('test web server', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(import.meta.dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        // WWW-Authenticate must not include Basic, otherwise browsers
        // show a native auth popup instead of letting the WebUI handle the error
        expect(response.headers['www-authenticate']).toBe('Bearer');
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
      .expect(HEADERS.CACHE_CONTROL, HEADERS.NO_CACHE)
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

  test('should change password', async () => {
    const oldPass = 'test';
    const newPass = 'new-pass';

    const api = supertest(await initializeServer('default-test.yaml'));

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

    // Change the password.
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
      .expect(HTTP_STATUS.OK);

    // Verify that you cannot login with the old password.
    await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: oldPass,
        })
      )
      .expect(HTTP_STATUS.UNAUTHORIZED);

    // Verify that you can login with the new password.
    await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: newPass,
        })
      )
      .expect(HTTP_STATUS.OK);
  });

  test('should not change to invalid password', async () => {
    const oldPass = 'test';
    const newPass = '12'; // Invalid password: Too short.

    const api = supertest(await initializeServer('default-test.yaml'));

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

    // Try changing to an invalid password.
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
      .expect(HTTP_STATUS.BAD_REQUEST);

    // Verify that you cannot login with the new (invalid) password.
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

  describe('signup', () => {
    test('should reject signup with invalid sessionId', async () => {
      return supertest(await initializeServer('create-user-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            password: 'newuser123',
            email: 'new@test.com',
            sessionId: 'invalid-short',
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.BAD_REQUEST)
        .then((response) => {
          expect(response.body.error).toEqual(API_ERROR.SESSION_ID_INVALID);
        });
    });

    test('should reject signup with missing name', async () => {
      return supertest(await initializeServer('create-user-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            password: 'newuser123',
            email: 'new@test.com',
            sessionId: validSessionId,
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.BAD_REQUEST)
        .then((response) => {
          expect(response.body.error).toEqual(API_ERROR.BAD_DATA);
        });
    });

    test('should reject signup with missing password', async () => {
      return supertest(await initializeServer('create-user-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            name: 'newuser',
            email: 'new@test.com',
            sessionId: validSessionId,
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    test('should reject signup with missing email', async () => {
      return supertest(await initializeServer('create-user-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            name: 'newuser',
            password: 'newuser123',
            sessionId: validSessionId,
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    test('should create user successfully', async () => {
      return supertest(await initializeServer('create-user-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            name: 'newuser',
            password: 'newuser123',
            email: 'new@test.com',
            sessionId: validSessionId,
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.OK)
        .then((response) => {
          expect(response.body.token).toBeDefined();
          expect(response.body.username).toEqual('newuser');
        });
    });

    test('should not register signup route when createUser flag is disabled', async () => {
      return supertest(await initializeServer('default-test.yaml'))
        .put('/-/verdaccio/sec/signup')
        .send(
          JSON.stringify({
            password: 'newuser123',
            email: 'new@test.com',
            sessionId: validSessionId,
          })
        )
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CANNOT_HANDLE);
    });
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
});
