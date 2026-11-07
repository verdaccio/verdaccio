import nock from 'nock';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { API_ERROR, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generateRemotePackageMetadata, publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';
import attestations from './partials/attestations-semver.json';

beforeAll(async () => {
  await setup({});
});

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

const npmjs = 'https://registry.npmjs.org';

function remoteSemver(name = 'semver', domain = npmjs) {
  const manifest = generateRemotePackageMetadata(name, '7.8.6', domain);
  manifest.versions['7.8.6'].dist = {
    ...manifest.versions['7.8.6'].dist,
    signatures: [{ keyid: 'SHA256:DhQ8', sig: 'MEUC' }],
    attestations: {
      url: `${npmjs}/-/npm/v1/attestations/${name}@7.8.6`,
      provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
    },
  };
  return manifest;
}

describe('provenance api', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(import.meta.dirname, 'static'),
      manifestFiles: { js: ['runtime.js', 'vendors.js', 'main.js'] },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  afterEach(() => {
    nock.cleanAll();
    vi.clearAllMocks();
  });

  test('summarizes the provenance of a proxied version', async () => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    nock(npmjs).get('/-/npm/v1/attestations/semver@7.8.6').reply(200, attestations);
    const app = await initializeServer('provenance.yaml');

    const response = await supertest(app)
      .get('/-/verdaccio/data/package/provenance/semver?v=7.8.6')
      .expect(HTTP_STATUS.OK);
    expect(response.body).toMatchObject({
      name: 'semver',
      version: '7.8.6',
      signatures: [{ keyid: 'SHA256:DhQ8' }],
      sourceRepository: 'https://github.com/npm/node-semver',
      sourceCommit: 'b37b033b585ad5e575afeccadb426ea41bc6cea4',
      transparencyLogUrl: 'https://search.sigstore.dev/?logIndex=3644633127',
      hasPublishAttestation: true,
    });
  });

  test('asks the uplink that supplied the version, not the first one declared', async () => {
    nock('https://mirror.test').get('/mirrored-pkg').reply(404);
    nock(npmjs).get('/mirrored-pkg').reply(200, remoteSemver('mirrored-pkg'));
    const wrong = nock('https://mirror.test')
      .get('/-/npm/v1/attestations/mirrored-pkg@7.8.6')
      .reply(200, attestations);
    nock(npmjs).get('/-/npm/v1/attestations/mirrored-pkg@7.8.6').reply(200, attestations);
    const app = await initializeServer('provenance.yaml');

    const response = await supertest(app)
      .get('/-/verdaccio/data/package/provenance/mirrored-pkg?v=7.8.6')
      .expect(HTTP_STATUS.OK);
    expect(response.body.sourceRepository).toBe('https://github.com/npm/node-semver');
    expect(wrong.isDone()).toBe(false);
  });

  test('tells apart two uplinks on the same host by their path', async () => {
    nock(npmjs).get('/mirrored-pkg').reply(404);
    nock(npmjs)
      .get('/sub/mirrored-pkg')
      .reply(200, remoteSemver('mirrored-pkg', `${npmjs}/sub`));
    const wrong = nock(npmjs)
      .get('/-/npm/v1/attestations/mirrored-pkg@7.8.6')
      .reply(200, attestations);
    nock(npmjs).get('/sub/-/npm/v1/attestations/mirrored-pkg@7.8.6').reply(200, attestations);
    const app = await initializeServer('provenance-same-host.yaml');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/mirrored-pkg?v=7.8.6')
      .expect(HTTP_STATUS.OK);
    expect(wrong.isDone()).toBe(false);
  });

  test('keeps the recorded uplink apart from a twin with the same url', async () => {
    nock(npmjs).matchHeader('x-uplink', 'a').get('/dup-pkg').reply(404);
    nock(npmjs).matchHeader('x-uplink', 'b').get('/dup-pkg').reply(200, remoteSemver('dup-pkg'));
    const wrong = nock(npmjs)
      .matchHeader('x-uplink', 'a')
      .get('/-/npm/v1/attestations/dup-pkg@7.8.6')
      .reply(200, attestations);
    nock(npmjs)
      .matchHeader('x-uplink', 'b')
      .get('/-/npm/v1/attestations/dup-pkg@7.8.6')
      .reply(200, attestations);
    const app = await initializeServer('provenance-duplicate-url.yaml');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/dup-pkg?v=7.8.6')
      .expect(HTTP_STATUS.OK);
    expect(wrong.isDone()).toBe(false);
  });

  test('reports an upstream failure instead of a missing bundle', async () => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    nock(npmjs).persist().get('/-/npm/v1/attestations/semver@7.8.6').reply(503);
    const app = await initializeServer('provenance.yaml');

    const response = await supertest(app).get(
      '/-/verdaccio/data/package/provenance/semver?v=7.8.6'
    );
    expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.INTERNAL_ERROR);
  });

  test('applies the package access rules', async () => {
    nock(npmjs)
      .get(/\/@restricted(%2f|%2F|\/)dashboard$/)
      .times(2)
      .reply(200, remoteSemver('@restricted/dashboard'));
    nock(npmjs)
      .get(/\/-\/npm\/v1\/attestations\/@restricted(%2f|%2F|\/)dashboard@7\.8\.6$/)
      .reply(200, attestations);
    const app = await initializeServer('provenance.yaml');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/@restricted/dashboard?v=7.8.6')
      .expect(HTTP_STATUS.FORBIDDEN);
    const login = await supertest(app)
      .post('/-/verdaccio/sec/login')
      .send({ username: 'test', password: 'test' })
      .expect(HTTP_STATUS.OK);
    const response = await supertest(app)
      .get('/-/verdaccio/data/package/provenance/@restricted/dashboard?v=7.8.6')
      .set('authorization', `Bearer ${login.body.token}`)
      .expect(HTTP_STATUS.OK);
    expect(response.body.name).toBe('@restricted/dashboard');
  });

  test('returns 404 for a version without attestations', async () => {
    const app = await initializeServer('provenance.yaml');
    await publishVersion(app, 'local-pkg', '1.0.0');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/local-pkg')
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test.each([
    ['path traversal', '../../7.8.6'],
    ['encoded path traversal', '..%2F..%2F7.8.6'],
    ['traversal after a valid version', '7.8.6/../7.8.6'],
    ['__proto__', '__proto__'],
    ['constructor', 'constructor'],
    ['prototype', 'prototype'],
    ['hasOwnProperty', 'hasOwnProperty'],
    ['toString', 'toString'],
    ['valueOf', 'valueOf'],
    ['a script tag', '<script>alert(1)</script>'],
    ['a version followed by markup', '7.8.6<script>'],
    ['an empty string', ''],
    ['whitespace', ' '],
    ['a padded version', ' 7.8.6 '],
    ['a version with a newline', '7.8.6\n'],
    ['a null byte', '7.8.6\u0000'],
    ['a v prefix', 'v7.8.6'],
    ['an uppercase v prefix', 'V7.8.6'],
    ['a semver range', '^7.8.6'],
    ['a tilde range', '~7.8.6'],
    ['a comparator', '>=7.8.6'],
    ['a wildcard', '*'],
    ['an x-range', '7.x'],
    ['a major only', '7'],
    ['a major.minor only', '7.8'],
    ['a trailing hyphen', '7.8.6-'],
    ['build metadata', '7.8.6+build.1'],
    ['a prerelease that does not exist', '7.8.6-beta.1'],
    ['fullwidth digits', '７.８.６'],
    ['the string null', 'null'],
    ['the string undefined', 'undefined'],
    ['the string NaN', 'NaN'],
    ['zero', '0'],
    ['a negative number', '-1'],
    ['an unknown dist-tag', 'next'],
    ['a dist-tag with trailing space', 'latest '],
    ['a JSON string', '"7.8.6"'],
    ['a JSON object', '{"v":"7.8.6"}'],
    ['an object literal string', '[object Object]'],
    ['a 300-character value', 'a'.repeat(300)],
  ])('answers a generic 404 to %s as version, without echoing it', async (_label, v) => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    const app = await initializeServer('provenance.yaml');

    const response = await supertest(app)
      .get(`/-/verdaccio/data/package/provenance/semver?v=${encodeURIComponent(v)}`)
      .expect(HTTP_STATUS.NOT_FOUND);
    expect(response.body).toEqual({ error: API_ERROR.NO_PACKAGE });
  });

  test.each([
    ['a repeated v parameter', 'v=7.8.6&v=../../x'],
    ['a bracketed v parameter', 'v[]=7.8.6'],
    ['an object-shaped v parameter', 'v[x]=7.8.6'],
  ])('%s is not a version and falls back to latest', async (_label, query) => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    nock(npmjs).get('/-/npm/v1/attestations/semver@7.8.6').reply(200, attestations);
    const app = await initializeServer('provenance.yaml');

    const response = await supertest(app)
      .get(`/-/verdaccio/data/package/provenance/semver?${query}`)
      .expect(HTTP_STATUS.OK);
    expect(response.body.version).toBe('7.8.6');
  });

  test('returns 404 for an unknown version', async () => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    const app = await initializeServer('provenance.yaml');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/semver?v=0.0.1')
      .expect(HTTP_STATUS.NOT_FOUND);
  });
});
