import { beforeAll, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Version } from '@verdaccio/types';

import { Storage } from '../src';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({});
});

async function registry() {
  const config = new Config({
    ...getDefaultConfig(),
    uplinks: {},
    storage: await fileUtils.createTempStorageFolder('web-search'),
  });
  const storage = new Storage(config, logger);
  await storage.init(config);
  return { storage, config };
}

async function publish(storage: Storage, name: string, metadata: Partial<Version> = {}) {
  const version = metadata.version ?? '1.0.0';
  const manifest = generatePackageMetadata(name, version);
  Object.assign(manifest.versions[version], metadata);
  await storage.updateManifest(manifest, {
    signal: new AbortController().signal,
    name,
    uplinksLook: false,
    revision: '1',
    requestOptions: { host: 'localhost', protocol: 'http', headers: {}, username: 'owner' },
  });
}

const options = (text: string) => ({
  query: { text, from: 0, size: 20, quality: 0.65, popularity: 0.98, maintenance: 0.5 },
  url: `/-/v1/search?text=${encodeURIComponent(text)}`,
  abort: new AbortController(),
});

describe('web search index lifecycle', () => {
  test('loads persisted local packages before initialization completes', async () => {
    const { storage, config } = await registry();
    await publish(storage, 'persisted-package', { keywords: ['cobaltneutrino'] });
    const restarted = new Storage(config, logger);
    await restarted.init(config);

    const results = await restarted.searchWeb(options('cobaltneutrino'));
    expect(results.map((item) => item.package.name)).toEqual(['persisted-package']);
  });

  test('tracks latest-tag changes and complete package removal', async () => {
    const { storage } = await registry();
    const name = 'versioned-package';
    await publish(storage, name, { keywords: ['cobaltneutrino'] });
    await publish(storage, name, { version: '2.0.0', keywords: ['xylophonezephyr'] });
    expect(await storage.searchWeb(options('cobaltneutrino'))).toEqual([]);

    await storage.mergeTagsNext(name, { latest: '1.0.0' });
    const results = await storage.searchWeb(options('cobaltneutrino'));
    expect(results.map((item) => item.package.version)).toEqual(['1.0.0']);
    expect(await storage.searchWeb(options('xylophonezephyr'))).toEqual([]);

    const manifest = await storage.getPackageLocalMetadata(name);
    await storage.removePackage(name, manifest._rev, 'owner');
    expect(await storage.searchWeb(options('cobaltneutrino'))).toEqual([]);
  });

  test('indexes filtered metadata without persisting the filtered view', async () => {
    const { storage } = await registry();
    storage.filters = [
      {
        filter_metadata: async (manifest) => {
          const latest = manifest['dist-tags'].latest;
          if (latest) manifest.versions[latest].keywords = ['xylophonezephyr'];
          return manifest;
        },
      },
    ];
    await publish(storage, 'filtered-package', { keywords: ['cobaltneutrino'] });

    expect(await storage.searchWeb(options('cobaltneutrino'))).toEqual([]);
    expect(
      (await storage.searchWeb(options('xylophonezephyr'))).map((item) => item.package.name)
    ).toEqual(['filtered-package']);
    const raw = await storage.getPackageLocalMetadata('filtered-package');
    expect(raw.versions['1.0.0'].keywords).toEqual(['cobaltneutrino']);
  });

  test('retains cached package matches that are outside the private package index', async () => {
    const { storage } = await registry();
    const name = 'cached-package';
    const manifest = generatePackageMetadata(name);
    manifest.time = { '1.0.0': '2026-01-01T00:00:00.000Z' };
    await storage.localStorage
      .getStoragePlugin()
      .getPackageStorage(name)
      .createPackage(name, manifest);

    const results = await storage.searchWeb(options(name));
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      package: { name },
      verdaccioPkgCached: true,
      verdaccioPrivate: false,
    });
  });

  test('keeps npm search separate from web metadata matching', async () => {
    const { storage } = await registry();
    await publish(storage, 'local-package', { keywords: ['cobaltneutrino'] });
    expect(
      (await storage.searchWeb(options('cobaltneutrino'))).map((item) => item.package.name)
    ).toEqual(['local-package']);
    expect(await storage.search(options('cobaltneutrino'))).toEqual([]);
    expect((await storage.searchPages(options('cobaltneutrino')).next()).value).toEqual([]);
  });
});
