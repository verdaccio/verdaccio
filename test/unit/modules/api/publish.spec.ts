import nock from 'nock';
import { basename } from 'path';
import supertest from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';
import { API_ERROR, API_MESSAGE, HEADERS, HEADER_TYPE } from '@verdaccio/core';

import { generatePackageMetadata } from '../../../helpers/generatePackageMetadata';
import { generateRemotePackageMetadata } from '../../../helpers/generateRemotePackageMetadata';
import { getPackage, initializeServer, publishVersion } from './_helper';

describe('publish', () => {
  describe('handle errors', () => {
    const pkgName = 'test';
    const pkgMetadata = generatePackageMetadata(pkgName, '1.0.0');
    // TODO: validation not implemented yet (v6)
    test.skip('should fail on publish a bad _attachments package', async () => {
      const app = await initializeServer('publish.yaml');
      const response = await supertest(app)
        .put(`/${encodeURIComponent(pkgName)}`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(
          JSON.stringify(
            Object.assign({}, pkgMetadata, {
              _attachments: {},
            })
          )
        )
        .set('accept', HEADERS.GZIP)
        .expect(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.error).toEqual(API_ERROR.UNSUPORTED_REGISTRY_CALL);
    });

    test('should fail on publish a bad versions package', async () => {
      const app = await initializeServer('publish.yaml');
      return new Promise((resolve) => {
        supertest(app)
          .put(`/${encodeURIComponent(pkgName)}`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .send(
            JSON.stringify(
              Object.assign({}, pkgMetadata, {
                versions: '',
              })
            )
          )
          .set('accept', HEADERS.GZIP)
          .expect(HTTP_STATUS.BAD_REQUEST)
          .then((response) => {
            expect(response.body.error).toEqual(API_ERROR.UNSUPORTED_REGISTRY_CALL);
            resolve(response);
          });
      });
    });

    test.each([['foo', '@scope/foo']])(
      'should fails on publish a duplicated package',
      async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        await publishVersion(app, pkgName, '1.0.0');
        return new Promise((resolve) => {
          publishVersion(app, pkgName, '1.0.0')
            .expect(HTTP_STATUS.CONFLICT)
            .then((response) => {
              expect(response.body.error).toEqual(API_ERROR.PACKAGE_EXIST);
              resolve(response);
            });
        });
      }
    );
  });

  describe('publish a package', () => {
    describe('no proxies setup', () => {
      test.each([['foo', '@scope/foo']])('should publish a package', async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        return new Promise((resolve) => {
          publishVersion(app, pkgName, '1.0.0')
            .expect(HTTP_STATUS.CREATED)
            .then((response) => {
              expect(response.body.ok).toEqual(API_MESSAGE.PKG_CREATED);
              resolve(response);
            });
        });
      });

      test.each([['foo', '@scope/foo']])('should publish a new package', async (pkgName) => {
        const pkgMetadata = generatePackageMetadata(pkgName, '1.0.0');
        const app = await initializeServer('publish.yaml');
        return new Promise((resolve) => {
          supertest(app)
            .put(`/${encodeURIComponent(pkgName)}`)
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .send(JSON.stringify(Object.assign({}, pkgMetadata)))
            .set('accept', HEADERS.GZIP)
            .expect(HTTP_STATUS.CREATED)
            .then((response) => {
              expect(response.body.ok).toEqual(API_MESSAGE.PKG_CREATED);
              resolve(response);
            });
        });
      });

      test('should publish a new package with no readme', async () => {
        const pkgName = 'test';
        const pkgMetadata = generatePackageMetadata(pkgName, '1.0.0');
        const app = await initializeServer('publish.yaml');
        return new Promise((resolve) => {
          supertest(app)
            .put(`/${encodeURIComponent(pkgName)}`)
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .send(
              JSON.stringify(
                Object.assign({}, pkgMetadata, {
                  versions: {
                    ['1.0.0']: {
                      readme: null,
                    },
                  },
                })
              )
            )
            .set('accept', HEADERS.GZIP)
            .expect(HTTP_STATUS.CREATED)
            .then((response) => {
              expect(response.body.ok).toEqual(API_MESSAGE.PKG_CREATED);
              resolve(response);
            });
        });
      });
    });

    describe('proxies setup', () => {
      test.each([['foo', '@scope%2Ffoo']])(
        'should publish a a patch package that already exist on a remote',
        async (pkgName) => {
          const upstreamManifest = generateRemotePackageMetadata(
            pkgName,
            '1.0.0',
            'https://registry.npmjs.org',
            ['1.0.1', '1.0.2', '1.0.3']
          );
          nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(200, upstreamManifest);
          const app = await initializeServer('publish-proxy.yaml');
          const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
          expect(manifest.body.name).toEqual(decodeURIComponent(pkgName));
          const response = await publishVersion(
            app,
            decodeURIComponent(pkgName),
            '1.0.1-patch'
          ).expect(HTTP_STATUS.CREATED);
          expect(response.body.ok).toEqual(API_MESSAGE.PKG_CREATED);
          const response2 = await publishVersion(
            app,
            decodeURIComponent(pkgName),
            '1.0.2-patch'
          ).expect(HTTP_STATUS.CREATED);
          expect(response2.body.ok).toEqual(API_MESSAGE.PKG_CREATED);
        }
      );
    });
  });

  describe('unpublish a package', () => {
    test.each([['foo', '@scope/foo']])('should unpublish entirely a package', async (pkgName) => {
      const app = await initializeServer('publish.yaml');
      await publishVersion(app, pkgName, '1.0.0');
      const response = await supertest(app)
        // FIXME: should be filtered by revision to avoid
        // conflicts
        .delete(`/${encodeURIComponent(pkgName)}/-rev/xxx`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CREATED);
      expect(response.body.ok).toEqual(API_MESSAGE.PKG_REMOVED);
      // package should be completely un published
      await supertest(app)
        .get(`/${pkgName}`)
        .set('Accept', HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.NOT_FOUND);
    });

    test.each([['foo', '@scope/foo']])(
      'should fails unpublish entirely a package',
      async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        const response = await supertest(app)
          .delete(`/${encodeURIComponent(pkgName)}/-rev/1cf3-fe3`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toEqual(API_ERROR.NO_PACKAGE);
      }
    );

    test.each([['foo', '@scope/foo']])(
      'should fails remove a tarball of a package does not exist',
      async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        const response = await supertest(app)
          .delete(`/${pkgName}/-/${basename(pkgName)}-1.0.3.tgz/-rev/revision`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toEqual(API_ERROR.NO_PACKAGE);
      }
    );

    test.each([['foo', '@scope/foo']])(
      'should fails on try remove a tarball does not exist',
      async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        await publishVersion(app, pkgName, '1.0.0');
        const response = await supertest(app)
          .delete(`/${pkgName}/-/${basename(pkgName)}-1.0.3.tgz/-rev/revision`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.NOT_FOUND);
        expect(response.body.error).toEqual(API_ERROR.NO_SUCH_FILE);
      }
    );

    test.each([['foo', '@scope/foo']])(
      'should remove a tarball that does exist',
      async (pkgName) => {
        const app = await initializeServer('publish.yaml');
        await publishVersion(app, pkgName, '1.0.0');
        const response = await supertest(app)
          .delete(`/${pkgName}/-/${basename(pkgName)}-1.0.0.tgz/-rev/revision`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.CREATED);
        expect(response.body.ok).toEqual(API_MESSAGE.TARBALL_REMOVED);
      }
    );
  });
});
