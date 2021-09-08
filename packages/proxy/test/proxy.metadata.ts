import path from 'path';
import nock from 'nock';
import { Config, parseConfigFile } from '@verdaccio/config';
import { ErrorCode } from '@verdaccio/utils';
import { API_ERROR } from '@verdaccio/commons-api';
import { ProxyStorage } from '../src/up-storage';

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

const domain = 'https://registry.npmjs.org';

describe('proxy', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  const defaultRequestOptions = {
    url: 'https://registry.npmjs.org',
  };
  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  describe('getRemoteMetadata', () => {
    describe('basic requests', () => {
      test('proxy call with etag', (done) => {
        nock(domain)
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', {}, (_error, body, etag) => {
          expect(etag).toEqual('_ref_4444');
          expect(body).toEqual({ body: 'test' });
          done();
        });
      });

      test('proxy call with etag as option', (done) => {
        nock(domain)
          .get('/jquery')
          .reply(
            200,
            { body: 'test' },
            {
              etag: () => `_ref_4444`,
            }
          );
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', { etag: 'rev_3333' }, (_error, body, etag) => {
          expect(etag).toEqual('_ref_4444');
          expect(body).toEqual({ body: 'test' });
          done();
        });
      });

      test('proxy  not found', (done) => {
        nock(domain).get('/jquery').reply(404);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', { etag: 'rev_3333' }, (error) => {
          expect(error).toEqual(ErrorCode.getNotFound(API_ERROR.NOT_PACKAGE_UPLINK));
          done();
        });
      });
    });

    describe('error handling', () => {
      test('reply with error', (done) => {
        nock(domain).get('/jquery').replyWithError('something awful happened');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', {}, (error) => {
          expect(error).toEqual(new Error('something awful happened'));
          done();
        });
      });

      test('reply with bad body json format', (done) => {
        nock(domain).get('/jquery').reply(200, 'some-text');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', {}, (error) => {
          expect(error).toEqual(new SyntaxError('Unexpected token s in JSON at position 0'));
          done();
        });
      });

      test('400 error proxy call', (done) => {
        nock(domain).get('/jquery').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        prox1.getRemoteMetadata('jquery', {}, (error) => {
          expect(error.statusCode).toEqual(500);
          expect(mockInfo).toHaveBeenCalled();
          expect(mockHttp).toHaveBeenCalledWith({
            request: { method: 'GET', url: 'https://registry.npmjs.org/jquery' },
            status: 409,
          });
          expect(mockHttp).toHaveBeenCalledWith({
            bytes: { in: 0, out: 0 },
            err: undefined,
            error: undefined,
            request: { method: 'GET', url: 'https://registry.npmjs.org/jquery' },
            status: 409,
          });
          done();
        });
      });
    });
  });
});
