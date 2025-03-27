import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { API_ERROR, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { initializeServer } from './_helper';

setup({});

describe('server api', () => {
  test('should request any package', async () => {
    const app = await initializeServer('conf.yaml');
    await supertest(app)
      .get('/jquery')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('should able to catch non defined routes with 404', async () => {
    const app = await initializeServer('conf.yaml');
    await supertest(app)
      .get('/-/this-does-not-exist-anywhere')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('should return index page if web is enabled', async () => {
    const app = await initializeServer('conf.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch('<title>verdaccio</title>');
  });

  test('should define rate limit headers', async () => {
    const app = await initializeServer('conf.yaml');
    await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HEADERS.RATELIMIT_LIMIT, '10000')
      .expect(HEADERS.RATELIMIT_REMAINING, '9999')
      .expect(HTTP_STATUS.OK);
  });

  test('should contains cors headers', async () => {
    const app = await initializeServer('conf.yaml');
    await supertest(app).get('/').expect('access-control-allow-origin', '*').expect(HTTP_STATUS.OK);
  });

  test('should contains etag', async () => {
    const app = await initializeServer('conf.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HTTP_STATUS.OK);
    const etag = response.get(HEADERS.ETAG);
    expect(typeof etag === 'string').toBeTruthy();
  });

  test('should be hidden by default', async () => {
    const app = await initializeServer('conf.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HTTP_STATUS.OK);
    const powered = response.get(HEADERS.POWERED_BY);
    expect(powered).toMatch('hidden');
  }, 40000);

  test('should not contains powered header', async () => {
    const app = await initializeServer('powered-disabled.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HTTP_STATUS.OK);
    const powered = response.get(HEADERS.POWERED_BY);
    expect(powered).toEqual('hidden');
  });

  test('should contains custom powered header', async () => {
    const app = await initializeServer('powered-custom.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HTTP_STATUS.OK);
    const powered = response.get(HEADERS.POWERED_BY);
    expect(powered).toEqual('custom user agent');
  });

  test('should return 404 if web is disabled', async () => {
    const app = await initializeServer('web-disabled.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.NOT_FOUND);
    expect(response.body.error).toEqual(API_ERROR.WEB_DISABLED);
  });

  test('should return homepage if web is enabled', async () => {
    const app = await initializeServer('web-enabled.yaml');
    const response = await supertest(app)
      .get('/')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toContain('<title>verdaccio</title>');
  });

  test('should not display debug hook disabled by default', async () => {
    const app = await initializeServer('no_debug.yaml');
    await supertest(app)
      .get('/-/_debug')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  test('should  display debug hook if directly enabled', async () => {
    const app = await initializeServer('conf.yaml');
    const res = await supertest(app)
      .get('/-/_debug')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(res.body.pid).toEqual(process.pid);
    expect(res.body.mem).toBeDefined();
  });
});
