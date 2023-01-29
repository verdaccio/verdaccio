import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { antiLoop } from '../src';
import { getApp } from './helper';

test('should not be a loop', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/sec').set('via', 'Server 2').expect(HTTP_STATUS.OK);
});

test('should be a loop', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app)
    .get('/sec')
    .set('via', 'Server 1, Server 2')
    .expect(HTTP_STATUS.LOOP_DETECTED);
});
