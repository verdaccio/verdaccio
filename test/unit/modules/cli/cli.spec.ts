import path from 'path';
import _ from 'lodash';

import startServer from '../../../../src';
import config from '../../partials/config';
import {DEFAULT_DOMAIN, DEFAULT_PORT, DEFAULT_PROTOCOL} from '../../../../src/lib/constants';
import {getListListenAddresses} from '../../../../src/lib/cli/utils';
import {parseConfigFile} from '../../../../src/lib/utils';

const logger = require('../../../../src/lib/logger');

jest.mock('../../../../src/lib/logger', () => ({
  setup: jest.fn(),
  logger: {
    child: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
  }
}));

describe('startServer via API', () => {

  const parseConfigurationFile = (name) => {
    return parseConfigFile(path.join(__dirname, `../../partials/config/yaml/${name}.yaml`));
  };

  describe('startServer launcher', () => {
    test('should provide all HTTP server data', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6000';

      await startServer(config(), port, store, version, serverName,
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
          expect(addrs.host).toBe(DEFAULT_DOMAIN);
          expect(addrs.port).toBe(port);
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe(version);
          expect(pkgName).toBe(serverName);
          done();
        });
    });

    test('should set keepAliveTimeout to 0 seconds', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6100';

      await startServer(config(parseConfigurationFile('server/keepalivetimeout-0')), port, store, version, serverName,
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(webServer.keepAliveTimeout).toBeDefined();
          expect(webServer.keepAliveTimeout).toBe(0);
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
          expect(addrs.host).toBe(DEFAULT_DOMAIN);
          expect(addrs.port).toBe(port);
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe(version);
          expect(pkgName).toBe(serverName);
          done();
      });
    });

    test('should set keepAliveTimeout to 60 seconds', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6200';

      await startServer(config(parseConfigurationFile('server/keepalivetimeout-60')), port, store, version, serverName,
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(webServer.keepAliveTimeout).toBeDefined();
          expect(webServer.keepAliveTimeout).toBe(60000);
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
          expect(addrs.host).toBe(DEFAULT_DOMAIN);
          expect(addrs.port).toBe(port);
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe(version);
          expect(pkgName).toBe(serverName);
          done();
      });
    });

    test('should set keepAliveTimeout to 5 seconds per default', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6300';

      await startServer(config(parseConfigurationFile('server/keepalivetimeout-undefined')), port, store, version, serverName,
        (webServer, addrs, pkgName, pkgVersion) => {
          expect(webServer).toBeDefined();
          expect(webServer.keepAliveTimeout).toBeDefined();
          expect(webServer.keepAliveTimeout).toBe(5000);
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
          expect(addrs.host).toBe(DEFAULT_DOMAIN);
          expect(addrs.port).toBe(port);
          expect(pkgName).toBeDefined();
          expect(pkgVersion).toBeDefined();
          expect(pkgVersion).toBe(version);
          expect(pkgName).toBe(serverName);
          done();
      });
    });

    test('should provide all HTTPS server fails', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';
      const realProcess = process;

      const conf = config();
      conf.https = {};
      // save process to catch exist
      const exitMock = jest.fn();
      // @ts-ignore
      global.process = { ...realProcess, exit: exitMock };
      await startServer(conf, address, store, version, serverName, () => {
        expect(logger.logger.fatal).toHaveBeenCalled();
        expect(logger.logger.fatal).toHaveBeenCalledTimes(2);
        done();
      });
      expect(exitMock).toHaveBeenCalledWith(2);
      // restore process
      global.process = realProcess;
    });

    test('should fails if config is missing', async () => {
      try {
        // @ts-ignore
        await startServer();
      } catch (e) {
        expect(e.message).toEqual('config file must be an object');
      }
    });

  });

  describe('getListListenAddresses test', () => {

    test('should return no address if a single address is wrong', () => {
      // @ts-ignore
      const addrs = getListListenAddresses("wrong");

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(0);
    });

    test('should return no address if a two address are wrong', () => {
      // @ts-ignore
      const addrs = getListListenAddresses(["wrong", "same-wrong"]);

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(0);
    });

    test('should return a list of 1 address provided', () => {
      // @ts-ignore
      const addrs = getListListenAddresses(null, '1000');

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(1);
    });

    test('should return a list of 2 address provided', () => {
      // @ts-ignore
      const addrs = getListListenAddresses(null, ['1000', '2000']);

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(2);
    });

    test(`should return by default ${DEFAULT_PORT}`, () => {
      // @ts-ignore
      const [addrs] = getListListenAddresses();

      // @ts-ignore
      expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
      // @ts-ignore
      expect(addrs.host).toBe(DEFAULT_DOMAIN);
      // @ts-ignore
      expect(addrs.port).toBe(DEFAULT_PORT);
    });

    test('should return default proto, host and custom port', () => {
      const initPort = '1000';
      // @ts-ignore
      const [addrs] = getListListenAddresses(null, initPort);

      // @ts-ignore
      expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
      // @ts-ignore
      expect(addrs.host).toEqual(DEFAULT_DOMAIN);
      // @ts-ignore
      expect(addrs.port).toEqual(initPort);
    });

  });

});
