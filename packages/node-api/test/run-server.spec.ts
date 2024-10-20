import request from 'supertest';
import { describe, expect, test } from 'vitest';

import { runServer } from '../src';

describe('startServer via API', () => {
  // TODO: fix this test does not runs with vitest
  test.skip('should provide all HTTP server data', async () => {
    const webServer = await runServer();
    expect(webServer).toBeDefined();
    await request(webServer).get('/').expect(200);
  });

  test('should fail on start with empty configuration', async () => {
    // @ts-expect-error
    await expect(runServer({})).rejects.toThrow('configPath property is required');
  });

  test('should fail on start with null as entry', async () => {
    // @ts-expect-error
    await expect(runServer(null)).rejects.toThrow();
  });
});
