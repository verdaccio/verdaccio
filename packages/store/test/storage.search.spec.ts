import nock from 'nock';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { fileUtils, searchUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { removeDuplicates } from '@verdaccio/search';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { Storage } from '../src';

const logger = setup({});

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
});
