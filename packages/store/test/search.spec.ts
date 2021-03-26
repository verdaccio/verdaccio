import { Config } from '@verdaccio/config';
import { configExample } from '@verdaccio/mock';
import { setup } from '@verdaccio/logger';

import { Storage } from '../src';
import { SearchInstance } from '../src/search';

setup([]);

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

describe.skip('search', () => {
  beforeAll(async function () {
    const config = new Config(configExample());
    const storage = new Storage(config);
    await storage.init(config);
    SearchInstance.configureStorage(storage);
    packages.map(function (item) {
      // @ts-ignore
      SearchInstance.add(item);
    });
  });

  test('search query item', () => {
    const result = SearchInstance.query('t');
    expect(result).toHaveLength(3);
  });

  test('search remove item', () => {
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
