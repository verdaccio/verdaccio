// @flow
import ProxyStorage from '../../src/lib/up-storage';
import AppConfig from '../../src/lib/config';
import _ from 'lodash';
// $FlowFixMe
import configExample from './partials/config';
import {setup} from '../../src/lib/logger';

setup([]);

describe('UpStorge', () => {

  const uplinkDefault = {
    url: 'https://registry.npmjs.org/'
  };
  let generateProxy = (config = uplinkDefault) => {
    const appConfig: Config = new AppConfig(configExample);
    // config.self_path = path.join('../partials/store');

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
      proxy.getRemoteMetadata('@verdaccio/fake-package', {etag: '123456'}, (err, data, etag) => {
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
    });

});
