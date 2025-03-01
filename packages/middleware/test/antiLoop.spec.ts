import request from 'supertest';
import { test } from 'vitest';

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

test('should detect loop with protocol name in via header', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/sec').set('via', 'HTTP/1.1 1').expect(HTTP_STATUS.LOOP_DETECTED);
});

test('should detect loop with comment in via header', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/sec').set('via', '1.1 1 (Verdaccio)').expect(HTTP_STATUS.LOOP_DETECTED);
});

test('should detect loop in multiple via entries', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app)
    .get('/sec')
    .set('via', '1.1 server-a, 1.1 1, 1.1 server-b')
    .expect(HTTP_STATUS.LOOP_DETECTED);
});

test('should handle malformed via header gracefully', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app).get('/sec').set('via', 'malformed-header').expect(HTTP_STATUS.OK);
});

test('should handle via header with unexpected format', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(antiLoop({ server_id: '1' }));
  app.get('/sec', (req, res) => {
    res.status(HTTP_STATUS.OK).json({});
  });

  return request(app)
    .get('/sec')
    .set('via', 'unexpected format that does not match regex')
    .expect(HTTP_STATUS.OK);
});
