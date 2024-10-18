/* eslint-disable no-console */
import request from 'supertest';
import { describe, expect, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { encodeScopePackage } from '../src';
import { getApp } from './helper';

const testHosts = [
  'localhost:4873', // with port
  'myregistry.com', // no port
  '42.42.42.42', // ip
  '[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443', // ip6
];

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

  test('just package', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/foo').set('host', host);
      expect(res.body).toEqual({ package: 'foo' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('package with version', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/foo/1.0.0').set('host', host);
      expect(res.body).toEqual({ package: 'foo', version: '1.0.0' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope/foo').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with version', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope/foo/1.0.0').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded path', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope%2ffoo').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package and version with encoded path', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope%2ffoo/1.0.0').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded @ and path ', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope%2ffoo').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package and version with encoded @ and path', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope%2ffoo/1.0.0').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded @', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope/foo').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package and version with encoded @', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope/foo/1.0.0').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', version: '1.0.0' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
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

  test('just package', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/foo/-/foo-1.2.3.tgz').set('host', host);
      expect(res.body).toEqual({ package: 'foo', filename: 'foo-1.2.3.tgz' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope/foo/-/foo-1.2.3.tgz').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded path', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/@scope%2ffoo/-/foo-1.2.3.tgz').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded @ and path', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope%2ffoo/-/foo-1.2.3.tgz').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });

  test('scoped package with encoded @', () => {
    testHosts.forEach(async (host) => {
      const res = await request(app).get('/%40scope/foo/-/foo-1.2.3.tgz').set('host', host);
      expect(res.body).toEqual({ package: '@scope/foo', filename: 'foo-1.2.3.tgz' });
      expect(res.status).toEqual(HTTP_STATUS.OK);
    });
  });
});

test('invalid url', async () => {
  const app = getApp([]);
  // @ts-ignore
  app.use(encodeScopePackage);
  app.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(HTTP_STATUS.OK).json({ id });
  });

  const res = await request(app).get('/foo').set('host', 'invalid::host');
  expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST);
  expect(res.text).toContain('Invalid URL');
});
