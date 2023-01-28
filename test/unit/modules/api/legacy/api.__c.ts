import _ from 'lodash';
import nock from 'nock';
import path from 'path';
import rimraf from 'rimraf';
import { Readable } from 'stream';
import request from 'supertest';

import endPointAPI from '../../../../../src/api';
import {
  API_ERROR,
  API_MESSAGE,
  DIST_TAGS,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
} from '../../../../../src/lib/constants';
import { buildToken, encodeScopedUri } from '../../../../../src/lib/utils';
import { DOMAIN_SERVERS } from '../../../../functional/config.functional';
import {
  generateUnPublishURI,
  getNewToken,
  getPackage,
  putPackage,
  verifyPackageVersionDoesExist,
} from '../../../__helper/api';
import { mockServer } from '../../../__helper/mock';
import {
  generateDeprecateMetadata,
  generatePackageMetadata,
  generatePackageUnpublish,
  generateStarMedatada,
  generateVersion,
} from '../../../__helper/utils';
import configDefault from '../../../partials/config';
import publishMetadata from '../../../partials/publish-api';

const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

require('../../../../../src/lib/logger').setup({ type: 'stdout', format: 'pretty', level: 'warn' });

const credentials = { name: 'jota', password: 'secretPass' };

jest.setTimeout(10000);

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
  const mockServerPort = 55549;
  let mockRegistry;

  beforeAll(function (done) {
    const store = path.join(__dirname, '../../partials/store/test-storage-api-spec');
    rimraf(store, async () => {
      const configForTest = configDefault(
        {
          auth: {
            htpasswd: {
              file: './test-storage-api-spec/.htpasswd',
            },
          },
          filters: {
            '../../modules/api/partials/plugin/filter': {
              pkg: 'npm_test',
              version: '2.0.0',
            },
          },
          storage: store,
          self_path: store,
          uplinks: {
            npmjs: {
              url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
            },
            socketTimeout: {
              url: `http://some.registry.timeout.com`,
              max_fails: 2,
              timeout: '1s',
              fail_timeout: '1s',
            },
          },
          logs: [{ type: 'stdout', format: 'pretty', level: 'warn' }],
        },
        'api.spec.yaml'
      );

      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function (done) {
    mockRegistry[0].stop();
    done();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Registry API Endpoints', () => {
    describe('should test ping api', () => {
      test('should test endpoint /-/ping', (done) => {
        request(app)
          .get('/-/ping')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });

    describe('should test whoami api', () => {
      test('should test referer /whoami endpoint', (done) => {
        request(app).get('/whoami').set('referer', 'whoami').expect(HTTP_STATUS.OK).end(done);
      });

      test('should test no referer /whoami endpoint', (done) => {
        request(app).get('/whoami').expect(HTTP_STATUS.NOT_FOUND).end(done);
      });

      test('should test /-/whoami endpoint', (done) => {
        request(app)
          .get('/-/whoami')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      test('should test /whoami endpoint', (done) => {
        request(app)
          .get('/-/whoami')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });

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
            expect(res.get(HEADERS.CACHE_CONTROL)).toEqual('no-cache, no-store');
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

      test('should test fails add a new user with missing name', (done) => {
        const credentialsShort = _.cloneDeep(credentials);
        delete credentialsShort.name;

        request(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send(credentialsShort)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body.error).toBeDefined();
            expect(res.body.error).toMatch(API_ERROR.USERNAME_PASSWORD_REQUIRED);
            done();
          });
      });

      test('should test fails add a new user with missing password', (done) => {
        const credentialsShort = _.cloneDeep(credentials);
        delete credentialsShort.password;

        request(app)
          .put(`/-/user/org.couchdb.user:${credentials.name}`)
          .send(credentialsShort)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.BAD_REQUEST)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body.error).toBeDefined();
            // FIXME: message is not 100% accurate
            /* eslint new-cap: 0 */
            expect(res.body.error).toMatch(API_ERROR.PASSWORD_SHORT());
            done();
          });
      });

      test('should test add a new user with login', (done) => {
        const newCredentials = _.cloneDeep(credentials);
        newCredentials.name = 'jotaNew';

        request(app)
          .put('/-/user/org.couchdb.user:jotaNew')
          .send(newCredentials)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CREATED)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.get(HEADERS.CACHE_CONTROL)).toEqual('no-cache, no-store');
            expect(res.body).toBeTruthy();
            done();
          });
      });

      test('should test fails on add a existing user with login', (done) => {
        request(app)
          .put('/-/user/org.couchdb.user:jotaNew')
          .send(credentials)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CONFLICT)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toMatch(API_ERROR.USERNAME_ALREADY_REGISTERED);
            done();
          });
      });

      test('should test fails add a new user with wrong password', (done) => {
        const credentialsShort = _.cloneDeep(credentials);
        credentialsShort.password = 'failPassword';

        request(app)
          .put('/-/user/org.couchdb.user:jota')
          .send(credentialsShort)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body.error).toBeDefined();
            expect(res.body.error).toMatch(/unauthorized/);
            done();
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

      test.each([
        'application/json; q=1.0, application/vnd.npm.install-v1+json; q=0.9, */*',
        'application/json; q=1.0; q=1.0, */*',
        'application/json',
      ])(
        'should not fetch abbreviated jquery package from remote uplink with %s',
        (accept, done: any) => {
          request(app)
            .get('/jquery')
            .set('accept', accept)
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP)
            .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              const manifest = res.body;
              expect(manifest).toBeDefined();
              expect(manifest.name).toMatch(/jquery/);
              expect(manifest.readme).toBeDefined();
              done();
            });
        }
      );

      test.each([
        'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
        'application/vnd.npm.install-v1+json; q=1.0, */*',
        'application/vnd.npm.install-v1+json',
      ])(
        'should fetch abbreviated jquery package from remote uplink with %s',
        (accept, done: any) => {
          request(app)
            .get('/jquery')
            .set('accept', accept)
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP)
            .expect(HEADERS.CONTENT_TYPE, 'application/vnd.npm.install-v1+json; charset=utf-8')
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              const manifest = res.body;
              expect(manifest).toBeDefined();
              expect(manifest.name).toMatch(/jquery/);
              expect(manifest.description).not.toBeDefined();
              expect(manifest.readme).not.toBeDefined();
              expect(manifest[DIST_TAGS]).toBeDefined();
              expect(manifest.modified).toBeDefined();
              expect(Object.keys(manifest.versions)).toHaveLength(48);
              // NOTE: special case for pnpm https://github.com/pnpm/rfcs/pull/2
              expect(Object.keys(manifest.time)).toHaveLength(51);
              done();
            });
        }
      );

      test.each([
        'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
        'application/vnd.npm.install-v1+json; q=1.0, */*',
        'application/vnd.npm.install-v1+json',
      ])(
        'should fetch abbreviated puppeteer package from remote uplink with %s',
        (accept, done: any) => {
          request(app)
            .get('/puppeteer')
            .set('accept', accept)
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .expect(HEADER_TYPE.CONTENT_ENCODING, HEADERS.GZIP)
            .expect(HEADERS.CONTENT_TYPE, 'application/vnd.npm.install-v1+json; charset=utf-8')
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              const manifest = res.body;
              expect(manifest).toBeDefined();
              expect(manifest.name).toMatch(/puppeteer/);
              expect(manifest.versions['19.2.2'].hasInstallScript).toBeTruthy();
              done();
            });
        }
      );

      test('should fails with socket time out fetch tarball timeout package from remote uplink', async () => {
        const timeOutPkg = generatePackageMetadata('timeout', '1.5.1');
        const responseText = 'fooooooooooooooooo';
        const readable = Readable.from([responseText]);
        timeOutPkg.versions['1.5.1'].dist.tarball =
          'http://some.registry.timeout.com/timeout/-/timeout-1.5.1.tgz';
        nock('http://some.registry.timeout.com').get('/timeout').reply(200, timeOutPkg);
        nock('http://some.registry.timeout.com')
          .get('/timeout/-/timeout-1.5.1.tgz')
          .twice()
          .socketDelay(50000)
          .reply(200);
        nock('http://some.registry.timeout.com')
          .get('/timeout/-/timeout-1.5.1.tgz')
          .reply(200, () => readable);
        const agent = request.agent(app);
        await agent
          .get('/timeout/-/timeout-1.5.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.INTERNAL_ERROR);
        await agent
          .get('/timeout/-/timeout-1.5.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.INTERNAL_ERROR);
        await sleep(2000);
        // await agent
        await agent
          .get('/timeout/-/timeout-1.5.1.tgz')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
          .expect(HTTP_STATUS.OK);
      }, 10000);

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
        test('should flow with no credentials', async () => {
          const pkgName = '@public-anyone-can-publish/pk1-test';
          return new Promise((resolve) => {
            runPublishUnPublishFlow(pkgName, resolve, undefined);
          });
        });

        test('should flow with credentials', async () => {
          const credentials = { name: 'jota_unpublish', password: 'secretPass' };
          const token = await getNewToken(request(app), credentials);
          const pkgName = '@only-one-can-publish/pk1-test';
          return new Promise((resolve) => {
            runPublishUnPublishFlow(pkgName, resolve, token);
          });
        });
      });

      describe('test error handling', () => {
        test('should fail if user is not allowed to unpublish', async () => {
          /**
           * Context:
           *
           *   'non-unpublish':
                 access: $authenticated
                 publish: jota_unpublish_fail
                 # There is some conditions to keep on mind here
                 # - If unpublish is empty, fallback with the publish value
                 # - If the user has permissions to publish and this empty it will be allowed to unpublish
                 # - If we want to forbid anyone to unpublish,  just write here any unexisting user
                 unpublish: none

              The result of this test should fail and even if jota_unpublish_fail is allowed to publish.

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
          expect(newErr).toBeNull();

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
        });

        test('should fail if publish prop is not defined', async () => {
          /**
           * Context:
           *
           *   'non-unpublish':
           access: $authenticated
           publish: jota_unpublish_fail
           # There is some conditions to keep on mind here
           # - If unpublish is empty, fallback with the publish value
           # - If the user has permissions to publish and this empty it will be allowed to unpublish
           # - If we want to forbid anyone to unpublish,  just write here any unexisting user
           unpublish: none

           The result of this test should fail and even if jota_unpublish_fail is allowed to publish.

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
        });
      });

      test('should be able to publish/unpublish by only super_admin user', async () => {
        const credentials = { name: 'super_admin', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        const res = await request(app)
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
          .expect(HTTP_STATUS.CREATED);
        expect(res.body.ok).toBeDefined();
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBeTruthy();
        expect(res.body.ok).toMatch(API_MESSAGE.PKG_CREATED);
        const res2 = await request(app)
          .del('/super-admin-can-unpublish/-rev/4-6abcdb4efd41a576')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .expect(HTTP_STATUS.CREATED);
        expect(res2.body.ok).toBeDefined();
        expect(res2.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
      });

      test('should be able to publish/unpublish by any user', async () => {
        const credentials = { name: 'any_user', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        const res = await request(app)
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
          .expect(HTTP_STATUS.CREATED);
        expect(res.body.ok).toBeDefined();
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBeTruthy();
        expect(res.body.ok).toMatch(API_MESSAGE.PKG_CREATED);
        const res2 = await request(app)
          .del('/all-can-unpublish/-rev/4-6abcdb4efd41a576')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .expect(HTTP_STATUS.CREATED);
        expect(res2.body.ok).toBeDefined();
        expect(res2.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
      });
    });

    describe('should test star and stars api', () => {
      const pkgName = '@scope/starPackage';
      const credentials = { name: 'jota_star', password: 'secretPass' };
      let token = '';
      beforeAll(async () => {
        token = await getNewToken(request(app), credentials);
        await putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName), token);
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

      test('should unstar a package', async () => {
        const res = await request(app)
          .put(`/${pkgName}`)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .send(JSON.stringify(generateStarMedatada(pkgName, {})))
          .expect(HTTP_STATUS.OK);
        expect(res.body.success).toBeDefined();
        expect(res.body.success).toBeTruthy();
      });

      test('should retrieve stars list with credentials', (done) => {
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

    describe('should test tarball url redirect', () => {
      const pkgName = 'testTarballPackage';
      const scopedPkgName = '@tarball_tester/testTarballPackage';
      const tarballUrlRedirectCredentials = { name: 'tarball_tester', password: 'secretPass' };
      const store = path.join(__dirname, '../../partials/store/test-storage-api-spec');
      const mockServerPort = 55549;
      const baseTestConfig = configDefault(
        {
          auth: {
            htpasswd: {
              file: './test-storage-api-spec/.htpasswd',
            },
          },
          filters: {
            '../../modules/api/partials/plugin/filter': {
              pkg: 'npm_test',
              version: '2.0.0',
            },
          },
          storage: store,
          self_path: store,
          uplinks: {
            npmjs: {
              url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
            },
          },
          logs: [{ type: 'stdout', format: 'pretty', level: 'warn' }],
        },
        'api.spec.yaml'
      );
      let token;
      beforeAll(async () => {
        token = await getNewToken(request(app), tarballUrlRedirectCredentials);
        await putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName), token);
        await putPackage(
          request(app),
          `/${scopedPkgName}`,
          generatePackageMetadata(scopedPkgName),
          token
        );
      });

      describe('for a string value of tarball_url_redirect', () => {
        let app2;
        beforeAll(async () => {
          app2 = await endPointAPI({
            ...baseTestConfig,
            experiments: {
              tarball_url_redirect:
                'https://myapp.sfo1.mycdn.com/verdaccio/${packageName}/${filename}',
            },
          });
        });

        test('should redirect for package tarball', (done) => {
          request(app2)
            .get('/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
            .expect(HTTP_STATUS.REDIRECT)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              expect(res.headers.location).toEqual(
                'https://myapp.sfo1.mycdn.com/verdaccio/testTarballPackage/testTarballPackage-1.0.0.tgz'
              );
              done();
            });
        });

        test('should redirect for scoped package tarball', (done) => {
          request(app2)
            .get('/@tarball_tester/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
            .expect(HTTP_STATUS.REDIRECT)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              expect(res.headers.location).toEqual(
                'https://myapp.sfo1.mycdn.com/verdaccio/@tarball_tester/testTarballPackage/testTarballPackage-1.0.0.tgz'
              );
              done();
            });
        });
      });

      describe('for a function value of tarball_url_redirect', () => {
        let app2;
        beforeAll(async () => {
          app2 = await endPointAPI({
            ...baseTestConfig,
            experiments: {
              tarball_url_redirect(context) {
                return `https://myapp.sfo1.mycdn.com/verdaccio/${context.packageName}/${context.filename}`;
              },
            },
          });
        });

        test('should redirect for package tarball', (done) => {
          request(app2)
            .get('/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
            .expect(HTTP_STATUS.REDIRECT)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              expect(res.headers.location).toEqual(
                'https://myapp.sfo1.mycdn.com/verdaccio/testTarballPackage/testTarballPackage-1.0.0.tgz'
              );
              done();
            });
        });

        test('should redirect for scoped package tarball', (done) => {
          request(app2)
            .get('/@tarball_tester/testTarballPackage/-/testTarballPackage-1.0.0.tgz')
            .expect(HTTP_STATUS.REDIRECT)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              expect(res.headers.location).toEqual(
                'https://myapp.sfo1.mycdn.com/verdaccio/@tarball_tester/testTarballPackage/testTarballPackage-1.0.0.tgz'
              );
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
      beforeAll(async () => {
        token = await getNewToken(request(app), credentials);
        await putPackage(
          request(app),
          `/${pkgName}`,
          generatePackageMetadata(pkgName, version),
          token
        );
      });

      test('should deprecate a package', async () => {
        const pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
        const [err] = await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        expect(err).toBeNull();
        const [, res] = await getPackage(request(app), '', pkgName);
        expect(res.body.versions[version].deprecated).toEqual('get deprecated');
      });

      test('should undeprecate a package', async () => {
        let pkg = generateDeprecateMetadata(pkgName, version, 'get deprecated');
        await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        pkg = generateDeprecateMetadata(pkgName, version, '');
        const [err] = await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);
        expect(err).toBeNull();
        const [, res] = await getPackage(request(app), '', pkgName);
        expect(res.body.versions[version].deprecated).not.toBeDefined();
      });

      test('should require both publish and unpublish access to (un)deprecate a package', async () => {
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
      });

      test('should deprecate multiple packages', async () => {
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
      });

      test('should deprecate when publish new version with deprecate field', async () => {
        await Promise.all([
          putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName, '2.0.0'), token),
          putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName, '2.0.1'), token),
          putPackage(request(app), `/${pkgName}`, generatePackageMetadata(pkgName, '2.0.2'), token),
        ]);

        const pkg = generatePackageMetadata(pkgName, '2.0.3');
        pkg.versions['2.0.3'].deprecated = 'get deprecated';
        await putPackage(request(app), `/${encodeScopedUri(pkgName)}`, pkg, token);

        const [, res] = await getPackage(request(app), '', pkgName);
        const versions = Object.keys(res.body.versions);

        expect(res.body.versions['2.0.3'].deprecated).toEqual('get deprecated');
        expect(versions).toContain('2.0.0');
        expect(versions).toContain('2.0.1');
        expect(versions).toContain('2.0.2');
        expect(versions).toContain('2.0.3');
      });
    });
  });
});
