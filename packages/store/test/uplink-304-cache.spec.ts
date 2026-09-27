import MockDate from 'mockdate';
import nock from 'nock';
import { pseudoRandomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { DIST_TAGS, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { addNewVersion, generateRemotePackageMetadata } from '@verdaccio/test-helper';
import type { ConfigYaml, Logger, Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import { configExample } from './helpers';

const UPLINK = 'https://fake.verdaccio.org';
const NPMJS = 'https://registry.npmjs.org';
const EXPIRED = 10 * 60 * 1000;

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'warn' });
});

afterEach(() => {
  MockDate.reset();
  nock.cleanAll();
});

function randomStorage(): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-storage-'));
  return path.join(tempRoot, pseudoRandomBytes(5).toString('hex'));
}

async function createStorage(fixture: string, override: Partial<ConfigYaml> = {}) {
  const storagePath = randomStorage();
  const config = new Config(
    configExample(
      { ...getDefaultConfig(), storage: storagePath, ...override },
      `./fixtures/config/${fixture}`,
      import.meta.dirname
    )
  );
  const storage = new Storage(config, logger);
  await storage.init(config);
  return { storage, storagePath };
}

function manifestPath(storagePath: string, name: string): string {
  return path.join(storagePath, name, 'package.json');
}

function readManifest(storagePath: string, name: string): any {
  return JSON.parse(fs.readFileSync(manifestPath(storagePath, name), 'utf8'));
}

function writeManifest(storagePath: string, name: string, manifest: any): void {
  fs.writeFileSync(manifestPath(storagePath, name), JSON.stringify(manifest));
}

/**
 * Fill the local cache from the uplink and leave it in the state of issue #6115:
 * a stored etag and a `fetched` timestamp older than the uplink maxage.
 */
async function seedExpiredCache(
  storage: Storage,
  storagePath: string,
  name: string,
  manifest: Manifest,
  uplinks: Record<string, string> = { ver: 'etag-ver' }
) {
  nock(UPLINK).get(`/${name}`).reply(200, manifest);
  await storage.syncUplinksMetadata(name, null, { retry: { limit: 0 } });
  const onDisk = readManifest(storagePath, name);
  onDisk._uplinks = Object.fromEntries(
    Object.entries(uplinks).map(([uplink, etag]) => [
      uplink,
      { etag, fetched: Date.now() - EXPIRED },
    ])
  );
  writeManifest(storagePath, name, onDisk);
  nock.cleanAll();
  return onDisk;
}

/** Counts the requests the uplink actually receives. */
function countingUplink(host: string, name: string, status: number, body?: any) {
  const counter = { hits: 0 };
  nock(host)
    .get(`/${name}`)
    .times(10)
    .reply(function () {
      counter.hits++;
      return body === undefined ? [status] : [status, body];
    });
  return counter;
}

