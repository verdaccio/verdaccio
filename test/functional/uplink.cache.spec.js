'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');

const util = require('./lib/test.utils');

function getBinary() {
  return util.readFile('../fixtures/binary');
}

const STORAGE = 'store/test-storage3';
const TARBALL = 'blahblah';
const PKG_GH131 = 'pkg-gh131';
const PKG_GH1312 = 'pkg-gh1312';

function isCached(pkgName, tarballName) {
  return fs.existsSync(path.join(__dirname, STORAGE, pkgName, tarballName));
}

module.exports = function() {
  const server = process.server;
  const server2 = process.server2;
  const server3 = process.server3;

  describe('storage tarball cache test', function() {

    //more info #131

    before(function () {
      return server.addPackage(PKG_GH131);
    });

    before(function () {
      return server.putTarball(PKG_GH131, TARBALL, getBinary())
        .status(201)
        .body_ok(/.*/);
    });

    before(function () {
      const pkg = require('./fixtures/package')(PKG_GH131);
      pkg.dist.shasum = crypto.createHash('sha1').update(getBinary()).digest('hex');

      return server.putVersion(PKG_GH131, '0.0.1', pkg)
        .status(201)
        .body_ok(/published/);
    });

    before(function () {
      return server3.getPackage(PKG_GH131)
        .status(200);
    });

    before(function () {
      return server3.getTarball(PKG_GH131, TARBALL)
        .status(200);
    });

    it('should be caching packages from uplink server1', function () {
      assert.equal(isCached(PKG_GH131, TARBALL), true);
    });

    before(function () {
      return server2.addPackage(PKG_GH1312);
    });

    before(function () {
      return server2.putTarball(PKG_GH1312, TARBALL, getBinary())
        .status(201)
        .body_ok(/.*/);
    });

    before(function () {
      const pkg = require('./fixtures/package')(PKG_GH1312);
      pkg.dist.shasum = crypto.createHash('sha1').update(getBinary()).digest('hex');

      return server2.putVersion(PKG_GH1312, '0.0.1', pkg)
        .status(201)
        .body_ok(/published/);
    });

    before(function () {
      return server3.getPackage(PKG_GH1312)
        .status(200);
    });

    before(function () {
      return server3.getTarball(PKG_GH1312, TARBALL)
        .status(200);
    });

    it('must not be caching packages from uplink server2', function () {
      assert.equal(isCached(PKG_GH1312, TARBALL), false);
    });

  });
};

