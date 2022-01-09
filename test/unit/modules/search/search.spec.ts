import Config from '../../../../src/lib/config';
import { setup } from '../../../../src/lib/logger';
import Search from '../../../../src/lib/search';
import Storage from '../../../../src/lib/storage';
import buildConfig from '../../partials/config';

setup([]);

let packages = [
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
  {
    name: '@verdaccio/scope',
    description: 'scope',
    _npmUser: {
      name: 'scope_user',
    },
  },
  {
    name: '@any/scope',
    description: 'scope',
    _npmUser: {
      name: 'scope_user',
    },
  },
];

describe('search', () => {
  beforeAll(async function () {
    let config = new Config(buildConfig());
    const storage = new Storage(config);
    await storage.init(config);
    Search.configureStorage(storage);
    packages.map(function (item) {
      // @ts-ignore
      Search.add(item);
    });
  });

  test('search query item', () => {
    let result = Search.query('t');
    expect(result).toHaveLength(3);
  });

  test('search query with @scope', () => {
    let result = Search.query('@');
    expect(result).toHaveLength(2);
    result = Search.query('@verdaccio');
    expect(result).toHaveLength(1);
  });

  test('search remove item', () => {
    let item = {
      name: 'test6',
      description: 'description',
      _npmUser: {
        name: 'test_user',
      },
    };
    // @ts-ignore
    Search.add(item);
    let result = Search.query('test6');
    expect(result).toHaveLength(1);
    Search.remove(item.name);
    result = Search.query('test6');
    expect(result).toHaveLength(0);
  });
});
