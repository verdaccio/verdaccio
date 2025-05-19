import fs from 'fs';
import path from 'path';

import { HTTP_STATUS, cryptoUtils } from '@verdaccio/core';

import { TARBALL } from '../config.functional';
import requirePackage from '../fixtures/package';
import { readFile } from '../lib/test.utils';

function getBinary() {
  return readFile('../fixtures/binary');
}

const STORAGE = '../store/test-storage3';
const PKG_GH131 = 'pkg-gh131';
const PKG_GH1312 = 'pkg-gh1312';

function isCached(pkgName, tarballName) {
  const pathCached = path.join(__dirname, STORAGE, pkgName, tarballName);
  return fs.existsSync(pathCached);
}

export default function (server, server2, server3) {
  describe('storage tarball cache test', () => {
    // more info #131
    beforeAll(function () {
      return server.addPackage(PKG_GH131);
    });

    beforeAll(function () {
      return server
        .putTarball(PKG_GH131, TARBALL, getBinary())
        .status(HTTP_STATUS.CREATED)
        .body_ok(/.*/);
    });

    beforeAll(function () {
      const pkg = requirePackage(PKG_GH131);
      pkg.dist.shasum = cryptoUtils.createTarballHash().update(getBinary()).digest('hex');

      return server
        .putVersion(PKG_GH131, '0.0.1', pkg)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/published/);
    });

    beforeAll(function () {
      return server3.getPackage(PKG_GH131).status(HTTP_STATUS.OK);
    });

    beforeAll(function () {
      return server3.getTarball(PKG_GH131, TARBALL).status(HTTP_STATUS.OK);
    });

    test.skip('should be caching packages from uplink server1', () => {
      expect(isCached(PKG_GH131, TARBALL)).toEqual(true);
    });

    beforeAll(function () {
      return server2.addPackage(PKG_GH1312);
    });

    beforeAll(function () {
      return server2
        .putTarball(PKG_GH1312, TARBALL, getBinary())
        .status(HTTP_STATUS.CREATED)
        .body_ok(/.*/);
    });

    beforeAll(function () {
      const pkg = requirePackage(PKG_GH1312);
      pkg.dist.shasum = cryptoUtils.createTarballHash().update(getBinary()).digest('hex');

      return server2
        .putVersion(PKG_GH1312, '0.0.1', pkg)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/published/);
    });

    beforeAll(function () {
      return server3.getPackage(PKG_GH1312).status(HTTP_STATUS.OK);
    });

    beforeAll(function () {
      return server3.getTarball(PKG_GH1312, TARBALL).status(HTTP_STATUS.OK);
    });

    test('must not be caching packages from uplink server2', () => {
      expect(isCached(PKG_GH1312, TARBALL)).toEqual(false);
    });
  });
}
