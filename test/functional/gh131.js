'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');

const STORAGE = 'test-storage3';
const TARBALL = 'blahblah';
const PKG_GH131 = 'pkg-gh131';
const PKG_GH1312 = 'pkg-gh1312';

function isCached(pkgname, tarballname) {
  return fs.existsSync(path.join(__dirname, STORAGE, pkgname, tarballname));
}

function readfile(x) {
  return fs.readFileSync(path.join(__dirname, x));
}

module.exports = function() {
  const server = process.server;
  const server2 = process.server2;
  const server3 = process.server3;

  before(function() {
    return server.addPackage(PKG_GH131);
  });

  before(function() {
    return server.putTarball(PKG_GH131, TARBALL, readfile('fixtures/binary'))
             .status(201)
             .body_ok(/.*/);
  });

  before(function() {
    const pkg = require('./lib/package')(PKG_GH131);
    pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex');
    return server.putVersion(PKG_GH131, '0.0.1', pkg)
             .status(201)
             .body_ok(/published/);
  });

  before(function() {
    return server3.getPackage(PKG_GH131)
	    .status(200);
  });

  before(function() {
    return server3.getTarball(PKG_GH131, TARBALL)
            .status(200);
  });

  it('should be caching packages from uplink server1', function () {
    assert.equal(isCached(PKG_GH131, TARBALL), true);
  });

  before(function() {
    return server2.addPackage(PKG_GH1312);
  });

  before(function() {
    return server2.putTarball(PKG_GH1312, TARBALL, readfile('fixtures/binary'))
             .status(201)
             .body_ok(/.*/);
  });

  before(function() {
    const pkg = require('./lib/package')(PKG_GH1312);
    pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex');
    return server2.putVersion(PKG_GH1312, '0.0.1', pkg)
             .status(201)
             .body_ok(/published/);
  });

  before(function() {
    return server3.getPackage(PKG_GH1312)
	    .status(200);
  });

  before(function() {
    return server3.getTarball(PKG_GH1312, TARBALL)
            .status(200);
  });

  it('must not be caching packages from uplink server2', function () {
    assert.equal(isCached(PKG_GH1312, TARBALL), false);
  });
};

