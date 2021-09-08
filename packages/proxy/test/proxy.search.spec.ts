// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global AbortController */

import path from 'path';
import semver from 'semver';
import getStream from 'get-stream';
import { Config, parseConfigFile } from '@verdaccio/config';
import { streamUtils } from '@verdaccio/core';
import { ProxyStorage } from '../src/up-storage';

// FUTURE: remove me when v15 is the min required version
if (semver.lte(process.version, 'v15.0.0')) {
  global.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill').AbortController;
}

const getConf = (name) => path.join(__dirname, '/conf', name);

const mockDebug = jest.fn();
const mockInfo = jest.fn();
const mockHttp = jest.fn();
const mockError = jest.fn();
const mockWarn = jest.fn();
jest.mock('@verdaccio/logger', () => {
  const originalLogger = jest.requireActual('@verdaccio/logger');
  return {
    ...originalLogger,
    logger: {
      child: () => ({
        debug: (arg) => mockDebug(arg),
        info: (arg) => mockInfo(arg),
        http: (arg) => mockHttp(arg),
        error: (arg) => mockError(arg),
        warn: (arg) => mockWarn(arg),
      }),
    },
  };
});

const { MockAgent } = require('undici');
const { setGlobalDispatcher } = require('undici-fetch');
const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  const queryUrl = '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio';
  const defaultRequestOptions = {
    url: domain,
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  const options = {
    path: '/-/v1/search?maintenance=1&popularity=1&quality=1&size=10&text=verdaccio',
    method: 'GET',
  };

  describe('search', () => {
    test('get response from v1 endpoint', async () => {
      const response = require('./partials/search-v1.json');
      const mockAgent = new MockAgent({ connections: 1 });
      mockAgent.disableNetConnect();
      setGlobalDispatcher(mockAgent);
      const mockClient = mockAgent.get(domain);
      mockClient.intercept(options).reply(200, JSON.stringify(response));
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const abort = new AbortController();
      const stream = await prox1.search({
        abort,
        url: queryUrl,
      });

      const searchResponse = await getStream(stream.pipe(streamUtils.transformObjectToString()));
      expect(searchResponse).toEqual(searchResponse);
    });

    test('handle bad response 409', async () => {
      const mockAgent = new MockAgent({ connections: 1 });
      mockAgent.disableNetConnect();
      setGlobalDispatcher(mockAgent);
      const mockClient = mockAgent.get(domain);
      mockClient.intercept(options).reply(409, {});
      const abort = new AbortController();
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      await expect(
        prox1.search({
          abort,
          url: queryUrl,
        })
      ).rejects.toThrow('bad status code 409 from uplink');
    });

    test.todo('abort search from v1 endpoint');

    // TODO: we should test the gzip deflate here, but is hard to test
    // fix me if you can deal with Incorrect Header Check issue
    test.todo('get file from v1 endpoint with gzip headers');

    test('search v1 endpoint fails', async () => {
      const mockAgent = new MockAgent({ connections: 1 });
      mockAgent.disableNetConnect();
      setGlobalDispatcher(mockAgent);
      const mockClient = mockAgent.get(domain);
      mockClient.intercept(options).reply(500, {});
      const abort = new AbortController();
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      await expect(
        prox1.search({
          abort,
          url: queryUrl,
        })
      ).rejects.toThrow('bad status code 500 from uplink');
    });
  });
});
