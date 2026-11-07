import nock from 'nock';
import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import type { Logger } from '@verdaccio/types';

import { ProxyStorage } from '../src';

const logger = {
  debug: vi.fn(),
  info: vi.fn(),
  http: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  trace: vi.fn(),
} as unknown as Logger;

const domain = 'https://registry.npmjs.org';
const conf = new Config(parseConfigFile(path.join(import.meta.dirname, '/conf', 'proxy1.yaml')));
conf.server_id = 'foo-phseudo-bytes';

const attestations = {
  attestations: [
    {
      predicateType: 'https://slsa.dev/provenance/v1',
      bundle: { mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json' },
    },
  ],
};

const createProxy = () =>
  new ProxyStorage('uplink', { url: domain, retry: 0 } as any, conf, logger);

describe('proxy attestations', () => {
  beforeEach(() => {
    nock.cleanAll();
    vi.clearAllMocks();
  });

  describe('getAttestations', () => {
    test('encodes a scoped package name in the path', async () => {
      nock(domain).get('/-/npm/v1/attestations/@scope%2Fpkg@1.0.0').reply(200, attestations);
      expect(await createProxy().getAttestations('@scope/pkg', '1.0.0')).toEqual(attestations);
    });

    test('returns null when the version has no attestations', async () => {
      nock(domain).get('/-/npm/v1/attestations/semver@7.8.6').reply(404);
      expect(await createProxy().getAttestations('semver', '7.8.6')).toBeNull();
    });

    test('encodes the version segment', async () => {
      nock(domain).get('/-/npm/v1/attestations/pkg@1.0.0%2Fx').reply(404);
      expect(await createProxy().getAttestations('pkg', '1.0.0/x')).toBeNull();
    });

    test('clears the failure count once the uplink answers again', async () => {
      nock(domain).get('/-/npm/v1/attestations/semver@7.8.6').reply(200, attestations);
      const proxy = createProxy();
      proxy.failed_requests = proxy.max_fails;
      proxy.last_request_time = Date.now() - proxy.fail_timeout - 1;
      await proxy.getAttestations('semver', '7.8.6');
      expect(proxy.failed_requests).toBe(0);
    });
  });
});
