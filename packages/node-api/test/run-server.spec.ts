import http from 'node:http';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { runServer } from '../src';

const mockServerFactory = vi.fn();

describe('startServer via API', () => {
  afterEach(() => {
    mockServerFactory.mockReset();
  });

  test('should return an HTTP server instance', async () => {
    const app = (_req: any, res: any) => {
      res.writeHead(200);
      res.end();
    };
    mockServerFactory.mockResolvedValue(app);
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
