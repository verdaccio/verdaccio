import nock from 'nock';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import type { searchUtils } from '@verdaccio/core';
import { errorUtils, fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { removeDuplicates } from '@verdaccio/search';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Logger } from '@verdaccio/types';

import { Storage } from '../src';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({});
});

describe('search', () => {
  describe('search manager utils', () => {
    test('remove duplicates', () => {
      const item: searchUtils.SearchPackageItem = {
        // @ts-expect-error
        package: {
          name: 'foo',
        },
        ['dist-tags']: {
          latest: '1.0.0',
        },
        // @ts-expect-error
        score: {},
        searchScore: 0.4,
      };

      expect(removeDuplicates([item, item])).toEqual([item]);
    });
  });
  describe('search manager', () => {
    test('search items', async () => {
      const domain = 'https://registry.npmjs.org';
      const url = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
      const response = require('./fixtures/search.json');
      nock(domain).get(url).reply(200, response);
      const config = new Config({
        ...getDefaultConfig(),
        storage: await fileUtils.createTempStorageFolder('fix-1'),
      });
      const storage = new Storage(config, logger);
      await storage.init(config);
      const abort = new AbortController();
      const pkgName = 'verdaccio';
      const requestOptions = {
        host: 'localhost',
        protocol: 'http',
        headers: {},
      };
      // create private packages
      const bodyNewManifest = generatePackageMetadata(pkgName, '5.1.2');
      await storage.updateManifest(bodyNewManifest, {
        signal: new AbortController().signal,
        name: pkgName,
        uplinksLook: true,
        revision: '1',
        requestOptions,
      });

      // @ts-expect-error
      const results = await storage.search({ url, query: { text: 'verdaccio' }, abort });
      expect(results).toHaveLength(4);
    });
  });

  describe('getCachedPackages', () => {
    const searchItem = (name: string): searchUtils.SearchItem => ({
      package: { name },
      verdaccioPrivate: true,
      verdaccioPkgCached: false,
      score: {
        final: 1,
        detail: { quality: 1, popularity: 1, maintenance: 1 },
      },
    });

    const createStorage = async () => {
      const config = new Config({
        ...getDefaultConfig(),
        storage: await fileUtils.createTempStorageFolder('search-cached'),
      });
      const storage = new Storage(config, logger);
      await storage.init(config);
      await storage.updateManifest(generatePackageMetadata('real-pkg', '1.0.0'), {
        signal: new AbortController().signal,
        name: 'real-pkg',
        uplinksLook: false,
        revision: '1',
        requestOptions: { host: 'localhost', protocol: 'http', headers: {} },
      });
      return storage;
    };

    test('skips a name whose package is gone and returns the others', async () => {
      const storage = await createStorage();
      vi.spyOn(storage.localStorage.getStoragePlugin(), 'search').mockResolvedValue([
        searchItem('ghost-pkg'),
        searchItem('real-pkg'),
      ]);
      const warn = vi.spyOn(storage.logger, 'warn');

      const results = await storage.getCachedPackages({ text: 'pkg' } as searchUtils.SearchQuery);

      expect(results.map((item) => item.package.name)).toEqual(['real-pkg']);
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({ package: 'ghost-pkg' }),
        expect.any(String)
      );
    });

    test('fails on any other error reading a package', async () => {
      const storage = await createStorage();
      vi.spyOn(storage.localStorage.getStoragePlugin(), 'search').mockResolvedValue([
        searchItem('real-pkg'),
      ]);
      vi.spyOn(storage, 'getPackageLocalMetadata').mockRejectedValue(errorUtils.getInternalError());

      await expect(
        storage.getCachedPackages({ text: 'pkg' } as searchUtils.SearchQuery)
      ).rejects.toThrow();
    });
  });
});
