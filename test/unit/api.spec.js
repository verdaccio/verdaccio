import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import configDefault from './partials/config';
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
        .expect(409)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(/username should not contain non-uri-safe characters/);
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
        .expect(403)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          //FIXME: message is not 100% accurate
          expect(res.body.error).toMatch(/this user already exists/);
          done();
        });
    });

    test('should test fails add a new user', (done) => {

      request(app)
        .put('/-/user/org.couchdb.user:jota')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          //FIXME: message is not 100% accurate
          expect(res.body.error).toMatch(/this user already exists/);
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
        //TODO: this should return 401 and will fail when issue
        // https://github.com/verdaccio/verdaccio-htpasswd/issues/5
        // is being fixed
        .expect(403)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(/this user already exists/);
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

});
