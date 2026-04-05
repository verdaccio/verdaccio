import { describe, expect, test, vi } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';

import { runServer } from '../../../../src';
import config from '../../partials/config';

vi.setConfig({ testTimeout: 20000 });

describe('startServer via API', () => {
  describe('runServer launcher', () => {
    test('should create an HTTP server', async () => {
      const server = await runServer(config());
      expect(server).toBeDefined();
      expect(server.listen).toBeDefined();
      server.close();
    });

    test('should set keepAliveTimeout to 0 seconds', async () => {
      const server = await runServer(config({}, 'server/keepalivetimeout-0.yaml', true));
      expect(server).toBeDefined();
      expect(server.keepAliveTimeout).toBe(0);
      server.close();
    });

    test('should set keepAliveTimeout to 60 seconds', async () => {
      const server = await runServer(
        config(getDefaultConfig(), 'server/keepalivetimeout-60.yaml', true)
      );
      expect(server).toBeDefined();
      expect(server.keepAliveTimeout).toBe(60000);
      server.close();
    });

    test('should set keepAliveTimeout to 60 seconds per default', async () => {
      const server = await runServer(
        config(getDefaultConfig(), 'server/keepalivetimeout-undefined.yaml', true)
      );
      expect(server).toBeDefined();
      expect(server.keepAliveTimeout).toBe(60000);
      server.close();
    });

    test('should fail with bad HTTPS config', async () => {
      const conf = config({ https: {} }, undefined, true);
      conf.listen = 'https://www.domain.com:443';
      await expect(runServer(conf)).rejects.toThrow('bad format https configuration');
    });

    test('should fail if config is missing', async () => {
      try {
        // @ts-ignore
        await runServer();
      } catch (e) {
        expect(e.message).toEqual('config file must be an object');
      }
    });
  });
});
