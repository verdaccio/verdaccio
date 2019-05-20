import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import configDefault from '../../partials/config';
import publishMetadata from '../../partials/publish-api';
import starMetadata from '../../partials/star-api';
import endPointAPI from '../../../../src/api';

import {HEADERS, API_ERROR, HTTP_STATUS, HEADER_TYPE, API_MESSAGE, TOKEN_BEARER} from '../../../../src/lib/constants';
import {mockServer} from '../../__helper/mock';
import {DOMAIN_SERVERS} from '../../../functional/config.functional';
import {buildToken} from '../../../../src/lib/utils';
import {getNewToken} from '../../__helper/api';

require('../../../../src/lib/logger').setup([]);
const credentials = { name: 'jota', password: 'secretPass' };

const putPackage = (app, name, publishMetadata) => {
  return request(app)
    .put(name)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(publishMetadata))
    .expect(HTTP_STATUS.CREATED)
    .set('accept', 'gzip')
    .set('accept-encoding', HEADERS.JSON)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
}

describe('endpoint unit test', () => {
  let app;
  let mockRegistry;

  beforeAll(function(done) {
    const store = path.join(__dirname, '../../partials/store/test-storage-api-spec');
    const mockServerPort = 55549;
    rimraf(store, async () => {
      const configForTest = configDefault({
        auth: {
          htpasswd: {
            file: './test-storage-api-spec/.htpasswd'
          }
        },
        filters: {
          '../../modules/api/partials/plugin/filter': {
            pkg: 'npm_test',
            version: '2.0.0'
          }
        },
        storage: store,
        self_path: store,
        uplinks: {
          npmjs: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`
          }
        }
      }, 'api.spec.yaml');

      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function(done) {
    mockRegistry[0].stop();
    done();
  });

  describe('Registry API Endpoints', () => {

    describe('should test ping api', () => {
     test('should test endpoint /-/ping', (done) => {
        request(app)
          .get('/-/ping')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });

    describe('should test whoami api', () => {
      test('should test referer /whoami endpoint', (done) => {
        request(app)
          .get('/whoami')
          .set('referer', 'whoami')
          .expect(HTTP_STATUS.OK)
          .end(done);
      });

      test('should test no referer /whoami endpoint', (done) => {
        request(app)
          .get('/whoami')
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(done);
      });

      test('should test /-/whoami endpoint', (done) => {
        request(app)
          .get('/-/whoami')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err) {
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
          .end(function(err) {
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
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/authorization required to access package auth-package/);
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package bad JWT Bearer format', (done) => {
          request(app)
            .get('/auth-package')
            .set(HEADERS.AUTHORIZATION, TOKEN_BEARER)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/authorization required to access package auth-package/);
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package well JWT Bearer', (done) => {
          request(app)
            .get('/auth-package')
            .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, '12345'))
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/authorization required to access package auth-package/);
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
          .end(function(err, res) {
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
              .end(function(err, res) {
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
          .end(function(err, res) {
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
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            expect(res.body.error).toBeDefined();
            //FIXME: message is not 100% accurate
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
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
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
          .end(function(err, res) {
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
          .end(function(err, res) {
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

      test('should fetch jquery package from remote uplink', (done) => {

        request(app)
          .get('/jquery')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err, res) {
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
          .end(function(err, res) {
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
          .end(function(err, res) {
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
          .end(function(err) {
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
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      test('be able to filter packages', (done) => {
        request(app)
          .get('/npm_test')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err, res) {
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
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      });

      test('should forbid access to remote package', (done) => {

        request(app)
          .get('/forbidden-place')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.UNAUTHORIZED)
          .end(function(err) {
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
          .end(function(err, res) {
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
          .end(function(err, res) {
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
          .end(function(err) {
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
        'beta': '3.0.0',
        'jota': '1.6.3'
      };

      test('should set a new tag on jquery', (done) => {
        putPackage(app, '/jquery/verdaccio-tag', jqueryVersion)
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
          //.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
        const now = Date.now()
        const cacheTime = now - 6000000;
        request(app)
          .get('/-/all/since?stale=update_after&startkey=' + cacheTime)
          // .set('accept-encoding', HEADERS.JSON)
          // .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          //.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err) {
            if (err) {
              expect.toBeNull();
              return done(err);
            }
            //TODO: we have to catch the stream check whether it returns something
            // we should not spend much time on this api since is deprecated somehow.
            done();
          });
      });

    });

    describe('should test publish/unpublish api', () => {
      test('should publish a new package with no credentials', (done) => {
        request(app)
          .put('/@scope%2fpk1-test')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .send(JSON.stringify(publishMetadata))
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
              return done(err);
            }
            expect(res.body.ok).toBeDefined();
            expect(res.body.success).toBeDefined();
            expect(res.body.success).toBeTruthy();
            expect(res.body.ok).toMatch(API_MESSAGE.PKG_CREATED);
            done();
          });
      });

      describe('should test star and stars api', () => {
        test('should star a package', (done) => {
          request(app)
            .put('/@scope%2fpk1-test')
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .send(JSON.stringify({
              ...starMetadata,
              users: {
                [credentials.name]: true
              }
            }))
            .expect(HTTP_STATUS.OK)
            .end(function(err, res) {
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
            .put('/@scope%2fpk1-test')
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .send(JSON.stringify(starMetadata))
            .expect(HTTP_STATUS.OK)
            .end(function(err, res) {
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
          const credentials = { name: 'star_user', password: 'secretPass' };
          const token = await getNewToken(request(app), credentials);
          request(app)
            .put('/@scope%2fpk1-test')
            .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
            .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .send(JSON.stringify({
              ...starMetadata,
              users: {
                [credentials.name]: true
              }
            }))
            .expect(HTTP_STATUS.OK).end(function(err) {
              if (err) {
                expect(err).toBeNull();
                return done(err);
              }
              request(app)
                .get('/-/_view/starredByUser')
                .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
                .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
                .send(JSON.stringify({
                  key: [credentials.name]
                }))
                .expect(HTTP_STATUS.OK)
                .end(function(err, res) {
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



      test('should unpublish a new package with credentials', async (done) => {

        const credentials = { name: 'jota_unpublish', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        //FUTURE: for some reason it does not remove the scope folder
        request(app)
          .del('/@scope%2fpk1-test/-rev/4-6abcdb4efd41a576')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
              return done(err);
            }
            expect(res.body.ok).toBeDefined();
            expect(res.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
            done();
          });
      });

      test('should fail due non-unpublish nobody can unpublish', async (done) => {
        const credentials = { name: 'jota_unpublish_fail', password: 'secretPass' };
        const token = await getNewToken(request(app), credentials);
        request(app)
          .del('/non-unpublish/-rev/4-6abcdb4efd41a576')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .expect(HTTP_STATUS.FORBIDDEN)
          .end(function(err, res) {
            expect(err).toBeNull();
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toMatch(/user jota_unpublish_fail is not allowed to unpublish package non-unpublish/);
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
          .send(JSON.stringify(_.assign({}, publishMetadata, {
            name: 'super-admin-can-unpublish'
          })))
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
              .end(function(err, res) {
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
          .send(JSON.stringify(_.assign({}, publishMetadata, {
            name: 'all-can-unpublish'
          })))
          .expect(HTTP_STATUS.CREATED)
          .end(function(err, res) {
            if (err) {
              expect.toBeNull();
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
              .end(function(err, res) {
                expect(err).toBeNull();
                expect(res.body.ok).toBeDefined();
                expect(res.body.ok).toMatch(API_MESSAGE.PKG_REMOVED);
                done();
              });
          });
      });
    });
  });
});
