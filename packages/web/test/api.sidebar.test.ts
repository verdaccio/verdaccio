import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

beforeAll(async () => {
  await setup({});
});

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

describe('sidebar api', () => {
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

  test('should display sidebar info for an existing version', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk3-test', '1.0.0', { readme: 'my readme' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk3-test?v=1.0.0')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(JSON.parse(response.text).latest.version).toBe('1.0.0');
  });

  test('should return 404 for a version that does not exist instead of falling back to latest', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk4-test', '1.0.0', { readme: 'my readme' });
    await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk4-test?v=9.9.9')
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('should resolve a dist-tag used as version', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk5-test', '1.0.0', { readme: 'my readme' });
    const response = await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk5-test?v=latest')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(JSON.parse(response.text).latest.version).toBe('1.0.0');
  });

  test('should return 404 for an unknown dist-tag', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk5b-test', '1.0.0', { readme: 'my readme' });
    await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk5b-test?v=next')
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('should return 404 for __proto__ as version without polluting Object.prototype', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'pk6-test', '1.0.0', { readme: 'my readme' });
    await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk6-test?v=__proto__')
      .expect(HTTP_STATUS.NOT_FOUND);
    await supertest(app)
      .get('/-/verdaccio/data/sidebar/pk6-test?v=constructor')
      .expect(HTTP_STATUS.NOT_FOUND);
    // the sidebar handler assigns `.author` on the looked-up version: a
    // prototype-resolving lookup would have polluted every object
    expect(({} as any).author).toBeUndefined();
    expect(Object.prototype).not.toHaveProperty('author');
  });
});
