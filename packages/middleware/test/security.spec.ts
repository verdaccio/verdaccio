import request from 'supertest';
import { expect, test } from 'vitest';

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

test('should set own content security policy', async () => {
  const csp = 'default "self"; connect-src "self" https://other.example.com';
  const app = getApp([]);
  // @ts-ignore
  app.use((req, res, next) => {
    res.header(HEADERS.CSP, csp);
    next();
  });
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.CSP)).toEqual(csp);
});

test('should overwrite invalid frame options', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use((req, res, next) => {
    res.header(HEADERS.FRAMES_OPTIONS, 'allow something');
    next();
  });
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.FRAMES_OPTIONS)).toEqual('deny');
});

test('should get changed xss header', async () => {
  const xss = '1; report=https://example.com/report';
  const app = getApp([]);
  // @ts-ignore
  app.use((req, res, next) => {
    res.header(HEADERS.XSS, xss);
    next();
  });
  // @ts-ignore
  app.use(setSecurityWebHeaders);
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  const res = await request(app).get('/sec').expect(HTTP_STATUS.OK);
  expect(res.get(HEADERS.XSS)).toEqual(xss);
});
