import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { encodeScopePackage } from '../src';
import { getApp } from './helper';

test('encode is json', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  // @ts-ignore
  app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(HTTP_STATUS.OK).json({ id });
  });

  const res = await request(app).get('/@scope/foo');
  expect(res.body).toEqual({ id: '@scope/foo' });
  expect(res.status).toEqual(HTTP_STATUS.OK);
});
