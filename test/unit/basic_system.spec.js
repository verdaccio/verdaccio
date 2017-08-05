'use strict';

const assert = require('assert');
const express = require('express');
const request = require('request');
const rimraf = require('rimraf');
const verdaccio = require('../../');
const config = require('./partials/config');

describe('basic system test', function() {
  let port;

  before(function(done) {
    rimraf(__dirname + '/store/test-storage', done);
  });

  before(function(done) {
    let app = express();
    app.use(verdaccio(config));

    const server = require('http').createServer(app);
    server.listen(0, function() {
      port = server.address().port;
      done();
    });
  });

  it('server should respond on /', function(done) {
    request({
      url: 'http://localhost:' + port + '/',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/<title>Verdaccio<\/title>/));
      done();
    });
  });

  it('server should respond on /whatever', function(done) {
    request({
      url: 'http://localhost:' + port + '/whatever',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/no such package available/));
      done();
    });
  });
});
