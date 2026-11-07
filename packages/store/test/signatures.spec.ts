import { afterEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';

import { Storage } from '../src';

// getRegistryKeys, getAttestations and uplinkOfVersion only touch `uplinks`, `config`,
// `logger`, the keys cache and getPackagelocalByName, so they run against a fake instance
const logger = { warn: vi.fn(), debug: vi.fn(), info: vi.fn(), error: vi.fn(), http: vi.fn() };

const key = (keyid: string, material = 'MFkw' + keyid) => ({
  expires: null,
  keyid,
  keytype: 'ecdsa-sha2-nistp256',
  scheme: 'ecdsa-sha2-nistp256',
  key: material,
});

const attestations = {
  attestations: [{ predicateType: 'https://slsa.dev/provenance/v1', bundle: {} }],
};

function fakeUplink(keys: unknown = null, atts: unknown = null): any {
  const impl = (value: unknown) =>
    value instanceof Error ? vi.fn().mockRejectedValue(value) : vi.fn().mockResolvedValue(value);
  return { getRegistryKeys: impl(keys), getAttestations: impl(atts) };
}

function storageWith(uplinks: Record<string, any>, packages: any, manifest: any = null) {
  const config = new Config({ ...getDefaultConfig(), packages } as any);
  // inherits the private helpers (uplinkOfVersion) while faking the storage reads
  const self: any = Object.assign(Object.create(Storage.prototype), {
    uplinks,
    config,
    logger,
    getPackagelocalByName: vi.fn().mockResolvedValue(manifest),
  });
  return {
    self,
    getRegistryKeys: () => (Storage.prototype as any).getRegistryKeys.call(self),
    getAttestations: (name: string, version: string) =>
      (Storage.prototype as any).getAttestations.call(self, name, version),
  };
}

const proxyTo = (proxy: string[]) => ({
  '**': { access: ['$all'], publish: ['$all'], proxy },
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('Storage.getRegistryKeys', () => {
  test('merges the keys of every uplink by key id, first uplink wins on a conflict', async () => {
    const { getRegistryKeys } = storageWith(
      {
        npmjs: fakeUplink([key('A'), key('B')]),
        mirror: fakeUplink([key('B'), key('C'), key('A', 'different')]),
      },
      proxyTo(['npmjs', 'mirror'])
    );
    expect(await getRegistryKeys()).toEqual([key('A'), key('B'), key('C')]);
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      { uplinkName: 'mirror', keyid: 'A' },
      expect.stringContaining('different key')
    );
  });

  test('returns null when no uplink publishes keys and caches that answer', async () => {
    const { self, getRegistryKeys } = storageWith(
      { npmjs: fakeUplink(null), mirror: fakeUplink([]) },
      proxyTo(['npmjs', 'mirror'])
    );
    expect(await getRegistryKeys()).toBeNull();
    expect(await getRegistryKeys()).toBeNull();
    expect(self.uplinks.npmjs.getRegistryKeys).toHaveBeenCalledTimes(1);
    expect(self.uplinks.mirror.getRegistryKeys).toHaveBeenCalledTimes(1);
  });

  test('serves a complete answer from the cache for an hour', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-07T10:00:00.000Z'));
    const { self, getRegistryKeys } = storageWith(
      { npmjs: fakeUplink([key('A')]) },
      proxyTo(['npmjs'])
    );
    expect(await getRegistryKeys()).toEqual([key('A')]);
    vi.setSystemTime(new Date('2026-11-07T10:59:59.000Z'));
    expect(await getRegistryKeys()).toEqual([key('A')]);
    expect(self.uplinks.npmjs.getRegistryKeys).toHaveBeenCalledTimes(1);
    vi.setSystemTime(new Date('2026-11-07T11:00:01.000Z'));
    expect(await getRegistryKeys()).toEqual([key('A')]);
    expect(self.uplinks.npmjs.getRegistryKeys).toHaveBeenCalledTimes(2);
  });

  test('serves a partial set without caching it when an uplink fails', async () => {
    const { self, getRegistryKeys } = storageWith(
      { npmjs: fakeUplink([key('A')]), mirror: fakeUplink(new Error('boom')) },
      proxyTo(['npmjs', 'mirror'])
    );
    expect(await getRegistryKeys()).toEqual([key('A')]);
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      { uplinkName: 'mirror', err: 'boom' },
      expect.stringContaining('unavailable')
    );
    self.uplinks.mirror.getRegistryKeys.mockResolvedValue([key('B')]);
    expect(await getRegistryKeys()).toEqual([key('A'), key('B')]);
    expect(self.uplinks.npmjs.getRegistryKeys).toHaveBeenCalledTimes(2);
  });

  test('throws the last error when every uplink fails', async () => {
    const { getRegistryKeys } = storageWith(
      { npmjs: fakeUplink(new Error('first')), mirror: fakeUplink(new Error('second')) },
      proxyTo(['npmjs', 'mirror'])
    );
    await expect(getRegistryKeys()).rejects.toThrow('second');
  });
});

