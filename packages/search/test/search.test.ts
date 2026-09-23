import nock from 'nock';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { Search } from '../src/search';

beforeAll(async () => {
  await setup({});
});

beforeEach(() => {
  nock.cleanAll();
  nock.abortPendingRequests();
});

const domain = 'https://registry.npmjs.org';

describe('search', () => {
  const response = require('./partials/search.json');
  test.each([false, true])(
    'does not let an invalid remote entry hide a valid duplicate (reverse=%s)',
    async (reverse) => {
      const objects = [
        { package: { name: 'foo', version: 'latest' } },
        { package: { name: 'foo', version: '01.2.3' } },
        { package: { name: 'invalid-only', version: '^1.0.0' } },
      ];
      nock(domain)
        .get('/-/v1/search')
        .reply(200, { objects: reverse ? objects.reverse() : objects });
      const search = new Search(new Config(getDefaultConfig()), logger);
      const results = await search.search({ url: '/-/v1/search', abort: new AbortController() });
      expect(results.map((entry) => entry.package)).toEqual([{ name: 'foo', version: '01.2.3' }]);
    }
  );

  test('search', async () => {
    nock(domain).get('/-/v1/search').reply(200, response);
    const abort = new AbortController();
    const config = new Config(getDefaultConfig());
    const searchInstance = new Search(config, logger);
    const results = await searchInstance.search({
      query: { text: 'verdaccio', maintenance: 0, popularity: 0, quality: 0, size: 0 },
      abort,
      url: '/-/v1/search',
    });
    expect(results).toHaveLength(8);

    expect(results[0]).toEqual({
      package: {
        name: 'verdaccio',
        scope: 'unscoped',
        version: '5.29.2',
        description: 'A lightweight private npm proxy registry',
        keywords: [
          'private',
          'package',
          'repository',
          'registry',
          'enterprise',
          'modules',
          'proxy',
          'server',
          'verdaccio',
        ],
        date: '2024-02-21T19:56:45.379Z',
        links: {
          npm: 'https://www.npmjs.com/package/verdaccio',
          homepage: 'https://verdaccio.org',
          repository: 'https://github.com/verdaccio/verdaccio',
          bugs: 'https://github.com/verdaccio/verdaccio/issues',
        },
        author: {
          name: 'Verdaccio Maintainers',
          email: 'test@test.com',
          username: 'verdaccio.npm',
        },
        publisher: {
          username: 'verdaccio.npm',
          email: 'test@test.com',
        },
        maintainers: [
          {
            username: 'jotadeveloper',
            email: 'test@test.com',
          },
          {
            username: 'ayusharma',
            email: 'test@test.com',
          },
          {
            username: 'trentearl',
            email: 'test@test.com',
          },
          {
            username: 'jmwilkinson',
            email: 'test@test.com',
          },
          {
            username: 'sergiohgz',
            email: 'test@test.com',
          },
          {
            username: 'verdaccio.npm',
            email: 'test@test.com',
          },
        ],
      },
      flags: {
        insecure: 0,
      },
      score: {
        final: 0.28923397536716566,
        detail: {
          quality: 0.39403701233442867,
          popularity: 0.1553034428576298,
          maintenance: 0.3333333333333333,
        },
      },
      searchScore: 100000.26,
      verdaccioPkgCached: false,
      verdaccioPrivate: false,
    });
  });
});
