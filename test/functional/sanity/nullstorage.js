import assert from 'assert';
import crypto from 'crypto';
import {readFile} from '../lib/test.utils';

function getBinary() {
  return readFile('../fixtures/binary');
}

export default function (server, server2) {

  test('trying to fetch non-existent package / null storage', () => {
    return server.getPackage('test-nullstorage-nonexist')
             .status(404)
             .body_error(/no such package/);
  });

  describe('test-nullstorage on server2', () => {
    beforeAll(function() {
      return server2.addPackage('test-nullstorage2');
    });

    test('creating new package - server2', () => {/* test for before() */});

    test('downloading non-existent tarball', () => {
      return server.getTarball('test-nullstorage2', 'blahblah')
               .status(404)
               .body_error(/no such file/);
    });

    describe('tarball', () => {
      beforeAll(function() {
        return server2.putTarball('test-nullstorage2', 'blahblah', getBinary())
                 .status(201)
                 .body_ok(/.*/);
      });

      beforeAll(function() {
        let pkg = require('../fixtures/package')('test-nullstorage2');
        pkg.dist.shasum = crypto.createHash('sha1').update(getBinary()).digest('hex');
        return server2.putVersion('test-nullstorage2', '0.0.1', pkg)
                 .status(201)
                 .body_ok(/published/);
      });

      test('uploading new tarball', () => {/* test for before() */});

      test('downloading newly created tarball', () => {
        return server.getTarball('test-nullstorage2', 'blahblah')
                 .status(200)
                 .then(function(body) {
                   assert.deepEqual(body, getBinary());
                 });
      });

      test('downloading newly created package', () => {
        return server.getPackage('test-nullstorage2')
                 .status(200)
                 .then(function(body) {
                   assert.equal(body.name, 'test-nullstorage2');
                   assert.equal(body.versions['0.0.1'].name, 'test-nullstorage2');
                   assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/test-nullstorage2/-/blahblah');
                   assert.deepEqual(body['dist-tags'], {latest: '0.0.1'});
                 });
      });
    });
  });
}
