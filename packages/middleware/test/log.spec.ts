import path from 'path';
import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { log } from '../src';
import { getApp } from './helper';

setup({
  type: 'file',
  path: path.join(__dirname, './verdaccio.log'),
  level: 'trace',
  format: 'json',
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
