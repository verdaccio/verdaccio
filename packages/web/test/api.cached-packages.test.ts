import nock from 'nock';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generateRemotePackageMetadata, publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

beforeAll(async () => {
  await setup({});
});

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

const REMOTE = 'https://registry.npmjs.org';

async function cacheFromUplink(app, name: string, token?: string) {
  nock(REMOTE)
    .get((uri) => decodeURIComponent(uri) === `/${name}`)
    .reply(200, generateRemotePackageMetadata(name, '1.0.0', REMOTE));
  const request = supertest(app).get(`/${name.replace('/', '%2f')}`);
  if (token) {
    request.set(HEADER_TYPE.AUTHORIZATION, `Bearer ${token}`);
  }
  await request.expect(HTTP_STATUS.OK);
}

function getJson(app, url: string) {
  return supertest(app)
    .get(url)
    .set('Accept', HEADERS.JSON_CHARSET)
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET);
}

describe('cached packages web api', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(import.meta.dirname, 'static'),
      manifestFiles: { js: ['runtime.js', 'vendors.js', 'main.js'] },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('should not expose the cached list nor tag packages when the flag is off', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, 'local-pkg', '1.0.0');

    await getJson(app, '/-/verdaccio/data/packages/cached').expect(HTTP_STATUS.NOT_FOUND);
    const response = await getJson(app, '/-/verdaccio/data/packages').expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].origin).toBeUndefined();
  });

  test('should list cached packages apart from the private ones', async () => {
    const app = await initializeServer('cached-packages.yaml');
    await cacheFromUplink(app, 'remote-b');
    await cacheFromUplink(app, '@scope/remote-c');
    await cacheFromUplink(app, 'remote-a');
    await publishVersion(app, 'local-pkg', '1.0.0');

    const privateList = await getJson(app, '/-/verdaccio/data/packages').expect(HTTP_STATUS.OK);
    expect(privateList.body.map((pkg) => [pkg.name, pkg.origin])).toEqual([
      ['local-pkg', 'private'],
    ]);

    const cached = await getJson(app, '/-/verdaccio/data/packages/cached').expect(HTTP_STATUS.OK);
    expect(cached.body.total).toEqual(3);
    expect(cached.body.packages.map((pkg) => [pkg.name, pkg.origin])).toEqual([
      ['@scope/remote-c', 'cached'],
      ['remote-a', 'cached'],
      ['remote-b', 'cached'],
    ]);
    expect(cached.body.packages[1].version).toEqual('1.0.0');
    expect(cached.body.packages[1].dist.tarball).toMatch(/\/remote-a\/-\/remote-a-1\.0\.0\.tgz$/);
    // only the fields the list renders, not the whole version
    expect(cached.body.packages[1]).not.toHaveProperty('readme');
    expect(cached.body.packages[1]).not.toHaveProperty('dependencies');
  });

  test('should page the cached list by offset and limit', async () => {
    const app = await initializeServer('cached-packages.yaml');
    for (const name of ['pkg-a', 'pkg-b', 'pkg-c']) {
      await cacheFromUplink(app, name);
    }

    const page = await getJson(app, '/-/verdaccio/data/packages/cached?offset=1&limit=1').expect(
      HTTP_STATUS.OK
    );
    expect(page.body).toMatchObject({ total: 3, offset: 1, limit: 1 });
    expect(page.body.packages.map((pkg) => pkg.name)).toEqual(['pkg-b']);

    const pastTheEnd = await getJson(app, '/-/verdaccio/data/packages/cached?offset=10').expect(
      HTTP_STATUS.OK
    );
    expect(pastTheEnd.body.packages).toEqual([]);
  });

  test('should rewrite tarball urls for each request host', async () => {
    const app = await initializeServer('cached-packages.yaml');
    await cacheFromUplink(app, 'remote-a');

    for (const host of ['first.example', 'second.example']) {
      const response = await getJson(app, '/-/verdaccio/data/packages/cached')
        .set('host', host)
        .expect(HTTP_STATUS.OK);
      expect(response.body.packages[0].dist.tarball).toEqual(
        `http://${host}/remote-a/-/remote-a-1.0.0.tgz`
      );
    }
  });

  test('should hide cached packages the user cannot access', async () => {
    const app = await initializeServer('cached-packages.yaml');
    const login = await supertest(app)
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify({ username: 'test', password: 'test' }))
      .expect(HTTP_STATUS.OK);
    await cacheFromUplink(app, 'secret-pkg', login.body.token);
    await cacheFromUplink(app, 'public-pkg');

    const anonymous = await getJson(app, '/-/verdaccio/data/packages/cached').expect(
      HTTP_STATUS.OK
    );
    expect(anonymous.body.total).toEqual(1);
    expect(anonymous.body.packages.map((pkg) => pkg.name)).toEqual(['public-pkg']);

    const authenticated = await getJson(app, '/-/verdaccio/data/packages/cached')
      .set(HEADER_TYPE.AUTHORIZATION, `Bearer ${login.body.token}`)
      .expect(HTTP_STATUS.OK);
    expect(authenticated.body.packages.map((pkg) => pkg.name)).toEqual([
      'public-pkg',
      'secret-pkg',
    ]);
  });
});
