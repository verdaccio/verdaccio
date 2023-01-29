import request from 'supertest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { setSecurityWebHeaders } from '../src';
import { getApp } from './helper';

test('should get frame options', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.FRAMES_OPTIONS)).toEqual('deny');
});

test('should get csp options', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.CSP)).toEqual("connect-src 'self'");
});

test('should get cto', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.CTO)).toEqual('nosniff');
});

test('should get xss', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.XSS)).toEqual('1; mode=block');
});
