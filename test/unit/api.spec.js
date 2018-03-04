import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import configDefault from './partials/config';
import publishMetadata from './partials/publish-api';
import Config from '../../src/lib/config';
import Storage from '../../src/lib/storage';
import Auth from '../../src/lib/auth';
import indexAPI from '../../src/api/index';

require('../../src/lib/logger').setup([]);

describe('endpoint unit test', () => {
  let config;
  let storage;
  let auth;
  let app;

  beforeAll(function(done) {
    const store = path.join(__dirname, './partials/store/test-storage');
    rimraf(store, () => {
      const configForTest = _.clone(configDefault);
      configForTest.auth = {
        htpasswd: {
          file: './test-storage/htpasswd-test'
        }
      };
      configForTest.self_path = store;
      config = new Config(configForTest);
      storage = new Storage(config);
      auth = new Auth(config);
      app = indexAPI(config, auth, storage);
      done();
    });
  });

  describe('should test ping api', () => {
    test('should test endpoint /-/ping', (done) => {
      request(app)
        .get('/-/ping')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
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
        .expect('Content-Type', /json/)
        .expect(200)
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
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('should test user api', () => {
    const credentials = { name: 'Jota', password: 'secretPass' };

    test('should test add a new user', (done) => {


      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.ok).toBeDefined();
          expect(res.body.ok).toMatch(`user '${credentials.name}' created`);
          done();
        });
    });

    test('should test fails add a new user with missing name', (done) => {

      const credentialsShort = _.clone(credentials);
      delete credentialsShort.name;

      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentialsShort)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(/username and password is required/);
          done();
        });
    });

    test('should test fails add a new user with missing password', (done) => {

      const credentialsShort = _.clone(credentials);
      delete credentialsShort.password;

      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentialsShort)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          //FIXME: message is not 100% accurate
          expect(res.body.error).toMatch(/username and password is required/);
          done();
        });
    });

    test('should test add a new user with login', (done) => {

      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).toBeTruthy();
          done();
        });
    });

    test('should test fails add a new user with wrong password', (done) => {

      const credentialsShort = _.clone(credentials);
      credentialsShort.password = 'failPassword';

      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentialsShort)
        .expect('Content-Type', /json/)
        .expect(401)
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
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(200)
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
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(200)
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
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(200)
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
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    test('should not found a unexisting remote package under scope', (done) => {

      request(app)
        .get('/@verdaccio/not-found')
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(404)
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
        .set('content-type', 'application/json; charset=utf-8')
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    test('should fetch a tarball from remote uplink', (done) => {

      request(app)
        .get('/jquery/-/jquery-1.5.1.tgz')
        .expect('Content-Type', /application\/octet-stream/)
        .expect(200)
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
        .expect('Content-Type', /application\/octet-stream/)
        .expect(404)
        .end(function(err, res) {
          if (err) {
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
        .set('accept-encoding', 'application/json')
        .set('content-type', 'application/json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
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
        .set('accept-encoding', 'application/json')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
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
        .set('content-type', 'application/json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.ok).toBeDefined();
          expect(res.body.ok).toMatch(/tags updated/);
          done();
        });
    });

    test('should fetch all tags for jquery and ccheck previous update', (done) => {

      request(app)
        .get('/-/package/jquery/dist-tags')
        .set('accept-encoding', 'application/json')
        .set('content-type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
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
        .set('accept-encoding', 'application/json')
        .set('content-type', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.ok).toBeDefined();
          expect(res.body.ok).toMatch(/tag removed/);
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
        // .set('accept-encoding', 'application/json')
        // .set('content-type', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
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
        .set('content-type', 'application/json')
        .send(JSON.stringify(publishMetadata))
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body.ok).toBeDefined();
          expect(res.body.success).toBeDefined();
          expect(res.body.success).toBeTruthy();
          expect(res.body.ok).toMatch(/created new package/);
          done();
        });
    });

    test('should unpublish a new package', (done) => {
      //FUTURE: for some reason it does not remove the scope folder
      request(app)
        .del('/@scope%2fpk1-test/-rev/4-6abcdb4efd41a576')
        .set('content-type', 'application/json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body.ok).toBeDefined();
          expect(res.body.ok).toMatch(/package removed/);
          done();
        });
    });
  });

});
