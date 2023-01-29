import mime from 'mime';
import request from 'supertest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { media } from '../src';
import { getApp } from './helper';

test('media is json', async () => {
  const app = getApp([]);
  app.get('/json', media(mime.getType('json')), (req, res) => {
    res.status(200).json();
  });

  return request(app)
    .get('/json')
    .set(HEADERS.CONTENT_TYPE, 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
});

test('media is not json', async () => {
  const app = getApp([]);
  app.get('/json', media(mime.getType('json')), (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app)
    .get('/json')
    .set(HEADERS.CONTENT_TYPE, 'text/html; charset=utf-8')
    .expect('Content-Type', /html/)
    .expect(HTTP_STATUS.UNSUPPORTED_MEDIA);
});
