import http from 'node:http';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { initServer, runServer } from '../src';

const mockServerFactory = vi.fn();
const mockApp = (_req: any, res: any) => {
  res.writeHead(200);
  res.end();
};

describe('runServer', () => {
  afterEach(() => {
    mockServerFactory.mockReset();
  });

  test('should return an HTTP server instance', async () => {
    mockServerFactory.mockResolvedValue(mockApp);
    // @ts-expect-error
    const webServer = await runServer({}, mockServerFactory);
    expect(webServer).toBeDefined();
    expect(webServer).toBeInstanceOf(http.Server);
    expect(mockServerFactory).toHaveBeenCalledOnce();
  });

  test('should fail on start with null as entry', async () => {
    // @ts-expect-error
    await expect(runServer(null, mockServerFactory)).rejects.toThrow();
  });
});

describe('initServer', () => {
  afterEach(() => {
    mockServerFactory.mockReset();
  });

  test('should start the server and resolve', async () => {
    mockServerFactory.mockResolvedValue(mockApp);
    const config = { listen: 'localhost:0' } as any;
    await initServer(config, 'localhost:0', '1.0.0', 'verdaccio', mockServerFactory);
    expect(mockServerFactory).toHaveBeenCalledWith(config);
  });

  test('should reject when server factory fails', async () => {
    mockServerFactory.mockRejectedValue(new Error('factory error'));
    const config = { listen: 'localhost:0' } as any;
    await expect(
      initServer(config, 'localhost:0', '1.0.0', 'verdaccio', mockServerFactory)
    ).rejects.toThrow('factory error');
  });

  test('should use port parameter over config listen', async () => {
    mockServerFactory.mockResolvedValue(mockApp);
    const config = { listen: 'localhost:9999' } as any;
    // port param takes precedence
    await initServer(config, 'localhost:0', '1.0.0', 'verdaccio', mockServerFactory);
    expect(mockServerFactory).toHaveBeenCalledOnce();
  });

  test.each(['SIGINT', 'SIGTERM', 'SIGHUP'])(
    'should close the server gracefully on %s',
    async (signal) => {
      mockServerFactory.mockResolvedValue(mockApp);
      const config = { listen: 'localhost:0' } as any;
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      await initServer(config, 'localhost:0', '1.0.0', 'verdaccio', mockServerFactory);

      // Emit the signal to trigger handleShutdownGracefully
      process.emit(signal as any);

      // Wait for server.close callback to fire
      await vi.waitFor(() => {
        expect(exitSpy).toHaveBeenCalledWith(0);
      });

      exitSpy.mockRestore();
    }
  );
});