describe('uplink metadata revalidation (304)', () => {
  describe('single uplink', () => {
    test('refreshes the cached timestamp without touching the manifest', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        addNewVersion(generateRemotePackageMetadata(name, '1.0.0') as Manifest, '2.0.0')
      );
      nock(UPLINK).get(`/${name}`).matchHeader('if-none-match', 'etag-ver').reply(304);

      const [manifest] = await storage.syncUplinksMetadata(name, before, { retry: { limit: 0 } });

      const after = readManifest(storagePath, name);
      expect(after._uplinks.ver.fetched).toBeGreaterThan(before._uplinks.ver.fetched);
      expect(after._uplinks.ver.etag).toEqual('etag-ver');
      expect(after[DIST_TAGS]).toEqual(before[DIST_TAGS]);
      expect(Object.keys(after.versions)).toEqual(Object.keys(before.versions));
      expect(after.readme).toEqual(before.readme);
      expect(after.time).toEqual(before.time);
      expect(after._distfiles).toEqual(before._distfiles);
      expect((manifest as Manifest)[DIST_TAGS]).toEqual(before[DIST_TAGS]);
    });

    test('serves the next request from cache instead of revalidating again', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      const uplink = countingUplink(UPLINK, name, 304);

      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });
      expect(uplink.hits).toEqual(1);

      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });
      expect(uplink.hits).toEqual(1);
    });

    test('revalidates again once maxage expires after the refresh', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      const uplink = countingUplink(UPLINK, name, 304);

      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });
      expect(uplink.hits).toEqual(1);

      // default uplink maxage is 2m
      MockDate.set(Date.now() + 3 * 60 * 1000);
      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });
      expect(uplink.hits).toEqual(2);
    });

    test('does not reach the uplink while the cache is still fresh', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      nock(UPLINK)
        .get(`/${name}`)
        .reply(200, generateRemotePackageMetadata(name, '1.0.0') as Manifest);
      await storage.syncUplinksMetadata(name, null, { retry: { limit: 0 } });
      nock.cleanAll();
      const uplink = countingUplink(UPLINK, name, 304);

      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });

      expect(uplink.hits).toEqual(0);
    });

    test('keeps versions that exist only in the local cache', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      before.versions['9.9.9-local'] = {
        ...before.versions['1.0.0'],
        version: '9.9.9-local',
        dist: { ...before.versions['1.0.0'].dist, tarball: 'http://localhost:5555/foo-local.tgz' },
      };
      before._distfiles['foo-local.tgz'] = { url: 'http://localhost:5555/foo-local.tgz', sha: 'x' };
      before[DIST_TAGS].local = '9.9.9-local';
      writeManifest(storagePath, name, before);
      nock(UPLINK).get(`/${name}`).reply(304);

      await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });

      const after = readManifest(storagePath, name);
      expect(after.versions['9.9.9-local']).toBeDefined();
      expect(after._distfiles['foo-local.tgz']).toBeDefined();
      expect(after[DIST_TAGS].local).toEqual('9.9.9-local');
      expect(after[DIST_TAGS].latest).toEqual(before[DIST_TAGS].latest);
    });

    test('ignores a 304 when no etag is cached for that uplink', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      const local = readManifest(storagePath, name);
      local._uplinks = {};
      writeManifest(storagePath, name, local);
      nock(UPLINK).get(`/${name}`).reply(304);

      const [manifest] = await storage.syncUplinksMetadata(name, readManifest(storagePath, name), {
        retry: { limit: 0 },
      });

      expect((manifest as Manifest).versions['1.0.0']).toBeDefined();
      expect(readManifest(storagePath, name)._rev).toEqual(local._rev);
      expect(readManifest(storagePath, name)._uplinks).toEqual({});
    });

    test('still bubbles up the 304 when there is no local manifest', async () => {
      const name = 'foo';
      const { storage } = await createStorage('syncSingleUplinksMetadata.yaml');
      nock(UPLINK).get(`/${name}`).reply(304);

      await expect(
        storage.syncUplinksMetadata(name, null, { retry: { limit: 0 } })
      ).rejects.toMatchObject({ code: HTTP_STATUS.NOT_MODIFIED });
    });

    test('keeps reporting other uplink failures', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      nock(UPLINK).get(`/${name}`).reply(500);

      const [manifest, errors] = await storage.syncUplinksMetadata(name, before, {
        retry: { limit: 0 },
      });

      expect((manifest as Manifest).versions['1.0.0']).toBeDefined();
      expect(errors).toHaveLength(1);
      expect(readManifest(storagePath, name)._uplinks.ver.fetched).toEqual(
        before._uplinks.ver.fetched
      );
    });
  });

  describe('several uplinks', () => {
    const name = 'foo-multiple';

    test('keeps checking the remaining uplinks after a 304', async () => {
      const { storage, storagePath } = await createStorage('syncMultipleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest
      );
      nock(UPLINK).get(`/${name}`).matchHeader('if-none-match', 'etag-ver').reply(304);
      nock(NPMJS)
        .get(`/${name}`)
        .reply(200, generateRemotePackageMetadata(name, '9.0.0') as Manifest);

      const [manifest] = await storage.syncUplinksMetadata(name, before, { retry: { limit: 0 } });

      const after = readManifest(storagePath, name);
      expect((manifest as Manifest).versions['9.0.0']).toBeDefined();
      expect(after.versions['9.0.0']).toBeDefined();
      expect(after.versions['1.0.0']).toBeDefined();
      expect(after._uplinks.ver.fetched).toBeGreaterThan(before._uplinks.ver.fetched);
      expect(after._uplinks.npmjs).toBeDefined();
    });

    test('refreshes every uplink that replies 304', async () => {
      const { storage, storagePath } = await createStorage('syncMultipleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest,
        { ver: 'etag-ver', npmjs: 'etag-npm' }
      );
      nock(UPLINK).get(`/${name}`).matchHeader('if-none-match', 'etag-ver').reply(304);
      nock(NPMJS).get(`/${name}`).matchHeader('if-none-match', 'etag-npm').reply(304);

      await storage.syncUplinksMetadata(name, before, { retry: { limit: 0 } });

      const after = readManifest(storagePath, name);
      expect(after._uplinks.ver.fetched).toBeGreaterThan(before._uplinks.ver.fetched);
      expect(after._uplinks.npmjs.fetched).toBeGreaterThan(before._uplinks.npmjs.fetched);
      expect(after._uplinks.ver.etag).toEqual('etag-ver');
      expect(after._uplinks.npmjs.etag).toEqual('etag-npm');
    });

    test('leaves the metadata of a failing uplink untouched', async () => {
      const { storage, storagePath } = await createStorage('syncMultipleUplinksMetadata.yaml');
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        generateRemotePackageMetadata(name, '1.0.0') as Manifest,
        { ver: 'etag-ver', npmjs: 'etag-npm' }
      );
      nock(UPLINK).get(`/${name}`).reply(304);
      nock(NPMJS).get(`/${name}`).reply(500);

      await storage.syncUplinksMetadata(name, before, { retry: { limit: 0 } });

      const after = readManifest(storagePath, name);
      expect(after._uplinks.ver.fetched).toBeGreaterThan(before._uplinks.ver.fetched);
      expect(after._uplinks.npmjs).toEqual(before._uplinks.npmjs);
    });
  });

  describe('filtered manifests', () => {
    test('does not persist the filtered view when the uplink replies 304', async () => {
      const name = 'foo';
      const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml', {
        filters: {
          '@verdaccio/package-filter': { block: [{ package: name, versions: '>=2.0.0' }] },
        },
      } as Partial<ConfigYaml>);
      const before = await seedExpiredCache(
        storage,
        storagePath,
        name,
        addNewVersion(generateRemotePackageMetadata(name, '1.0.0') as Manifest, '2.0.0')
      );
      expect(before[DIST_TAGS].latest).toEqual('2.0.0');
      nock(UPLINK).get(`/${name}`).times(2).reply(304);
      nock('http://localhost:5555').get(`/${name}/-/${name}-2.0.0.tgz`).times(2).reply(404);

      // the blocked version has no dist file in the filtered view, so the tarball
      // request falls through to a metadata sync
      const abort = new AbortController();
      const stream = await storage.getTarball(name, `${name}-2.0.0.tgz`, { signal: abort.signal });
      await new Promise((resolve) => {
        stream.on('error', resolve);
        stream.on('end', resolve);
        stream.resume();
      });

      const after = readManifest(storagePath, name);
      expect(after[DIST_TAGS].latest).toEqual('2.0.0');
      expect(after.versions['2.0.0']).toBeDefined();
      expect(after.readme).toEqual(before.readme);
      expect(after._uplinks.ver.fetched).toBeGreaterThan(before._uplinks.ver.fetched);
    });
  });
});
