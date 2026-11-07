import nock from 'nock';
import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { API_ERROR } from '@verdaccio/core';
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

const keys = [
  {
    expires: null,
    keyid: 'SHA256:abc',
    keytype: 'ecdsa-sha2-nistp256',
    scheme: 'ecdsa-sha2-nistp256',
    key: 'MFkw',
  },
];

const createProxy = () =>
  new ProxyStorage('uplink', { url: domain, retry: 0 } as any, conf, logger);

describe('proxy registry keys', () => {
  beforeEach(() => {
    nock.cleanAll();
    vi.clearAllMocks();
  });

  test('returns the keys the uplink publishes', async () => {
    nock(domain).get('/-/npm/v1/keys').reply(200, { keys });
    expect(await createProxy().getRegistryKeys()).toEqual(keys);
  });

  test('returns null when the uplink has no keys endpoint', async () => {
    nock(domain).get('/-/npm/v1/keys').reply(404);
    expect(await createProxy().getRegistryKeys()).toBeNull();
  });

  test.each([
    ['a null entry', [null, ...keys]],
    ['an entry without keytype and scheme', [{ keyid: 'SHA256:x', key: 'MFkw' }, ...keys]],
    ['an entry with a numeric expires', [...keys, { ...keys[0], expires: 42 }]],
    ['only invalid entries', [null, { keyid: 'SHA256:x' }]],
  ])('rejects a response with %s instead of relaying a partial set', async (_label, body) => {
    nock(domain).get('/-/npm/v1/keys').reply(200, { keys: body });
    await expect(createProxy().getRegistryKeys()).rejects.toThrow(
      API_ERROR.INVALID_UPLINK_KEYS_RESPONSE
    );
  });

  test('an empty keys array is a registry without keys', async () => {
    nock(domain).get('/-/npm/v1/keys').reply(200, { keys: [] });
    expect(await createProxy().getRegistryKeys()).toEqual([]);
  });

  test('rejects a successful response without a keys array', async () => {
    nock(domain).get('/-/npm/v1/keys').reply(200, { keys: 'nope' });
    await expect(createProxy().getRegistryKeys()).rejects.toThrow(
      API_ERROR.INVALID_UPLINK_KEYS_RESPONSE
    );
  });

  test('rejects other upstream failures', async () => {
    nock(domain).get('/-/npm/v1/keys').reply(500);
    await expect(createProxy().getRegistryKeys()).rejects.toThrow('bad status code: 500');
  });

  test('reports a timeout as the uplink being unavailable', async () => {
    nock(domain).get('/-/npm/v1/keys').replyWithError({ code: 'ETIMEDOUT' });
    await expect(createProxy().getRegistryKeys()).rejects.toThrow(API_ERROR.SERVER_TIME_OUT);
  });
});
