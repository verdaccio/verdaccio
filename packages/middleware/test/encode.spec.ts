import request from 'supertest';
import { describe, expect, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { encodeScopePackage } from '../src';
import { getApp } from './helper';

test('encode is json with relative path', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(HTTP_STATUS.OK).json({ id });
  });

  const res = await request(app).get('/@scope/foo');
  expect(res.body).toEqual({ id: '@scope/foo' });
  expect(res.status).toEqual(HTTP_STATUS.OK);
});

describe('packages requests', () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  app.get('/:package/:version?', (req, res) => {
    const { package: pkg, version } = req.params;
    res.status(HTTP_STATUS.OK).json({ package: pkg, version });
  });

  test('just package', async () => {
    const res = await request(app).get('/foo');
    expect(res.body).toEqual({ package: 'foo' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('package with version', async () => {
    const res = await request(app).get('/foo/1.0.0');
    expect(res.body).toEqual({ package: 'foo', version: '1.0.0' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package', async () => {
    const res = await request(app).get('/@scope/foo');
    expect(res.body).toEqual({ package: '@scope/foo' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with version', async () => {
    const res = await request(app).get('/@scope/foo/1.0.0');
    expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded path', async () => {
    const res = await request(app).get('/@scope%2ffoo');
    expect(res.body).toEqual({ package: '@scope/foo' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package and version with encoded path', async () => {
    const res = await request(app).get('/@scope%2ffoo/1.0.0');
    expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @ and path', async () => {
    const res = await request(app).get('/%40scope%2ffoo');
    expect(res.body).toEqual({ package: '@scope/foo' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package and version with encoded @ and path', async () => {
    const res = await request(app).get('/%40scope%2ffoo/1.0.0');
    expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @', async () => {
    const res = await request(app).get('/%40scope/foo');
    expect(res.body).toEqual({ package: '@scope/foo' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package and version with encoded @', async () => {
    const res = await request(app).get('/%40scope/foo/1.0.0');
    expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });
});

describe('tarball requests', () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  app.get('/:package/-/:filename', (req, res) => {
    const { package: pkg, filename } = req.params;
    res.status(HTTP_STATUS.OK).json({ package: pkg, filename });
  });

  test('just package', async () => {
    const res = await request(app).get('/foo/-/foo-1.2.3.tgz');
    expect(res.body).toEqual({ package: 'foo', filename: 'foo-1.2.3.tgz' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package', async () => {
    const res = await request(app).get('/@scope/foo/-/foo-1.2.3.tgz');
    expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded path', async () => {
    const res = await request(app).get('/@scope%2ffoo/-/foo-1.2.3.tgz');
    expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @ and path', async () => {
    const res = await request(app).get('/%40scope%2ffoo/-/foo-1.2.3.tgz');
    expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @', async () => {
    const res = await request(app).get('/%40scope/foo/-/foo-1.2.3.tgz');
    expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });
});

describe('dist-tags requests', () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  app.get('/-/package/:package/dist-tags/:tag', (req, res) => {
    const { package: pkg, tag } = req.params;
    res.status(HTTP_STATUS.OK).json({ package: pkg, tag });
  });

  test('just package', async () => {
    const res = await request(app).get('/-/package/foo/dist-tags/latest');
    expect(res.body).toEqual({ package: 'foo', tag: 'latest' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package', async () => {
    const res = await request(app).get('/-/package/@scope/foo/dist-tags/latest');
    expect(res.body).toEqual({ package: '@scope/foo', tag: 'latest' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded path', async () => {
    const res = await request(app).get('/-/package/@scope%2ffoo/dist-tags/latest');
    expect(res.body).toEqual({ package: '@scope/foo', tag: 'latest' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @ and path', async () => {
    const res = await request(app).get('/-/package/%40scope%2ffoo/dist-tags/latest');
    expect(res.body).toEqual({ package: '@scope/foo', tag: 'latest' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });

  test('scoped package with encoded @', async () => {
    const res = await request(app).get('/-/package/%40scope/foo/dist-tags/latest');
    expect(res.body).toEqual({ package: '@scope/foo', tag: 'latest' });
    expect(res.status).toEqual(HTTP_STATUS.OK);
  });
});
