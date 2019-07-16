import fs from 'fs';
import path from 'path';
import {TARBALL} from '../config.functional';
import {HTTP_STATUS} from "../../../src/lib/constants";
import {createTarballHash} from "../../../src/lib/crypto-utils";
import requirePackage from '../fixtures/package';

function readfile(filePath) {
  const folder = path.join(__dirname , filePath);

  return fs.readFileSync(folder);
}

const binary = '../fixtures/binary';
const pkgName = 'testpkg-gh29';

export default function (server, server2) {
  describe('pkg-gh29 #1', () => {
    test('downloading non-existent tarball #1 / srv2', () => {
      return server2.getTarball(pkgName, TARBALL)
        .status(HTTP_STATUS.NOT_FOUND)
        .body_error(/no such package/);
    });
  });

  describe('pkg-gh29 #2', () => {
    beforeAll(function() {
      return server.putPackage(pkgName, requirePackage(pkgName))
        .status(HTTP_STATUS.CREATED)
        .body_ok(/created new package/);
    });

    test('creating new package / srv1', () => {});

    test('downloading non-existent tarball #2 / srv2', () => {
      return server2.getTarball(pkgName, TARBALL)
        .status(HTTP_STATUS.NOT_FOUND)
        .body_error(/no such file available/);
    });

    describe('tarball', () => {
      beforeAll(function() {
        return server.putTarball(pkgName, TARBALL, readfile(binary))
          .status(HTTP_STATUS.CREATED)
          .body_ok(/.*/);
      });

      test('uploading new tarball / srv1', () => {});

      describe('pkg version', () => {
        beforeAll(function() {
          const pkg = requirePackage(pkgName);
          pkg.dist.shasum = createTarballHash().update(readfile(binary)).digest('hex');
          return server.putVersion(pkgName, '0.0.1', pkg)
            .status(HTTP_STATUS.CREATED)
            .body_ok(/published/);
        });

        test('uploading new package version / srv1', () => {});

        test('downloading newly created tarball / srv2', () => {
          return server2.getTarball(pkgName, TARBALL)
            .status(HTTP_STATUS.OK)
            .then(function(body) {
              expect(body).toEqual(readfile(binary));
            });
        });
      });
    });
  });
}
