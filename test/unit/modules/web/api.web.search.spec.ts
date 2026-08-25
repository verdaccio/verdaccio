import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { Auth } from '@verdaccio/auth';
import { errorUtils, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Manifest } from '@verdaccio/types';

import Storage from '../../../../src/lib/storage';
import { setup } from '../../../../src/lib/logger';
import { createWebApp, seedPackages } from './__helper';

setup({});

async function publishSearchPackages(app, prefix: string, count: number): Promise<void> {
  for (let index = 0; index < count; index++) {
    const packageName = `${prefix}-${index}`;
    await request(app)
      .put(`/${packageName}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(generatePackageMetadata(packageName)))
      .expect(HTTP_STATUS.CREATED);
  }
}

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

  afterEach(() => {
    vi.restoreAllMocks();
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

  test('should limit the number of search results', async () => {
    await publishSearchPackages(app, 'search-limit-package', 25);

    const res = await request(app)
      .get('/-/verdaccio/data/search/search-limit-package')
      .expect(HTTP_STATUS.OK);

    expect(res.body).toHaveLength(20);
  });

  test('should return all search results when there are fewer than the limit', async () => {
    await publishSearchPackages(app, 'quokkaomega', 5);

    const res = await request(app)
      .get('/-/verdaccio/data/search/quokkaomega')
      .expect(HTTP_STATUS.OK);

    expect(res.body).toHaveLength(5);
  });

  test('should wait for asynchronous access checks', async () => {
    await publishSearchPackages(app, 'nebulaquartz', 3);
    vi.spyOn(Auth.prototype, 'allow_access').mockImplementation((_pkg, _user, callback) => {
      setTimeout(() => callback(null, true), 10);
    });

    const res = await request(app)
      .get('/-/verdaccio/data/search/nebulaquartz')
      .expect(HTTP_STATUS.OK);

    expect(res.body).toHaveLength(3);
  });

  test('should skip an access error and continue searching', async () => {
    await publishSearchPackages(app, 'vortexmango', 3);
    vi.spyOn(Auth.prototype, 'allow_access').mockImplementation(
      ({ packageName }, _user, callback) => {
        setTimeout(() => {
          if (packageName.endsWith('-1')) {
            callback(errorUtils.getInternalError('access failed'), false);
          } else {
            callback(null, true);
          }
        }, 10);
      }
    );

    const res = await request(app)
      .get('/-/verdaccio/data/search/vortexmango')
      .expect(HTTP_STATUS.OK);

    expect(res.body).toHaveLength(2);
    expect(res.body.map((pkg) => pkg.name)).not.toContain('vortexmango-1');
  });

  test('should skip a package without a valid latest version', async () => {
    await publishSearchPackages(app, 'brokenmanifest', 3);
    const originalGetPackage = Storage.prototype.getPackage;
    vi.spyOn(Storage.prototype, 'getPackage').mockImplementation(function (options) {
      if (options.name === 'brokenmanifest-1') {
        options.callback(null, {
          name: options.name,
          versions: {},
          'dist-tags': { latest: '1.0.0' },
        } as Manifest);
        return;
      }

      originalGetPackage.call(this, options);
    });

    const res = await request(app)
      .get('/-/verdaccio/data/search/brokenmanifest')
      .expect(HTTP_STATUS.OK);

    expect(res.body).toHaveLength(2);
    expect(res.body.every(Boolean)).toBe(true);
  });
});
