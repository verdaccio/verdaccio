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

test('packages with version/scope', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  // @ts-ignore
  app.get('/:package/:version?', (req, res) => {
    const { package: pkg, version } = req.params;
    res.status(HTTP_STATUS.OK).json({ package: pkg, version });
  });

  const res = await request(app).get('/foo');
  expect(res.body).toEqual({ package: 'foo' });
  expect(res.status).toEqual(HTTP_STATUS.OK);

  const res2 = await request(app).get('/foo/1.0.0');
  expect(res2.body).toEqual({ package: 'foo', version: '1.0.0' });
  expect(res2.status).toEqual(HTTP_STATUS.OK);

  const res3 = await request(app).get('/@scope/foo');
  expect(res3.body).toEqual({ package: '@scope/foo' });
  expect(res3.status).toEqual(HTTP_STATUS.OK);

  const res4 = await request(app).get('/@scope/foo/1.0.0');
  expect(res4.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
  expect(res4.status).toEqual(HTTP_STATUS.OK);

  const res5 = await request(app).get('/@scope%2ffoo');
  expect(res5.body).toEqual({ package: '@scope/foo' });
  expect(res5.status).toEqual(HTTP_STATUS.OK);

  const res6 = await request(app).get('/@scope%2ffoo/1.0.0');
  expect(res6.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
  expect(res6.status).toEqual(HTTP_STATUS.OK);

  const res7 = await request(app).get('/%40scope%2ffoo');
  expect(res7.body).toEqual({ package: '@scope/foo' });
  expect(res7.status).toEqual(HTTP_STATUS.OK);

  const res8 = await request(app).get('/%40scope%2ffoo/1.0.0');
  expect(res8.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
  expect(res8.status).toEqual(HTTP_STATUS.OK);

  const res9 = await request(app).get('/%40scope/foo');
  expect(res9.body).toEqual({ package: '@scope/foo' });
  expect(res9.status).toEqual(HTTP_STATUS.OK);

  const res10 = await request(app).get('/%40scope/foo/1.0.0');
  expect(res10.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
  expect(res10.status).toEqual(HTTP_STATUS.OK);
});

test('tarballs with and without scope', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  // @ts-ignore
  app.get('/:package/-/:filename', (req, res) => {
    const { package: pkg, filename } = req.params;
    res.status(HTTP_STATUS.OK).json({ package: pkg, filename });
  });

  const res = await request(app).get('/foo/-/foo-1.2.3.tgz');
  expect(res.body).toEqual({ package: 'foo', filename: 'foo-1.2.3.tgz' });
  expect(res.status).toEqual(HTTP_STATUS.OK);

  const res2 = await request(app).get('/@scope/foo/-/foo-1.2.3.tgz');
  expect(res2.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
  expect(res2.status).toEqual(HTTP_STATUS.OK);

  const res3 = await request(app).get('/@scope%2ffoo/-/foo-1.2.3.tgz');
  expect(res3.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
  expect(res3.status).toEqual(HTTP_STATUS.OK);

  const res4 = await request(app).get('/%40scope%2ffoo/-/foo-1.2.3.tgz');
  expect(res4.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
  expect(res4.status).toEqual(HTTP_STATUS.OK);

  const res5 = await request(app).get('/%40scope/foo/-/foo-1.2.3.tgz');
  expect(res5.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
  expect(res5.status).toEqual(HTTP_STATUS.OK);
});
