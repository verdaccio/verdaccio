import getPort from 'get-port';
import nock from 'nock';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { ProxyStorage } from '@verdaccio/proxy';
import type { Config, UpLinkConf } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import {
  API_ERROR,
  ERROR_CODE,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
} from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import { mockServer } from '../../__helper/mock';
import configExample from '../../partials/config';

setup({});

const dummyLogger: any = {
  warn: () => {},
  error: () => {},
  info: () => {},
  http: () => {},
  debug: () => {},
};

describe('UpStorage', () => {
  let mockRegistry;
  let generateProxy;
  let mockServerPort;
  beforeAll(async () => {
    mockServerPort = await getPort();

    const uplinkDefault = {
      url: `http://localhost:${mockServerPort}`,
    };
    generateProxy = (config: UpLinkConf = uplinkDefault) => {
      const appConfig: Config = new AppConfig(configExample());

      return new ProxyStorage('test', config, appConfig, dummyLogger);
    };
    mockRegistry = await mockServer(mockServerPort).init();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterAll(function () {
    mockRegistry[0].stop();
  });

  test('should be defined', () => {
    const proxy = generateProxy();

    expect(proxy).toBeDefined();
  });

  describe('getRemoteMetadata', () => {
    beforeEach(() => {
      // @ts-ignore
      process.env.TOKEN_TEST_ENV = 'foo';
      // @ts-ignore
      process.env.NPM_TOKEN = 'foo';
    });

    afterEach(() => {
      delete process.env.TOKEN_TEST_ENV;
      delete process.env.NPM_TOKEN;
    });

    test('should be get remote metadata', async () => {
      const proxy = generateProxy();

      const [data, etag] = await proxy.getRemoteMetadata('jquery', {});
      expect(typeof etag === 'string').toBeTruthy();
      expect(data.name).toBe('jquery');
    });

    test('should handle 404 on be get remote metadata', async () => {
      nock(`http://localhost:${mockServerPort}`)
        .get(`/jquery`)
        .once()
        .reply(404, { name: 'jquery' });
      const proxy = generateProxy();

      await expect(proxy.getRemoteMetadata('jquery', {})).rejects.toThrow(
        /package does not exist on uplink/
      );
    });

    test('should handle 500 on be get remote metadata', async () => {
      nock(`http://localhost:${mockServerPort}`)
        .get(`/jquery`)
        .times(5)
        .reply(500, { name: 'jquery' });
      const proxy = generateProxy();

      await expect(proxy.getRemoteMetadata('jquery', { retry: { limit: 0 } })).rejects.toThrow(
        /bad status code: 500/
      );
    });

    test('should be get remote metadata with etag', async () => {
      const proxy = generateProxy();

      const [data, etag] = await proxy.getRemoteMetadata('jquery', { etag: '123456' });
      expect(typeof etag === 'string').toBeTruthy();
      expect(data.name).toBe('jquery');
    });

    test('should be get remote metadata package does not exist', async () => {
      const proxy = generateProxy();

      try {
        await proxy.getRemoteMetadata('@verdaccio/fake-package', { etag: '123456' });
        expect(true).toBe(false); // should not reach here
      } catch (err: any) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(err.message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
      }
    });

    test('should be get remote metadata with json when uplink is npmmirror', async () => {
      nock('https://registry.npmmirror.com').get(`/jquery`).reply(200, { name: 'jquery' });
      const proxy = generateProxy({ url: 'https://registry.npmmirror.com' });

      const [data] = await proxy.getRemoteMetadata('jquery', {});
      expect(data.name).toBe('jquery');
    });

    test('should be get remote metadata with auth header bearer', async () => {
      nock('https://registry.npmmirror.com', {
        reqheaders: {
          authorization: 'Bearer foo',
        },
      })
        .get(`/jquery`)
        .reply(200, { name: 'jquery' }, { etag: '123456' });
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BEARER,
          token: 'foo',
        },
      });

      const [data, etag] = await proxy.getRemoteMetadata('jquery', {});
      expect(typeof etag === 'string').toBeTruthy();
      expect(etag).toBe('123456');
      expect(data.name).toBe('jquery');
    });

    test('should be get remote metadata with auth node env TOKEN_TEST_ENV header bearer', async () => {
      nock('https://registry.npmmirror.com', {
        reqheaders: {
          authorization: 'Bearer foo',
        },
      })
        .get(`/jquery`)
        .reply(200, { name: 'jquery' }, { etag: '123456' });
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BEARER,
          token_env: 'TOKEN_TEST_ENV',
        },
      });

      const [data, etag] = await proxy.getRemoteMetadata('jquery', {});
      expect(typeof etag === 'string').toBeTruthy();
      expect(data.name).toBe('jquery');
    });

    test('should be get remote metadata with auth node env NPM_TOKEN header bearer', async () => {
      nock('https://registry.npmmirror.com', {
        reqheaders: {
          authorization: 'Bearer foo',
        },
      })
        .get(`/jquery`)
        .reply(200, { name: 'jquery' }, { etag: '123456' });
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BEARER,
          token_env: true,
        },
      });

      const [data, etag] = await proxy.getRemoteMetadata('jquery', {});
      expect(typeof etag === 'string').toBeTruthy();
      expect(data.name).toBe('jquery');
    });

    test('should be get remote metadata with auth header basic', async () => {
      nock('https://registry.npmmirror.com', {
        reqheaders: {
          authorization: 'Basic foo',
        },
      })
        .get(`/jquery`)
        .reply(200, { name: 'jquery' }, { etag: '123456' });
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token: 'foo',
        },
      });

      const [data, etag] = await proxy.getRemoteMetadata('jquery', {});
      expect(etag).toBe('123456');
      expect(typeof etag === 'string').toBeTruthy();
      expect(data.name).toBe('jquery');
    });
  });

  describe('error handling', () => {
    test('should fails if auth type is missing', async () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token: undefined,
        },
      });

      await expect(proxy.getRemoteMetadata('jquery', {})).rejects.toThrow(/token is required/);
    });

    test('should fails if token_env is undefined', async () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token_env: undefined,
        },
      });

      await expect(proxy.getRemoteMetadata('jquery', {})).rejects.toThrow(
        ERROR_CODE.token_required
      );
    });

    test('should fails if token_env is false', async () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token_env: false,
        },
      });

      await expect(proxy.getRemoteMetadata('jquery', {})).rejects.toThrow(
        ERROR_CODE.token_required
      );
    });

    test('should fails if invalid token type', async () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          // Intentionally wrong typo
          _token: 'SomethingWrong',
        },
      });

      await expect(proxy.getRemoteMetadata('jquery', {})).rejects.toThrow(
        ERROR_CODE.token_required
      );
    });
  });

  describe('search', () => {
    test('should search packages from uplink', async () => {
      nock(`http://localhost:${mockServerPort}`)
        .get('/-/v1/search?text=jquery')
        .reply(200, {
          objects: [{ package: { name: 'jquery', version: '3.0.0' } }],
          total: 1,
          time: new Date().toUTCString(),
        });
      const proxy = generateProxy();
      const abort = new AbortController();
      const stream = await proxy.search({
        url: '/-/v1/search?text=jquery',
        abort,
      });

      return new Promise<void>((resolve, reject) => {
        const results: any[] = [];
        stream.on('error', function (err) {
          reject(err);
        });
        stream.on('data', function (chunk) {
          results.push(chunk);
        });
        stream.on('end', function () {
          expect(results.length).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    test('should handle abort signal on search', async () => {
      nock(`http://localhost:${mockServerPort}`)
        .get('/-/v1/search?text=jquery')
        .delay(5000)
        .reply(200, {
          objects: [],
          total: 0,
          time: new Date().toUTCString(),
        });
      const proxy = generateProxy();
      const abort = new AbortController();

      const searchPromise = proxy.search({
        url: '/-/v1/search?text=jquery',
        abort,
      });

      abort.abort();

      await expect(searchPromise).rejects.toThrow();
    });
  });

  describe('fetchTarball', () => {
    test('should fetch a tarball from uplink', async () => {
      const tarballPath = join(__dirname, '__fixtures__', 'jquery-1.5.1.tgz');
      const tarballSize = statSync(tarballPath).size;

      nock(`http://localhost:${mockServerPort}`)
        .get('/jquery/-/jquery-1.5.1.tgz')
        .replyWithFile(200, tarballPath, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': tarballSize.toString(),
        })
        .persist();
      const proxy = generateProxy();
      const tarball = `http://localhost:${mockServerPort}/jquery/-/jquery-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball, {});

      return new Promise<void>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('error', function (err) {
          reject(err);
        });

        stream.on('data', function (chunk) {
          chunks.push(chunk);
        });

        stream.on('end', function () {
          expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    test('should throw on fetch a tarball 404 from uplink', async () => {
      nock(`http://localhost:${mockServerPort}`).get('/jquery/-/no-exist-1.5.1.tgz').reply(404);
      const proxy = generateProxy();
      const tarball = `http://localhost:${mockServerPort}/jquery/-/no-exist-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball, {});

      return new Promise<void>((resolve) => {
        stream.on('error', function (err: any) {
          expect(err).not.toBeNull();
          resolve();
        });

        stream.on('end', function () {
          resolve();
        });
      });
    });
  });
});
