import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { setup } from '../../../../src/lib/logger';
import { createWebApp, seedPackages } from './__helper';

setup({});

describe('web endpoint: search', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    ({ app, mockRegistry } = await createWebApp({}, 'htpasswd-web-search'));
    await seedPackages(app);
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

  test('should search pk1-test', () => {
    return new Promise((done) => {
      request(app)
        .get('/-/verdaccio/data/search/scope')
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          expect(res.body).toHaveLength(1);
          done(true);
        });
    });
  });

  test('should search with 404', async () => {
    const res = await request(app)
      .get('/-/verdaccio/data/search/nonexistent-package-xyz')
      .expect(HTTP_STATUS.OK);
    expect(res.body).toEqual([]);
  });

  test('should not find forbidden-place', () => {
    return new Promise((done) => {
      request(app)
        .get('/-/verdaccio/data/search/forbidden-place')
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          // this is expected since we are not logged
          // and  forbidden-place is allow_access: 'nobody'
          expect(res.body).toHaveLength(0);
          done(true);
        });
    });
  });
});
