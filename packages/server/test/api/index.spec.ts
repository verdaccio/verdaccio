import path from 'path';
import request from 'supertest';
import _ from 'lodash';

import {
  HEADERS,
  HTTP_STATUS,
  HEADER_TYPE,
  API_MESSAGE,
  TOKEN_BEARER,
} from '@verdaccio/commons-api';
import { buildToken, encodeScopedUri } from '@verdaccio/utils';
import { setup, logger } from '@verdaccio/logger';

import { mockServer } from '@verdaccio/mock';

import {
  configExample,
  DOMAIN_SERVERS,
  getNewToken,
  getPackage,
  putPackage,
  generateRamdonStorage,
  verifyPackageVersionDoesExist,
  generateUnPublishURI,
} from '@verdaccio/mock';

import endPointAPI from '../../src';
import publishMetadata from './helpers/publish-api';
import {
  generateDeprecateMetadata,
  generatePackageMetadata,
  generatePackageUnpublish,
  generateStarMedatada,
  generateVersion,
} from './helpers/utils';

setup([]);

const credentials = { name: 'server_user_api_spec', password: 'secretPass' };

const putVersion = (app, name, publishMetadata) => {
  return request(app)
    .put(name)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(publishMetadata))
    .expect(HTTP_STATUS.CREATED)
    .set('accept', 'gzip')
    .set('accept-encoding', HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
};

