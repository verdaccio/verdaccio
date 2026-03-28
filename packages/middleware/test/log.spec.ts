import path from 'node:path';
import request from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { log } from '../src';
import { getApp } from './helper';

beforeAll(async () => {
  await setup({
    type: 'file',
    path: path.join(import.meta.dirname, './verdaccio.log'),
    level: 'trace',
    format: 'json',
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
