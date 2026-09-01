import express from 'express';
import request from 'supertest';
import { expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { errorReportingMiddleware, handleError } from '../src';

const fakeLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() } as any;

test('reports 500 for a status-less error when headers were not sent yet', async () => {
  const app = express();
  app.use(errorReportingMiddleware(fakeLogger));
  app.get('/fail', (req, res) => {
    res.locals.report_error(new Error('boom'));
  });
  app.use(handleError(fakeLogger));
  // minimal final layer: report_error calls next({error}) after setting the status
  app.use((err, req, res, next) => {
    void next;
    res.json(err);
  });

  const res = await request(app).get('/fail');
  expect(res.status).toEqual(HTTP_STATUS.INTERNAL_ERROR);
});

test('destroys the response when a status-less error arrives after headers were sent', async () => {
  const app = express();
  app.use(errorReportingMiddleware(fakeLogger));
  app.get('/stream', (req, res) => {
    res.status(HTTP_STATUS.OK);
    // flushes the headers — from here on no error status can be delivered
    res.write('partial body');
    // a mid-stream failure (eg. uplink connection dropped) has no status code
    res.locals.report_error(new Error('mid-stream failure'));
  });
  app.use(handleError(fakeLogger));

  // the connection must be terminated, not left open for the client to hang on
  await expect(request(app).get('/stream')).rejects.toThrow(/aborted|socket hang up|ECONNRESET/i);
});