describe('endpoint unit test', () => {
  let app;
  let mockRegistry;

  beforeAll(async function (done) {
    const store = generateRamdonStorage();
    const mockServerPort = 55549;
    const configForTest = configExample(
      {
        filters: {
          [path.join(__dirname, './plugin/filter')]: {
            pkg: 'npm_test',
            version: '2.0.0',
          },
        },
        storage: store,
        config_path: store,
        uplinks: {
          npmjs: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          },
        },
      },
      'api.spec.yaml',
      __dirname
    );

    app = await endPointAPI(configForTest);
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
    done();
  });

  afterAll(function (done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

    done();
  });

  describe('Registry API Endpoints', () => {
    describe('should test user api', () => {
      describe('should test authorization headers with tokens only errors', () => {
        test('should fails on protected endpoint /-/auth-package bad format', (done) => {
          request(app)
            .get('/auth-package')
            .set(HEADERS.AUTHORIZATION, 'FakeHader')
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function (err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(
                /authorization required to access package auth-package/
              );
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package bad JWT Bearer format', (done) => {
          request(app)
            .get('/auth-package')
            .set(HEADERS.AUTHORIZATION, TOKEN_BEARER)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function (err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(
                /authorization required to access package auth-package/
              );
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package well JWT Bearer', (done) => {
          request(app)
            .get('/auth-package')
            .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, '12345'))
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function (err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(
                /authorization required to access package auth-package/
              );
              done();
            });
        });
      });

      test('should test add a new user', (done) => {
        request(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send(credentials)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body.ok).toBeDefined();
            expect(res.body.token).toBeDefined();
            const token = res.body.token;
            expect(typeof token).toBe('string');
            expect(res.body.ok).toMatch(`user '${credentials.name}' created`);

            // testing JWT auth headers with token
            // we need it here, because token is required
            request(app)
              .get('/vue')
              .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
              .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
              .expect(HTTP_STATUS.OK)
              .end(function (err, res) {
                expect(err).toBeNull();
                expect(res.body).toBeDefined();
                expect(res.body.name).toMatch(/vue/);
                done();
              });
          });
      });
    });

    describe('should test package api', () => {
      // The current behaviour depends of what's defined in the following configuration file.
      // test/unit/partials/config/yaml/api.spec.yaml
      // 'jquery':
      //   access: $all
      //   publish: $all
      //   proxy: npmjs

      test('should fetch jquery package from remote uplink', (done) => {
        request(app)
          .get('/jquery')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).toBeDefined();
            expect(res.body.name).toMatch(/jquery/);
            done();
          });
      });

      test('should fetch jquery specific version package from remote uplink', (done) => {
        request(app)
          .get('/jquery/1.5.1')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).toBeDefined();
            expect(res.body.name).toMatch(/jquery/);
            done();
          });
      });

      test('should fetch jquery specific tag package from remote uplink', (done) => {
        request(app)
          .get('/jquery/latest')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).toBeDefined();
            expect(res.body.name).toMatch(/jquery/);
            done();
          });
      });

      test('should fails on fetch jquery specific tag package from remote uplink', (done) => {
        request(app)
          .get('/jquery/never-will-exist-this-tag')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      test('should not found a unexisting remote package under scope', (done) => {
        request(app)
          .get('/@verdaccio/not-found')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      describe('testing filters', () => {
        test('be able to filter packages', (done) => {
          request(app)
            .get('/npm_test')
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              // Filter out 2.0.0
              expect(Object.keys(res.body.versions)).toEqual(['1.0.0']);
              done();
            });
        });

        test('should not found when a filter fails', (done) => {
          request(app)
            // Filter errors look like other uplink errors
            .get('/trigger-filter-failure')
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HTTP_STATUS.NOT_FOUND)
            .end(function (err) {
              if (err) {
                return done(err);
              }
              done();
            });
        });
      });

      test('should forbid access to remote package', (done) => {
        request(app)
          .get('/forbidden-place')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      test('should fetch a tarball from remote uplink', (done) => {
        request(app)
          .get('/jquery/-/jquery-1.5.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).toBeDefined();
            done();
          });
      });

      test('should fetch a scoped tarball from remote uplink', (done) => {
        request(app)
          .get('/@jquery/jquery/-/@jquery/jquery-1.5.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body).toBeDefined();
            done();
          });
      });

      test('should fails fetch a tarball from remote uplink', (done) => {
        request(app)
          .get('/jquery/-/jquery-not-found-tarball-0.0.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(function (err) {
            if (err) {
              expect(err).not.toBeNull();
              return done(err);
            }

            done();
          });
      });
    });

    describe('should test dist-tag api', () => {
      const jqueryVersion = '2.1.2';
      const jqueryUpdatedVersion = {
        beta: '3.0.0',
        jota: '1.6.3',
      };

      test('should set a new tag on jquery', (done) => {
        putVersion(app, '/jquery/verdaccio-tag', jqueryVersion)
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }

            expect(res.body.ok).toBeDefined();
            expect(res.body.ok).toMatch(/package tagged/);
            done();
          });
      });

      test('should fetch all tag for jquery', (done) => {
        request(app)
          .get('/-/package/jquery/dist-tags')
          .set('accept-encoding', HEADERS.JSON)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }

            expect(res.body).toBeDefined();
            expect(res.body['verdaccio-tag']).toMatch(jqueryVersion);
            done();
          });
      });

      test('should update a new tag on jquery', (done) => {
        request(app)
          .post('/-/package/jquery/dist-tags')
          .send(JSON.stringify(jqueryUpdatedVersion))
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }

            expect(res.body.ok).toBeDefined();
            expect(res.body.ok).toMatch(API_MESSAGE.TAG_UPDATED);
            done();
          });
      });

      test('should fetch all tags for jquery and ccheck previous update', (done) => {
        request(app)
          .get('/-/package/jquery/dist-tags')
          .set('accept-encoding', HEADERS.JSON)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }

            expect(res.body).toBeDefined();
            expect(res.body['beta']).toMatch(jqueryUpdatedVersion['beta']);
            done();
          });
      });

      test('should set a remove a tag on jquery', (done) => {
        request(app)
          .del('/-/package/jquery/dist-tags/verdaccio-tag')
          .set('accept-encoding', HEADERS.JSON)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          // .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }

            expect(res.body.ok).toBeDefined();
            expect(res.body.ok).toMatch(API_MESSAGE.TAG_REMOVED);
            done();
          });
      });
    });

    describe('should test search api', () => {
      test('should perform a search', (done) => {
        const now = Date.now();
        const cacheTime = now - 6000000;
        request(app)
          .get('/-/all/since?stale=update_after&startkey=' + cacheTime)
          // .set('accept-encoding', HEADERS.JSON)
          // .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            // TODO: we have to catch the stream check whether it returns something
            // we should not spend much time on this api since is deprecated somehow.
            done();
          });
      });
    });

    describe('should test publish/unpublish api', () => {
      /**
       * It publish 2 versions and unpublish the latest one, then verifies
       * the version do not exist anymore in the body of the metadata.
       */
      const runPublishUnPublishFlow = async (pkgName: string, done, token?: string) => {
        const version = '2.0.0';
        const pkg = generatePackageMetadata(pkgName, version);

        const [err] = await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        if (err) {
          expect(err).toBeNull();
          return done(err);
        }

        const newVersion = '2.0.1';
        const [newErr] = await putPackage(
          request(app),
          `/${encodeScopedUri(pkgName)}`,
          generatePackageMetadata(pkgName, newVersion),
          token
        );
        if (newErr) {
          expect(newErr).toBeNull();
          return done(newErr);
        }

        const deletePayload = generatePackageUnpublish(pkgName, ['2.0.0']);
        const [err2, res2] = await putPackage(
          request(app),
          generateUnPublishURI(pkgName),
          deletePayload,
          token
        );

        expect(err2).toBeNull();
        expect(res2.body.ok).toMatch(API_MESSAGE.PKG_CHANGED);

        const existVersion = await verifyPackageVersionDoesExist(app, pkgName, newVersion, token);
        expect(existVersion).toBeTruthy();

        return done();
      };

      describe('un/publish scenarios with credentials', () => {
        test('should flow with no credentials', async (done) => {
          const pkgName = '@public-anyone-can-publish/pk1-test';
          runPublishUnPublishFlow(pkgName, done, undefined);
        });

        test('should flow with credentials', async (done) => {
          const credentials = { name: 'jota_unpublish', password: 'secretPass' };
          const token = await getNewToken(request(app), credentials);
          const pkgName = '@only-one-can-publish/pk1-test';

          runPublishUnPublishFlow(pkgName, done, token);
        });
      });

      describe('test error handling', () => {
        test('should fail if user is not allowed to unpublish', async (done) => {
          /**
           * Context:
           *
           *  'non-unpublish':
           *    access: $authenticated
           *    publish: jota_unpublish_fail
           *    # There is some conditions to keep on mind here
           *    # - If unpublish is empty, fallback with the publish value
           *    # - If the user has permissions to publish and this empty it will
           *    #   be allowed to unpublish
           *    # - If we want to forbid anyone to unpublish, just write here any non-existing user
           *    unpublish: none
           *
           *   The result of this test should fail and even if jota_unpublish_fail is
           *   allowed to publish.
           *
           */
          const credentials = { name: 'jota_unpublish_fail', password: 'secretPass' };
          const pkgName = 'non-unpublish';
          const newVersion = '1.0.0';
          const token = await getNewToken(request(app), credentials);

          const [newErr] = await putPackage(
            request(app),
            `/${encodeScopedUri(pkgName)}`,
            generatePackageMetadata(pkgName, newVersion),
            token
          );
          if (newErr) {
            expect(newErr).toBeNull();
            return done(newErr);
          }

          const deletePayload = generatePackageUnpublish(pkgName, ['2.0.0']);
          const [err2, res2] = await putPackage(
            request(app),
            generateUnPublishURI(pkgName),
            deletePayload,
            token
          );

          expect(err2).not.toBeNull();
          expect(res2.body.error).toMatch(
            /user jota_unpublish_fail is not allowed to unpublish package non-unpublish/
          );
          done();
        });

        test('should fail if publish prop is not defined', async (done) => {
          /**
           * Context:
           *
           *   'non-unpublish':
           access: $authenticated
           publish: jota_unpublish_fail
           # There is some conditions to keep on mind here
           # - If unpublish is empty, fallback with the publish value
           # - If the user has permissions to publish and this empty it will be allowed to unpublish
           # - If we want to forbid anyone to unpublish,  just write here any non-existing user
           unpublish: none

           The result of this test should fail and even if jota_unpublish_fail is allowed
           to publish.

           *
           */
          const credentials = { name: 'jota_only_unpublish_fail', password: 'secretPass' };
          const pkgName = 'only-unpublish';
          const newVersion = '1.0.0';
          const token = await getNewToken(request(app), credentials);

          const [newErr, resp] = await putPackage(
            request(app),
            `/${encodeScopedUri(pkgName)}`,
            generatePackageMetadata(pkgName, newVersion),
            token
          );

          expect(newErr).not.toBeNull();
          expect(resp.body.error).toMatch(
            /user jota_only_unpublish_fail is not allowed to publish package only-unpublish/
          );
          done();
        });
      });

      test('should be able to publish/unpublish by only super_admin user', async (done) => {
        const credentials = { name: 'super_admin', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        request(app)
          .put('/super-admin-can-unpublish')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .send(
            JSON.stringify(
              _.assign({}, publishMetadata, {
                name: 'super-admin-can-unpublish',
              })
            )
          )
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            expect(res.body.ok).toBeDefined();
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBeTruthy();
            expect(res.body.ok).toMatch(API_MESSAGE.PKG_CREATED);
            request(app)
              .del('/super-admin-can-unpublish/-rev/4-6abcdb4efd41a576')
              .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
              .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
              .expect(HTTP_STATUS.CREATED)
              .end(function (err, res) {
                expect(err).toBeNull();
                expect(res.body.ok).toBeDefined();
                expect(res.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
                done();
              });
          });
      });

      test('should be able to publish/unpublish by any user', async (done) => {
        const credentials = { name: 'any_user', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        request(app)
          .put('/all-can-unpublish')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .send(
            JSON.stringify(
              _.assign({}, publishMetadata, {
                name: 'all-can-unpublish',
              })
            )
          )
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            expect(res.body.ok).toBeDefined();
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBeTruthy();
            expect(res.body.ok).toMatch(API_MESSAGE.PKG_CREATED);
            request(app)
              .del('/all-can-unpublish/-rev/4-6abcdb4efd41a576')
              .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
              .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
              .expect(HTTP_STATUS.CREATED)
              .end(function (err, res) {
                expect(err).toBeNull();
                expect(res.body.ok).toBeDefined();
                expect(res.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
                done();
              });
          });
      });
    });

    describe('should test star and stars api', () => {
      const pkgName = '@scope/starPackage';
      const credentials = { name: 'jota_star', password: 'secretPass' };
      let token = '';
      beforeAll(async (done) => {
        token = await getNewToken(request(app), credentials);
        await putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName), token);
        done();
      });

      test('should star a package', (done) => {
        request(app)
          .put(`/${pkgName}`)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .send(
            JSON.stringify(
              generateStarMedatada(pkgName, {
                [credentials.name]: true,
              })
            )
          )
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBeTruthy();
            done();
          });
      });

      test('should unstar a package', (done) => {
        request(app)
          .put(`/${pkgName}`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .send(JSON.stringify(generateStarMedatada(pkgName, {})))
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBeTruthy();
            done();
          });
      });

      test('should retrieve stars list with credentials', async (done) => {
        request(app)
          .put(`/${pkgName}`)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .send(generateStarMedatada(pkgName, { [credentials.name]: true }))
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              expect(err).toBeNull();
              return done(err);
            }
            request(app)
              .get('/-/_view/starredByUser')
              .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
              .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
              .send(
                JSON.stringify({
                  key: [credentials.name],
                })
              )
              .expect(HTTP_STATUS.OK)
              .end(function (err, res) {
                if (err) {
                  expect(err).toBeNull();
                  return done(err);
                }
                expect(res.body.rows).toBeDefined();
                expect(res.body.rows).toHaveLength(1);
                done();
              });
          });
      });
    });

    describe('should test (un)deprecate api', () => {
      const pkgName = '@scope/deprecate';
      const credentials = { name: 'jota_deprecate', password: 'secretPass' };
      const version = '1.0.0';
      let token = '';
      beforeAll(async (done) => {
        token = await getNewToken(request(app), credentials);
        await putPackage(
          request(app),
          `/${pkgName}`,
          generatePackageMetadata(pkgName, version),
          token
        );
        done();
      });

      test('should deprecate a package', async (done) => {
        const pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
        const [err] = await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        if (err) {
          expect(err).toBeNull();
          return done(err);
        }
        const [, res] = await getPackage(request(app), '', pkgName);
        expect(res.body.versions[version].deprecated).toEqual('get deprecated');
        done();
      });

      test('should undeprecate a package', async (done) => {
        let pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
        await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        pkg = generateDeprecateMetadata(pkgName, version, '');
        const [err] = await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        if (err) {
          expect(err).toBeNull();
          return done(err);
        }
        const [, res] = await getPackage(request(app), '', pkgName);
        expect(res.body.versions[version].deprecated).not.toBeDefined();
        done();
      });

      test(
        'should require both publish and unpublish access to ' + '(un)deprecate a package',
        async () => {
          let credentials = { name: 'only_publish', password: 'secretPass' };
          let token = await getNewToken(request(app), credentials);
          const pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
          const [err, res] = await putPackage(
            request(app),
            `/${encodeScopedUri(pkgName)}`,
            pkg,
            token
          );
          expect(err).not.toBeNull();
          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(
            /user only_publish is not allowed to unpublish package @scope\/deprecate/
          );
          credentials = { name: 'only_unpublish', password: 'secretPass' };
          token = await getNewToken(request(app), credentials);
          const [err2, res2] = await putPackage(
            request(app),
            `/${encodeScopedUri(pkgName)}`,
            pkg,
            token
          );
          expect(err2).not.toBeNull();
          expect(res2.body.error).toBeDefined();
          expect(res2.body.error).toMatch(
            /user only_unpublish is not allowed to publish package @scope\/deprecate/
          );
        }
      );

      test('should deprecate multiple packages', async (done) => {
        await putPackage(
          request(app),
          `/${pkgName}`,
          generatePackageMetadata(pkgName, '1.0.1'),
          token
        );
        const pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
        pkg.versions['1.0.1'] = {
          ...generateVersion(pkgName, '1.0.1'),
          deprecated: 'get deprecated',
        };
        await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        const [, res] = await getPackage(request(app), '', pkgName);
        expect(res.body.versions[version].deprecated).toEqual('get deprecated');
        expect(res.body.versions['1.0.1'].deprecated).toEqual('get deprecated');
        done();
      });
    });
  });
});
