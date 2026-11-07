import nock from 'nock';
import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { getNewToken, initializeServer } from './_helper';

const npmjs = 'https://registry.npmjs.org';
const mirror = 'https://mirror.example.test';

const key = (keyid: string) => ({
  expires: null,
  keyid,
  keytype: 'ecdsa-sha2-nistp256',
  scheme: 'ecdsa-sha2-nistp256',
  key: `key-${keyid}`,
});
const attestations = {
  attestations: [
    {
      predicateType: 'https://github.com/npm/attestation/tree/main/specs/publish/v0.1',
      bundle: { mediaType: 'application/vnd.dev.sigstore.bundle+json;version=0.2' },
    },
    {
      predicateType: 'https://slsa.dev/provenance/v1',
      bundle: { mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json' },
    },
  ],
};

describe('signatures', () => {
  let app: any;

  describe('without flags.signatures', () => {
    test('does not expose the routes', async () => {
      const plain = await initializeServer('package.yaml');
      await supertest(plain).get('/-/npm/v1/keys').expect(HTTP_STATUS.NOT_FOUND);
      await supertest(plain)
        .get('/-/npm/v1/attestations/semver@7.8.6')
        .expect(HTTP_STATUS.NOT_FOUND);
    });
  });

  beforeEach(async () => {
    nock.cleanAll();
    app = await initializeServer('signatures.yaml');
  });

  describe('GET /-/npm/v1/keys', () => {
    test('merges the keys of every uplink by keyid and caches them', async () => {
      nock(npmjs)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [key('A'), key('B')] });
      nock(mirror)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [key('B'), key('C')] });

      const response = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(response.body.keys.map((k: any) => k.keyid)).toEqual(['A', 'B', 'C']);

      // interceptors are consumed, so a second hit on the uplinks would fail
      const cached = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(cached.body.keys).toHaveLength(3);
      expect(nock.isDone()).toBe(true);
    });

    test('keeps the keys an uplink returns when another one fails, without caching them', async () => {
      nock(npmjs)
        .get('/-/npm/v1/keys')
        .times(2)
        .reply(200, { keys: [key('A')] });
      nock(mirror).get('/-/npm/v1/keys').reply(500);

      const response = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(response.body.keys.map((k: any) => k.keyid)).toEqual(['A']);

      // the mirror is back: the partial set was not cached, so its keys appear right away
      nock(mirror)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [key('B')] });
      const recovered = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(recovered.body.keys.map((k: any) => k.keyid)).toEqual(['A', 'B']);
    });

    test('treats a malformed successful answer as a failure and retries it', async () => {
      nock(npmjs)
        .get('/-/npm/v1/keys')
        .times(2)
        .reply(200, { keys: [key('A')] });
      nock(mirror).get('/-/npm/v1/keys').reply(200, { keys: 'invalid' });

      const first = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(first.body.keys.map((k: any) => k.keyid)).toEqual(['A']);

      nock(mirror)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [key('B')] });
      const second = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(second.body.keys.map((k: any) => k.keyid)).toEqual(['A', 'B']);
    });

    test('keeps the first key published under a key id', async () => {
      nock(npmjs)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [key('A')] });
      nock(mirror)
        .get('/-/npm/v1/keys')
        .reply(200, { keys: [{ ...key('A'), key: 'something-else' }] });

      const response = await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.OK);
      expect(response.body.keys).toEqual([key('A')]);
    });

    test('reports an outage when every uplink fails', async () => {
      nock(npmjs).get('/-/npm/v1/keys').reply(503);
      nock(mirror).get('/-/npm/v1/keys').reply(500);

      const response = await supertest(app).get('/-/npm/v1/keys');
      expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.INTERNAL_ERROR);
    });

    test('returns 404 when no uplink publishes keys, and caches that answer', async () => {
      nock(npmjs).get('/-/npm/v1/keys').reply(404);
      nock(mirror).get('/-/npm/v1/keys').reply(404);

      await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.NOT_FOUND);
      // interceptors are consumed: a second round trip to the uplinks would not be a 404
      await supertest(app).get('/-/npm/v1/keys').expect(HTTP_STATUS.NOT_FOUND);
      expect(nock.isDone()).toBe(true);
    });
  });

  describe('GET /-/npm/v1/attestations/:spec', () => {
    test('relays the attestations of the uplink that proxies the package', async () => {
      nock(npmjs).get('/-/npm/v1/attestations/semver@7.8.6').reply(200, attestations);

      const response = await supertest(app)
        .get('/-/npm/v1/attestations/semver@7.8.6')
        .expect(HTTP_STATUS.OK);
      expect(response.body).toEqual(attestations);
    });

    test('accepts a scoped spec with an encoded or a plain slash', async () => {
      nock(mirror)
        .get('/-/npm/v1/attestations/@mirror%2Fpkg@1.0.0')
        .times(2)
        .reply(200, attestations);

      await supertest(app).get('/-/npm/v1/attestations/@mirror/pkg@1.0.0').expect(HTTP_STATUS.OK);
      await supertest(app).get('/-/npm/v1/attestations/@mirror%2fpkg@1.0.0').expect(HTTP_STATUS.OK);
      expect(nock.isDone()).toBe(true);
    });

    test('returns 404 when the uplink has no attestations for the version', async () => {
      nock(npmjs).get('/-/npm/v1/attestations/semver@7.8.6').reply(404);

      await supertest(app).get('/-/npm/v1/attestations/semver@7.8.6').expect(HTTP_STATUS.NOT_FOUND);
    });

    test('returns 404 for a package without uplinks', async () => {
      await supertest(app)
        .get('/-/npm/v1/attestations/local-pkg@1.0.0')
        .expect(HTTP_STATUS.NOT_FOUND);
    });

    test('rejects a spec without an exact version', async () => {
      await supertest(app).get('/-/npm/v1/attestations/semver').expect(HTTP_STATUS.BAD_REQUEST);
      await supertest(app)
        .get('/-/npm/v1/attestations/semver@latest')
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    test('rejects a malformed spec without echoing it', async () => {
      const specs = [
        '<script>alert(1)</script>@1.0.0',
        '../../etc@1.0.0',
        '..\\..\\etc@1.0.0',
        '%2e%2e%2fetc@1.0.0',
        '@scope/__proto__@1.0.0',
        'semver@../../1.0.0',
        'semver@1.0.0/../2.0.0',
      ];
      for (const spec of specs) {
        const response = await supertest(app)
          .get(`/-/npm/v1/attestations/${encodeURIComponent(spec)}`)
          .expect(HTTP_STATUS.BAD_REQUEST);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(JSON.stringify(response.body)).not.toMatch(/script|etc|__proto__/);
      }
    });

    test('applies the package access rules', async () => {
      const upstream = nock(npmjs)
        .get('/-/npm/v1/attestations/private-pkg@1.0.0')
        .reply(200, attestations);

      const denied = await supertest(app).get('/-/npm/v1/attestations/private-pkg@1.0.0');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(denied.status);
      expect(upstream.isDone()).toBe(false);

      const token = await getNewToken(app, { name: 'signer', password: 'signer-password' });
      const allowed = await supertest(app)
        .get('/-/npm/v1/attestations/private-pkg@1.0.0')
        .set('authorization', `Bearer ${token}`)
        .expect(HTTP_STATUS.OK);
      expect(allowed.body).toEqual(attestations);
    });
  });
});
