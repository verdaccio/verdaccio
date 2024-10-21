import request from 'supertest';
import { expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { makeURLrelative } from '../src';
import { getApp } from './helper';

const testHosts = [
  'localhost:4873', // with port
  'myregistry.com', // no port
  '42.42.42.42', // ip
  '[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443', // ip6
];

test.each([testHosts])('remove host from url', async (host) => {
  const app = getApp([]);
  // @ts-ignore
  app.use(makeURLrelative);
  app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(HTTP_STATUS.OK).json({ id, url: req.url });
  });

  const res = await request(app).get('/foo').set(HEADERS.HOST, host);
  expect(res.body).toEqual({ id: 'foo', url: '/foo' });
  expect(res.status).toEqual(HTTP_STATUS.OK);
});

test('invalid url', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(makeURLrelative);
  app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(HTTP_STATUS.OK).json({ id });
  });

  const res = await request(app).get('/foo').set(HEADERS.HOST, 'invalid::host');
  expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST);
  expect(res.text).toContain('Invalid URL');
});
