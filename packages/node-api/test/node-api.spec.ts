import path from 'path';
import os from 'os';
import fs from 'fs';
import selfsigned from 'selfsigned';

import { configExample } from '@verdaccio/mock';
import { parseConfigFile } from '@verdaccio/config';

import { startVerdaccio } from '../src';
import { DEFAULT_DOMAIN, DEFAULT_PROTOCOL } from '../src/cli-utils';
const mockProcess = require('jest-mock-process');

describe('startServer via API', () => {
  const parseConfigurationFile = (name) => {
    return parseConfigFile(path.join(__dirname, `./partials/config/yaml/${name}.yaml`));
  };

  describe('startServer launcher', () => {
    test('should provide all HTTP server data', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6000';

      await startVerdaccio(
        configExample(),
        port,
        store,
        version,
        serverName,
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
        }
      );
    });

    test('should set keepAliveTimeout to 0 seconds', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6100';

      await startVerdaccio(
        configExample(parseConfigurationFile('server/keepalivetimeout-0')),
        port,
        store,
        version,
        serverName,
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
        }
      );
    });

    test('should set keepAliveTimeout to 60 seconds', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6200';

      await startVerdaccio(
        configExample(parseConfigurationFile('server/keepalivetimeout-60')),
        port,
        store,
        version,
        serverName,
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
        }
      );
    });

    test('should set keepAliveTimeout to 5 seconds per default', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = '6300';

      await startVerdaccio(
        configExample(parseConfigurationFile('server/keepalivetimeout-undefined')),
        port,
        store,
        version,
        serverName,
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
        }
      );
    });

    test('should provide all HTTPS server fails', async (done) => {
      let mockExit = mockProcess.mockProcessExit();
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';

      const conf = configExample({});
      conf.https = {};
      // save process to catch exist
      await startVerdaccio(conf, address, store, version, serverName, () => {
        expect(mockExit).toHaveBeenCalledWith(2);
        done();
      });
    });

    test('should start a https server with key and cert', async (done) => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';
      const { private: key, cert } = selfsigned.generate();
      const keyPath = path.join(os.tmpdir(), 'key.pem');
      const certPath = path.join(os.tmpdir(), 'crt.pem');
      fs.writeFileSync(keyPath, key);
      fs.writeFileSync(certPath, cert);

      const conf = configExample();
      conf.https = {
        key: keyPath,
        cert: certPath,
      };

      await startVerdaccio(conf, address, store, version, serverName, (webServer, addrs) => {
        expect(webServer).toBeDefined();
        expect(addrs).toBeDefined();
        expect(addrs.proto).toBe('https');
        done();
      });
    });

    test('should fails if config is missing', async () => {
      try {
        // @ts-ignore
        await startVerdaccio();
      } catch (e) {
        expect(e.message).toEqual('config file must be an object');
      }
    });
  });
});
