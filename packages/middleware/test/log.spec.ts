import { EventEmitter } from 'node:events';
import path from 'node:path';
import { type RequestHandler, Router } from 'express';
import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { log } from '../src';
import type { $RequestExtend, $ResponseExtend } from '../src/types';
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
  // @ts-ignore
  app.get('/:package', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  // TODO: pending output
  return request(app).get('/react').expect(HTTP_STATUS.OK);
});

function captureLogger() {
  const requests: { url: string; method: string; headers: Record<string, unknown> }[] = [];
  const child = {
    info: vi.fn(({ req }: { req: $RequestExtend }) => {
      requests.push({ url: req.url, method: req.method, headers: { ...req.headers } });
    }),
    http: vi.fn(),
  };
  return { requests, child, logger: { child: vi.fn(() => child) } };
}

function createRequest(headers: Record<string, string> = {}) {
  const req = Object.assign(new EventEmitter(), {
    method: 'POST',
    url: '/@scope%2fpkg?version=1.0.0',
    originalUrl: '/registry/@scope%2fpkg?version=1.0.0',
    baseUrl: '/registry',
    headers,
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
    get: (name: string) => headers[name.toLowerCase()],
  }) as unknown as $RequestExtend;
  const res = {
    locals: {},
    statusCode: HTTP_STATUS.OK,
    write: vi.fn(() => true),
    end: vi.fn(),
  } as unknown as $ResponseExtend;
  return { req, res };
}

test('preserves routing state before calling the next middleware', () => {
  const { req, res } = createRequest();
  const captured = captureLogger();
  const next = vi.fn(() => {
    expect(req.url).toBe('/@scope%2fpkg?version=1.0.0');
    expect(req.originalUrl).toBe('/registry/@scope%2fpkg?version=1.0.0');
    expect(req.baseUrl).toBe('/registry');
  });

  log(captured.logger)(req, res, next);

  expect(next).toHaveBeenCalledExactlyOnceWith();
  expect(captured.requests).toEqual([{ method: 'POST', url: req.originalUrl, headers: {} }]);
});

describe.each([
  { name: 'root', mounts: [] },
  { name: 'prefixed', mounts: ['/registry'] },
  { name: 'nested', mounts: ['/outer', '/registry'] },
])('$name router', ({ mounts }) => {
  test.each([false, true])('routes a scoped package with deferred next = %s', async (deferred) => {
    const captured = captureLogger();
    const app = getApp();
    const router = Router();
    let mounted = router;
    for (const mount of [...mounts].reverse()) {
      const parent = Router();
      parent.use(mount, mounted);
      mounted = parent;
    }
    app.use(mounted);
    router.use(log(captured.logger) as RequestHandler);
    router.use((_req, _res, next) => {
      if (deferred) setImmediate(next);
      else next();
    });
    router.get('/:package', (req, res) => {
      res.json({
        package: req.params.package,
        url: req.url,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
      });
    });
    const url = '/@scope%2fpkg?version=1.0.0';
    const prefix = mounts.join('');

    const response = await request(app).get(`${prefix}${url}`).expect(HTTP_STATUS.OK);

    expect(response.body).toEqual({
      package: '@scope/pkg',
      url,
      originalUrl: `${prefix}${url}`,
      baseUrl: prefix,
    });
    expect(captured.requests[0]).toMatchObject({ method: 'GET', url: `${prefix}${url}` });
    expect(captured.child.http).toHaveBeenCalledWith(
      expect.objectContaining({ request: { method: 'GET', url: `${prefix}${url}` } }),
      expect.any(String)
    );
  });
});

describe.each(['close', 'end'])('%s logging', (event) => {
  test.each([false, true])('preserves a downstream URL rewrite with error = %s', (failed) => {
    const { req, res } = createRequest();
    const captured = captureLogger();
    const end = res.end;
    log(captured.logger)(req, res, vi.fn());
    req.url = '/rewritten?version=1.0.0';
    req.baseUrl = '/registry/nested';
    if (failed) {
      res.statusCode = HTTP_STATUS.FORBIDDEN;
      res.locals._verdaccio_error = 'access denied';
    }
    req.emit('data', Buffer.from('input'));
    res.write(Buffer.from('output'));

    if (event === 'close') req.emit('close');
    else res.end(Buffer.from('end'));

    expect(req.url).toBe('/rewritten?version=1.0.0');
    expect(req.originalUrl).toBe('/registry/@scope%2fpkg?version=1.0.0');
    expect(req.baseUrl).toBe('/registry/nested');
    expect(captured.child.http).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        request: { method: 'POST', url: req.originalUrl },
        status: failed ? HTTP_STATUS.FORBIDDEN : HTTP_STATUS.OK,
        error: failed ? 'access denied' : undefined,
        bytes: { in: 5, out: event === 'close' ? 6 : 9 },
      }),
      expect.stringContaining(failed ? 'error: @{!error}' : 'bytes: @{bytes.in}/@{bytes.out}')
    );
    if (event === 'end') expect(end).toHaveBeenCalledExactlyOnceWith(Buffer.from('end'));
    else expect(end).not.toHaveBeenCalled();
  });
});

test.each<Record<string, string>>([
  {},
  { authorization: 'Bearer test-token' },
  { cookie: 'session=test-cookie' },
  { authorization: 'Bearer test-token', cookie: 'session=test-cookie' },
  { authorization: '', cookie: '' },
])('masks credentials in logs and restores headers %j', (headers) => {
  const originalHeaders = { ...headers };
  const { req, res } = createRequest({ ...headers });
  const captured = captureLogger();
  const next = vi.fn(() => expect(req.headers).toEqual(originalHeaders));

  log(captured.logger)(req, res, next);

  expect(captured.requests).toEqual([
    {
      method: 'POST',
      url: req.originalUrl,
      headers: Object.fromEntries(Object.keys(originalHeaders).map((key) => [key, '<Classified>'])),
    },
  ]);
  expect(req.headers).toEqual(originalHeaders);
  expect(next).toHaveBeenCalledOnce();
});
