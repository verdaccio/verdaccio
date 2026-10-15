import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { API_ERROR, HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { setup } from '../../../../src/lib/logger';
import { addUser } from '../../__helper/api';
import { createWebApp } from './__helper';

setup({});

const credentials = { name: 'user-web', password: 'secretPass' };

describe('web endpoint: login', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    ({ app, mockRegistry } = await createWebApp({}, 'htpasswd-web-login'));
    await addUser(request(app), credentials.name, credentials);
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

  test('should log successfully', () => {
    return new Promise((done) => {
      request(app)
        .post('/-/verdaccio/sec/login')
        .send({
          username: credentials.name,
          password: credentials.password,
        })
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          expect(res.body.error).toBeUndefined();
          expect(res.body.token).toBeDefined();
          expect(res.body.token).toBeTruthy();
          expect(res.body.username).toMatch(credentials.name);
          expect(res.get(HEADERS.CACHE_CONTROL)).toEqual('no-cache, no-store');
          done(true);
        });
    });
  });

  test('should fails on log unvalid user', () => {
    return new Promise((done) => {
      request(app)
        .post('/-/verdaccio/sec/login')
        .send({
          username: 'fake',
          password: 'fake',
        })
        // FIXME: there should be 401
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          expect(res.body.error).toMatch(/bad username\/password, access denied/);
          expect(res.get('www-authenticate')).toBe('Bearer');
          done(true);
        });
    });
  });

  test.each([
    ['null', 'null'],
    ['an empty object', '{}'],
    ['a missing username', JSON.stringify({ password: credentials.password })],
    ['a missing password', JSON.stringify({ username: credentials.name })],
    ['an empty username', JSON.stringify({ username: '', password: credentials.password })],
    ['an empty password', JSON.stringify({ username: credentials.name, password: '' })],
    ['a non-string username', JSON.stringify({ username: [credentials.name], password: 'x' })],
    ['a non-string password', JSON.stringify({ username: credentials.name, password: {} })],
  ])('should reject %s with 400', async (_label, body) => {
    const res = await request(app)
      .post('/-/verdaccio/sec/login')
      .set(HEADERS.CONTENT_TYPE, HEADERS.JSON)
      .send(body);

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body.error).toBe(API_ERROR.USERNAME_PASSWORD_REQUIRED);
  });
});
