import nock from 'nock';
import { createHash } from 'node:crypto';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { extractTarballMetadata } from '@verdaccio/tarball';
import {
  generatePackageMetadataWithTarball,
  generateRemotePackageMetadata,
  generateTarball,
} from '@verdaccio/test-helper';

import { NOT_README_FOUND } from '../src/api/readme';
import { initializeServer } from './helper';

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));
vi.mock('@verdaccio/tarball', async (importOriginal) => {
  const original = await importOriginal<typeof import('@verdaccio/tarball')>();
  return { ...original, extractTarballMetadata: vi.fn(original.extractTarballMetadata) };
});

const UPLINK = 'https://registry.tarball.test';

beforeAll(async () => {
  await setup({});
  mockManifest.mockReturnValue(() => ({
    staticPath: path.join(import.meta.dirname, 'static'),
    manifestFiles: { js: ['runtime.js', 'vendors.js', 'main.js'] },
    manifest: require('./partials/manifest/manifest.json'),
  }));
});

beforeEach(() => {
  vi.mocked(extractTarballMetadata).mockClear();
});

afterEach(() => {
  nock.cleanAll();
});

const createTarball = (name: string, version: string, readme: string) =>
  generateTarball({
    'package/package.json': JSON.stringify({ name, version }),
    'package/README.md': readme,
  });

