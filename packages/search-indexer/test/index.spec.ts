import { beforeEach, expect, test, vi } from 'vitest';

import { generatePackageMetadata } from '@verdaccio/test-helper';
import type { Logger, Version } from '@verdaccio/types';

import type { SearchMemoryIndexer } from '../src';

let indexer: typeof SearchMemoryIndexer;
const logger = { error: vi.fn() } as unknown as Logger;

function pkg(name: string, metadata: Partial<Version> = {}): Version {
  return {
    ...generatePackageMetadata(name).versions['1.0.0'],
    description: '',
    ...metadata,
  };
}

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  ({ SearchMemoryIndexer: indexer } = await import('../src'));
});

test('ignores queries and mutations before initialization', async () => {
  expect(await indexer.query('verdaccio')).toBeUndefined();
  await indexer.add(pkg('verdaccio'));
  await indexer.remove('verdaccio');
  await indexer.init(logger);
  expect(await indexer.query('')).toMatchObject({ count: 0, hits: [] });
});

test('waits for all private packages to load before initialization resolves', async () => {
  const packages = [pkg('verdaccio-search'), pkg('verdaccio-utils'), pkg('@scope/verdaccio')];
  indexer.configureStorage({
    getLocalDatabase(callback) {
      queueMicrotask(() => callback(null, packages));
    },
  });

  await indexer.init(logger);

  expect((await indexer.query('verdaccio')).hits.map(({ id }) => id).sort()).toEqual(
    packages.map(({ name }) => name).sort()
  );
  await indexer.add(pkg('verdaccio'));
  const result = await indexer.query('verdaccio');
  expect(result.count).toBe(4);
  expect(result.hits[0].id).toBe('verdaccio');
});

test.each<[string, string[]]>([
  ['react', ['react', 'react-router', '@scope/react-utils']],
  ['REACT', ['react', 'react-router', '@scope/react-utils']],
  ['rea', ['react', 'react-router', '@scope/react-utils']],
  ['act', []],
  ['@scope/react-utils', ['@scope/react-utils']],
  ['quasar', ['description-match', 'keyword-match']],
  ['cafe', ['accent-match']],
  ['7.42', ['version-match']],
  [
    'react quasar',
    ['react', 'react-router', '@scope/react-utils', 'description-match', 'keyword-match'],
  ],
  ['authorsecret', []],
  ['readmesecret', []],
  [' ', []],
  ['missing', []],
])('searches package metadata with token prefixes: %j', async (term, expected) => {
  await indexer.init(logger);
  for (const document of [
    pkg('react', { readme: 'readmesecret', _npmUser: { name: 'authorsecret' } }),
    pkg('react-router'),
    pkg('preact'),
    pkg('@scope/react-utils'),
    pkg('description-match', { description: 'quasar' }),
    pkg('keyword-match', { keywords: ['quasar'] }),
    pkg('accent-match', { description: 'café' }),
    pkg('version-match', { version: '7.42.0' }),
  ]) {
    await indexer.add(document);
  }

  const result = await indexer.query(term);
  expect(result.count).toBe(expected.length);
  expect(result.hits.map(({ id }) => id).sort()).toEqual([...expected].sort());
});

test.each([undefined, 'registry', ['registry', 'storage']])(
  'preserves returned metadata and keyword normalization: %j',
  async (keywords) => {
    await indexer.init(logger);
    await indexer.add(pkg('verdaccio', { keywords }));

    const result = await indexer.query('verdaccio');

    expect(Object.keys(result).sort()).toEqual(['count', 'elapsed', 'hits']);
    expect(result.hits[0]).toMatchObject({
      id: 'verdaccio',
      score: expect.any(Number),
      document: {
        id: 'verdaccio',
        name: 'verdaccio',
        version: '1.0.0',
        description: '',
        keywords: Array.isArray(keywords) ? keywords.join(',') : (keywords ?? ''),
        author: 'foo',
      },
    });
    expect(result.hits[0].document).not.toHaveProperty('readme');
    expect(result.elapsed).toEqual({ raw: expect.any(Number), formatted: expect.any(String) });
    expect(Number.isFinite(result.hits[0].score)).toBe(true);
  }
);

test('ranks an exact name before prefixes and returns ten hits with the full count', async () => {
  await indexer.init(logger);
  for (let i = 0; i < 12; i++) await indexer.add(pkg(`react-addon-${i}`));
  await indexer.add(pkg('react'));

  const result = await indexer.query('react');

  expect(result.count).toBe(13);
  expect(result.hits).toHaveLength(10);
  expect(result.hits[0].id).toBe('react');
  const all = await indexer.query('');
  expect(all.count).toBe(13);
  expect(all.hits).toHaveLength(10);
});

test('removes a package and indexes its replacement metadata', async () => {
  await indexer.init(logger);
  await indexer.add(pkg('verdaccio', { keywords: ['quasar'] }));
  await indexer.remove('verdaccio');
  expect(await indexer.query('quasar')).toMatchObject({ count: 0, hits: [] });

  await indexer.add(pkg('verdaccio', { version: '2.0.0', keywords: ['nebula'] }));
  expect(await indexer.query('quasar')).toMatchObject({ count: 0, hits: [] });
  expect((await indexer.query('nebula')).hits[0].document.version).toBe('2.0.0');
  await indexer.remove('verdaccio');
  await indexer.remove('missing');
  expect(await indexer.query('')).toMatchObject({ count: 0, hits: [] });
});

test('retains the existing package when a duplicate ID is rejected', async () => {
  await indexer.init(logger);
  await indexer.add(pkg('verdaccio'));
  await expect(indexer.add(pkg('verdaccio', { version: '2.0.0' }))).rejects.toMatchObject({
    code: 'DOCUMENT_ALREADY_EXISTS',
  });
  const result = await indexer.query('verdaccio');
  expect(result.count).toBe(1);
  expect(result.hits[0].document.version).toBe('1.0.0');
});

test('waits for reindexing and logs invalid stored packages while loading valid ones', async () => {
  await indexer.init(logger);
  const invalid = { ...pkg('invalid'), description: 42 };
  indexer.configureStorage({
    getLocalDatabase(callback) {
      queueMicrotask(() => callback(null, [pkg('alpha'), invalid, pkg('bravo')]));
    },
  });

  await indexer.reindex();

  expect((await indexer.query('')).hits.map(({ id }) => id).sort()).toEqual(['alpha', 'bravo']);
  expect(logger.error).toHaveBeenCalledOnce();
  expect(logger.error).toHaveBeenCalledWith(
    { err: expect.stringContaining('description') },
    'error @{err} indexing package'
  );
});

test('propagates a storage error and preserves the loaded packages', async () => {
  await indexer.init(logger);
  await indexer.add(pkg('verdaccio'));
  const error = new Error('storage unavailable');
  indexer.configureStorage({ getLocalDatabase: (callback) => callback(error) });

  await expect(indexer.reindex()).rejects.toBe(error);
  expect((await indexer.query('verdaccio')).count).toBe(1);
});
