import path from 'node:path';
import request from 'supertest';
import { expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { log } from '../src';
import { getApp } from './helper';

setup({
  type: 'file',
  path: path.join(__dirname, './verdaccio.log'),
  level: 'trace',
  format: 'json',
});

test('should log request', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(log(logger));
  app.get('/:package', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  // TODO: pending output
  return request(app).get('/react').expect(HTTP_STATUS.OK);
});

test('should log request aborted by user', async () => {
  const app = getApp([]);
  // Create a mock child logger to spy on
  const mockChildLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    http: vi.fn(),
  };

  const mockLogger = {
    child: vi.fn(() => mockChildLogger),
  };

  // @ts-ignore
  app.use(log(mockLogger));

  app.get('/slow/:package', (req, res) => {
    // Simulate a slow response - will be aborted before completing
    setTimeout(() => {
      res.status(HTTP_STATUS.OK).json({});
    }, 1000);
  });

  // Create a direct request to the app to have better control over socket events
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'string' ? parseInt(address) : address?.port;

  if (!port) {
    throw new Error('Failed to get server port');
  }

  try {
    // Make request that we'll abort
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/slow/react',
      method: 'GET',
    });

    // Handle expected error when we destroy the connection
    req.on('error', (err) => {
      // Expected error when destroying connection - ignore it
      if (err.code === 'ECONNRESET') {
        return;
      }
      throw err;
    });

    // Start the request
    req.end();

    // Abort after a short delay to simulate user cancellation
    setTimeout(() => {
      req.destroy();
    }, 100);

    // Wait for the abort to be processed
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify that the abort was logged
    expect(mockChildLogger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          method: 'GET',
          url: '/slow/react',
        }),
        status: 499, // CLIENT_CLOSED_REQUEST
      }),
      expect.stringContaining('request aborted by client')
    );
  } finally {
    server.close();
  }
});
