import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import nock from 'nock';
import supertest from 'supertest';

import { API_ERROR } from '@verdaccio/commons-api';
import Proxy, { RemoteMetadata } from '../src/proxy';
import { prepareApp } from './helper/app';

const streamPipeline = promisify(pipeline);

beforeEach(() => {
  nock.cleanAll();
});

const domainTest = 'https://registry.verdaccio.org';

jest.setTimeout(100000);

test('fails on missing configuration', async () => {
  nock(domainTest)
    .get('/node-fetch')
    .reply(200, JSON.stringify({ name: 'node-fetch' }), { etag: '12345' });

  expect(() => {
    // @ts-expect-error
    new Proxy();
  }).toThrow();
});

test('metadata with 200', async () => {
  nock(domainTest)
    .get('/node-fetch')
    .reply(200, JSON.stringify({ name: 'node-fetch' }), { etag: '12345' });

  const proxy = new Proxy({
    url: domainTest,
  });

  const response = await proxy.getRemoteMetadata('node-fetch');
  const { body, etag } = response as RemoteMetadata;
  expect(etag).toEqual('12345');
  expect(body).toEqual({
    name: 'node-fetch',
  });
});

test('metadata not found', async () => {
  nock(domainTest).get('/node-fetch').reply(404);

  const proxy = new Proxy({
    url: domainTest,
  });

  await expect(proxy.getRemoteMetadata('node-fetch')).rejects.toThrow(API_ERROR.NOT_PACKAGE_UPLINK);
});

test('error on fetch metadata with 501', async () => {
  nock(domainTest).get('/501').times(10).reply(501);

  const proxy = new Proxy({
    url: domainTest,
  });

  await expect(proxy.getRemoteMetadata('501')).rejects.toThrow(`${API_ERROR.BAD_STATUS_CODE}: 501`);
});

test('fetch successfully a tarball', async () => {
  const responseText = 'input string';
  const tarball = 'node-fetch-3.0.0-beta.1.tgz';
  const filePath = `/node-fetch/-/${tarball}`;
  const readable = Readable.from([responseText]);
  const distUrl = `${domainTest}${filePath}`;
  nock(domainTest)
    .get(filePath)
    .reply(200, () => {
      return readable;
    });

  const app = prepareApp(async (req, res, next) => {
    try {
      const proxy = new Proxy({
        url: domainTest,
      });
      const streamTarball = await proxy.fetchTarball(distUrl);
      await streamPipeline(streamTarball, res);
      return next();
    } catch (error) {
      res.status(501);
      next();
    }
  });

  return supertest(app)
    .get('/tarball')
    .expect(200)
    .then((response) => {
      expect(response.text).toEqual(responseText);
    });
});

test('tarball not found', async () => {
  const tarball = 'node-fetch-3.0.0-beta.1.tgz';
  const filePath = `/node-fetch/-/${tarball}`;
  const distUrl = `${domainTest}${filePath}`;
  nock(domainTest).get(filePath).times(5).reply(404);

  const app = prepareApp(async (req, res, next) => {
    try {
      const proxy = new Proxy({
        url: domainTest,
      });
      const streamTarball = await proxy.fetchTarball(distUrl);
      await streamPipeline(streamTarball, res);
      return next();
    } catch (error) {
      res.status(error.code);
      return next();
    }
  });

  return supertest(app).get('/tarball').expect(404);
});

test('tarball fails on retrieve tarball', async () => {
  const tarball = 'node-fetch-3.0.0-beta.1.tgz';
  const filePath = `/node-fetch/-/${tarball}`;
  const distUrl = `${domainTest}${filePath}`;
  nock(domainTest).get(filePath).times(10).reply(500);
  const proxy = new Proxy({
    url: domainTest,
  });
  await expect(proxy.fetchTarball(distUrl)).rejects.toThrow(`${API_ERROR.BAD_STATUS_CODE}: 500`);
});