describe('Storage.getAttestations', () => {
  const synced = (registry?: string) => ({
    name: 'pkg',
    versions: {
      '1.0.0': { dist: { tarball: 'https://cdn.example.test/pkg/-/pkg-1.0.0.tgz' } },
    },
    _distfiles: {
      'pkg-1.0.0.tgz': { url: 'https://cdn.example.test/pkg/-/pkg-1.0.0.tgz', sha: 'x', registry },
    },
  });

  test('asks only the uplink recorded for the version', async () => {
    const { self, getAttestations } = storageWith(
      { npmjs: fakeUplink(null, attestations), mirror: fakeUplink(null, attestations) },
      proxyTo(['npmjs', 'mirror']),
      synced('mirror')
    );
    expect(await getAttestations('pkg', '1.0.0')).toEqual(attestations);
    expect(self.uplinks.mirror.getAttestations).toHaveBeenCalledExactlyOnceWith('pkg', '1.0.0');
    expect(self.uplinks.npmjs.getAttestations).not.toHaveBeenCalled();
  });

  test('ignores a recorded uplink that no longer proxies the package', async () => {
    const { self, getAttestations } = storageWith(
      { npmjs: fakeUplink(null, attestations), mirror: fakeUplink(null, attestations) },
      proxyTo(['npmjs']),
      synced('mirror')
    );
    expect(await getAttestations('pkg', '1.0.0')).toEqual(attestations);
    expect(self.uplinks.npmjs.getAttestations).toHaveBeenCalledOnce();
    expect(self.uplinks.mirror.getAttestations).not.toHaveBeenCalled();
  });

  test('without a recorded source, asks the proxying uplinks in order until one answers', async () => {
    const { self, getAttestations } = storageWith(
      {
        other: fakeUplink(null, attestations),
        npmjs: fakeUplink(null, null),
        mirror: fakeUplink(null, attestations),
      },
      proxyTo(['npmjs', 'mirror']),
      synced()
    );
    expect(await getAttestations('pkg', '1.0.0')).toEqual(attestations);
    expect(self.uplinks.npmjs.getAttestations).toHaveBeenCalledOnce();
    expect(self.uplinks.mirror.getAttestations).toHaveBeenCalledOnce();
    expect(self.uplinks.other.getAttestations).not.toHaveBeenCalled();
  });

  test('a cached version without a tarball url has no recorded source', async () => {
    const { self, getAttestations } = storageWith(
      { npmjs: fakeUplink(null, attestations) },
      proxyTo(['npmjs']),
      { name: 'pkg', versions: { '1.0.0': {} }, _distfiles: {} }
    );
    expect(await getAttestations('pkg', '1.0.0')).toEqual(attestations);
    expect(self.uplinks.npmjs.getAttestations).toHaveBeenCalledOnce();
  });

  test('returns null when the package is unknown locally and no uplink has attestations', async () => {
    const { getAttestations } = storageWith({ npmjs: fakeUplink(null, null) }, proxyTo(['npmjs']));
    expect(await getAttestations('pkg', '1.0.0')).toBeNull();
  });

  test('a failing uplink is skipped when a later one answers', async () => {
    const { getAttestations } = storageWith(
      { npmjs: fakeUplink(null, new Error('boom')), mirror: fakeUplink(null, attestations) },
      proxyTo(['npmjs', 'mirror']),
      synced()
    );
    expect(await getAttestations('pkg', '1.0.0')).toEqual(attestations);
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      { name: 'pkg', version: '1.0.0', uplinkName: 'npmjs', err: 'boom' },
      expect.stringContaining('unavailable')
    );
  });

  test('a failure followed by a definite "none" is null, not an error', async () => {
    const { getAttestations } = storageWith(
      { npmjs: fakeUplink(null, new Error('boom')), mirror: fakeUplink(null, null) },
      proxyTo(['npmjs', 'mirror']),
      synced()
    );
    expect(await getAttestations('pkg', '1.0.0')).toBeNull();
  });

  test('throws the last error when no uplink could answer', async () => {
    const { getAttestations } = storageWith(
      { npmjs: fakeUplink(null, null), mirror: fakeUplink(null, new Error('last')) },
      proxyTo(['npmjs', 'mirror']),
      synced()
    );
    await expect(getAttestations('pkg', '1.0.0')).rejects.toThrow('last');
  });
});
