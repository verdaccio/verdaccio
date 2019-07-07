import Search from '../../../../src/lib/search';
import Config from '../../../../src/lib/config';
import Storage from '../../../../src/lib/storage';
import buildConfig from '../../partials/config';


require('../../../../src/lib/logger').setup([]);

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
];

describe('search', () => {
  beforeAll(async function() {
    let config = new Config(buildConfig());
    this.storage = new Storage(config);
    await this.storage.init(config);
    Search.configureStorage(this.storage);
    packages.map(function(item) {
      Search.add(item);
    });
  });

  test('search query item', () => {
    let result = Search.query('t');
    expect(result).toHaveLength(3);
  });

  test('search remove item', () => {
    let item = {
      name: 'test6',
      description: 'description',
      _npmUser: {
        name: 'test_user',
      },
    };
    Search.add(item);
    let result = Search.query('test6');
    expect(result).toHaveLength(1);
    Search.remove(item.name);
    result = Search.query('test6');
    expect(result).toHaveLength(0);
  });
});
