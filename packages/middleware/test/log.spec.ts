import type { ErrorRequestHandler } from 'express';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { log } from '../src';
import { getApp } from './helper';

const logPath = path.join(import.meta.dirname, './verdaccio.log');

beforeAll(async () => {
  await setup({
    type: 'file',
    path: logPath,
    level: 'trace',
    format: 'json',
    sync: true,
  });
});

describe('sensitive request headers', () => {
  const sensitiveHeaders = {
    authorization: 'Bearer private-test-token',
    cookie: 'session=private-test-session',
    'npm-otp': '654321',
  };

  test.each([false, true])('masks JSON headers with redact removal = %s', async (remove) => {
    const offset = readFileSync(logPath, 'utf8').length;
    const requestLogger = remove
      ? logger.child({}, { redact: { paths: ['req.headers["npm-otp"]'], remove: true } })
      : logger;
    const app = getApp([]);
    app.use(log(requestLogger));
    app.get('/react', (req, res) => {
      for (const [header, value] of Object.entries(sensitiveHeaders)) {
        expect(req.headers[header]).toBe(value);
      }
      res.sendStatus(HTTP_STATUS.OK);
    });

    await request(app).get('/react').set(sensitiveHeaders).expect(HTTP_STATUS.OK);

    const output = readFileSync(logPath, 'utf8').slice(offset);
    const records = output
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const loggedHeaders = records.find((record) => record.req)?.req.headers;
    expect(loggedHeaders).toBeDefined();
    expect(loggedHeaders.authorization).toBe('<Classified>');
    expect(loggedHeaders.cookie).toBe('<Classified>');
    if (remove) {
      expect(loggedHeaders).not.toHaveProperty('npm-otp');
    } else {
      expect(loggedHeaders['npm-otp']).toBe('<Classified>');
    }
    for (const value of Object.values(sensitiveHeaders)) {
      expect(output).not.toContain(value);
    }
  });

  test('does not add absent sensitive headers to the request or JSON log', async () => {
    const offset = readFileSync(logPath, 'utf8').length;
    const app = getApp([]);
    app.use(log(logger));
    app.get('/react', (req, res) => {
      for (const header of Object.keys(sensitiveHeaders)) {
        expect(req.headers).not.toHaveProperty(header);
      }
      res.sendStatus(HTTP_STATUS.OK);
    });

    await request(app).get('/react').expect(HTTP_STATUS.OK);

    const records = readFileSync(logPath, 'utf8')
      .slice(offset)
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const loggedHeaders = records.find((record) => record.req)?.req.headers;
    expect(loggedHeaders).toBeDefined();
    for (const header of Object.keys(sensitiveHeaders)) {
      expect(loggedHeaders).not.toHaveProperty(header);
    }
  });

  test('restores all sensitive headers when the logger throws', async () => {
    const failure = new Error('request logger failed');
    const app = getApp([]);
    app.use(
      log({
        child: () => ({
          info: () => {
            throw failure;
          },
        }),
      })
    );
    const nextHandler = vi.fn((_req, res) => res.sendStatus(HTTP_STATUS.OK));
    app.get('/react', nextHandler);
    const onError = vi.fn();
    const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
      onError(error, { ...req.headers });
      res.sendStatus(HTTP_STATUS.INTERNAL_ERROR);
    };
    app.use(errorHandler);

    await request(app).get('/react').set(sensitiveHeaders).expect(HTTP_STATUS.INTERNAL_ERROR);
    expect(onError).toHaveBeenCalledExactlyOnceWith(
      failure,
      expect.objectContaining(sensitiveHeaders)
    );
    expect(nextHandler).not.toHaveBeenCalled();
  });
});

test('should log request', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(log(logger));
  // @ts-ignore
  app.get('/:package', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  // TODO: pending output
  return request(app).get('/react').expect(HTTP_STATUS.OK);
});

describe('hideStaticLogs option', () => {
  test('should log static requests when hideStaticLogs is false', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hideStaticLogs: false }));
    app.get('/-/static/main.js', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/static/main.js').expect(HTTP_STATUS.OK);
    expect(infoSpy).toHaveBeenCalled();
  });

  test('should not log static requests when hideStaticLogs is true', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hideStaticLogs: true }));
    app.get('/-/static/main.js', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/static/main.js').expect(HTTP_STATUS.OK);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  test('should hide static logs by default', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger));
    app.get('/-/static/main.js', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/static/main.js').expect(HTTP_STATUS.OK);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  test('should still log non-static requests when hideStaticLogs is true', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hideStaticLogs: true }));
    app.get('/react', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/react').expect(HTTP_STATUS.OK);
    expect(infoSpy).toHaveBeenCalled();
  });
});

describe('hidePingLogs option', () => {
  test('should log ping requests when hidePingLogs is false', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hidePingLogs: false }));
    app.get('/-/ping', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/ping').expect(HTTP_STATUS.OK);
    expect(infoSpy).toHaveBeenCalled();
  });

  test('should not log successful ping requests when hidePingLogs is true', async () => {
    const infoSpy = vi.fn();
    const httpSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: httpSpy }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hidePingLogs: true }));
    app.get('/-/ping', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/ping').expect(HTTP_STATUS.OK);
    expect(infoSpy).not.toHaveBeenCalled();
    expect(httpSpy).not.toHaveBeenCalled();
  });

  test('should hide ping logs by default', async () => {
    const infoSpy = vi.fn();
    const httpSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: httpSpy }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger));
    app.get('/-/ping', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/ping').expect(HTTP_STATUS.OK);
    expect(infoSpy).not.toHaveBeenCalled();
    expect(httpSpy).not.toHaveBeenCalled();
  });

  test('should still log failed ping requests when hidePingLogs is true', async () => {
    const httpSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: vi.fn(), http: httpSpy }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hidePingLogs: true }));
    app.get('/-/ping', (_req, res) => {
      res.status(HTTP_STATUS.INTERNAL_ERROR).send('fail');
    });

    await request(app).get('/-/ping').expect(HTTP_STATUS.INTERNAL_ERROR);
    expect(httpSpy).toHaveBeenCalled();
  });

  test('should hide ping logs independently of hideStaticLogs', async () => {
    const infoSpy = vi.fn();
    const mockLogger = {
      child: () => ({ info: infoSpy, http: vi.fn() }),
    };

    const app = getApp([]);
    // @ts-ignore
    app.use(log(mockLogger, { hideStaticLogs: false, hidePingLogs: true }));
    app.get('/-/ping', (_req, res) => {
      res.status(HTTP_STATUS.OK).send('ok');
    });

    await request(app).get('/-/ping').expect(HTTP_STATUS.OK);
    expect(infoSpy).not.toHaveBeenCalled();
  });
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
    const { request: httpRequest } = await import('node:http');
    const req = httpRequest({
      hostname: 'localhost',
      port: port,
      path: '/slow/react',
      method: 'GET',
    });

    // Handle expected error when we destroy the connection
    req.on('error', (err: NodeJS.ErrnoException) => {
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
    expect(mockChildLogger.info).toHaveBeenCalledWith(
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
    // Await the close callback to avoid open handles
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
