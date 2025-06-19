import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

setup({});

const mockManifest = vi.fn();
vi.mock('@verdaccio/ui-theme', () => mockManifest());

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
    Date.now = vi.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());
    vi.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should find results to search api', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'foo', '1.0.0');
    const response = await supertest(app)
      .get('/-/verdaccio/data/search/foo')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(1);
    // FUTURE: we can improve here matching the right outcome
  });

  test('should found no results to search', async () => {
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/data/search/notFound')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(0);
  });

  // TODO: need a way to make this fail
  test.skip('should fail search api', async () => {
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/data/search/thisWillFail')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(3);
  });

  test.todo('search abort request');
  // maybe these could be done in storage package to avoid have specifics on this level
  test.todo('search allow request permissions');
  test.todo('search query params, pagination etc');
});
