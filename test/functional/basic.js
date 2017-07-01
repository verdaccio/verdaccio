'use strict';

const assert = require('assert');
const crypto = require('crypto');

function readfile(folderPath) {
  return require('fs').readFileSync(__dirname + '/' + folderPath);
}

function getPackage(name) {
  return require('./lib/package')(name);
}

function createHash() {
  return crypto.createHash('sha1');
}

module.exports = function() {
  let server = process.server;
  let server2 = process.server2;

  describe('basic test endpoints', function() {

    require('./basic/whoIam')(server);
    require('./basic/ping')(server);

    describe('handling packages', function() {

      before(function() {
        return server.addPackage('testpkg');
      });

      it('creating new package', function() {/* test for before() */});

      it('downloading non-existent tarball', function() {
        return server.getTarball('testpkg', 'blahblah').status(404).body_error(/no such file/);
      });

      it('uploading incomplete tarball', function() {
        return server.putTarballIncomplete('testpkg', 'blahblah1', readfile('fixtures/binary'), 3000);
      });

      describe('publishing package', function() {

        before(function() {
          return server.putTarball('testpkg', 'blahblah', readfile('fixtures/binary'))
                   .status(201)
                   .body_ok(/.*/);
        });

        after(function() {
          return server.removeTarball('testpkg').status(201);
        });

        it('remove a tarball', function() {
          /* test for before() */
        });

        it('uploading new tarball', function() {
          /* test for after() */
        });

        it('remove non existing tarball', function() {
          return server.removeTarball('testpkg404').status(404);
        });

        it('downloading newly created tarball', function() {
          return server.getTarball('testpkg', 'blahblah')
                   .status(200)
                   .then(function(body) {
                     assert.deepEqual(body, readfile('fixtures/binary'));
                   });
        });

        it('uploading new package version (bad sha)', function() {
          let pkg = getPackage('testpkg');
          pkg.dist.shasum = createHash().update('fake').digest('hex');

          return server.putVersion('testpkg', '0.0.1', pkg)
                   .status(400)
                   .body_error(/shasum error/);
        });

        describe('publishing version', function() {

          before(function() {
            const pkg = getPackage('testpkg');

            pkg.dist.shasum = createHash().update(readfile('fixtures/binary')).digest('hex');
            return server.putVersion('testpkg', '0.0.1', pkg)
                     .status(201)
                     .body_ok(/published/);
          });

          it('uploading new package version', function() {
            /* test for before() */
          });

          it('downloading newly created package', function() {
            return server.getPackage('testpkg')
                     .status(200)
                     .then(function(body) {
                       assert.equal(body.name, 'testpkg');
                       assert.equal(body.versions['0.0.1'].name, 'testpkg');
                       assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/testpkg/-/blahblah');
                       assert.deepEqual(body['dist-tags'], {
                         latest: '0.0.1'
                       });
                     });
          });

          it('downloading package via server2', function() {
            return server2.getPackage('testpkg')
                     .status(200)
                     .then(function(body) {
                       assert.equal(body.name, 'testpkg');
                       assert.equal(body.versions['0.0.1'].name, 'testpkg');
                       assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55552/testpkg/-/blahblah');
                       assert.deepEqual(body['dist-tags'], {
                         latest: '0.0.1'
                       });
                     });
          });
        });
      });
    });

    describe('handle failures on endpoints', function() {


      it('should fails trying to fetch non-existent package', function() {
        return server.getPackage('testpkg').status(404).body_error(/no such package/);
      });

      it('should fails on publish a version for non existing package', function() {
        return server.putVersion('testpxg', '0.0.1', getPackage('testpxg'))
                 .status(404)
                 .body_error(/no such package/);
      });

      it('should be a package not found', function() {
        return server.putTarball('nonExistingPackage', 'blahblah', readfile('fixtures/binary'))
                 .status(404)
                 .body_error(/no such/);
      });

      it('should fails on publish package in a bad uplink', function() {
        return server.putPackage('baduplink', getPackage('baduplink'))
                 .status(503)
                 .body_error(/one of the uplinks is down, refuse to publish/);
      });

    });
  });
};

