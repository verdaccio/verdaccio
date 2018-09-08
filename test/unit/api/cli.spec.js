import path from 'path';
import _ from 'lodash';

import startServer from '../../../src/index';
import config from '../partials/config/index';
import {DEFAULT_DOMAIN, DEFAULT_PORT, DEFAULT_PROTOCOL} from '../../../src/lib/constants';
import {getListListenAddresses} from '../../../src/lib/cli/utils';

const logger = require('../../../src/lib/logger');

jest.mock('../../../src/lib/logger', () => ({
  setup: jest.fn(),
  logger: {
    child: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
  }
}));

describe('startServer via API', () => {

  describe('startServer launcher', () => {
    test('should provide all HTTP server data', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6000';

      await startServer(_.clone(config), port, store, version, serverName,
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

    test('should provide all HTTPS server fails', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';
      const realProcess = process;

      const conf = _.clone(config);
      conf.https = {};
      // save process to catch exist
      const exitMock = jest.fn();
      global.process = { ...realProcess, exit: exitMock };
      await startServer(conf, address, store, version, serverName, () => {
        expect(logger.logger.fatal).toBeCalled();
        expect(logger.logger.fatal).toHaveBeenCalledTimes(2);
        done();
      });
      expect(exitMock).toHaveBeenCalledWith(2);
      // restore process
      global.process = realProcess;
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

    test('should return no address if a single address is wrong', () => {
      const addrs = getListListenAddresses("wrong");

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(0);
    });

    test('should return no address if a two address are wrong', () => {
      const addrs = getListListenAddresses(["wrong", "same-wrong"]);

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(0);
    });

    test('should return a list of 1 address provided', () => {
      const addrs = getListListenAddresses(null, '1000');

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(1);
    });

    test('should return a list of 2 address provided', () => {
      const addrs = getListListenAddresses(null, ['1000', '2000']);

      expect(_.isArray(addrs)).toBeTruthy();
      expect(addrs).toHaveLength(2);
    });

    test(`should return by default ${DEFAULT_PORT}`, () => {
      const [addrs] = getListListenAddresses();

      expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
      expect(addrs.host).toBe(DEFAULT_DOMAIN);
      expect(addrs.port).toBe(DEFAULT_PORT);
    });

    test('should return default proto, host and custom port', () => {
      const initPort = '1000';
      const [addrs] = getListListenAddresses(null, initPort);

      expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
      expect(addrs.host).toEqual(DEFAULT_DOMAIN);
      expect(addrs.port).toEqual(initPort);
    });

  });

});
