import { expect, test } from 'vitest';

import { Logger } from '@verdaccio/types';

import { SearchMemoryIndexer } from '../src';

class MockStore {
  getLocalDatabase(cb) {
    return cb(null, [
      {
        name: 'verdaccio-search',
        version: '1.0.0',
        readme: 'foo',
        description: 'foo',
        keywords: ['foo', 'bar'],
      },
      {
        name: 'verdaccio-utils',
        version: '2.0.0',
        readme: 'foo',
        description: 'foo',
        keywords: 'some',
      },
    ]);
  }
}

const logger = {
  // eslint-disable-next-line no-console
  error: (...arg) => console.error(...arg),
} as Logger;

test('should search', async () => {
  const store = new MockStore();

  SearchMemoryIndexer.configureStorage(store);
  await SearchMemoryIndexer.init(logger);
  // @ts-expect-error
  await SearchMemoryIndexer.add({
    name: 'verdaccio',
    version: '2.0.0',
    readme: 'foo',
    description: '',
  });
  const query = await SearchMemoryIndexer.query('verdaccio');
  expect(query.hits.map((item) => item.id)).toEqual(['verdaccio', 'verdaccio-utils']);
});
