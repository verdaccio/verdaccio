import fs from 'fs';
import path from 'path';
import assert from 'assert';
import crypto from 'crypto';
import {readFile} from './lib/test.utils';

function getBinary() {
  return readFile('../fixtures/binary');
}

const STORAGE = 'store/test-storage3';
const TARBALL = 'blahblah';
const PKG_GH131 = 'pkg-gh131';
const PKG_GH1312 = 'pkg-gh1312';

function isCached(pkgName, tarballName) {
  return fs.existsSync(path.join(__dirname, STORAGE, pkgName, tarballName));
}

export default function (server, server2, server3) {

  describe('storage tarball cache test', () => {

    //more info #131

    beforeAll(function () {
      return server.addPackage(PKG_GH131);
    });

    beforeAll(function () {
      return server.putTarball(PKG_GH131, TARBALL, getBinary())
        .status(201)
        .body_ok(/.*/);
    });

    beforeAll(function () {
      const pkg = require('./fixtures/package')(PKG_GH131);
      pkg.dist.shasum = crypto.createHash('sha1').update(getBinary()).digest('hex');

      return server.putVersion(PKG_GH131, '0.0.1', pkg)
        .status(201)
        .body_ok(/published/);
    });

    beforeAll(function () {
      return server3.getPackage(PKG_GH131)
        .status(200);
    });

    beforeAll(function () {
      return server3.getTarball(PKG_GH131, TARBALL)
        .status(200);
    });

    test('should be caching packages from uplink server1', () => {
      assert.equal(isCached(PKG_GH131, TARBALL), true);
    });

    beforeAll(function () {
      return server2.addPackage(PKG_GH1312);
    });

    beforeAll(function () {
      return server2.putTarball(PKG_GH1312, TARBALL, getBinary())
        .status(201)
        .body_ok(/.*/);
    });

    beforeAll(function () {
      const pkg = require('./fixtures/package')(PKG_GH1312);
      pkg.dist.shasum = crypto.createHash('sha1').update(getBinary()).digest('hex');

      return server2.putVersion(PKG_GH1312, '0.0.1', pkg)
        .status(201)
        .body_ok(/published/);
    });

    beforeAll(function () {
      return server3.getPackage(PKG_GH1312)
        .status(200);
    });

    beforeAll(function () {
      return server3.getTarball(PKG_GH1312, TARBALL)
        .status(200);
    });

    test('must not be caching packages from uplink server2', () => {
      assert.equal(isCached(PKG_GH1312, TARBALL), false);
    });

  });
}
