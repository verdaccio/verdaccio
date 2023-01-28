import supertest from 'supertest';

import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { initializeServer, publishVersion } from './_helper';

describe('package', () => {
  describe('get tarball', () => {
    let app;
    beforeEach(async () => {
      app = await initializeServer('package.yaml');
    });

    test.each([
      ['foo', 'foo-1.0.0.tgz'],
      ['@scope/foo', 'foo-1.0.0.tgz'],
    ])('should return a file tarball', async (pkg, fileName) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${pkg}/-/${fileName}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
        .expect(HTTP_STATUS.OK);
      expect(Buffer.from(response.body).toString('utf8')).toBeDefined();
    });

    test.each([
      ['foo', 'foo-1.0.0.tgz'],
      ['@scope/foo', 'foo-1.0.0.tgz'],
    ])('should fails if tarball does not exist', async (pkg, fileName) => {
      await publishVersion(app, pkg, '1.0.1');
      return await supertest(app)
        .get(`/${pkg}/-/${fileName}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
        .expect(HTTP_STATUS.NOT_FOUND);
    });
    test.todo('check content length file header');
    test.todo('fails on file was aborted');
  });

  describe('get package', () => {
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
          .set(HEADERS.ACCEPT, 'application/vnd.npm.install-v1+json')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_INSTALL_CHARSET)
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
});
