'use strict';

const assert = require('assert');
const express = require('express');
const request = require('request');
const rimraf = require('rimraf');
const verdaccio = require('../../');
const config = require('./partials/config');

const app = express();
const server = require('http').createServer(app);

describe('basic system test', () => {
  let port;

  beforeAll(function(done) {
    rimraf(__dirname + '/store/test-storage', done);
  });

  beforeAll(function(done) {

    app.use(verdaccio(config));

    server.listen(0, function() {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('server should respond on /', done => {
    request({
      url: 'http://localhost:' + port + '/',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/<title>Verdaccio<\/title>/));
      done();
    });
  });

  test('server should respond on /whatever', done => {
    request({
      url: 'http://localhost:' + port + '/whatever',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/no such package available/));
      done();
    });
  });
});
