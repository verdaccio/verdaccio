// eslint-disable-next-line @typescript-eslint/no-unused-vars

/* global AbortController */
import getStream from 'get-stream';
import nock from 'nock';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { streamUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

const getConf = (name) => path.join(__dirname, '/conf', name);

setup({});

const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  const queryUrl = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
  const defaultRequestOptions = {
    url: domain,
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  describe('search', () => {
    test('get response from endpoint', async () => {
      const response = require('./partials/search-v1.json');
      nock(domain)
        .get('/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio')
        .reply(200, response);
      const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
      const abort = new AbortController();
      const stream = await prox1.search({
        abort,
        url: queryUrl,
      });

      const searchResponse = await getStream(stream.pipe(streamUtils.transformObjectToString()));
      expect(searchResponse).toEqual(searchResponse);
    });

    test('get response from uplink with trailing slash', async () => {
      const response = require('./partials/search-v1.json');
      nock(domain + '/')
        .get('/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio')
        .reply(200, response);
      const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
      const abort = new AbortController();
      const stream = await prox1.search({
        abort,
        url: queryUrl,
      });

      const searchResponse = await getStream(stream.pipe(streamUtils.transformObjectToString()));
      expect(searchResponse).toEqual(searchResponse);
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

    // test.todo('abort search from endpoint');

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
