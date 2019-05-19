import _ from 'lodash';
// @flow
import Auth from '../../../src/lib/auth';
// $FlowFixMe
import _configExample from '../partials/config/index';
// $FlowFixMe
import _configPlugins from '../partials/config/plugin';
import AppConfig from '../../../src/lib/config';
import {setup} from '../../../src/lib/logger';

import type {IAuth} from '../../../types/index';
import type {Config} from '@verdaccio/types';

setup([]);

describe('AuthTest', () => {
  let configExample;
  let configPlugins;

  beforeEach(() => {
    configExample = _configExample({
      logs: [{type: 'stdout', format: 'pretty', level: 'error'}]
    });
    configPlugins = _.cloneDeep(_configPlugins);
  });

  test('should be defined', () => {
    const config: Config = new AppConfig(configExample);
    const auth: IAuth = new Auth(config);

    expect(auth).toBeDefined();
  });

  describe('test authenticate method', () => {
    test('should utilize plugin', () => {
      const config: Config = new AppConfig(configPlugins);
      const auth: IAuth = new Auth(config);

      expect(auth).toBeDefined();

      const callback = jest.fn();
      const result = [ "test" ];

      // $FlowFixMe
      auth.authenticate(1, null, callback);
      // $FlowFixMe
      auth.authenticate(null, result, callback);

      expect(callback.mock.calls).toHaveLength(2);
      expect(callback.mock.calls[0][0]).toBe(1);
      expect(callback.mock.calls[0][1]).toBeUndefined();
      expect(callback.mock.calls[1][0]).toBeNull();
      expect(callback.mock.calls[1][1].real_groups).toBe(result);
    });

    test('should skip falsy values', () => {
      const config: Config = new AppConfig(configPlugins);
      const auth: IAuth = new Auth(config);

      expect(auth).toBeDefined();

      const callback = jest.fn();
      let index = 0;

      // as defined by https://developer.mozilla.org/en-US/docs/Glossary/Falsy
      for (const value of [ false, 0, "",  null, undefined, NaN ]) {
        // $FlowFixMe
        auth.authenticate(null, value, callback);
        const call = callback.mock.calls[index++];
        expect(call[0]).toBeDefined();
        expect(call[1]).toBeUndefined();
      }
    });

    test('should error truthy non-array', () => {
      const config: Config = new AppConfig(configPlugins);
      const auth: IAuth = new Auth(config);

      expect(auth).toBeDefined();

      const callback = jest.fn();

      for (const value of [ true, 1, "test", { } ]) {
        expect(function ( ) {
          // $FlowFixMe
          auth.authenticate(null, value, callback);
        }).toThrow(TypeError);
        expect(callback.mock.calls).toHaveLength(0);
      }
    });

    test('should skip empty array', () => {
      const config: Config = new AppConfig(configPlugins);
      const auth: IAuth = new Auth(config);

      expect(auth).toBeDefined();

      const callback = jest.fn();
      const value = [ ];

      // $FlowFixMe
      auth.authenticate(null, value, callback);
      expect(callback.mock.calls).toHaveLength(1);
      expect(callback.mock.calls[0][0]).toBeDefined();
      expect(callback.mock.calls[0][1]).toBeUndefined();
    });

    test('should accept valid array', () => {
      const config: Config = new AppConfig(configPlugins);
      const auth: IAuth = new Auth(config);

      expect(auth).toBeDefined();

      const callback = jest.fn();
      let index = 0;

      for (const value of [ [ "" ], [ "1" ], [ "0" ], ["000"] ]) {
        // $FlowFixMe
        auth.authenticate(null, value, callback);
        const call = callback.mock.calls[index++];
        expect(call[0]).toBeNull();
        expect(call[1].real_groups).toBe(value);
      }
    });
  })
});
