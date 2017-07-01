'use strict';

let assert = require('assert');
let express = require('express');
let request = require('request');
let rimraf = require('rimraf');
let verdaccio = require('../../');
let config = require('./partials/config');

describe('toplevel', function() {
  let port;

  before(function(done) {
    rimraf(__dirname + '/store/test-storage', done);
  });

  before(function(done) {
    let app = express();
    app.use(verdaccio(config));

    let server = require('http').createServer(app);
    server.listen(0, function() {
      port = server.address().port;
      done();
    });
  });

  it('should respond on /', function(done) {
    request({
      url: 'http://localhost:' + port + '/',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/<title>Verdaccio<\/title>/));
      done();
    });
  });

  it('should respond on /whatever', function(done) {
    request({
      url: 'http://localhost:' + port + '/whatever',
    }, function(err, res, body) {
      assert.equal(err, null);
      assert(body.match(/no such package available/));
      done();
    });
  });
});
