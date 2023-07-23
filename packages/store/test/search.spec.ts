import nock from 'nock';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { searchUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { Storage, removeDuplicates } from '../src';

setup({});

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

    test('search items', async () => {
      // FIXME: fetch is already part of undici
      const domain = 'https://registry.npmjs.org';
      const url = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
      const response = require('./fixtures/search.json');
      nock(domain).get(url).reply(200, response);
      const config = new Config(getDefaultConfig());
      const storage = new Storage(config);
      await storage.init(config);
      const abort = new AbortController();

      const results = await storage.search({ url, query: { text: 'verdaccio' }, abort });
      expect(results).toHaveLength(4);
    });
  });
});
