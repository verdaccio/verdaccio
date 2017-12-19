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

  test('should be get remote metadata', (done) => {
    const proxy = generateProxy();
    proxy.getRemoteMetadata('jquery', {}, (err, data, etag) => {
      expect(err).toBeNull();
      expect(_.isString(etag)).toBeTruthy();
      expect(data.name).toBe('jquery');
      done();
    });
  });

});
