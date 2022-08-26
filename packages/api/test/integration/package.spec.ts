import supertest from 'supertest';

import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';

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

  test.each([['foo-abbreviated'], ['@scope/foo-abbreviated']])(
    'should return abbreviated local manifest',
    async (pkg) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${pkg}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADERS.ACCEPT, Storage.ABBREVIATED_HEADER)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toEqual(pkg);
      expect(response.body.time).toBeDefined();
      expect(response.body.modified).toBeDefined();
      expect(response.body[DIST_TAGS]).toEqual({ latest: '1.0.0' });
      expect(response.body.readme).not.toBeDefined();
      expect(response.body._rev).not.toBeDefined();
      expect(response.body.users).not.toBeDefined();
    }
  );
});
