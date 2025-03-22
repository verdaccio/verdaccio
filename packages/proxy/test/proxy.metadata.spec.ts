import nock from 'nock';
import path from 'path';
import { setTimeout } from 'timers/promises';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { API_ERROR, errorUtils } from '@verdaccio/core';
import { Logger } from '@verdaccio/types';

import { ProxyStorage } from '../src';

const getConf = (name) => path.join(__dirname, '/conf', name);

const mockDebug = vi.fn();
const mockInfo = vi.fn();
const mockHttp = vi.fn();
const mockError = vi.fn();
const mockWarn = vi.fn();

const logger = {
  debug: mockDebug,
  info: mockInfo,
  http: mockHttp,
  error: mockError,
  warn: mockWarn,
} as unknown as Logger;

const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  const defaultRequestOptions = {
    url: domain,
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));
  conf.server_id = 'foo-phseudo-bytes';

  describe('getRemoteMetadata', () => {
    beforeEach(() => {
      nock.cleanAll();
      nock.abortPendingRequests();
      vi.clearAllMocks();
    });
    describe('basic requests', () => {
      test('success call to remote', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
          },
        })
          .get('/jquery')
          .reply(200, { body: 'test' });
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        const [manifest] = await prox1.getRemoteMetadata('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(manifest).toEqual({ body: 'test' });
      });
    });

    describe('etag header', () => {
      test('proxy call with etag', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
          },
        })
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        const [manifest, etag] = await prox1.getRemoteMetadata('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(etag).toEqual('_ref_4444');
        expect(manifest).toEqual({ body: 'test' });
      });

      test('proxy call with etag as option', async () => {
        nock(domain, {
          reqheaders: {
            accept: 'application/json;',
            'accept-encoding': 'gzip',
            'x-forwarded-for': '127.0.0.1',
            via: '1.1 foo-phseudo-bytes (Verdaccio)',
            // match only if etag is set as option
            'if-none-match': 'foo',
          },
        })
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        const [manifest, etag] = await prox1.getRemoteMetadata('jquery', {
          etag: 'foo',
          remoteAddress: '127.0.0.1',
        });
        expect(etag).toEqual('_ref_4444');
        expect(manifest).toEqual({ body: 'test' });
      });
    });

    describe('log activity', () => {
      test('proxy call with etag', async () => {
        nock(domain)
          .get('/jquery')
          .reply(200, { body: { name: 'foo', version: '1.0.0' } }, {});
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await prox1.getRemoteMetadata('jquery', {
          remoteAddress: '127.0.0.1',
        });
        expect(mockHttp).toHaveBeenCalledTimes(2);
        expect(mockHttp).toHaveBeenCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 200,
          },
          "@{!status}, req: '@{request.method} @{request.url}' (streaming)"
        );
        expect(mockHttp).toHaveBeenLastCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 200,
            bytes: {
              in: 0,
              out: 41,
            },
          },
          "@{!status}, req: '@{request.method} @{request.url}'"
        );
      });
    });

    describe('error handling', () => {
      test('proxy call with 304', async () => {
        nock(domain).get('/jquery').reply(304);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(prox1.getRemoteMetadata('jquery', { etag: 'rev_3333' })).rejects.toThrow(
          'no data'
        );
      });

      test('reply with error', async () => {
        nock(domain).get('/jquery').replyWithError('something awful happened');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrow(/something awful happened/);
      });

      test('reply with 409 error', async () => {
        nock(domain).get('/jquery').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(prox1.getRemoteMetadata('jquery', { retry: { limit: 0 } })).rejects.toThrow(
          /bad status code: 409/
        );
      });

      test('reply with bad body json format', async () => {
        nock(domain).get('/jquery').reply(200, 'some-text');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrow();
      });

      test('400 error proxy call', async () => {
        nock(domain).get('/jquery').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrow(/bad status code: 409/);
      });

      test('proxy  not found', async () => {
        nock(domain).get('/jquery').reply(404);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
          })
        ).rejects.toThrow(errorUtils.getNotFound(API_ERROR.NOT_PACKAGE_UPLINK));
        expect(mockHttp).toHaveBeenCalledTimes(1);
        expect(mockHttp).toHaveBeenLastCalledWith(
          {
            request: { method: 'GET', url: `${domain}/jquery` },
            status: 404,
          },
          "@{!status}, req: '@{request.method} @{request.url}' (streaming)"
        );
      });
    });

    describe('retry', () => {
      test('retry twice on 500 and return 200 logging offline activity', async () => {
        nock(domain)
          .get('/jquery')
          .twice()
          .reply(500, 'some-text')
          .get('/jquery')
          .once()
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        const [manifest] = await prox1.getRemoteMetadata('jquery', {
          retry: { limit: 2 },
        });
        expect(manifest).toEqual({ body: { name: 'foo', version: '1.0.0' } });
        expect(mockInfo).toHaveBeenCalledTimes(2);
        expect(mockInfo).toHaveBeenLastCalledWith(
          {
            error: 'Response code 500 (Internal Server Error)',
            request: { method: 'GET', url: `${domain}/jquery` },
            retryCount: 2,
          },
          "retry @{retryCount} req: '@{request.method} @{request.url}'"
        );
      });

      test('retry count is exceded and uplink goes offline with logging activity', async () => {
        nock(domain).get('/jquery').times(10).reply(500);

        const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrow();
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrow(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
        expect(mockWarn).toHaveBeenCalledTimes(1);
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
      });

      test('fails calls and recover with 200 with log online activity', async () => {
        // This unit test is designed to verify if the uplink goes to offline
        // and recover after the fail_timeout has expired.
        nock(domain)
          .get('/jquery')
          .thrice()
          .reply(500, 'some-text')
          .get('/jquery')
          .once()
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const prox1 = new ProxyStorage(
          { ...defaultRequestOptions, fail_timeout: '1s', max_fails: 1 },
          conf,
          logger
        );
        // force retry
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrow();
        // display offline error on exausted retry
        await expect(
          prox1.getRemoteMetadata('jquery', {
            remoteAddress: '127.0.0.1',
            retry: { limit: 2 },
          })
        ).rejects.toThrow(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
        expect(mockWarn).toHaveBeenCalledTimes(2);
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now offline'
        );
        // this is based on max_fails, if change that also change here acordingly
        await setTimeout(3000);
        const [manifest] = await prox1.getRemoteMetadata('jquery', {
          retry: { limit: 2 },
        });
        expect(manifest).toEqual({ body: { name: 'foo', version: '1.0.0' } });
        expect(mockWarn).toHaveBeenLastCalledWith(
          {
            host: 'registry.npmjs.org',
          },
          'host @{host} is now online'
        );
      }, 10000);
    });

    describe('timeout', () => {
      test('fail for timeout (2 seconds)', async () => {
        nock(domain)
          .get('/jquery')
          .times(10)
          .delayConnection(6000)
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const confTimeout = { ...defaultRequestOptions };
        // @ts-expect-error
        confTimeout.timeout = '2s';
        const prox1 = new ProxyStorage(confTimeout, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            retry: { limit: 0 },
          })
        ).rejects.toThrow(errorUtils.getServiceUnavailable(API_ERROR.SERVER_TIME_OUT));
      }, 10000);

      test('fail for one failure and timeout (2 seconds)', async () => {
        nock(domain)
          .get('/jquery')
          .times(1)
          .reply(500)
          .get('/jquery')
          .delayConnection(4000)
          .reply(200, { body: { name: 'foo', version: '1.0.0' } });

        const confTimeout = { ...defaultRequestOptions };
        // @ts-expect-error
        confTimeout.timeout = '2s';
        const prox1 = new ProxyStorage(confTimeout, conf, logger);
        await expect(
          prox1.getRemoteMetadata('jquery', {
            retry: { limit: 1 },
          })
        ).rejects.toThrow(errorUtils.getServiceUnavailable(API_ERROR.SERVER_TIME_OUT));
      }, 10000);

      // test('retry count is exceded and uplink goes offline with logging activity', async () => {
      //   nock(domain).get('/jquery').times(10).reply(500);

      //   const prox1 = new ProxyStorage(defaultRequestOptions, conf, logger);
      //   await expect(
      //     prox1.getRemoteMetadata('jquery', {
      //       remoteAddress: '127.0.0.1',
      //       retry: { limit: 2 },
      //     })
      //   ).rejects.toThrow();
      //   await expect(
      //     prox1.getRemoteMetadata('jquery', {
      //       remoteAddress: '127.0.0.1',
      //       retry: { limit: 2 },
      //     })
      //   ).rejects.toThrow(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
      //   expect(mockWarn).toHaveBeenCalledTimes(1);
      //   expect(mockWarn).toHaveBeenLastCalledWith(
      //     {
      //       host: 'registry.npmjs.org',
      //     },
      //     'host @{host} is now offline'
      //   );
      // });

      // test('fails calls and recover with 200 with log online activity', async () => {
      //   // This unit test is designed to verify if the uplink goes to offline
      //   // and recover after the fail_timeout has expired.
      //   nock(domain)
      //     .get('/jquery')
      //     .thrice()
      //     .reply(500, 'some-text')
      //     .get('/jquery')
      //     .once()
      //     .reply(200, { body: { name: 'foo', version: '1.0.0' } });

      //   const prox1 = new ProxyStorage(
      //     { ...defaultRequestOptions, fail_timeout: '1s', max_fails: 1 },
      //     conf,
      //     logger
      //   );
      //   // force retry
      //   await expect(
      //     prox1.getRemoteMetadata('jquery', {
      //       remoteAddress: '127.0.0.1',
      //       retry: { limit: 2 },
      //     })
      //   ).rejects.toThrow();
      //   // display offline error on exausted retry
      //   await expect(
      //     prox1.getRemoteMetadata('jquery', {
      //       remoteAddress: '127.0.0.1',
      //       retry: { limit: 2 },
      //     })
      //   ).rejects.toThrow(errorUtils.getInternalError(errorUtils.API_ERROR.UPLINK_OFFLINE));
      //   expect(mockWarn).toHaveBeenCalledTimes(2);
      //   expect(mockWarn).toHaveBeenLastCalledWith(
      //     {
      //       host: 'registry.npmjs.org',
      //     },
      //     'host @{host} is now offline'
      //   );
      //   expect(mockWarn).toHaveBeenLastCalledWith(
      //     {
      //       host: 'registry.npmjs.org',
      //     },
      //     'host @{host} is now offline'
      //   );
      //   // this is based on max_fails, if change that also change here acordingly
      //   await setTimeout(3000);
      //   const [manifest] = await prox1.getRemoteMetadata('jquery', {
      //     retry: { limit: 2 },
      //   });
      //   expect(manifest).toEqual({ body: { name: 'foo', version: '1.0.0' } });
      //   expect(mockWarn).toHaveBeenLastCalledWith(
      //     {
      //       host: 'registry.npmjs.org',
      //     },
      //     'host @{host} is now online'
      //   );
      // }, 10000);
    });
  });
});
