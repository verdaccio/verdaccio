import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

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
          done(true);
        });
    });
  });
});
