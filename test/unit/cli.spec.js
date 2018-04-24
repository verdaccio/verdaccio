import startServer from '../../src';
import {getListListenAddresses} from '../../src/lib/bootstrap';
import config from './partials/config';
import path from 'path';
import _ from 'lodash';

require('../../src/lib/logger').setup([]);

describe('startServer via API', () => {

  describe('startServer launcher', () => {
    test('should provide all server data await/async', async (done) => {
      const store = path.join(__dirname, 'partials/store');

      await startServer(config, 6000, store, '1.0.0', 'verdaccio-test',
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe('http');
          expect(addrs.host).toBe('localhost');
          expect(addrs.port).toBe('6000');
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe('1.0.0');
          expect(pkgName).toBe('verdaccio-test');
          done();
      });
    });

    test('should fails if config is missing', async () => {
      try {
        await startServer();
      } catch (e) {
        expect(e.message).toEqual('config file must be an object');
      }
    });

  });

  describe('getListListenAddresses test', () => {
    test('should return by default 4873', () => {
      const addrs = getListListenAddresses()[0];

      expect(addrs.proto).toBe('http');
      expect(addrs.host).toBe('localhost');
      expect(addrs.port).toBe('4873');
    });

    test('should return a list of address and no cli argument provided', () => {
      const addrs = getListListenAddresses(null, ['1000', '2000']);

      expect(_.isArray(addrs)).toBeTruthy();
    });

    test('should return an address and no cli argument provided', () => {
      const addrs = getListListenAddresses(null, '1000');

      expect(_.isArray(addrs)).toBeTruthy();
    });


  });

});
