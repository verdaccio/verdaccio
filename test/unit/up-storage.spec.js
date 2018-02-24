// @flow
import ProxyStorage from '../../src/lib/up-storage';
import AppConfig from '../../src/lib/config';
import _ from 'lodash';
// $FlowFixMe
import configExample from './partials/config';
import {setup} from '../../src/lib/logger';
import type {IProxy, Config} from '@verdaccio/types';

setup([]);

describe('UpStorge', () => {

  const uplinkDefault = {
    url: 'https://registry.npmjs.org/'
  };
  const generateProxy = (config: UpLinkConf = uplinkDefault): IProxy => {
    const appConfig: Config = new AppConfig(configExample);

    return new ProxyStorage(config, appConfig);
  };

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

      proxy.getRemoteMetadata('jquery', {etag: '123456'}, (err, data, etag) => {
        expect(err).toBeNull();
        expect(_.isString(etag)).toBeTruthy();
        expect(data.name).toBe('jquery');
        done();
      });
    });

    test('should be get remote metadata package does not exist', (done) => {
      const proxy = generateProxy();

      proxy.getRemoteMetadata('@verdaccio/fake-package', {etag: '123456'}, (err) => {
        expect(err).not.toBeNull();
        expect(err.statusCode).toBe(404);
        expect(err.message).toMatch(/package doesn't exist on uplink/);
        done();
      });
    });
  });


    describe('UpStorge::fetchTarball', () => {
      test('should fetch a tarball from uplink', (done) => {
        const proxy = generateProxy();
        const tarball:string = 'https://registry.npmjs.org/aaa/-/aaa-0.0.1.tgz';
        const stream = proxy.fetchTarball(tarball);

        stream.on('error', function(err) {
          expect(err).toBeNull();
          done();
        });

        stream.on('content-length', function(contentLength) {
          expect(contentLength).toBeDefined();
          done();
        });

      });

      test('should throw a 404 on fetch a tarball from uplink', (done) => {
        const proxy = generateProxy();
        const tarball:string = 'https://google.es/aaa/-/aaa-0.0.1.tgz';
        const stream = proxy.fetchTarball(tarball);

        stream.on('error', function(err) {
          expect(err).not.toBeNull();
          expect(err.statusCode).toBe(404);
          expect(err.message).toMatch(/file doesn't exist on uplink/);

          done();
        });

        stream.on('content-length', function(contentLength) {
          expect(contentLength).toBeDefined();
          done();
        });

      });

      test('should be offline uplink', (done) => {
        const proxy = generateProxy();
        const tarball:string = 'http://404.verdaccioo.com';
        const stream = proxy.fetchTarball(tarball);
        expect(proxy.failed_requests).toBe(0);

        //to test a uplink is offline we have to be try 3 times
        //the default failed request are set to 2
        process.nextTick(function() {
          stream.on('error', function(err) {
            expect(err).not.toBeNull();
            // expect(err.statusCode).toBe(404);
            expect(proxy.failed_requests).toBe(1);

            const streamSecondTry = proxy.fetchTarball(tarball);
              streamSecondTry.on('error', function(err) {
                expect(err).not.toBeNull();
                /*
                  code: 'ENOTFOUND',
                  errno: 'ENOTFOUND',
                 */
                // expect(err.statusCode).toBe(404);
                expect(proxy.failed_requests).toBe(2);
                const streamThirdTry = proxy.fetchTarball(tarball);
                streamThirdTry.on('error', function(err) {
                  expect(err).not.toBeNull();
                  expect(err.statusCode).toBe(500);
                  expect(proxy.failed_requests).toBe(2);
                  expect(err.message).toMatch(/uplink is offline/);
                  done();
                });
              });
          });
        });
      });
    });

  describe('UpStorge::isUplinkValid', () => {
    const validateUpLink = (
      url: string,
      tarBallUrl?: string = `${url}/artifactory/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz`) => {
      const uplinkConf = { url };
      const proxy: IProxy = generateProxy(uplinkConf);

      return proxy.isUplinkValid(tarBallUrl);
    }

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
      expect(validateUpLink('https://my.domain.test',
      `https://my.domain.test:443/artifactory/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz`)).toBe(false);
    });

    test('should fails on validate tarball path against uplink', () => {
      const url = 'https://artifactory.mydomain.com';
      const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
      const uplinkConf = { url };
      const proxy: IProxy = generateProxy(uplinkConf);

      expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
    });

    test('should fails on validate tarball path against uplink case#2', () => {
      const url = 'https://localhost:5001';
      const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
      const uplinkConf = { url };
      const proxy: IProxy = generateProxy(uplinkConf);

      expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
    });

    test('should fails on validate tarball path against uplink case#3', () => {
      const url = 'http://localhost:5001';
      const tarBallUrl = 'https://localhost/api/npm/npm/pk1-juan/-/pk1-juan-1.0.7.tgz';
      const uplinkConf = { url };
      const proxy: IProxy = generateProxy(uplinkConf);

      expect(proxy.isUplinkValid(tarBallUrl)).toBe(false);
    });

  });

});
