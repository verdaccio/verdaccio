import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

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
    vi.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should return file from asset folder', async () => {
    const app = await initializeServer('web-assets.yaml');
    const response = await supertest(app)
      .get('/-/assets/verdaccio.svg')
      .expect(HEADER_TYPE.CONTENT_TYPE, 'image/svg+xml')
      .expect(HTTP_STATUS.OK);
    expect(response.body).toBeInstanceOf(Buffer);
    expect(response.body).toHaveLength(3279);
  });
});
