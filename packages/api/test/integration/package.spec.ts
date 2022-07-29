import supertest from 'supertest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { initializeServer, publishVersion } from './_helper';

describe('package', () => {
  let app;
  beforeEach(async () => {
    app = await initializeServer('package.yaml');
  });

  test.each([['foo'], ['@scope/foo']])('should return a foo private package', async (pkg) => {
    await publishVersion(app, pkg, '1.0.0');
    const response = await supertest(app)
      .get(`/${pkg}`)
      .set(HEADERS.ACCEPT, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body.name).toEqual(pkg);
  });

  test.each([['foo'], ['@scope/foo']])(
    'should return a foo private package by version',
    async (pkg) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${pkg}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toEqual(pkg);
    }
  );

  test.each([['foo'], ['@scope/foo']])(
    'should return a foo private package by version',
    async (pkg) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${pkg}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toEqual(pkg);
    }
  );
});
