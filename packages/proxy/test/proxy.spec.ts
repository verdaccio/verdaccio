import path from 'path';
import nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import { Config, parseConfigFile } from '@verdaccio/config';
import { ErrorCode } from '@verdaccio/utils';
import { API_ERROR, HEADER_TYPE, HTTP_STATUS, VerdaccioError } from '@verdaccio/commons-api';
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

  describe('search', () => {
    test('get file from v1 endpoint', (done) => {
      const url = '/-/v1/search';
      nock(domain).get(url).replyWithFile(200, path.join(__dirname, 'partials/search-v1.json'));
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          referer: 'some.org',
          ['x-forwarded-for']: '10.0.0.1',
        },
        connection: {
          remoteAddress: 'localhost',
        },
        url,
      });
      let dataSearch;
      const stream = prox1.search({ req });
      stream.on('data', (data) => {
        dataSearch += `${data}`;
      });
      stream.on('end', () => {
        expect(dataSearch).toBeDefined();
        done();
      });
    });

    test('abort search from v1 endpoint', (done) => {
      const url = '/-/v1/search';
      nock(domain).get(url).delay(20000);
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          referer: 'some.org',
          ['x-forwarded-for']: '10.0.0.1',
        },
        connection: {
          remoteAddress: 'localhost',
        },
        url,
      });
      const stream = prox1.search({ req });
      stream.on('end', () => {
        done();
      });
      // TODO: apply correct types here
      // @ts-ignore
      stream.abort();
    });

    // TODO: we should test the gzip deflate here, but is hard to test
    // fix me if you can deal with Incorrect Header Check issue
    test.todo('get file from v1 endpoint with gzip headers');

    test('search v1 endpoint fails', (done) => {
      const url = '/-/v1/search';
      nock(domain).get(url).replyWithError('search endpoint is down');
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          referer: 'some.org',
          ['x-forwarded-for']: '10.0.0.1',
        },
        connection: {
          remoteAddress: 'localhost',
        },
        url,
      });
      const stream = prox1.search({ req });
      stream.on('error', (error) => {
        expect(error).toEqual(Error('search endpoint is down'));
        done();
      });
    });

    test('search v1 endpoint bad status code', (done) => {
      const url = '/-/v1/search';
      nock(domain).get(url).reply(409);
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const req = httpMocks.createRequest({
        method: 'GET',
        headers: {
          referer: 'some.org',
          ['x-forwarded-for']: '10.0.0.1',
        },
        connection: {
          remoteAddress: 'localhost',
        },
        url,
      });
      const stream = prox1.search({ req });
      stream.on('error', (error) => {
        expect(error).toEqual(ErrorCode.getInternalError(`bad status code 409 from uplink`));
        done();
      });
    });
  });

  describe('fetchTarball', () => {
    test('get file tarball no content-length', (done) => {
      nock(domain)
        .get('/jquery/-/jquery-0.0.1.tgz')
        .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'));
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
      stream.on('data', (data) => {
        expect(data).toBeDefined();
        done();
      });
    });

    test('get file tarball correct content-length', (done) => {
      nock(domain)
        .get('/jquery/-/jquery-0.0.1.tgz')
        // types does not match here with documentation
        // @ts-expect-error
        .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const prox1 = new ProxyStorage(defaultRequestOptions, conf);
      const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
      stream.on(HEADER_TYPE.CONTENT_LENGTH, (data) => {
        expect(data).toEqual('277');
        done();
      });
    });

    describe('error handling', () => {
      test('should be offline uplink', (done) => {
        const tarball = 'https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz';
        nock(domain).get('/jquery/-/jquery-0.0.1.tgz').times(100).replyWithError('some error');
        const proxy = new ProxyStorage(defaultRequestOptions, conf);
        const stream = proxy.fetchTarball(tarball);
        // to test a uplink is offline we have to be try 3 times
        // the default failed request are set to 2
        process.nextTick(function () {
          stream.on('error', function (err) {
            expect(err).not.toBeNull();
            // expect(err.statusCode).toBe(404);
            expect(proxy.failed_requests).toBe(1);

            const streamSecondTry = proxy.fetchTarball(tarball);
            streamSecondTry.on('error', function (err) {
              expect(err).not.toBeNull();
              /*
                  code: 'ENOTFOUND',
                  errno: 'ENOTFOUND',
                 */
              // expect(err.statusCode).toBe(404);
              expect(proxy.failed_requests).toBe(2);
              const streamThirdTry = proxy.fetchTarball(tarball);
              streamThirdTry.on('error', function (err: VerdaccioError) {
                expect(err).not.toBeNull();
                expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
                expect(proxy.failed_requests).toBe(2);
                expect(err.message).toMatch(API_ERROR.UPLINK_OFFLINE);
                done();
              });
            });
          });
        });
      });

      test('not found tarball', (done) => {
        nock(domain).get('/jquery/-/jquery-0.0.1.tgz').reply(404);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
        stream.on('error', (response) => {
          expect(response).toEqual(ErrorCode.getNotFound(API_ERROR.NOT_FILE_UPLINK));
          done();
        });
      });

      test('fail tarball request', (done) => {
        nock(domain).get('/jquery/-/jquery-0.0.1.tgz').replyWithError('boom file');
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
        stream.on('error', (response) => {
          expect(response).toEqual(Error('boom file'));
          done();
        });
      });

      test('bad uplink request', (done) => {
        nock(domain).get('/jquery/-/jquery-0.0.1.tgz').reply(409);
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
        stream.on('error', (response) => {
          expect(response).toEqual(ErrorCode.getInternalError(`bad uplink status code: 409`));
          done();
        });
      });

      test('content length header mismatch', (done) => {
        nock(domain)
          .get('/jquery/-/jquery-0.0.1.tgz')
          // types does not match here with documentation
          // @ts-expect-error
          .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'), {
            [HEADER_TYPE.CONTENT_LENGTH]: 0,
          });
        const prox1 = new ProxyStorage(defaultRequestOptions, conf);
        const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
        stream.on('error', (response) => {
          expect(response).toEqual(ErrorCode.getInternalError(API_ERROR.CONTENT_MISMATCH));
          done();
        });
      });
    });
  });

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
