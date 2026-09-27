import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { Logger, Version } from '@verdaccio/types';

import { SearchIndexer, SearchMemoryIndexer } from '../src';

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
  error: vi.fn(),
} as unknown as Logger;

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
  expect(query.hits[0].id).toBe('verdaccio');
  expect(query.hits.map((item) => item.id).sort()).toEqual([
    'verdaccio',
    'verdaccio-search',
    'verdaccio-utils',
  ]);
});

const version = (name: string, metadata: Partial<Version> = {}) =>
  ({ name, version: '1.0.0', description: '', ...metadata }) as Version;

describe('Fuse search index', () => {
  let index: SearchIndexer;
  let packages: Version[];

  beforeEach(async () => {
    packages = [
      version('react-button', {
        description: 'Persistencia de datos',
        keywords: ['accessibility'],
        _npmUser: { name: 'marisol' },
      }),
      version('other-package', { keywords: 'astronomy' }),
    ];
    index = new SearchIndexer();
    index.configureStorage({ getLocalDatabase: async () => packages });
    await index.init(logger);
  });

  test.each([
    'react-button',
    'react-buton',
    'REACT-BUTTON',
    'act-button',
    'Persistencia',
    'accessibility',
    'marisol',
  ])('finds an indexed package by "%s"', async (term) => {
    const { hits } = await index.query(term);
    expect(hits.map((hit) => hit.id)).toEqual(['react-button']);
    expect(hits[0].score).toEqual(expect.any(Number));
  });

  test('accepts a keyword string and absent optional metadata', async () => {
    await index.add(version('bare-package', { description: undefined }));
    expect((await index.query('astronomy')).hits.map((hit) => hit.id)).toEqual(['other-package']);
    expect((await index.query('bare-package')).hits[0].description).toBe('');
  });

  test('puts an exact name before similar names', async () => {
    await index.add(version('react-buttons'));
    await index.add(version('react-button-extra'));
    expect((await index.query('react-button')).hits[0].id).toBe('react-button');
  });

  test('replaces a package without duplicates or obsolete metadata', async () => {
    await index.add(version('react-button', { version: '2.0.0', keywords: ['cobaltneutrino'] }));
    expect((await index.query('accessibility')).hits).toEqual([]);
    const { hits } = await index.query('cobaltneutrino');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ id: 'react-button', version: '2.0.0' });
  });

  test('removes a package from the index', async () => {
    await index.remove('react-button');
    expect((await index.query('accessibility')).hits).toEqual([]);
  });

  test('reindex waits for storage and removes stale documents', async () => {
    packages = [version('replacement', { keywords: ['cobaltneutrino'] })];
    index.configureStorage({
      getLocalDatabase: () => new Promise((resolve) => setImmediate(() => resolve(packages))),
    });
    await index.reindex();
    expect((await index.query('accessibility')).hits).toEqual([]);
    expect((await index.query('cobaltneutrino')).hits.map((hit) => hit.id)).toEqual([
      'replacement',
    ]);
  });

  test('leaves result limiting to the caller', async () => {
    for (let i = 0; i < 25; i++) {
      await index.add(version(`many-results-${i}`, { keywords: ['quasar'] }));
    }
    expect((await index.query('quasar')).hits).toHaveLength(25);
  });

  test.each(['callback', 'promise'])(
    'propagates %s initialization failures through the returned promise',
    async (mode) => {
      const error = new Error('storage unavailable');
      index.configureStorage({
        getLocalDatabase: (callback) => {
          if (mode === 'callback') callback(error, []);
          else return Promise.reject(error);
        },
      });
      await expect(index.init(logger)).rejects.toBe(error);
    }
  );

  test('returns no hits before initialization', async () => {
    expect(await new SearchIndexer().query('react')).toEqual({ hits: [] });
  });
});
