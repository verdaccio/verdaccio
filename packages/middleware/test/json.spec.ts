import bodyParser from 'body-parser';
import request from 'supertest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { expectJson } from '../src';
import { getApp } from './helper';

test('body is json', async () => {
  const app = getApp([]);
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  // @ts-ignore
  app.put('/json', expectJson, (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app)
    .put('/json')
    .send({ name: 'john' })
    .set(HEADERS.CONTENT_TYPE, 'application/json')
    .expect(HTTP_STATUS.OK);
});

test('body is not json', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.put('/json', expectJson, (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).put('/json').send('test=4').expect(HTTP_STATUS.BAD_REQUEST);
});
