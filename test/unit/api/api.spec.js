import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import configDefault from '../partials/config/index';
import publishMetadata from '../partials/publish-api';
import Config from '../../../src/lib/config';
import endPointAPI from '../../../src/api/index';

import { HEADERS, API_ERROR, HTTP_STATUS, HEADER_TYPE, API_MESSAGE} from '../../../src/lib/constants';
import {mockServer} from './mock';
import {DOMAIN_SERVERS} from '../../functional/config.functional';

require('../../../src/lib/logger').setup([]);
const credentials = { name: 'jota', password: 'secretPass' };

describe('endpoint unit test', () => {
  let config;
  let app;
  let mockRegistry;

  beforeAll(function(done) {
    const store = path.join(__dirname, '../partials/store/test-storage');
    const mockServerPort = 55549;
    rimraf(store, async () => {
      const configForTest = _.clone(configDefault);
      configForTest.auth = {
        htpasswd: {
          file: './test-storage/.htpasswd'
        }
      };
      configForTest.uplinks = {
        npmjs: {
          url: `http://${DOMAIN_SERVERS}:${mockServerPort}`
        }
      };
      configForTest.self_path = store;
      config = new Config(configForTest);
      app = await endPointAPI(config);
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
      test('should test /-/whoami endpoint', (done) => {
        request(app)
          .get('/-/whoami')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK)
          .end(function(err, res) {
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
          .end(function(err, res) {
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
            .set('authorization', 'FakeHader')
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/unregistered users are not allowed to access package auth-package/);
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package bad JWT Bearer format', (done) => {
          request(app)
            .get('/auth-package')
            .set('authorization', 'Bearer')
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/unregistered users are not allowed to access package auth-package/);
              done();
            });
        });

        test('should fails on protected endpoint /-/auth-package well JWT Bearer', (done) => {
          request(app)
            .get('/auth-package')
            .set('authorization', 'Bearer 12345')
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
            .expect(HTTP_STATUS.FORBIDDEN)
            .end(function(err, res) {
              expect(res.body.error).toBeDefined();
              expect(res.body.error).toMatch(/unregistered users are not allowed to access package auth-package/);
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
              .set('authorization', `Bearer ${token}`)
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

        const credentialsShort = _.clone(credentials);
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

        const credentialsShort = _.clone(credentials);
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
            expect(res.body.error).toMatch(API_ERROR.USERNAME_PASSWORD_REQUIRED);
            done();
          });
      });

      test('should test add a new user with login', (done) => {
        const newCredentials = _.clone(credentials);
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

        const credentialsShort = _.clone(credentials);
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

      test('should forbid access to remote package', (done) => {

        request(app)
          .get('/forbidden-place')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN)
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

      test('should fails fetch a tarball from remote uplink', (done) => {

        request(app)
          .get('/jquery/-/jquery-0.0.1.tgz')
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

        request(app)
          .put('/jquery/verdaccio-tag')
          .send(JSON.stringify(jqueryVersion))
          .set('accept', 'gzip')
          .set('accept-encoding', HEADERS.JSON)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
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

    describe('should test publish api', () => {
      test('should publish a new package', (done) => {
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

      test('should unpublish a new package', (done) => {
        //FUTURE: for some reason it does not remove the scope folder
        request(app)
          .del('/@scope%2fpk1-test/-rev/4-6abcdb4efd41a576')
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
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
    });
  });
});
