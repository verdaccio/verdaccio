import assert from 'assert';
import crypto from 'crypto';

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x);
}

export default function (server, server2) {

  test('downloading non-existent tarball #1 / srv2', () => {
    return server2.getTarball('testpkg-gh29', 'blahblah')
             .status(404)
             .body_error(/no such package/);
  });

  describe('pkg-gh29', () => {
    beforeAll(function() {
      return server.putPackage('testpkg-gh29', require('./fixtures/package')('testpkg-gh29'))
               .status(201)
               .body_ok(/created new package/);
    });

    test('creating new package / srv1', () => {});

    test('downloading non-existent tarball #2 / srv2', () => {
      return server2.getTarball('testpkg-gh29', 'blahblah')
               .status(404)
               .body_error(/no such file/);
    });

    describe('tarball', () => {
      beforeAll(function() {
        return server.putTarball('testpkg-gh29', 'blahblah', readfile('fixtures/binary'))
                 .status(201)
                 .body_ok(/.*/);
      });

      test('uploading new tarball / srv1', () => {});

      describe('pkg version', () => {
        beforeAll(function() {
          const pkg = require('./fixtures/package')('testpkg-gh29');

          pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex');
          return server.putVersion('testpkg-gh29', '0.0.1', pkg)
                   .status(201)
                   .body_ok(/published/);
        });

        test('uploading new package version / srv1', () => {});

        test('downloading newly created tarball / srv2', () => {
          return server2.getTarball('testpkg-gh29', 'blahblah')
                   .status(200)
                   .then(function(body) {
                     assert.deepEqual(body, readfile('fixtures/binary'));
                   });
        });
      });
    });
  });
}
