import fs from 'fs';
import getPort from 'get-port';
import os from 'os';
import path from 'path';
import selfsigned from 'selfsigned';
import { describe, expect, test, vi } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';
import { fileUtils } from '@verdaccio/core';

import startServer from '../../../../src';
import { DEFAULT_DOMAIN, DEFAULT_PROTOCOL } from '../../../../src/lib/constants';
import config from '../../partials/config';

describe('startServer via API', () => {
  describe('startServer launcher', () => {
    test('should provide all HTTP server data', async () => {
      const store = await fileUtils.createTempStorageFolder('server-http');

      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = await getPort();

      return new Promise((done) => {
        return startServer(
          config(),
          port.toString(),
          store,
          version,
          serverName,
          (webServer, addrs, pkgName, pkgVersion) => {
            expect(webServer).toBeDefined();
            expect(addrs).toBeDefined();
            expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
            expect(addrs.host).toEqual(DEFAULT_DOMAIN);
            expect(addrs.port).toEqual(port.toString());
            expect(pkgName).toBeDefined();
            expect(pkgVersion).toBeDefined();
            expect(pkgVersion).toEqual(version);
            expect(pkgName).toEqual(serverName);
            done(true);
          }
        );
      });
    });

    test('should set keepAliveTimeout to 0 seconds', async () => {
      const store = await fileUtils.createTempStorageFolder('keepalive-timeout-0');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = await getPort();
      return new Promise((done) => {
        startServer(
          config({}, 'server/keepalivetimeout-0.yaml', true),
          port.toString(),
          store,
          version,
          serverName,
          (webServer, addrs, pkgName, pkgVersion) => {
            expect(webServer).toBeDefined();
            expect(webServer.keepAliveTimeout).toBeDefined();
            expect(webServer.keepAliveTimeout).toBe(0);
            expect(addrs).toBeDefined();
            expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
            expect(addrs.host).toEqual(DEFAULT_DOMAIN);
            expect(addrs.port).toEqual(port.toString());
            expect(pkgName).toBeDefined();
            expect(pkgVersion).toBeDefined();
            expect(pkgVersion).toEqual(version);
            expect(pkgName).toEqual(serverName);
            done(true);
          }
        );
      });
    });

    test('should set keepAliveTimeout to 60 seconds', async () => {
      const store = await fileUtils.createTempStorageFolder('keepalive-timeout-60');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = await getPort();
      return new Promise((done) => {
        startServer(
          config(getDefaultConfig(), 'server/keepalivetimeout-60.yaml', true),
          port.toString(),
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
            expect(addrs.port).toBe(port.toString());
            expect(pkgName).toBeDefined();
            expect(pkgVersion).toBeDefined();
            expect(pkgVersion).toBe(version);
            expect(pkgName).toBe(serverName);
            done(true);
          }
        );
      });
    });

    test('should set keepAliveTimeout to 60 seconds per default', async () => {
      const store = await fileUtils.createTempStorageFolder('keepalive-timeout-5');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const port = await getPort();
      return new Promise((done) => {
        startServer(
          config(getDefaultConfig(), 'server/keepalivetimeout-undefined.yaml', true),
          port.toString(),
          store,
          version,
          serverName,
          (webServer, addrs, pkgName, pkgVersion) => {
            expect(webServer).toBeDefined();
            expect(webServer.keepAliveTimeout).toBeDefined();
            expect(webServer.keepAliveTimeout).toBe(60000);
            expect(addrs).toBeDefined();
            expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
            expect(addrs.host).toEqual(DEFAULT_DOMAIN);
            expect(addrs.port).toEqual(port.toString());
            expect(pkgName).toBeDefined();
            expect(pkgVersion).toBeDefined();
            expect(pkgVersion).toEqual(version);
            expect(pkgName).toEqual(serverName);
            done(true);
          }
        );
      });
    });

    test('should provide all HTTPS server fails', async () => {
      // @ts-expect-error
      vi.spyOn(process, 'exit').mockImplementation(() => {});

      const store = await fileUtils.createTempStorageFolder('server-https-fails');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';
      const conf = config({ https: {} }, undefined, true);

      return new Promise((done) => {
        startServer(conf, address, store, version, serverName, (app) => {
          // expect(logger.fatal).toHaveBeenCalled();
          // expect(logger.fatal).toHaveBeenCalledTimes(1);
          expect(app).toBeUndefined();
          done(true);
        });
      });
    });

    test('should start a https server with key and cert', () => {
      const store = path.join(__dirname, 'partials/store');
      const serverName = 'verdaccio-test';
      const version = '1.0.0';
      const address = 'https://www.domain.com:443';
      const { private: key, cert } = selfsigned.generate();
      const keyPath = path.join(os.tmpdir(), 'key.pem');
      const certPath = path.join(os.tmpdir(), 'crt.pem');
      fs.writeFileSync(keyPath, key);
      fs.writeFileSync(certPath, cert);

      const conf = config();
      conf.https = {
        key: keyPath,
        cert: certPath,
      };
      return new Promise((done) => {
        startServer(conf, address, store, version, serverName, (webServer, addrs) => {
          expect(webServer).toBeDefined();
          expect(addrs).toBeDefined();
          expect(addrs.proto).toBe('https');
          done(true);
        });
      });
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
});
