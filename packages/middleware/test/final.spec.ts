import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { final } from '../src';

test('handle error as object', async () => {
  const app = express();
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  app.get('/401', (req, res, next) => {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    next({ error: 'some error' });
  });
  // @ts-ignore
  app.use(final);

  const res = await request(app).get('/401');
  expect(res.get(HEADERS.WWW_AUTH)).toEqual('Basic, Bearer');
  expect(res.get(HEADERS.CONTENT_TYPE)).toEqual(HEADERS.JSON_CHARSET);
  expect(res.get(HEADERS.ETAG)).toEqual('W/"1c-CP1UoQiM59AjHpEk0334sfSp1kc"');
  expect(res.body).toEqual({ error: 'some error' });
});

test('handle error as string', async () => {
  const app = express();
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  app.get('/200', (req, res, next) => {
    res.status(HTTP_STATUS.OK);
    // error as json string
    next(JSON.stringify({ error: 'some error' }));
  });
  // @ts-ignore
  app.use(final);

  const res = await request(app).get('/200');
  expect(res.get(HEADERS.WWW_AUTH)).not.toBeDefined();
  expect(res.get(HEADERS.CONTENT_TYPE)).toEqual(HEADERS.JSON_CHARSET);
  expect(res.get(HEADERS.ETAG)).toEqual('"3f3a7b9afa23269e16685af6e707d109"');
  expect(res.body).toEqual({ error: 'some error' });
});

test('handle error as unknown string no parsable', async () => {
  const app = express();
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  app.get('/200', (req, res) => {
    res.status(HTTP_STATUS.OK);
    // error as json string
    throw Error('uknonwn');
  });
  // @ts-ignore
  app.use(final);

  const res = await request(app).get('/200');
  expect(res.get(HEADERS.WWW_AUTH)).not.toBeDefined();
  expect(res.get(HEADERS.CONTENT_TYPE)).toEqual(HEADERS.JSON_CHARSET);
  expect(res.get(HEADERS.ETAG)).toEqual('"8a80554c91d9fca8acb82f023de02f11"');
  expect(res.body).toEqual({});
});
