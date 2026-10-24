import nock from 'nock';
import supertest from 'supertest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { extractTarballMetadata } from '@verdaccio/tarball';
import {
  generatePackageMetadataWithTarball,
  generateRemotePackageMetadata,
  generateTarball,
} from '@verdaccio/test-helper';

import { initializeServer, publishVersion } from './_helper';

vi.mock('@verdaccio/store', () => import('../../../store/src'));
vi.mock('@verdaccio/local-storage', () => import('../../../plugins/local-storage/src'));
vi.mock('@verdaccio/tarball', async (importOriginal) => {
  const original = await importOriginal<typeof import('@verdaccio/tarball')>();
  return { ...original, extractTarballMetadata: vi.fn(original.extractTarballMetadata) };
});

const UPLINK = 'https://registry.tarball.test';
const ABBREVIATED = 'application/vnd.npm.install-v1+json';
const REMOTE_VERSIONS = ['1.0.0', '1.1.0', '2.0.0'];

const createTarball = (name: string, version: string, readme = `# ${name}@${version}`) =>
  generateTarball({
    'package/package.json': JSON.stringify({ name, version }),
    'package/index.js': 'module.exports = 1;',
    'package/README.md': readme,
  });

async function mockUplinkPackage(name: string): Promise<Record<string, Buffer>> {
  const remote = generateRemotePackageMetadata(name, REMOTE_VERSIONS[0], UPLINK, REMOTE_VERSIONS);
  remote.readme = '';
  const tarballs: Record<string, Buffer> = {};
  for (const version of REMOTE_VERSIONS) {
    tarballs[version] = await createTarball(name, version);
    remote.versions[version].readme = '';
    delete remote.versions[version].dist.fileCount;
    delete remote.versions[version].dist.unpackedSize;
    nock(UPLINK)
      .get(`/${name}/-/${name}-${version}.tgz`)
      .reply(HTTP_STATUS.OK, tarballs[version], {
        [HEADER_TYPE.CONTENT_LENGTH]: String(tarballs[version].length),
      })
      .persist();
  }
  nock(UPLINK).get(`/${name}`).reply(HTTP_STATUS.OK, remote).persist();
  return tarballs;
}

async function install(app, name: string) {
  const packument = await supertest(app)
    .get(`/${name}`)
    .set(HEADERS.ACCEPT, ABBREVIATED)
    .expect(HTTP_STATUS.OK);
  const tarballs = await Promise.all(
    REMOTE_VERSIONS.map((version) =>
      supertest(app)
        .get(`/${name}/-/${name}-${version}.tgz`)
        .buffer(true)
        .parse((res, done) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => done(null, Buffer.concat(chunks)));
        })
        .expect(HTTP_STATUS.OK)
    )
  );
  return { packument, tarballs };
}

// lets a background job run if the install path ever schedules one again
const settle = () => new Promise((resolve) => setTimeout(resolve, 200));

function publish(app, name: string, version: string, tarball: Buffer) {
  return supertest(app)
    .put(`/${encodeURIComponent(name)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(generatePackageMetadataWithTarball(name, version, tarball, '# readme')));
}

describe('flags.tarballMetadata in the npm API', () => {
  beforeEach(() => {
    vi.mocked(extractTarballMetadata).mockClear();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('installing from an uplink never unpacks tarballs', async () => {
    const app = await initializeServer('tarball-metadata.yaml');
    await mockUplinkPackage('remote-install');

    await install(app, 'remote-install');
    // a second install is served from the local cache
    await install(app, 'remote-install');
    await settle();

    expect(extractTarballMetadata).not.toHaveBeenCalled();
    const full = await supertest(app).get('/remote-install').expect(HTTP_STATUS.OK);
    for (const version of REMOTE_VERSIONS) {
      expect(full.body.versions[version].dist.fileCount).toBeUndefined();
    }
  });

  test('install responses are identical with the flag on and off', async () => {
    const tarballs = await mockUplinkPackage('remote-same');
    const results = [];
    for (const config of ['tarball-metadata.yaml', 'tarball-metadata-off.yaml']) {
      const app = await initializeServer(config);
      results.push(await install(app, 'remote-same'));
    }
    const [on, off] = results;

    // each app listens on its own port, so only the tarball path is comparable
    const withTarballPath = (versions) =>
      Object.fromEntries(
        Object.entries<any>(versions).map(([version, manifest]) => [
          version,
          {
            ...manifest,
            dist: { ...manifest.dist, tarball: new URL(manifest.dist.tarball).pathname },
          },
        ])
      );
    expect(withTarballPath(on.packument.body.versions)).toEqual(
      withTarballPath(off.packument.body.versions)
    );
    expect(on.packument.body[`dist-tags`]).toEqual(off.packument.body[`dist-tags`]);
    expect(on.packument.headers[HEADER_TYPE.CONTENT_TYPE]).toBe(
      off.packument.headers[HEADER_TYPE.CONTENT_TYPE]
    );
    REMOTE_VERSIONS.forEach((version, index) => {
      expect(on.tarballs[index].body).toEqual(tarballs[version]);
      expect(on.tarballs[index].body).toEqual(off.tarballs[index].body);
      expect(on.tarballs[index].headers[HEADER_TYPE.CONTENT_LENGTH]).toBe(
        String(tarballs[version].length)
      );
    });
  });

  test('publishing answers like the flag off and unpacks once in the background', async () => {
    const tarball = await createTarball('local-publish', '1.0.0');
    const responses = [];
    for (const config of ['tarball-metadata.yaml', 'tarball-metadata-off.yaml']) {
      const app = await initializeServer(config);
      responses.push(await publish(app, 'local-publish', '1.0.0', tarball));
      const manifest = await supertest(app).get('/local-publish').expect(HTTP_STATUS.OK);
      expect(manifest.body.versions['1.0.0'].dist).toMatchObject({
        fileCount: 3,
        unpackedSize: expect.any(Number),
      });
    }
    const [on, off] = responses;

    expect(on.status).toBe(HTTP_STATUS.CREATED);
    expect(on.body).toEqual(off.body);
    await vi.waitFor(() => expect(extractTarballMetadata).toHaveBeenCalledTimes(1));
  });

  test('a tarball that cannot be unpacked gets the same publish answer as with the flag off', async () => {
    const corrupt = Buffer.from('this is not a tarball');
    const responses = [];
    for (const config of ['tarball-metadata.yaml', 'tarball-metadata-off.yaml']) {
      const app = await initializeServer(config);
      // the helper's fixture tarball is not a valid archive either
      await publishVersion(app, 'local-fixture', '1.0.0').expect(HTTP_STATUS.CREATED);
      responses.push(await publish(app, 'local-corrupt', '1.0.0', corrupt));
      await settle();
      await supertest(app).get('/local-fixture').expect(HTTP_STATUS.OK);
      await supertest(app).get('/local-fixture/-/local-fixture-1.0.0.tgz').expect(HTTP_STATUS.OK);
    }
    const [on, off] = responses;

    expect(on.status).toBe(off.status);
    expect(on.body).toEqual(off.body);
  });
});
