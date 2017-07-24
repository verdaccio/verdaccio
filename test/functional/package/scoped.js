'use strict';

const assert = require('assert');
const utils = require ('../lib/test.utils');

module.exports = function() {
  let server = process.server;
  let server2 = process.server2;

  describe('test-scoped', function() {
    before(function() {
      return server.request({
        uri: '/@test%2fscoped',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: require('./scoped.json'),
      }).status(201);
    });

    it('add pkg', function() {});

    it('server1 - tarball', function() {
      return server.getTarball('@test/scoped', 'scoped-1.0.0.tgz')
               .status(200)
               .then(function(body) {
                 // not real sha due to utf8 conversion
                 assert.strictEqual(utils.generateSha(body), '6e67b14e2c0e450b942e2bc8086b49e90f594790');
               });
    });

    it('server2 - tarball', function() {
      return server2.getTarball('@test/scoped', 'scoped-1.0.0.tgz')
               .status(200)
               .then(function(body) {
                 // not real sha due to utf8 conversion
                 assert.strictEqual(utils.generateSha(body), '6e67b14e2c0e450b942e2bc8086b49e90f594790');
               });
    });

    it('server1 - package', function() {
      return server.getPackage('@test/scoped')
               .status(200)
               .then(function(body) {
                 assert.equal(body.name, '@test/scoped');
                 assert.equal(body.versions['1.0.0'].name, '@test/scoped');
                 assert.equal(body.versions['1.0.0'].dist.tarball, 'http://localhost:55551/@test%2fscoped/-/scoped-1.0.0.tgz');
                 assert.deepEqual(body['dist-tags'], {latest: '1.0.0'});
               });
    });

    it('server2 - package', function() {
      return server2.getPackage('@test/scoped')
               .status(200)
               .then(function(body) {
                 assert.equal(body.name, '@test/scoped');
                 assert.equal(body.versions['1.0.0'].name, '@test/scoped');
                 assert.equal(body.versions['1.0.0'].dist.tarball, 'http://localhost:55552/@test%2fscoped/-/scoped-1.0.0.tgz');
                 assert.deepEqual(body['dist-tags'], {latest: '1.0.0'});
               });
    });

    it('server2 - nginx workaround', function() {
      return server2.request({uri: '/@test/scoped/1.0.0'})
               .status(200)
               .then(function(body) {
                 assert.equal(body.name, '@test/scoped');
                 assert.equal(body.dist.tarball, 'http://localhost:55552/@test%2fscoped/-/scoped-1.0.0.tgz');
               });
    });
  });
};
