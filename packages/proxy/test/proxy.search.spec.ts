/* global AbortController */
import getStream from 'get-stream';
import nock from 'nock';
import path from 'node:path';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { streamUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

const getConf = (name) => path.join(import.meta.dirname, '/conf', name);

beforeAll(async () => {
  await setup({});
});

beforeEach(() => {
  nock.cleanAll();
  nock.abortPendingRequests();
});

const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  const queryUrl = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
  const defaultRequestOptions = {
    url: domain,
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  describe('search', () => {
    test.each([
      ['root URL', domain, queryUrl, '/-/v1/search'],
      ['root URL with trailing slash', `${domain}/`, queryUrl, '/-/v1/search'],
      ['subpath', `${domain}/private/npm`, queryUrl, '/private/npm/-/v1/search'],
      [
        'subpath with trailing slash',
        `${domain}/private/npm/`,
        queryUrl,
        '/private/npm/-/v1/search',
      ],
      [
        'subpath with multiple trailing slashes',
        `${domain}/private/npm///`,
        queryUrl,
        '/private/npm/-/v1/search',
      ],
      [
        'search path without leading slash',
        `${domain}/private/npm`,
        queryUrl.slice(1),
        '/private/npm/-/v1/search',
      ],
    ])('preserves the configured uplink %s', async (_name, uplinkUrl, searchUrl, path) => {
      const response = require('./partials/search-v1.json');
      const request = nock(domain)
        .get(`${path}?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio`)
        .reply(200, response);
      const prox1 = new ProxyStorage('uplink', { url: uplinkUrl }, conf, logger);
      const abort = new AbortController();
      const stream = await prox1.search({
        abort,
        url: searchUrl,
      });

      const searchResponse = await getStream(stream.pipe(streamUtils.transformObjectToString()));
      expect(searchResponse).not.toBe('');
      expect(request.isDone()).toBe(true);
    });

    test('handle bad response 409', async () => {
      nock(domain)
        .get('/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio')
        .reply(409);
      const abort = new AbortController();
      const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
      await expect(
        prox1.search({
          abort,
          url: queryUrl,
        })
      ).rejects.toThrow('bad status code 409 from uplink');
    });

    test('abort search from endpoint', async () => {
      nock(domain)
        .get('/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio')
        .delay(5000)
        .reply(200, require('./partials/search-v1.json'));
      const abort = new AbortController();
      const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
      const searchPromise = prox1.search({
        abort,
        url: queryUrl,
      });
      abort.abort();
      await expect(searchPromise).rejects.toThrow();
    });

    // // TODO: we should test the gzip deflate here, but is hard to test
    // // fix me if you can deal with Incorrect Header Check issue
    // test.todo('get file from endpoint with gzip headers');

    // test('search endpoint fails', async () => {
    //   const mockAgent = new MockAgent({ connections: 1 });
    //   mockAgent.disableNetConnect();
    //   setGlobalDispatcher(mockAgent);
    //   const mockClient = mockAgent.get(domain);
    //   mockClient.intercept(options).reply(500, {});
    //   const abort = new AbortController();
    //   const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
    //   await expect(
    //     prox1.search({
    //       abort,
    //       url: queryUrl,
    //     })
    //   ).rejects.toThrow('bad status code 500 from uplink');
    // });
  });
});
