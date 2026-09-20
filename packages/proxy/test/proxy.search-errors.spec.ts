/* global AbortController */
import nock from 'nock';
import path from 'node:path';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

const domain = 'https://registry.npmjs.org';
const url = '/-/v1/search?text=verdaccio';
const logMessage = 'proxy uplink @{name} search error: @{errorMessage}';

beforeAll(async () => {
  await setup({});
});

afterEach(() => {
  nock.abortPendingRequests();
  nock.cleanAll();
  vi.restoreAllMocks();
});

function prepareSearch(onSearchPage?: (total: number | undefined) => void) {
  const config = new Config(parseConfigFile(path.join(import.meta.dirname, 'conf/proxy1.yaml')));
  const proxy = new ProxyStorage('uplink', { url: domain }, config, logger);
  const abort = new AbortController();
  const log = vi.spyOn(proxy.logger, 'error').mockImplementation(() => {});
  const search = () => proxy.search({ url, abort, retry: { limit: 0 }, onSearchPage });
  return { proxy, abort, log, search };
}

describe('unpaginated search errors used by the web API', () => {
  test.each(['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET'])(
    'preserves and logs the original %s failure',
    async (code) => {
      const message = `uplink connection failed: ${code}`;
      const upstream = nock(domain).get(url).replyWithError({ code, message });
      const { search, log } = prepareSearch();

      await expect(search()).rejects.toMatchObject({ name: 'RequestError', code, message });
      expect(log).toHaveBeenCalledExactlyOnceWith(
        { name: 'uplink', errorMessage: message },
        logMessage
      );
      expect(upstream.isDone()).toBe(true);
    }
  );

  test('preserves and logs a timeout without a response', async () => {
    const upstream = nock(domain).get(url).delayConnection(1_000).reply(200, { objects: [] });
    const { proxy, search, log } = prepareSearch();
    proxy.timeout = { request: 50 };

    await expect(search()).rejects.toMatchObject({ name: 'TimeoutError', code: 'ETIMEDOUT' });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.stringContaining('Timeout') },
      logMessage
    );
    expect(upstream.isDone()).toBe(true);
  });

  test('preserves and logs invalid JSON instead of replacing its SyntaxError', async () => {
    nock(domain).get(url).reply(200, '<html>upstream unavailable</html>');
    const { search, log } = prepareSearch();

    await expect(search()).rejects.toBeInstanceOf(SyntaxError);
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.stringContaining('JSON') },
      logMessage
    );
  });

  test('preserves cancellation of an in-flight request', async () => {
    const { search, abort, log } = prepareSearch();
    const upstream = nock(domain)
      .get(url)
      .delay(1_000)
      .reply(200, { objects: [] })
      .on('request', () => abort.abort());

    await expect(search()).rejects.toMatchObject({ name: 'AbortError', code: 'ERR_ABORTED' });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.any(String) },
      logMessage
    );
    expect(upstream.isDone()).toBe(true);
  });

  test.each([404, 503])('preserves the upstream HTTP %i response', async (statusCode) => {
    nock(domain).get(url).reply(statusCode);
    const { search, log } = prepareSearch();

    await expect(search()).rejects.toMatchObject({ name: 'HTTPError', response: { statusCode } });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.stringContaining(String(statusCode)) },
      logMessage
    );
  });

  test('keeps the existing HTTP 409 to internal-error translation', async () => {
    nock(domain).get(url).reply(409);
    const { search } = prepareSearch();

    await expect(search()).rejects.toMatchObject({
      statusCode: 500,
      message: 'bad status code 409 from uplink',
    });
  });
});

describe('paginated search error regressions', () => {
  test.each([404, 409, 503])(
    'keeps HTTP %i details out of the client error',
    async (statusCode) => {
      nock(domain).get(url).reply(statusCode);
      const { search, log } = prepareSearch(() => {});

      await expect(search()).rejects.toMatchObject({
        statusCode: 503,
        message: 'uplink search failed',
      });
      expect(log).toHaveBeenCalledExactlyOnceWith(
        { name: 'uplink', errorMessage: expect.stringContaining(String(statusCode)) },
        logMessage
      );
    }
  );

  test('logs invalid JSON and returns a controlled error', async () => {
    nock(domain).get(url).reply(200, '<html>upstream unavailable</html>');
    const { search, log } = prepareSearch(() => {});

    await expect(search()).rejects.toMatchObject({
      statusCode: 503,
      message: 'uplink search failed',
    });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.stringContaining('JSON') },
      logMessage
    );
  });

  test('logs a timeout and returns a controlled error', async () => {
    nock(domain).get(url).delayConnection(1_000).reply(200, { objects: [] });
    const { proxy, search, log } = prepareSearch(() => {});
    proxy.timeout = { request: 50 };

    await expect(search()).rejects.toMatchObject({
      statusCode: 503,
      message: 'uplink search failed',
    });
    expect(log).toHaveBeenCalledExactlyOnceWith(
      { name: 'uplink', errorMessage: expect.stringContaining('Timeout') },
      logMessage
    );
  });

  test('propagates the cancellation reason without logging an upstream failure', async () => {
    const { search, abort, log } = prepareSearch(() => {});
    const reason = new Error('search client disconnected');
    nock(domain)
      .get(url)
      .delay(1_000)
      .reply(200, { objects: [] })
      .on('request', () => abort.abort(reason));

    await expect(search()).rejects.toBe(reason);
    expect(log).not.toHaveBeenCalled();
  });
});
