import nock from 'nock';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import type { searchUtils } from '@verdaccio/core';
import { fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { removeDuplicates } from '@verdaccio/search';
import { generatePackageMetadata, getDeprecatedPackageMetadata } from '@verdaccio/test-helper';
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
    const options = (name: string) => ({
      signal: new AbortController().signal,
      name,
      uplinksLook: false,
      revision: '1',
      requestOptions: { host: 'localhost', protocol: 'http', headers: {} },
    });

    test('skips a package whose manifest cannot be mapped and returns the others', async () => {
      const config = new Config({
        ...getDefaultConfig(),
        storage: await fileUtils.createTempStorageFolder('search-cached'),
      });
      const storage = new Storage(config, logger);
      await storage.init(config);
      await storage.updateManifest(
        generatePackageMetadata('pkg-good', '1.0.0'),
        options('pkg-good')
      );
      await storage.updateManifest(generatePackageMetadata('pkg-bad', '1.0.0'), options('pkg-bad'));
      // a deprecation body stores its dist-tags as sent: latest points to no version
      const { _rev } = await storage.getPackageLocalMetadata('pkg-bad');
      await storage.updateManifest(
        getDeprecatedPackageMetadata('pkg-bad', '1.0.0', { latest: '9.9.9' }, 'deprecated', _rev),
        options('pkg-bad')
      );
      const warn = vi.spyOn(storage.logger, 'warn');

      const results = await storage.getCachedPackages({ text: 'pkg' } as searchUtils.SearchQuery);

      expect(results.map((item) => item.package.name)).toEqual(['pkg-good']);
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({ packageName: 'pkg-bad' }),
        expect.any(String)
      );
    });
  });
});
