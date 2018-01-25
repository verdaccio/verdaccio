import request from 'supertest';
import configDefault from '../partials/config';
import Config from '../../../src/lib/config';
import Storage from '../../../src/lib/storage';
import Auth from '../../../src/lib/auth';
import indexAPI from '../../../src/api/index';

require('../../../src/lib/logger').setup([]);

describe('endpoint unit test', () => {
  let config;
  let storage;
  let auth;
  let app;

  beforeAll(function() {
    config = new Config(configDefault);
    storage = new Storage(config);
    auth = new Auth(config);
    app = indexAPI(config, auth, storage);
  });

  describe('ping unit test', () => {
    test('test /-/ping', (done) => {
      request(app)
        .get('/-/ping')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
  });

  describe('whoami unit test', () => {
    test('test /-/whoami', (done) => {
      request(app)
        .get('/-/whoami')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });

    test('test /whoami', (done) => {
      request(app)
        .get('/-/whoami')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
  });

});
