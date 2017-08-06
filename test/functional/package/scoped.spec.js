'use strict';

const assert = require('assert');
const utils = require ('../lib/test.utils');

module.exports = function() {
  const server = process.server;
  const server2 = process.server2;

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

    it('should publish scope package', function() {});

    describe('should get scoped packages tarball', () => {
      const uploadScopedTarBall = (server) => {
        return server.getTarball('@test/scoped', 'scoped-1.0.0.tgz')
          .status(200)
          .then(function(body) {
            // not real sha due to utf8 conversion
            assert.strictEqual(utils.generateSha(body),
              '6e67b14e2c0e450b942e2bc8086b49e90f594790');
          });
      };

      it('should be a scoped tarball from server1', () => {
        return uploadScopedTarBall(server);
      });

      it('should be a scoped tarball from server2', () => {
        return uploadScopedTarBall(server2);
      });

    });

    describe('should retrieve scoped packages', function() {
      const testScopePackage = (server, port) => server.getPackage('@test/scoped')
        .status(200)
        .then(function(body) {
          assert.equal(body.name, '@test/scoped');
          assert.equal(body.versions['1.0.0'].name, '@test/scoped');
          assert.equal(body.versions['1.0.0'].dist.tarball,
            `http://localhost:${port}/@test%2fscoped/-/scoped-1.0.0.tgz`);
          assert.deepEqual(body['dist-tags'], {latest: '1.0.0'});
        });

      it('scoped package on server1', () => {
        return testScopePackage(server, '55551');
      });

      it('scoped package on server2', () => {
        return testScopePackage(server2, '55552');
      });
    });

    describe('should retrieve a scoped packages under nginx', function() {
      it('should work nginx workaround', () => {
        return server2.request({
          uri: '/@test/scoped/1.0.0'
        }).status(200)
         .then(function(body) {
           assert.equal(body.name, '@test/scoped');
           assert.equal(body.dist.tarball,
             'http://localhost:55552/@test%2fscoped/-/scoped-1.0.0.tgz');
         });
      });
    });
  });
};
