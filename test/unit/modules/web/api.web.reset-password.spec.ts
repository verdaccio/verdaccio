import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { Auth } from '@verdaccio/auth';
import { API_ERROR, APP_ERROR, HEADERS, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { authUtils } from '@verdaccio/core';

const { buildToken } = authUtils;

import { setup } from '../../../../src/lib/logger';
import { addUser } from '../../__helper/api';
import { createWebApp } from './__helper';

setup({});

describe('web endpoint: reset_password (flag enabled)', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    ({ app, mockRegistry } = await createWebApp(
      { flags: { changePassword: true } },
      'htpasswd-web-reset-on'
    ));
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

  async function loginWebUI(name: string, password: string): Promise<string> {
    const res = await request(app)
      .post('/-/verdaccio/sec/login')
      .send({ username: name, password })
      .expect(HTTP_STATUS.OK);
    expect(res.body.token).toBeTruthy();
    return res.body.token;
  }

  test('should change password successfully when new password is valid', async () => {
    const user = { name: 'web-reset-ok', password: 'secretPass000' };
    await addUser(request(app), user.name, user);
    const token = await loginWebUI(user.name, user.password);

    const res = await request(app)
      .put('/-/verdaccio/sec/reset_password')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .send({ password: { old: user.password, new: 'newSecret123' } })
      .expect(HTTP_STATUS.OK);

    expect(res.body.ok).toBe(true);
    await loginWebUI(user.name, 'newSecret123');
    await request(app)
      .post('/-/verdaccio/sec/login')
      .send({ username: user.name, password: user.password })
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  test('should fail with 400 when new password does not pass validation', async () => {
    const user = { name: 'web-reset-short', password: 'secretPass001' };
    await addUser(request(app), user.name, user);
    const token = await loginWebUI(user.name, user.password);

    const res = await request(app)
      .put('/-/verdaccio/sec/reset_password')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .send({ password: { old: user.password, new: 'ab' } })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.error).toMatch(APP_ERROR.PASSWORD_VALIDATION);
  });

  test('should surface plugin error when old password is wrong', async () => {
    // Exercises the `err` branch of the changePassword callback.
    // htpasswd throws a plain Error (no .status) on wrong old password,
    // so the handler falls back to 409 CONFLICT with the plugin's message.
    const user = { name: 'web-reset-wrong-old', password: 'secretPass002' };
    await addUser(request(app), user.name, user);
    const token = await loginWebUI(user.name, user.password);

    const res = await request(app)
      .put('/-/verdaccio/sec/reset_password')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .send({ password: { old: 'not-the-real-password', new: 'newSecret123' } })
      .expect(HTTP_STATUS.CONFLICT);

    expect(res.body.error).toMatch(/invalid old password/i);
    await loginWebUI(user.name, user.password);
    await request(app)
      .post('/-/verdaccio/sec/login')
      .send({ username: user.name, password: 'newSecret123' })
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  describe('password request validation', () => {
    const user = { name: 'web-reset-body', password: 'secretPass003' };
    let token: string;

    beforeAll(async () => {
      await addUser(request(app), user.name, user);
      token = await loginWebUI(user.name, user.password);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test.each([
      ['missing body', undefined],
      ['empty body', {}],
      ['array body', []],
      ['null password', { password: null }],
      ['string password', { password: 'new-pass' }],
      ['number password', { password: 12345678 }],
      ['boolean password', { password: true }],
      ['array password', { password: [] }],
      ['empty password object', { password: {} }],
      ['missing old password', { password: { new: 'new-pass' } }],
      ['null old password', { password: { old: null, new: 'new-pass' } }],
      ['number old password', { password: { old: 1234, new: 'new-pass' } }],
      ['boolean old password', { password: { old: true, new: 'new-pass' } }],
      ['array old password', { password: { old: ['test'], new: 'new-pass' } }],
      ['object old password', { password: { old: {}, new: 'new-pass' } }],
      ['missing new password', { password: { old: user.password } }],
      ['null new password', { password: { old: user.password, new: null } }],
      ['number new password', { password: { old: user.password, new: 12345678 } }],
      ['boolean new password', { password: { old: user.password, new: true } }],
      ['array new password', { password: { old: user.password, new: ['new-pass'] } }],
      ['object new password', { password: { old: user.password, new: {} } }],
      ['empty new password', { password: { old: user.password, new: '' } }],
    ])('should reject %s without changing credentials', async (_label, body) => {
      const changePassword = vi.spyOn(Auth.prototype, 'changePassword');
      const response = await request(app)
        .put('/-/verdaccio/sec/reset_password')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .set('Content-Type', 'application/json')
        .send(body === undefined ? undefined : JSON.stringify(body))
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.error).toBe(APP_ERROR.PASSWORD_VALIDATION);
      expect(changePassword).not.toHaveBeenCalled();
      await loginWebUI(user.name, user.password);
    });

    test('should require authentication before validating the password body', async () => {
      const changePassword = vi.spyOn(Auth.prototype, 'changePassword');
      const response = await request(app)
        .put('/-/verdaccio/sec/reset_password')
        .send({})
        .expect(HTTP_STATUS.UNAUTHORIZED);
      expect(response.body.message).toBe(API_ERROR.MUST_BE_LOGGED);
      expect(changePassword).not.toHaveBeenCalled();
    });
  });

  test('should return 401 when request is not authenticated', async () => {
    const res = await request(app)
      .put('/-/verdaccio/sec/reset_password')
      .send({ password: { old: 'x', new: 'newSecret123' } })
      .expect(HTTP_STATUS.UNAUTHORIZED);

    // Handler uses `next({ message })` (data-via-next convention used
    // across the web endpoints), so the body field is `message`, not `error`.
    expect(res.body.message).toMatch(API_ERROR.MUST_BE_LOGGED);
  });
});

describe('web endpoint: reset_password (flag disabled)', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    ({ app, mockRegistry } = await createWebApp({}, 'htpasswd-web-reset-off'));
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

  test('should return 404 when flags.changePassword is not enabled', async () => {
    const user = { name: 'web-reset-flag-off', password: 'secretPass000' };
    const addRes = await addUser(request(app), user.name, user);
    const token = addRes[1].body.token;

    await request(app)
      .put('/-/verdaccio/sec/reset_password')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .send({ password: { old: user.password, new: 'newSecret123' } })
      .expect(HTTP_STATUS.NOT_FOUND);
  });
});
