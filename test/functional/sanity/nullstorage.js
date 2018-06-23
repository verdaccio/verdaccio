import {readFile} from '../lib/test.utils';
import {createTarballHash} from "../../../src/lib/crypto-utils";
import {HTTP_STATUS} from "../../../src/lib/constants";
import {PORT_SERVER_1, TARBALL} from '../config.func';

function getBinary() {
  return readFile('../fixtures/binary');
}

export default function (server, server2) {

  const PKG_NAME = 'test-nullstorage2';
  const PKG_VERSION = '0.0.1';

  describe('should check whether test-nullstorage is on server1', () => {
    test('trying to fetch non-existent package / null storage', () => {
      return server.getPackage('test-nullstorage-nonexist').status(HTTP_STATUS.NOT_FOUND)
               .body_error(/no such package/);
    });
  });

  describe('should check whether test-nullstorage is on server2', () => {
    beforeAll(function() {
      return server2.addPackage(PKG_NAME);
    });

    test('should creaate a new package on server2', () => {/* test for before() */});

    test('should fails on download a non existent tarball', () => {
      return server.getTarball(PKG_NAME, TARBALL)
               .status(HTTP_STATUS.NOT_FOUND)
               .body_error(/no such file/);
    });

    describe('test and publish test-nullstorage2 package', () => {
      beforeAll(function() {
        return server2.putTarball(PKG_NAME, TARBALL, getBinary())
                 .status(HTTP_STATUS.CREATED).body_ok(/.*/);
      });

      beforeAll(function() {
        let pkg = require('../fixtures/package')(PKG_NAME);
        pkg.dist.shasum = createTarballHash().update(getBinary()).digest('hex');
        return server2.putVersion(PKG_NAME, PKG_VERSION, pkg)
                 .status(HTTP_STATUS.CREATED).body_ok(/published/);
      });

      test('should upload a new version for test-nullstorage2', () => {/* test for before() */});

      test('should fetch the newly created published tarball for test-nullstorage2', () => {
        return server.getTarball(PKG_NAME, TARBALL)
                 .status(HTTP_STATUS.OK)
                 .then(function(body) {
                   expect(body).toEqual(getBinary());
                 });
      });

      test('should check whether the metadata for test-nullstorage2 match', () => {
        return server.getPackage(PKG_NAME)
                 .status(HTTP_STATUS.OK)
                 .then(function(body) {
                   expect(body.name).toBe(PKG_NAME);
                   expect(body.versions[PKG_VERSION].name).toBe(PKG_NAME);
                   expect(body.versions[PKG_VERSION].dist.tarball).toBe(`http://localhost:${PORT_SERVER_1}/${PKG_NAME}/-/${TARBALL}`);
                   expect(body['dist-tags']).toEqual({latest: PKG_VERSION});
                 });
      });
    });
  });
}
