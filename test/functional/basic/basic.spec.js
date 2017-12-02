import assert from 'assert';
import crypto from 'crypto';

function readfile(folderPath) {
  return require('fs').readFileSync(__dirname + '/' + folderPath);
}

function getPackage(name) {
  return require('../fixtures/package')(name);
}

function createHash() {
  return crypto.createHash('sha1');
}

export default function(server, server2) {
  describe('basic test endpoints', () => {

    require('./whoIam')(server);
    require('./ping')(server);

    describe('handling packages', () => {

      beforeAll(function () {
        return server.addPackage('testpkg');
      });

      beforeAll(function () {
        return server.addPackage('testpkg-single-tarball');
      });

      test('creating new package', () => {/* test for before() */
      });

      test('downloading non-existent tarball', () => {
        return server.getTarball('testpkg', 'blahblah').status(404).body_error(/no such file/);
      });

      test('uploading incomplete tarball', () => {
        return server.putTarballIncomplete('testpkg', 'blahblah1', readfile('../fixtures/binary'), 3000);
      });

      describe('publishing package', () => {

        beforeAll(function () {
          return server.putTarball('testpkg', 'blahblah', readfile('../fixtures/binary'))
            .status(201)
            .body_ok(/.*/);
        });

        beforeAll(function () {
          return server.putTarball('testpkg-single-tarball', 'single', readfile('../fixtures/binary'))
            .status(201)
            .body_ok(/.*/);
        });

        afterAll(function () {
          return server.removeTarball('testpkg').status(201);
        });

        test('remove a tarball', () => {
          /* test for before() */
        });

        test('uploading new tarball', () => {
          /* test for after() */
        });

        test('remove non existing tarball', () => {
          return server.removeTarball('testpkg404').status(404);
        });

        test('remove non existing single tarball', () => {
          return server.removeSingleTarball('', 'fakeFile').status(404);
        });

        // testexp-incomplete

        test('remove existing single tarball', () => {
          return server.removeSingleTarball('testpkg-single-tarball', 'single').status(201);
        });

        // testexp-incomplete

        test('downloading newly created tarball', () => {
          return server.getTarball('testpkg', 'blahblah')
            .status(200)
            .then(function (body) {
              assert.deepEqual(body, readfile('../fixtures/binary'));
            });
        });

        test('uploading new package version (bad sha)', () => {
          let pkg = getPackage('testpkg');
          pkg.dist.shasum = createHash().update('fake').digest('hex');

          return server.putVersion('testpkg', '0.0.1', pkg)
            .status(400)
            .body_error(/shasum error/);
        });

        describe('publishing version', () => {

          beforeAll(function () {
            const pkg = getPackage('testpkg');

            pkg.dist.shasum = createHash().update(readfile('../fixtures/binary')).digest('hex');
            return server.putVersion('testpkg', '0.0.1', pkg)
              .status(201)
              .body_ok(/published/);
          });

          test('uploading new package version', () => {
            /* test for before() */
          });

          test('downloading newly created package', () => {
            return server.getPackage('testpkg')
              .status(200)
              .then(function (body) {
                assert.equal(body.name, 'testpkg');
                assert.equal(body.versions['0.0.1'].name, 'testpkg');
                assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/testpkg/-/blahblah');
                assert.deepEqual(body['dist-tags'], {
                  latest: '0.0.1'
                });
              });
          });

          test('downloading package via server2', () => {
            return server2.getPackage('testpkg')
              .status(200)
              .then(function (body) {
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

    describe('handle failures on endpoints', () => {


      test('should fails trying to fetch non-existent package', () => {
        return server.getPackage('testpkg').status(404).body_error(/no such package/);
      });

      test(
        'should fails on publish a version for non existing package',
        () => {
          return server.putVersion('testpxg', '0.0.1', getPackage('testpxg'))
            .status(404)
            .body_error(/no such package/);
        }
      );

      test('should be a package not found', () => {
        return server.putTarball('nonExistingPackage', 'blahblah', readfile('../fixtures/binary'))
          .status(404)
          .body_error(/no such/);
      });

      test('should fails on publish package in a bad uplink', () => {
        return server.putPackage('baduplink', getPackage('baduplink'))
          .status(503)
          .body_error(/one of the uplinks is down, refuse to publish/);
      });

    });
  });
};

