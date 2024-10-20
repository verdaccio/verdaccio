import path from 'path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { NOT_README_FOUND } from '../src/api/readme';
import { initializeServer } from './helper';

setup({});

const mockManifest = vi.fn();
vi.mock('@verdaccio/ui-theme', () => mockManifest());

describe('readme api', () => {
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
    vi.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should fetch readme scoped package', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'my readme scoped' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/package/readme/@scope/pk1-test')
      .set('Accept', HEADERS.TEXT_PLAIN)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch('my readme scoped');
  }, 70000);

  test('should fetch readme scoped package with not found message', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: null });
    const response = await supertest(app)
      .get('/-/verdaccio/data/package/readme/@scope/pk1-test')
      .set('Accept', HEADERS.TEXT_PLAIN)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch(NOT_README_FOUND);
  });

  test('should fetch readme a package', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk1-test', '1.0.0', { readme: 'my readme' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/package/readme/pk1-test')
      .set('Accept', HEADERS.TEXT_PLAIN)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch('my readme');
  });

  test('should fetch readme a package with not found message', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk1-test', '1.0.0', { readme: null });
    const response = await supertest(app)
      .get('/-/verdaccio/data/package/readme/pk1-test')
      .set('Accept', HEADERS.TEXT_PLAIN)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN_UTF8)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch(NOT_README_FOUND);
  });
});
