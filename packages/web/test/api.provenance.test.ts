import nock from 'nock';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
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

function remoteSemver() {
  const manifest = generateRemotePackageMetadata('semver', '7.8.6', npmjs);
  manifest.versions['7.8.6'].dist = {
    ...manifest.versions['7.8.6'].dist,
    signatures: [{ keyid: 'SHA256:DhQ8', sig: 'MEUC' }],
    attestations: {
      url: `${npmjs}/-/npm/v1/attestations/semver@7.8.6`,
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

  test('returns 404 for a version without attestations', async () => {
    const app = await initializeServer('provenance.yaml');
    await publishVersion(app, 'local-pkg', '1.0.0');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/local-pkg')
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('returns 404 for an unknown version', async () => {
    nock(npmjs).get('/semver').reply(200, remoteSemver());
    const app = await initializeServer('provenance.yaml');

    await supertest(app)
      .get('/-/verdaccio/data/package/provenance/semver?v=0.0.1')
      .expect(HTTP_STATUS.NOT_FOUND);
  });
});
