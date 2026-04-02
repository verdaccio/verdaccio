import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

import { createServerFactory } from '../src/server';

const mockApp = (_req: any, res: any) => {
  res.writeHead(200);
  res.end();
};

const certsDir = path.join(__dirname, 'partials', 'certs');

describe('createServerFactory', () => {
  describe('http', () => {
    test('should create an HTTP server', () => {
      const addr = { proto: 'http', host: 'localhost', port: 0 };
      const server = createServerFactory({} as any, addr, mockApp);
      expect(server).toBeInstanceOf(http.Server);
    });

    test('should set keepAliveTimeout when configured', () => {
      const addr = { proto: 'http', host: 'localhost', port: 0 };
      const config = { server: { keepAliveTimeout: 60 } } as any;
      const server = createServerFactory(config, addr, mockApp);
      expect(server.keepAliveTimeout).toBe(60000);
    });

    test('should not set keepAliveTimeout when not configured', () => {
      const addr = { proto: 'http', host: 'localhost', port: 0 };
      const server = createServerFactory({} as any, addr, mockApp);
      // Node default is 5000ms
      expect(server.keepAliveTimeout).toBe(5000);
    });
  });

  describe('https', () => {
    test('should create an HTTPS server with key and cert', () => {
      const addr = { proto: 'https', host: 'localhost', port: 0 };
      const config = {
        https: {
          key: path.join(certsDir, 'key.pem'),
          cert: path.join(certsDir, 'cert.pem'),
        },
      } as any;
      const server = createServerFactory(config, addr, mockApp);
      expect(server).toBeInstanceOf(https.Server);
    });

    test('should create an HTTPS server with key, cert, and ca', () => {
      const addr = { proto: 'https', host: 'localhost', port: 0 };
      const config = {
        https: {
          key: path.join(certsDir, 'key.pem'),
          cert: path.join(certsDir, 'cert.pem'),
          ca: path.join(certsDir, 'cert.pem'),
        },
      } as any;
      const server = createServerFactory(config, addr, mockApp);
      expect(server).toBeInstanceOf(https.Server);
    });

    test('should create an HTTPS server with pfx', () => {
      const addr = { proto: 'https', host: 'localhost', port: 0 };
      const config = {
        https: {
          pfx: path.join(certsDir, 'server.pfx'),
          passphrase: 'test',
        },
      } as any;
      const server = createServerFactory(config, addr, mockApp);
      expect(server).toBeInstanceOf(https.Server);
    });

    test('should throw on bad https configuration', () => {
      const addr = { proto: 'https', host: 'localhost', port: 0 };
      const config = { https: {} } as any;
      expect(() => createServerFactory(config, addr, mockApp)).toThrow(
        'cannot create https server: bad format https configuration'
      );
    });

    test('should throw when cert files do not exist', () => {
      const addr = { proto: 'https', host: 'localhost', port: 0 };
      const config = {
        https: {
          key: '/nonexistent/key.pem',
          cert: '/nonexistent/cert.pem',
        },
      } as any;
      expect(() => createServerFactory(config, addr, mockApp)).toThrow(
        'cannot create https server'
      );
    });
  });

  describe('unix socket (unlinkAddressPath)', () => {
    let socketPath: string;

    afterEach(() => {
      if (socketPath && fs.existsSync(socketPath)) {
        fs.unlinkSync(socketPath);
      }
    });

    test('should remove stale socket file before creating server', () => {
      socketPath = path.join(os.tmpdir(), `verdaccio-test-${Date.now()}.sock`);
      fs.writeFileSync(socketPath, '');
      expect(fs.existsSync(socketPath)).toBe(true);

      const addr = { proto: 'http', path: socketPath };
      createServerFactory({} as any, addr, mockApp);

      expect(fs.existsSync(socketPath)).toBe(false);
    });

    test('should not throw when socket file does not exist', () => {
      const addr = { proto: 'http', path: '/tmp/nonexistent.sock' };
      const server = createServerFactory({} as any, addr, mockApp);
      expect(server).toBeInstanceOf(http.Server);
    });

    test('should not unlink when addr has no path', () => {
      const addr = { proto: 'http', host: 'localhost', port: 0 };
      const server = createServerFactory({} as any, addr, mockApp);
      expect(server).toBeInstanceOf(http.Server);
    });
  });
});
