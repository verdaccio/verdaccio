import getPort from 'get-port';
import _ from 'lodash';
import nock from 'nock';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { Config, UpLinkConf } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import {
  API_ERROR,
  ERROR_CODE,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
} from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import ProxyStorage from '../../../../src/lib/up-storage';
import { mockServer } from '../../__helper/mock';
import configExample from '../../partials/config';

setup({});

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

      return new ProxyStorage(config, appConfig);
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

    test('should be get remote metadata', () => {
      const proxy = generateProxy();

      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
          expect(err).toBeNull();
          expect(_.isString(etag)).toBeTruthy();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should handle 404 on be get remote metadata', () => {
      return new Promise((done) => {
        nock(`http://localhost:${mockServerPort}`)
          .get(`/jquery`)
          .once()
          .reply(404, { name: 'jquery' });
        const proxy = generateProxy();

        proxy.getRemoteMetadata('jquery', {}, (err) => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/package does not exist on uplink/);
          done(true);
        });
      });
    });

    test('should handle 500 on be get remote metadata', () => {
      nock(`http://localhost:${mockServerPort}`)
        .get(`/jquery`)
        .once()
        .reply(500, { name: 'jquery' });
      const proxy = generateProxy();
      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err) => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/bad status code: 500/);
          done(true);
        });
      });
    });

    test('should be get remote metadata with etag', () => {
      const proxy = generateProxy();
      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', { etag: '123456' }, (err, data, etag) => {
          expect(err).toBeNull();
          expect(_.isString(etag)).toBeTruthy();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should be get remote metadata package does not exist', () => {
      const proxy = generateProxy();
      return new Promise((done) => {
        proxy.getRemoteMetadata('@verdaccio/fake-package', { etag: '123456' }, (err) => {
          expect(err).not.toBeNull();
          expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
          expect(err.message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
          done(true);
        });
      });
    });

    test('should be get remote metadata with json when uplink is npmmirror', () => {
      nock('https://registry.npmmirror.com').get(`/jquery`).reply(200, { name: 'jquery' });
      const proxy = generateProxy({ url: 'https://registry.npmmirror.com' });
      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', { json: true }, (err, data) => {
          expect(err).toBeNull();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should be get remote metadata with auth header bearer', () => {
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
      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
          expect(err).toBeNull();
          expect(_.isString(etag)).toBeTruthy();
          expect(etag).toBe('123456');
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should be get remote metadata with auth node env TOKEN_TEST_ENV header bearer', () => {
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
      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
          expect(err).toBeNull();
          expect(_.isString(etag)).toBeTruthy();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should be get remote metadata with auth node env NPM_TOKEN header bearer', () => {
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

      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
          expect(err).toBeNull();
          expect(_.isString(etag)).toBeTruthy();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });

    test('should be get remote metadata with auth header basic', () => {
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

      return new Promise((done) => {
        proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
          expect(err).toBeNull();
          expect(etag).toBe('123456');
          expect(_.isString(etag)).toBeTruthy();
          expect(data.name).toBe('jquery');
          done(true);
        });
      });
    });
  });

  describe('error handling', () => {
    test('should fails if auth type is missing', () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token: undefined,
        },
      });

      expect(function () {
        proxy.getRemoteMetadata('jquery', {}, () => {});
      }).toThrow(/token is required/);
    });

    test('should fails if token_env is undefined', () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token_env: undefined,
        },
      });

      expect(function () {
        proxy.getRemoteMetadata('jquery', {}, () => {});
      }).toThrow(ERROR_CODE.token_required);
    });

    test('should fails if token_env is false', () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          type: TOKEN_BASIC,
          token_env: false,
        },
      });

      expect(function () {
        proxy.getRemoteMetadata('jquery', {}, () => {});
      }).toThrow(ERROR_CODE.token_required);
    });

    test('should fails if invalid token type', () => {
      const proxy = generateProxy({
        url: 'https://registry.npmmirror.com',
        auth: {
          // Intentionally wrong typo
          _token: 'SomethingWrong',
        },
      });

      expect(function () {
        proxy.getRemoteMetadata('jquery', {}, () => {});
      }).toThrow(ERROR_CODE.token_required);
    });
  });

  describe('fetchTarball', () => {
    test('should fetch a tarball from uplink', () => {
      const tarballPath = join(__dirname, '__fixtures__', 'jquery-1.5.1.tgz');
      const tarballSize = statSync(tarballPath).size;

      nock(`http://localhost:${mockServerPort}`)
        .get('/jquery/-/jquery-1.5.1.tgz')
        .replyWithFile(200, tarballPath, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': tarballSize.toString(),
        })
        .persist(); // optional: keep the interceptor alive for several calls
      const proxy = generateProxy();
      const tarball = `http://localhost:${mockServerPort}/jquery/-/jquery-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball);
      return new Promise((done) => {
        stream.on('error', function (err) {
          expect(err).toBeNull();
          done(false);
        });

        stream.on('content-length', function (contentLength) {
          expect(contentLength).toBeDefined();
          done(true);
        });
      });
    });

    test('should throw a 404 on fetch a tarball from uplink', () => {
      const proxy = generateProxy();
      const tarball = `http://localhost:${mockServerPort}/jquery/-/no-exist-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball);
      return new Promise((done) => {
        stream.on('error', function (err: any) {
          expect(err).not.toBeNull();
          expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
          expect(err.message).toMatch(API_ERROR.NOT_FILE_UPLINK);

          done(true);
        });

        stream.on('content-length', function (contentLength) {
          expect(contentLength).toBeDefined();
        });
      });
    });

    test('should be offline uplink', () => {
      const proxy = generateProxy();
      const tarball = 'http://404.verdaccioo.com';
      const stream = proxy.fetchTarball(tarball);
      expect(proxy.failed_requests).toBe(0);
      return new Promise((done) => {
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
              streamThirdTry.on('error', function (err: any) {
                expect(err).not.toBeNull();
                expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
                expect(proxy.failed_requests).toBe(2);
                expect(err.message).toMatch(API_ERROR.UPLINK_OFFLINE);
                done(true);
              });
            });
          });
        });
      });
    }, 10000);
  });

  describe('isUplinkValid', () => {
    describe('valid use cases', () => {
      const validateUpLink = (
        url: string,
        tarBallUrl = `${url}/artifactory/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz`
      ) => {
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        return proxy.isUplinkValid(tarBallUrl);
      };

      test('should validate tarball path against uplink', () => {
        expect(validateUpLink('https://artifactory.mydomain.com')).toBe(true);
      });

      test('should validate tarball path against uplink case#2', () => {
        expect(validateUpLink('https://artifactory.mydomain.com:443')).toBe(true);
      });

      test('should validate tarball path against uplink case#3', () => {
        expect(validateUpLink('http://localhost')).toBe(true);
      });

      test('should validate tarball path against uplink case#4', () => {
        expect(validateUpLink('http://my.domain.test')).toBe(true);
      });

      test('should validate tarball path against uplink case#5', () => {
        expect(validateUpLink('http://my.domain.test:3000')).toBe(true);
      });

      // corner case https://github.com/verdaccio/verdaccio/issues/571
      test('should validate tarball path against uplink case#6', () => {
        // same protocol, same domain, port === 443 which is also the standard for https
        expect(
          validateUpLink(
            'https://my.domain.test',
            `https://my.domain.test:443/artifactory/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz`
          )
        ).toBe(true);
      });

      test('should validate tarball path against uplink case#7', () => {
        expect(validateUpLink('https://artifactory.mydomain.com:5569')).toBe(true);
      });

      test('should validate tarball path against uplink case#8', () => {
        expect(validateUpLink('https://localhost:5539')).toBe(true);
      });
    });

    describe('invalid use cases', () => {
      test('should fails on validate tarball path against uplink', () => {
        const url = 'https://artifactory.mydomain.com';
        const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#2', () => {
        // different domain same, same port, same protocol
        const url = 'https://domain';
        const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#3', () => {
        // same domain, different protocol, different port
        const url = 'http://localhost:5001';
        const tarBallUrl = 'https://localhost:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#4', () => {
        // same domain, same protocol, different port
        const url = 'https://subdomain.domain:5001';
        const tarBallUrl =
          'https://subdomain.domain:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#5', () => {
        // different protocol, different domain, different port
        const url = 'https://subdomain.my:5001';
        const tarBallUrl = 'http://subdomain.domain:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: any = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });
    });
  });
});
