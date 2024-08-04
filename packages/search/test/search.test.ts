import nock from 'nock';
import { describe, expect, test } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { Search } from '../src/search';

setup({});

const domain = 'https://registry.npmjs.org';

describe('search', () => {
  const response = require('./partials/search.json');
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
