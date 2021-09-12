import { Config } from '@verdaccio/config';
import { configExample } from '@verdaccio/mock';
import { setup } from '@verdaccio/logger';

import { searchUtils } from '@verdaccio/core';
import { Storage, removeDuplicates } from '../src';
import { SearchInstance } from '../src/search';

setup([]);

// jest.mock('@verdaccio/logger');

describe('search', () => {
  describe('search manager utils', () => {
    test('remove duplicates', () => {
      const item: searchUtils.SearchPackageItem = {
        // @ts-expect-error
        package: {
          name: 'foo',
        },
        // @ts-expect-error
        score: {},
        searchScore: 0.4,
      };

      expect(removeDuplicates([item, item])).toEqual([item]);
    });

    test('search items', async () => {
      const { MockAgent } = require('undici');
      // FIXME: fetch is already part of undici
      const { setGlobalDispatcher } = require('undici-fetch');
      const domain = 'http://localhost:4873';
      const url = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
      const response = require('./fixtures/search.json');
      const options = {
        path: url,
        method: 'GET',
      };
      const mockAgent = new MockAgent({ connections: 1 });
      mockAgent.disableNetConnect();
      setGlobalDispatcher(mockAgent);
      const mockClient = mockAgent.get(domain);
      mockClient.intercept(options).reply(200, JSON.stringify(response));
      const config = new Config(configExample());
      const storage = new Storage(config);
      await storage.init(config);

      // @ts-expect-error
      const results = await storage.searchManager.search({ url, query: { text: 'foo' } });
      expect(results).toHaveLength(4);
    });
  });

  describe('search index', () => {
    const packages = [
      {
        name: 'test1',
        description: 'description',
        _npmUser: {
          name: 'test_user',
        },
      },
      {
        name: 'test2',
        description: 'description',
        _npmUser: {
          name: 'test_user',
        },
      },
      {
        name: 'test3',
        description: 'description',
        _npmUser: {
          name: 'test_user',
        },
      },
    ];

    test('search query item', async () => {
      const config = new Config(configExample());
      const storage = new Storage(config);
      await storage.init(config);
      SearchInstance.configureStorage(storage);
      packages.map(function (item) {
        // @ts-ignore
        SearchInstance.add(item);
      });
      const result = SearchInstance.query('t');
      expect(result).toHaveLength(3);
    });

    test('search remove item', async () => {
      const config = new Config(configExample());
      const storage = new Storage(config);
      await storage.init(config);
      SearchInstance.configureStorage(storage);
      packages.map(function (item) {
        // @ts-ignore
        SearchInstance.add(item);
      });
      const item = {
        name: 'test6',
        description: 'description',
        _npmUser: {
          name: 'test_user',
        },
      };
      // @ts-ignore
      SearchInstance.add(item);
      let result = SearchInstance.query('test6');
      expect(result).toHaveLength(1);
      SearchInstance.remove(item.name);
      result = SearchInstance.query('test6');
      expect(result).toHaveLength(0);
    });
  });
});