async function publishWithTarball(app, name: string, version: string, readme: string) {
  const tarball = await createTarball(name, version, readme);
  await supertest(app)
    .put(`/${encodeURIComponent(name)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(generatePackageMetadataWithTarball(name, version, tarball, readme)))
    .expect(HTTP_STATUS.CREATED);
}

const getReadme = (app, query: string) =>
  supertest(app)
    .get(`/-/verdaccio/data/package/readme/${query}`)
    .set('Accept', HEADERS.TEXT_PLAIN)
    .expect(HTTP_STATUS.OK);

describe('readme api with flags.tarballMetadata', () => {
  test('serves the README of the requested version from its tarball', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    await publishWithTarball(app, 'local-pkg', '1.0.0', 'readme one');
    await publishWithTarball(app, 'local-pkg', '1.1.0', 'readme two');

    expect((await getReadme(app, 'local-pkg?v=1.0.0')).text).toBe('readme one');
    expect((await getReadme(app, 'local-pkg')).text).toBe('readme two');
  });

  test('keeps the latest README fallback when the flag is off', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishWithTarball(app, 'local-pkg', '1.0.0', 'readme one');
    await publishWithTarball(app, 'local-pkg', '1.1.0', 'readme two');

    expect((await getReadme(app, 'local-pkg?v=1.0.0')).text).toBe('readme two');
  });

  test('reads the README from an uplink tarball and saves its dist stats', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    const tarball = await createTarball('remote-pkg', '1.0.0', 'remote readme');
    const remote = generateRemotePackageMetadata('remote-pkg', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    remote.versions['1.0.0'].dist.shasum = createHash('sha1').update(tarball).digest('hex');
    delete remote.versions['1.0.0'].dist.fileCount;
    delete remote.versions['1.0.0'].dist.unpackedSize;
    nock(UPLINK).get('/remote-pkg').reply(HTTP_STATUS.OK, remote).persist();
    nock(UPLINK)
      .get('/remote-pkg/-/remote-pkg-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball, { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) });

    expect((await getReadme(app, 'remote-pkg?v=1.0.0')).text).toBe('remote readme');

    await vi.waitFor(async () => {
      const response = await supertest(app).get('/remote-pkg').expect(HTTP_STATUS.OK);
      expect(response.body.versions['1.0.0'].dist).toMatchObject({
        fileCount: 2,
        unpackedSize: expect.any(Number),
      });
    });
  });

  test('never unpacks on install; the web visit reads the locally cached tarball', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    const tarball = await createTarball('remote-pkg', '1.0.0', 'remote readme');
    const remote = generateRemotePackageMetadata('remote-pkg', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    delete remote.versions['1.0.0'].dist.fileCount;
    delete remote.versions['1.0.0'].dist.unpackedSize;
    nock(UPLINK).get('/remote-pkg').reply(HTTP_STATUS.OK, remote).persist();
    // served once: a second uplink fetch would fail the README request
    nock(UPLINK)
      .get('/remote-pkg/-/remote-pkg-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball, { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) });

    await supertest(app).get('/remote-pkg/-/remote-pkg-1.0.0.tgz').expect(HTTP_STATUS.OK);
    // give a background job time to run if the install path ever schedules one again
    await new Promise((resolve) => setTimeout(resolve, 200));
    const afterInstall = await supertest(app).get('/remote-pkg').expect(HTTP_STATUS.OK);
    expect(afterInstall.body.versions['1.0.0'].dist.fileCount).toBeUndefined();

    expect((await getReadme(app, 'remote-pkg?v=1.0.0')).text).toBe('remote readme');
    await vi.waitFor(async () => {
      const response = await supertest(app).get('/remote-pkg').expect(HTTP_STATUS.OK);
      expect(response.body.versions['1.0.0'].dist.fileCount).toBe(2);
    });
  });

  test('serves READMEs of scoped packages from their tarballs', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    await publishWithTarball(app, '@scope/local-pkg', '1.0.0', 'scoped one');
    await publishWithTarball(app, '@scope/local-pkg', '1.1.0', 'scoped two');

    expect((await getReadme(app, '@scope/local-pkg?v=1.0.0')).text).toBe('scoped one');
    expect((await getReadme(app, '@scope/local-pkg?v=1.1.0')).text).toBe('scoped two');
  });

  test('never reads or leaks the tarball README of a package the visitor cannot access', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    await publishWithTarball(app, 'private-pkg', '1.0.0', 'secret one');
    await publishWithTarball(app, 'private-pkg', '1.1.0', 'secret two');
    await vi.waitFor(() => expect(extractTarballMetadata).toHaveBeenCalledTimes(2));
    vi.mocked(extractTarballMetadata).mockClear();

    const response = await supertest(app).get(
      '/-/verdaccio/data/package/readme/private-pkg?v=1.0.0'
    );

    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status);
    expect(response.text).not.toContain('secret');
    expect(extractTarballMetadata).not.toHaveBeenCalled();
  });

  test('falls back when the uplink tarball fails and retries on the next visit', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    const tarball = await createTarball('remote-flaky', '1.0.0', 'flaky readme');
    const remote = generateRemotePackageMetadata('remote-flaky', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    nock(UPLINK).get('/remote-flaky').reply(HTTP_STATUS.OK, remote).persist();
    nock(UPLINK)
      .get('/remote-flaky/-/remote-flaky-1.0.0.tgz')
      .reply(HTTP_STATUS.INTERNAL_ERROR)
      .get('/remote-flaky/-/remote-flaky-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball, { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) });

    expect((await getReadme(app, 'remote-flaky?v=1.0.0')).text).toBe(NOT_README_FOUND);
    expect((await getReadme(app, 'remote-flaky?v=1.0.0')).text).toBe('flaky readme');
  });

  test('keeps dist stats that the uplink already provides', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    const tarball = await createTarball('remote-stats', '1.0.0', 'stats readme');
    const remote = generateRemotePackageMetadata('remote-stats', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    remote.versions['1.0.0'].dist.fileCount = 99;
    remote.versions['1.0.0'].dist.unpackedSize = 12345;
    nock(UPLINK).get('/remote-stats').reply(HTTP_STATUS.OK, remote).persist();
    nock(UPLINK)
      .get('/remote-stats/-/remote-stats-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball, { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) });

    expect((await getReadme(app, 'remote-stats?v=1.0.0')).text).toBe('stats readme');
    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await supertest(app).get('/remote-stats').expect(HTTP_STATUS.OK);
    expect(response.body.versions['1.0.0'].dist).toMatchObject({
      fileCount: 99,
      unpackedSize: 12345,
    });
  });

  test('never unpacks anything when the flag is off', async () => {
    const app = await initializeServer('tarball-metadata-off.yaml');
    const tarball = await createTarball('remote-off', '1.0.0', 'off readme');
    const remote = generateRemotePackageMetadata('remote-off', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    nock(UPLINK).get('/remote-off').reply(HTTP_STATUS.OK, remote).persist();
    const tarballScope = nock(UPLINK)
      .get('/remote-off/-/remote-off-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball);
    await publishWithTarball(app, 'local-off', '1.0.0', 'local off readme');

    expect((await getReadme(app, 'remote-off?v=1.0.0')).text).toBe(NOT_README_FOUND);
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(tarballScope.isDone()).toBe(false);
    expect(extractTarballMetadata).not.toHaveBeenCalled();
  });

  test('an install and a README visit of the same uplink tarball both succeed', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    const tarball = await createTarball('remote-race', '1.0.0', 'race readme');
    const remote = generateRemotePackageMetadata('remote-race', '1.0.0', UPLINK);
    remote.readme = '';
    remote.versions['1.0.0'].readme = '';
    nock(UPLINK).get('/remote-race').reply(HTTP_STATUS.OK, remote).persist();
    nock(UPLINK)
      .get('/remote-race/-/remote-race-1.0.0.tgz')
      .reply(HTTP_STATUS.OK, tarball, { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) })
      .persist();
    const download = () =>
      supertest(app)
        .get('/remote-race/-/remote-race-1.0.0.tgz')
        .buffer(true)
        .parse((res, done) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => done(null, Buffer.concat(chunks)));
        })
        .expect(HTTP_STATUS.OK);

    const [installed, readme] = await Promise.all([
      download(),
      getReadme(app, 'remote-race?v=1.0.0'),
    ]);

    expect(installed.body).toEqual(tarball);
    expect(readme.text).toBe('race readme');
    expect((await download()).body).toEqual(tarball);
  });

  test.each([{ announced: true }, { announced: false }])(
    'stops downloading an uplink tarball above the limit (content-length: $announced)',
    async ({ announced }) => {
      const app = await initializeServer('tarball-metadata-limit.yaml');
      const tarball = await createTarball('remote-big', '1.0.0', 'x'.repeat(4096));
      const remote = generateRemotePackageMetadata('remote-big', '1.0.0', UPLINK);
      remote.readme = '';
      remote.versions['1.0.0'].readme = '';
      nock(UPLINK).get('/remote-big').reply(HTTP_STATUS.OK, remote).persist();
      nock(UPLINK)
        .get('/remote-big/-/remote-big-1.0.0.tgz')
        .reply(
          HTTP_STATUS.OK,
          tarball,
          announced ? { [HEADER_TYPE.CONTENT_LENGTH]: String(tarball.length) } : {}
        );

      expect((await getReadme(app, 'remote-big?v=1.0.0')).text).toBe(NOT_README_FOUND);
      // a second request is answered from the cached "too large" result
      expect((await getReadme(app, 'remote-big?v=1.0.0')).text).toBe(NOT_README_FOUND);
    }
  );

  test('does not unpack tarballs above tarball_metadata.max_size_mb', async () => {
    const app = await initializeServer('tarball-metadata-limit.yaml');
    await publishWithTarball(app, 'local-pkg', '1.0.0', 'readme one');
    await publishWithTarball(app, 'local-pkg', '1.1.0', 'readme two');

    expect((await getReadme(app, 'local-pkg?v=1.0.0')).text).toBe('readme two');
  });
});
