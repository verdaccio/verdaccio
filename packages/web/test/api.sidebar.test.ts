import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

await setup({});

const mockManifest = vi.fn();
vi.mock('@verdaccio/ui-theme', () => mockManifest());

describe('sidebar api', () => {
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

  test('should display sidebar info scoped package', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'my readme scoped' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/sidebar/@scope/pk1-test')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch('@scope/pk1-test');
  });

  test('should display sidebar info package', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk2-test', '1.0.0', { readme: 'my readme scoped' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk2-test')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch('pk2-test');
  });
});
