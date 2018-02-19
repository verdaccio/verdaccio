// @flow
import ProxyStorage from '../../src/lib/up-storage';
import AppConfig from '../../src/lib/config';
import _ from 'lodash';
// $FlowFixMe
import configExample from './partials/config';
import {setup} from '../../src/lib/logger';

import type {UpLinkConf, Config} from '@verdaccio/types';

setup([]);

describe('UpStorge', () => {

  const uplinkDefault: UpLinkConf = {
    url: 'https://registry.npmjs.org/',
    fail_timeout: '5m',
    max_fails: 2,
    maxage: '2m',
    timeout: '1m',
  };

  let generateProxy = (config: UpLinkConf = uplinkDefault) => {
    const appConfig: Config = new AppConfig(configExample);

    return new ProxyStorage(config, appConfig);
  }

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

});
