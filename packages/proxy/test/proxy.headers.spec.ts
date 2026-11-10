import nock from 'nock';
import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import type { Logger } from '@verdaccio/types';

import { ProxyStorage } from '../src';

const getConf = (name) => path.join(import.meta.dirname, '/conf', name);

const logger = {
  debug: vi.fn(),
  info: vi.fn(),
  http: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
} as unknown as Logger;

const domain = 'https://registry.npmjs.org';

describe('uplink headers config', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  const conf = new Config(parseConfigFile(getConf('proxy1.yaml')));
  conf.server_id = 'foo-phseudo-bytes';

  test('the via header does not grow with every request', async () => {
    const uplinkHeaders = { Accept: '*/*' };
    const proxy = new ProxyStorage('uplink', { url: domain, headers: uplinkHeaders }, conf, logger);

    // every request must carry a single via entry, whatever came before it
    const scope = nock(domain, {
      reqheaders: { via: '1.1 foo-phseudo-bytes (Verdaccio)' },
    });
    for (let i = 0; i < 3; i++) {
      scope.get(`/pkg${i}/-/pkg${i}-1.0.0.tgz`).reply(200, 'tarball');
      scope.get(`/pkg${i}`).reply(200, { name: `pkg${i}` });
    }

    for (let i = 0; i < 3; i++) {
      const stream = proxy.fetchTarball(`${domain}/pkg${i}/-/pkg${i}-1.0.0.tgz`, {});
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      stream.on('error', reject);
      stream.on('end', resolve);
      stream.resume();
      await promise;
      const [manifest] = await proxy.getRemoteMetadata(`pkg${i}`, { remoteAddress: '127.0.0.1' });
      expect(manifest).toEqual({ name: `pkg${i}` });
    }

    expect(nock.isDone()).toBe(true);
    // the config object itself is left alone
    expect(uplinkHeaders).toEqual({ Accept: '*/*' });
  });
});
