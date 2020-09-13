import path from 'path';
import _ from 'lodash';

import { Config as AppConfig } from '@verdaccio/config';
import { Config, UpLinkConf } from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';
import { IProxy } from '@verdaccio/dev-types';
import { API_ERROR, HTTP_STATUS } from '@verdaccio/dev-commons';
import { mockServer, configExample, DOMAIN_SERVERS } from '@verdaccio/mock';
import { ProxyStorage } from '@verdaccio/proxy';
import { setup, logger } from '@verdaccio/logger';

setup([]);

describe('UpStorge', () => {
  const mockServerPort = 55547;
  let mockRegistry;
  const uplinkDefault = {
    url: `http://0.0.0.0:${mockServerPort}`,
  };
  const generateProxy = (config: UpLinkConf = uplinkDefault) => {
    const appConfig: Config = new AppConfig(configExample());

    return new ProxyStorage(config, appConfig);
  };

  beforeAll(async () => {
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
  });

  afterAll(function (done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

    done();
  });

  test('should be defined', () => {
    const proxy = generateProxy();

    expect(proxy).toBeDefined();
  });

  describe('UpStorge::getRemoteMetadata', () => {
    test('should be get remote metadata', (done) => {
      const proxy = generateProxy();

      proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
        expect(err).toBeNull();
        expect(_.isString(etag)).toBeTruthy();
        expect(data.name).toBe('jquery');
        done();
      });
    });

    test('should be get remote metadata with etag', (done) => {
      const proxy = generateProxy();

      proxy.getRemoteMetadata('jquery', { etag: '123456' }, (err, data, etag) => {
        expect(err).toBeNull();
        expect(_.isString(etag)).toBeTruthy();
        expect(data.name).toBe('jquery');
        done();
      });
    });

    test('should be get remote metadata package does not exist', (done) => {
      const proxy = generateProxy();

      proxy.getRemoteMetadata('@verdaccio/fake-package', { etag: '123456' }, (err) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(err.message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
        done();
      });
    });
  });

  describe('UpStorge::fetchTarball', () => {
    test('should fetch a tarball from uplink', (done) => {
      const proxy = generateProxy();
      const tarball = `http://${DOMAIN_SERVERS}:${mockServerPort}/jquery/-/jquery-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball);

      stream.on('error', function (err) {
        expect(err).toBeNull();
        done();
      });

      stream.on('content-length', function (contentLength) {
        expect(contentLength).toBeDefined();
        done();
      });
    });

    test('should throw a 404 on fetch a tarball from uplink', (done) => {
      const proxy = generateProxy();
      const tarball = `http://${DOMAIN_SERVERS}:${mockServerPort}/jquery/-/no-exist-1.5.1.tgz`;
      const stream = proxy.fetchTarball(tarball);

      stream.on('error', function (err: VerdaccioError) {
        expect(err).not.toBeNull();
        expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(err.message).toMatch(API_ERROR.NOT_FILE_UPLINK);

        done();
      });

      stream.on('content-length', function (contentLength) {
        expect(contentLength).toBeDefined();
        done();
      });
    });

    test('should be offline uplink', (done) => {
      const proxy = generateProxy();
      const tarball = 'http://404.verdaccioo.com';
      const stream = proxy.fetchTarball(tarball);
      expect(proxy.failed_requests).toBe(0);

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
  });

  describe('UpStorge::isUplinkValid', () => {
    describe('valid use cases', () => {
      const validateUpLink = (
        url: string,
        tarBallUrl = `${url}/artifactory/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz`
      ) => {
        const uplinkConf = { url };
        const proxy: IProxy = generateProxy(uplinkConf);

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
        const proxy: IProxy = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#2', () => {
        // different domain same, same port, same protocol
        const url = 'https://domain';
        const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: IProxy = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#3', () => {
        // same domain, different protocol, different port
        const url = 'http://localhost:5001';
        const tarBallUrl = 'https://localhost:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: IProxy = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#4', () => {
        // same domain, same protocol, different port
        const url = 'https://subdomain.domain:5001';
        const tarBallUrl =
          'https://subdomain.domain:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: IProxy = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });

      test('should fails on validate tarball path against uplink case#5', () => {
        // different protocol, different domain, different port
        const url = 'https://subdomain.my:5001';
        const tarBallUrl = 'http://subdomain.domain:4000/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
        const uplinkConf = { url };
        const proxy: IProxy = generateProxy(uplinkConf);

        expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
      });
    });
  });
});
