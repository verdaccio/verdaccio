import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import configDefault from './partials/config/access';
import Config from '../../src/lib/config';
import Storage from '../../src/lib/storage';
import Auth from '../../src/lib/auth';
import indexAPI from '../../src/api/index';

require('../../src/lib/logger').setup([]);

describe('api with no limited access configuration', () => {
  let config;
  let storage;
  let auth;
  let app;

  beforeAll(function(done) {
    const store = path.join(__dirname, './partials/store/access-storage');
    rimraf(store, () => {
      const configForTest = _.clone(configDefault);
      configForTest.auth = {
        htpasswd: {
          file: './access-storage/htpasswd-access-test'
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

  afterAll(function(done) {
    const store = path.join(__dirname, './partials/store/access-storage');
    rimraf(store, (err) => {
      if (err) {
        return done(err);
      }

      return done();
    });
  });

  describe('test proxy packages partially restricted', () => {

    test('should test fails on fetch endpoint /-/jquery', (done) => {
      request(app)
        .get('/jquery')
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

    test('should success on fetch endpoint /-/vue', (done) => {
      request(app)
        .get('/vue')
        .set('content-type', 'application/json; charset=utf-8')
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

});
