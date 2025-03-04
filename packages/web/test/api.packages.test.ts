import path from 'path';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { initializeServer } from './helper';

setup({});

const mockManifest = vi.fn();
vi.mock('@verdaccio/ui-theme', () => mockManifest());

describe('test web server', () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should OK to package api', async () => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/data/packages')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toEqual([]);
  });

  test('should allow anonymous user to access package api when login is disabled', async () => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));

    const response = await supertest(await initializeServer('login-disabled.yaml'))
      .get('/-/verdaccio/data/packages')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);

    expect(response.body).toEqual([]);
  });

  test('should allow authenticated user to access package api', async () => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));

    const api = supertest(await initializeServer('default-test.yaml'));

    // First login to get the token
    const loginRes = await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: 'test',
        })
      )
      .expect(HTTP_STATUS.OK);

    expect(loginRes.body.token).toBeDefined();

    // Then access the packages API with the token
    const response = await api
      .get('/-/verdaccio/data/packages')
      .set('Accept', HEADERS.JSON_CHARSET)
      .set(HEADER_TYPE.AUTHORIZATION, `Bearer ${loginRes.body.token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);

    expect(response.body).toEqual([]);
  });
});
