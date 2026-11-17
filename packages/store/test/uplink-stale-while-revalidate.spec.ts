import nock from 'nock';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { addNewVersion, generateRemotePackageMetadata } from '@verdaccio/test-helper';
import type { Manifest } from '@verdaccio/types';

import {
  NPMJS,
  UPLINK,
  createStorage,
  readManifest,
  seedExpiredCache,
  writeManifest,
} from './uplink-cache-helpers';

const UPLINK_DELAY = 300;

afterEach(() => {
  nock.cleanAll();
});

function expiredManifest(name: string): Manifest {
  return generateRemotePackageMetadata(name, '1.0.0') as Manifest;
}

function refreshedManifest(name: string): Manifest {
  return addNewVersion(generateRemotePackageMetadata(name, '1.0.0') as Manifest, '2.0.0');
}

/** An uplink that answers after a delay and counts the requests it receives. */
function slowUplink(host: string, name: string, status: number, body?: any) {
  const counter = { hits: 0 };
  nock(host)
    .get(`/${name}`)
    .times(100)
    .delay(UPLINK_DELAY)
    .reply(function () {
      counter.hits++;
      return body === undefined ? [status] : [status, body];
    });
  return counter;
}

async function waitForRefresh(storagePath: string, name: string, version: string) {
  await vi.waitFor(
    () => expect(Object.keys(readManifest(storagePath, name).versions)).toContain(version),
    { timeout: 5000 }
  );
}

describe('uplink stale-while-revalidate', () => {
  test('serves the expired manifest at once and refreshes it in the background', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const startedAt = Date.now();
    const [manifest] = await storage.syncUplinksMetadata(name, before, {
      allowStale: true,
      retry: { limit: 0 },
    });

    expect(Date.now() - startedAt).toBeLessThan(UPLINK_DELAY);
    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0']);
    await waitForRefresh(storagePath, name, '2.0.0');
    expect(uplink.hits).toEqual(1);
    expect(readManifest(storagePath, name)._uplinks.ver.fetched).toBeGreaterThan(
      before._uplinks.ver.fetched
    );
  });

  test('the metadata read path serves stale', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const startedAt = Date.now();
    const manifest = (await storage.getPackageByOptions({
      name,
      uplinksLook: true,
      retry: { limit: 0 },
      requestOptions: { protocol: 'http', host: 'localhost', headers: {} },
    })) as Manifest;

    expect(Date.now() - startedAt).toBeLessThan(UPLINK_DELAY);
    expect(Object.keys(manifest.versions)).toEqual(['1.0.0']);
    await waitForRefresh(storagePath, name, '2.0.0');
    expect(uplink.hits).toEqual(1);
  });

  test('starts one refresh for concurrent reads of the same package', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const results = await Promise.all(
      Array.from({ length: 50 }, () =>
        storage.syncUplinksMetadata(name, before, { allowStale: true, retry: { limit: 0 } })
      )
    );

    for (const [manifest] of results) {
      expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0']);
    }
    await waitForRefresh(storagePath, name, '2.0.0');
    await new Promise((resolve) => setTimeout(resolve, UPLINK_DELAY));
    expect(uplink.hits).toEqual(1);
  });

  test('keeps serving the stored manifest when the background refresh fails', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 500);
    const warn = vi.spyOn(storage.logger, 'warn');

    const [manifest] = await storage.syncUplinksMetadata(name, before, {
      allowStale: true,
      retry: { limit: 0 },
    });

    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0']);
    await vi.waitFor(() => expect(uplink.hits).toEqual(1), { timeout: 5000 });
    await vi.waitFor(() => expect(warn).toHaveBeenCalled(), { timeout: 5000 });
    expect(Object.keys(readManifest(storagePath, name).versions)).toEqual(['1.0.0']);
  });

  test('refreshes synchronously when the uplink is not opted in', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncSingleUplinksMetadata.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const [manifest] = await storage.syncUplinksMetadata(name, before, {
      allowStale: true,
      retry: { limit: 0 },
    });

    expect(uplink.hits).toEqual(1);
    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0', '2.0.0']);
  });

  test('refreshes synchronously when the stored copy is older than maxage plus the interval', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    before._uplinks.ver.fetched = Date.now() - 2 * 24 * 60 * 60 * 1000;
    writeManifest(storagePath, name, before);
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const [manifest] = await storage.syncUplinksMetadata(name, before, {
      allowStale: true,
      retry: { limit: 0 },
    });

    expect(uplink.hits).toEqual(1);
    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0', '2.0.0']);
  });

  test('refreshes synchronously when the package was never fetched from the uplink', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    delete before._uplinks.ver;
    writeManifest(storagePath, name, before);
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const [manifest] = await storage.syncUplinksMetadata(name, before, {
      allowStale: true,
      retry: { limit: 0 },
    });

    expect(uplink.hits).toEqual(1);
    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0', '2.0.0']);
  });

  test('refreshes synchronously when the caller does not allow stale', async () => {
    const name = 'foo';
    const { storage, storagePath } = await createStorage('syncStaleWhileRevalidate.yaml');
    const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name));
    const uplink = slowUplink(UPLINK, name, 200, refreshedManifest(name));

    const [manifest] = await storage.syncUplinksMetadata(name, before, { retry: { limit: 0 } });

    expect(uplink.hits).toEqual(1);
    expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0', '2.0.0']);
  });

  describe('several uplinks', () => {
    const name = 'foo-multiple';

    test('requires every expired uplink to opt in', async () => {
      const { storage, storagePath } = await createStorage('syncStaleWhileRevalidateMixed.yaml');
      const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name), {
        ver: 'etag-ver',
        npmjs: 'etag-npm',
      });
      const ver = slowUplink(UPLINK, name, 200, refreshedManifest(name));
      slowUplink(NPMJS, name, 200, refreshedManifest(name));

      const [manifest] = await storage.syncUplinksMetadata(name, before, {
        allowStale: true,
        retry: { limit: 0 },
      });

      expect(ver.hits).toEqual(1);
      expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0', '2.0.0']);
    });

    test('serves stale when only the opted-in uplink is expired', async () => {
      const { storage, storagePath } = await createStorage('syncStaleWhileRevalidateMixed.yaml');
      const before = await seedExpiredCache(storage, storagePath, name, expiredManifest(name), {
        ver: 'etag-ver',
        npmjs: 'etag-npm',
      });
      before._uplinks.npmjs.fetched = Date.now();
      writeManifest(storagePath, name, before);
      const ver = slowUplink(UPLINK, name, 200, refreshedManifest(name));
      const npmjs = slowUplink(NPMJS, name, 200, refreshedManifest(name));

      const startedAt = Date.now();
      const [manifest] = await storage.syncUplinksMetadata(name, before, {
        allowStale: true,
        retry: { limit: 0 },
      });

      expect(Date.now() - startedAt).toBeLessThan(UPLINK_DELAY);
      expect(Object.keys((manifest as Manifest).versions)).toEqual(['1.0.0']);
      await waitForRefresh(storagePath, name, '2.0.0');
      expect(ver.hits).toEqual(1);
      expect(npmjs.hits).toEqual(0);
    });
  });
});
