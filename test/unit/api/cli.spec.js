import path from 'path';
import _ from 'lodash';

import startServer from '../../../src/index';
import {getListListenAddresses} from '../../../src/lib/bootstrap';
import config from '../partials/config/index';
import {DEFAULT_DOMAIN, DEFAULT_PORT} from '../../../src/lib/constants';

require('../../../src/lib/logger').setup([]);

describe('startServer via API', () => {

  describe('startServer launcher', () => {
    test('should provide all server data await/async', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6000';

      await startServer(config, port, store, version, serverName,
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe('http');
          expect(addrs.host).toBe('localhost');
          expect(addrs.port).toBe(port);
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe(version);
          expect(pkgName).toBe(serverName);
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
    test(`should return by default ${DEFAULT_PORT}`, () => {
      const addrs = getListListenAddresses()[0];

      expect(addrs.proto).toBe('http');
      expect(addrs.host).toBe(DEFAULT_DOMAIN);
      expect(addrs.port).toBe(DEFAULT_PORT);
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
