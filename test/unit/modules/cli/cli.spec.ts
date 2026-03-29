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
      // @ts-expect-error
      vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      const conf = config({ https: {} }, undefined, true);
      await expect(runServer(conf, { listenArg: 'https://www.domain.com:443' })).rejects.toThrow(
        'process.exit called'
      );
      expect(process.exit).toHaveBeenCalledWith(2);
      vi.restoreAllMocks();
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
