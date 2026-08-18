import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { API_ERROR, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { initializeServer } from './_helper';

const TARBALL_DATA =
  'H4sIAAAAAAAAE+2W32vbMBDH85y/QnjQp9qxLEeBMsbGlocNBmN7bFdQ5WuqxJaEpGQdo//79KPeQsnI' +
  'w5KUDX/9IOvurLuz/DHSjK/YAiY6jcXSKjk6sMqypHWNdtmD6hlBI0wqQmo8nVbVqMR4OsNoVB66kF1a' +
  'W8eML+Vv10m9oF/jP6IfY4QyyTrILlD2eqkcm+gVzpdrJrPz4NuAsULJ4MZFWdBkbcByI7R79CRjx0Sc' +
  'CdnAvf+SkjUFWu8IubzBgXUhDPidQlfZ3BhlLpBUKDiQ1cDFrYDmKkNnZwjuhUM4808+xNVW8P2bMk1Y' +
  '7vJrtLC1u1MmLPjBF40+Cc4ahV6GDmI/DWygVRpMwVX3KtXUCg7Sxp7ff3nbt6TBFy65gK1iffsN41yo' +
  'EHtdFbOiisWMH8bPvXUH0SP3k+KG3UBr+DFy7OGfEJr4x5iWVeS/pLQe+D+FIv/agIWI6GX66kFuIhT+' +
  '1gDjrp/4d7WAvAwEJPh0u14IufWkM0zaW2W6nLfM2lybgJ4LTJ0/jWiAK8OcMjt8MW3OlfQppcuhhQ6k' +
  '+2OgkK2Q8DssFPi/IHpU9fz3/+xj5NjDf8QFE39VmE4JDfzPCBn4P4X6/f88f/Pu47zomiPk2Lv/dOv8' +
  'h+P/34/D/p9CL+Kp67mrGDRo0KBBp9ZPsETQegASAAA=+2W32vbMBDH85y';

function publishVersion(app: any, pkgName: string, version: string): supertest.Test {
  return supertest(app)
    .put(`/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(
      JSON.stringify({
        _id: pkgName,
        name: pkgName,
        'dist-tags': { latest: version },
        versions: {
          [version]: {
            name: pkgName,
            version,
            dist: {
              shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
              tarball: `http://localhost:5555/${pkgName}/-/${pkgName}-${version}.tgz`,
            },
          },
        },
        _attachments: {
          [`${pkgName}-${version}.tgz`]: {
            content_type: HEADERS.OCTET_STREAM,
            data: TARBALL_DATA,
            length: 512,
          },
        },
      })
    )
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
    .expect(HTTP_STATUS.CREATED);
}

beforeAll(async () => {
  await setup({});
});

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

  test('should access protected package routes with web ui token', async () => {
    const app = await initializeServer('protected-package.yaml');
    const api = supertest(app);

    await api
      .put('/-/user/org.couchdb.user:test')
      .send({
        name: 'test',
        password: 'test',
      })
      .expect(HTTP_STATUS.CREATED);

    const loginRes = await api
      .post('/-/verdaccio/sec/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(
        JSON.stringify({
          username: 'test',
          password: 'test',
        })
      )
      .expect(HTTP_STATUS.OK);

    await publishVersion(app, 'foo', '1.0.0');

    await api
      .get('/foo/-/foo-1.0.0.tgz')
      .set(HEADERS.AUTHORIZATION, `Bearer ${loginRes.body.token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
      .expect(HTTP_STATUS.OK);

    await api
      .get('/foo')
      .set(HEADERS.AUTHORIZATION, `Bearer ${loginRes.body.token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
  });
});

describe('middleware plugins jwt order', () => {
  test('should expose anonymous remote_user to middleware plugins', async () => {
    const app = await initializeServer('middleware-plugin.yaml');
    const response = await supertest(app)
      .get('/-/remote-user-probe')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body.hasRemoteUser).toBe(true);
    // anonymous request: no username but the default anonymous groups are present
    expect(response.body.name).toBeNull();
    expect(response.body.groups).toContain('$all');
    expect(response.body.groups).toContain('$anonymous');
  });
});
