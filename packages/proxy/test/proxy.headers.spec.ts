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

  describe('x-forwarded-for', () => {
    const FORWARDED_FOR = 'x-forwarded-for';
    const tarball = `${domain}/pkg/-/pkg-1.0.0.tgz`;

    /** The forwarded-for header each request arrived with; undefined when absent. */
    function recordRequests(): (string | undefined)[] {
      const seen: (string | undefined)[] = [];
      const note = function (this: any, status: number, body: unknown) {
        seen.push(this.req.headers[FORWARDED_FOR]);
        return [status, body];
      };
      nock(domain)
        .persist()
        .get('/pkg')
        .reply(function () {
          return note.call(this, 200, { name: 'pkg' });
        })
        .get('/pkg/-/pkg-1.0.0.tgz')
        .reply(function () {
          return note.call(this, 200, 'tarball');
        });
      return seen;
    }

    async function drain(stream: any): Promise<void> {
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      stream.on('error', reject);
      stream.on('end', resolve);
      stream.resume();
      await promise;
    }

    test('is not sent when the client address is unknown', async () => {
      const seen = recordRequests();
      const proxy = new ProxyStorage('uplink', { url: domain }, conf, logger);

      await drain(proxy.fetchTarball(tarball, {}));
      await proxy.getRemoteMetadata('pkg', {});

      expect(seen).toEqual([undefined, undefined]);
    });

    test('carries the client address', async () => {
      const seen = recordRequests();
      const proxy = new ProxyStorage('uplink', { url: domain }, conf, logger);

      await drain(proxy.fetchTarball(tarball, { remoteAddress: '198.51.100.4' }));
      await proxy.getRemoteMetadata('pkg', { remoteAddress: '198.51.100.4' });

      expect(seen).toEqual(['198.51.100.4', '198.51.100.4']);
    });

    test('appends the client address to the chain the request arrived with', async () => {
      const seen = recordRequests();
      const proxy = new ProxyStorage('uplink', { url: domain }, conf, logger);
      const client = { remoteAddress: '10.0.0.2', forwardedFor: '203.0.113.7, 10.0.0.1' };

      await proxy.getRemoteMetadata('pkg', client);

      expect(seen).toEqual(['203.0.113.7, 10.0.0.1, 10.0.0.2']);
    });

    test('ignores a chain without a client address', async () => {
      const seen = recordRequests();
      const proxy = new ProxyStorage('uplink', { url: domain }, conf, logger);

      await proxy.getRemoteMetadata('pkg', { forwardedFor: '203.0.113.7' });

      expect(seen).toEqual([undefined]);
    });

    test.each(['X-Forwarded-For', 'x-forwarded-for', 'X-FORWARDED-FOR'])(
      'a value set in the uplink headers config as %s wins',
      async (name) => {
        const seen = recordRequests();
        const headers = { [name]: '192.0.2.9' };
        const proxy = new ProxyStorage('uplink', { url: domain, headers }, conf, logger);

        await drain(proxy.fetchTarball(tarball, {}));
        await drain(proxy.fetchTarball(tarball, { remoteAddress: '198.51.100.4' }));
        await proxy.getRemoteMetadata('pkg', { remoteAddress: '198.51.100.4' });

        expect(seen).toEqual(['192.0.2.9', '192.0.2.9', '192.0.2.9']);
        expect(headers).toEqual({ [name]: '192.0.2.9' });
      }
    );
  });
});
