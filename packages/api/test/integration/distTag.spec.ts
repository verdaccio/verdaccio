import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { API_MESSAGE, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { getDisTags, initializeServer, publishVersion } from './_helper';

setup({});

describe('package', () => {
  let app;
  beforeEach(async () => {
    app = await initializeServer('distTag.yaml');
  });

  test.each([['foo'], ['@scope/foo']])('should display dist-tag (npm dist-tag ls)', async (pkg) => {
    await publishVersion(app, pkg, '1.0.0');
    await publishVersion(app, pkg, '1.0.1');
    const response = await getDisTags(app, pkg);
    expect(response.body).toEqual({ latest: '1.0.1' });
  });

  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should add a version to a tag (npm dist-tag add)', async (pkg, path) => {
    await publishVersion(app, pkg, '1.0.0');
    await publishVersion(app, pkg, '1.0.1');

    const response = await supertest(app)
      .put(`/${path}/test`)
      .set(HEADERS.ACCEPT, HEADERS.GZIP)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify('1.0.1'))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED);
    expect(response.body.ok).toEqual(API_MESSAGE.TAG_ADDED);
    const response2 = await getDisTags(app, pkg);
    expect(response2.body).toEqual({ latest: '1.0.1', test: '1.0.1' });
  });

  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should fails if  a version is missing (npm dist-tag add)', async (pkg, path) => {
    await publishVersion(app, pkg, '1.0.0');
    await publishVersion(app, pkg, '1.0.1');

    await supertest(app)
      .put(`/${path}/test`)
      .set(HEADERS.ACCEPT, HEADERS.GZIP)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify({}))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST);
  });

  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should delete a previous added tag (npm dist-tag rm)', async (pkg, path) => {
    await publishVersion(app, pkg, '1.0.0');
    await publishVersion(app, pkg, '1.0.1');

    const response = await supertest(app)
      .put(`/${path}/beta`)
      .set(HEADERS.ACCEPT, HEADERS.GZIP)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify('1.0.1'))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED);
    expect(response.body.ok).toEqual(API_MESSAGE.TAG_ADDED);

    const response2 = await getDisTags(app, pkg);
    expect(response2.body).toEqual({ latest: '1.0.1', beta: '1.0.1' });

    const response3 = await supertest(app)
      .delete(`/-/package/${path}/dist-tags/beta`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED);
    expect(response3.body.ok).toEqual(API_MESSAGE.TAG_REMOVED);

    const response4 = await getDisTags(app, pkg);
    expect(response4.body).toEqual({ latest: '1.0.1' });
  });
});
