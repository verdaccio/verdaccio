import express from 'express';
import { setImmediate } from 'node:timers/promises';
import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { log } from '../src';

function createLogger() {
  const requests: {
    method: string;
    url: string;
    authorization: string | undefined;
    cookie: string | undefined;
  }[] = [];
  const logger = {
    child: vi.fn(),
    info: vi.fn(({ req }) => {
      if (req) {
        requests.push({
          method: req.method,
          url: req.url,
          authorization: req.headers.authorization,
          cookie: req.headers.cookie,
        });
      }
    }),
    http: vi.fn(),
  };
  logger.child.mockReturnValue(logger);
  return { logger, requests };
}

describe.each(['', '/registry'])('logging with mount prefix "%s"', (prefix) => {
  test.each([false, true])('preserves routing with async middleware: %s', async (defer) => {
    const { logger, requests } = createLogger();
    const app = express();
    const registry = express.Router();
    const endpoints = express.Router();
    let urlAfterResponse: string | undefined;
    registry.use(log(logger));
    registry.use(async (_req, _res, next) => {
      if (defer) await setImmediate();
      next();
    });
    endpoints.get('/packages', (req, res) => {
      expect(req.headers.authorization).toBe('Bearer routing-test');
      expect(req.headers.cookie).toBe('session=routing-test');
      res.json({ url: req.url, originalUrl: req.originalUrl });
      urlAfterResponse = req.url;
    });
    registry.use('/-/verdaccio/data', endpoints);
    app.use(prefix || '/', registry);
    const url = `${prefix}/-/verdaccio/data/packages?limit=2`;

    const response = await request(app)
      .get(url)
      .set('authorization', 'Bearer routing-test')
      .set('cookie', 'session=routing-test')
      .expect(HTTP_STATUS.OK);

    expect(response.body).toEqual({ url: '/packages?limit=2', originalUrl: url });
    expect(urlAfterResponse).toBe('/packages?limit=2');
    expect(requests).toEqual([
      { method: 'GET', url, authorization: '<Classified>', cookie: '<Classified>' },
    ]);
    expect(logger.http).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ request: { method: 'GET', url }, status: HTTP_STATUS.OK }),
      expect.any(String)
    );
  });
});

test.each(['/-/ping?write=true', '/-/static/main.js'])(
  'hides mounted %s logs by default',
  async (route) => {
    const { logger } = createLogger();
    const app = express();
    const registry = express.Router();
    registry.use(log(logger));
    registry.get(route.split('?')[0], (_req, res) => res.send('ok'));
    app.use('/registry', registry);

    await request(app).get(`/registry${route}`).expect(HTTP_STATUS.OK, 'ok');

    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.http).not.toHaveBeenCalled();
  }
);

test('logs failed mounted pings with the original URL', async () => {
  const { logger } = createLogger();
  const app = express();
  const registry = express.Router();
  registry.use(log(logger));
  registry.get('/-/ping', (_req, res) => res.status(HTTP_STATUS.INTERNAL_ERROR).send('failed'));
  app.use('/registry', registry);

  await request(app).get('/registry/-/ping').expect(HTTP_STATUS.INTERNAL_ERROR, 'failed');

  expect(logger.info).not.toHaveBeenCalled();
  expect(logger.http).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      request: { method: 'GET', url: '/registry/-/ping' },
      status: HTTP_STATUS.INTERNAL_ERROR,
    }),
    expect.any(String)
  );
});
