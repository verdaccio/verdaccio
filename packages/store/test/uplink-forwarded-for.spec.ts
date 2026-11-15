import nock from 'nock';
import { pseudoRandomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { generateRemotePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Manifest } from '@verdaccio/types';
import type { RequestOptions } from '@verdaccio/url';

import { Storage } from '../src';
import { configExample } from './helpers';

const UPLINK = 'https://fake.verdaccio.org';
const ELSEWHERE = 'https://cdn.verdaccio.test';
const FORWARDED_FOR = 'x-forwarded-for';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'fatal' });
});

afterEach(() => {
  nock.cleanAll();
});

async function createStorage(): Promise<Storage> {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-storage-'));
  const config = new Config(
    configExample(
      { ...getDefaultConfig(), storage: path.join(tempRoot, pseudoRandomBytes(5).toString('hex')) },
      './fixtures/config/syncSingleUplinksMetadata.yaml',
      import.meta.dirname
    )
  );
  config.packages = { '**': { access: ['$all'], publish: ['$all'], proxy: ['ver'] } } as any;
  const storage = new Storage(config, logger);
  await storage.init(config);
  return storage;
}

/** A client behind two proxies: the request carries their chain. */
const viaProxies: RequestOptions = {
  host: 'localhost',
  protocol: 'http',
  headers: { [FORWARDED_FOR]: '203.0.113.7, 10.0.0.1' },
  remoteAddress: '10.0.0.2',
};

const direct: RequestOptions = {
  host: 'localhost',
  protocol: 'http',
  headers: {},
  remoteAddress: '198.51.100.4',
};

/** The header as received: `undefined` when the request did not carry it. */
type Seen = string | undefined;

/** Records the forwarded-for header of every request a host receives. */
function record(host: string, name: string, manifest: Manifest | null): Seen[] {
  const seen: Seen[] = [];
  const note = function (this: { req: { headers: Record<string, string> } }): void {
    seen.push(this.req.headers[FORWARDED_FOR]);
  };
  const scope = nock(host).persist();
  if (manifest) {
    scope.get(`/${name}`).reply(function () {
      note.call(this as any);
      return [200, manifest];
    });
  }
  scope.get(`/${name}/-/${name}-1.0.0.tgz`).reply(function () {
    note.call(this as any);
    return [200, 'tarball'];
  });
  return seen;
}

async function download(storage: Storage, name: string, requestOptions?: RequestOptions) {
  const stream = await storage.getTarball(name, `${name}-1.0.0.tgz`, {
    signal: new AbortController().signal,
    requestOptions,
  });
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  stream.on('error', reject);
  stream.on('end', resolve);
  stream.resume();
  await promise;
}

describe('X-Forwarded-For sent to uplinks', () => {
  test('metadata requests carry the incoming chain followed by the client address', async () => {
    const name = 'xff-metadata';
    const seen = record(UPLINK, name, generateRemotePackageMetadata(name, '1.0.0', UPLINK));
    const storage = await createStorage();

    await storage.getPackageByOptions({
      name,
      uplinksLook: true,
      requestOptions: viaProxies,
    });

    expect(seen).toEqual(['203.0.113.7, 10.0.0.1, 10.0.0.2']);
  });

  test('tarball requests carry the incoming chain followed by the client address', async () => {
    const name = 'xff-tarball';
    const seen = record(UPLINK, name, generateRemotePackageMetadata(name, '1.0.0', UPLINK));
    const storage = await createStorage();

    await download(storage, name, viaProxies);

    // the metadata lookup of the download, then the tarball itself
    expect(seen).toEqual(['203.0.113.7, 10.0.0.1, 10.0.0.2', '203.0.113.7, 10.0.0.1, 10.0.0.2']);
  });

  test('a client that connects directly is forwarded as its own address', async () => {
    const name = 'xff-direct';
    const seen = record(UPLINK, name, generateRemotePackageMetadata(name, '1.0.0', UPLINK));
    const storage = await createStorage();

    await download(storage, name, direct);

    expect(seen).toEqual(['198.51.100.4', '198.51.100.4']);
  });

  test('no header is sent when the client is not known', async () => {
    const name = 'xff-unknown';
    const seen = record(UPLINK, name, generateRemotePackageMetadata(name, '1.0.0', UPLINK));
    const storage = await createStorage();

    await download(storage, name);

    expect(seen).toEqual([undefined, undefined]);
  });

  test('a tarball hosted outside the uplink never receives the client origin', async () => {
    const name = 'xff-elsewhere';
    const uplink = record(UPLINK, name, generateRemotePackageMetadata(name, '1.0.0', ELSEWHERE));
    const elsewhere = record(ELSEWHERE, name, null);
    const storage = await createStorage();

    await download(storage, name, viaProxies);

    expect(uplink).toEqual(['203.0.113.7, 10.0.0.1, 10.0.0.2']);
    expect(elsewhere).toEqual([undefined]);
  });
});
