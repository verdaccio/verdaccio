import fs from 'fs';
import path from 'path';
import {createTarballHash} from "../../../src/lib/crypto-utils";
import { HTTP_STATUS, DIST_TAGS} from "../../../src/lib/constants";
import {CREDENTIALS, DOMAIN_SERVERS, PORT_SERVER_1, PORT_SERVER_2, TARBALL} from "../config.functional";
import whoIam from './whoIam';
import ping from './ping';
import fixturePkg from '../fixtures/package';

function readfile(folderPath) {
  return fs.readFileSync(path.join(__dirname, '/', folderPath));
}

function getPackage(name) {
  return fixturePkg(name);
}

export default function(server: any, server2: any) {
  describe('basic test endpoints', () => {

    const PKG_NAME = 'testpkg';
    const PKG_VERSION = '0.0.1';

    beforeAll(function() {
      return server.auth(CREDENTIALS.user, CREDENTIALS.password)
        .status(HTTP_STATUS.CREATED)
        .body_ok(/'test'/);
    });

    whoIam(server);
    ping(server);

    describe('handling packages', () => {

      beforeAll(function () {
        return server.addPackage(PKG_NAME);
      });

      beforeAll(function () {
        return server.addPackage('testpkg-single-tarball');
      });

      test('creating new package', () => {/* test for before() */
      });

      test('downloading non-existent tarball', () => {
        return server.getTarball(PKG_NAME, TARBALL)
          .status(HTTP_STATUS.NOT_FOUND)
          .body_error(/no such file/);
      });

      test('uploading incomplete tarball', () => {
        return server.putTarballIncomplete(PKG_NAME, 'blahblah1', readfile('../fixtures/binary'), 3000);
      });

      describe('publishing package', () => {

        beforeAll(function () {
          return server.putTarball(PKG_NAME, TARBALL, readfile('../fixtures/binary'))
            .status(HTTP_STATUS.CREATED)
            .body_ok(/.*/);
        });

        beforeAll(function () {
          return server.putTarball('testpkg-single-tarball', 'single', readfile('../fixtures/binary'))
            .status(HTTP_STATUS.CREATED)
            .body_ok(/.*/);
        });

        afterAll(function () {
          return server.removeTarball(PKG_NAME).status(HTTP_STATUS.CREATED);
        });

        test('remove a tarball', () => {
          /* test for before() */
        });

        test('uploading new tarball', () => {
          /* test for after() */
        });

        test('remove non existing tarball', () => {
          return server.removeTarball('testpkg404').status(HTTP_STATUS.NOT_FOUND);
        });

        test('remove non existing single tarball', () => {
          return server.removeSingleTarball('', 'fakeFile').status(HTTP_STATUS.NOT_FOUND);
        });

        // testexp-incomplete

        test('remove existing single tarball', () => {
          return server.removeSingleTarball('testpkg-single-tarball', 'single').status(HTTP_STATUS.CREATED);
        });

        // testexp-incomplete

        test('downloading newly created tarball', () => {
          return server.getTarball(PKG_NAME, TARBALL)
            .status(200)
            .then(function (body) {
              expect(body).toEqual(readfile('../fixtures/binary'));
            });
        });

        test('uploading new package version (bad sha)', () => {
          let pkg = getPackage(PKG_NAME);
          pkg.dist.shasum = createTarballHash().update('fake').digest('hex');

          return server.putVersion(PKG_NAME, PKG_VERSION, pkg)
            .status(HTTP_STATUS.BAD_REQUEST)
            .body_error(/shasum error/);
        });

        describe('publishing version', () => {

          beforeAll(function () {
            const pkg = getPackage(PKG_NAME);

            pkg.dist.shasum = createTarballHash().update(readfile('../fixtures/binary')).digest('hex');
            return server.putVersion(PKG_NAME, PKG_VERSION, pkg)
              .status(HTTP_STATUS.CREATED)
              .body_ok(/published/);
          });

          describe('should download a package', () => {
            beforeAll(function() {
              return server.auth(CREDENTIALS.user, CREDENTIALS.password)
                .status(HTTP_STATUS.CREATED)
                .body_ok(new RegExp(CREDENTIALS.user));
            });

            test('should download a newly created package from server1', () => {
              return server.getPackage(PKG_NAME)
                .status(HTTP_STATUS.OK)
                .then(function (body) {
                  expect(body.name).toEqual(PKG_NAME);
                  expect(body.versions[PKG_VERSION].name).toEqual(PKG_NAME);
                  expect(body.versions[PKG_VERSION].dist.tarball).toEqual(`http://${DOMAIN_SERVERS}:${PORT_SERVER_1}/${PKG_NAME}/-/${TARBALL}`);
                  expect(body[DIST_TAGS]).toEqual({
                    latest: PKG_VERSION
                  });
                });
            });

            test('should downloading a package from server2', () => {
              return server2.getPackage(PKG_NAME)
                .status(HTTP_STATUS.OK)
                .then(function (body) {
                  expect(body.name).toEqual(PKG_NAME);
                  expect(body.versions[PKG_VERSION].name).toEqual(PKG_NAME);
                  expect(body.versions[PKG_VERSION].dist.tarball).toEqual(`http://${DOMAIN_SERVERS}:${PORT_SERVER_2}/${PKG_NAME}/-/${TARBALL}`);
                  expect(body[DIST_TAGS]).toEqual({
                    latest: PKG_VERSION
                  });
                });
            });

          });

        });
      });
    });

    describe('handle failures on endpoints', () => {

      test('should fails trying to fetch non-existent package', () => {
        return server.getPackage(PKG_NAME).status(HTTP_STATUS.NOT_FOUND).body_error(/no such package/);
      });

      test(
        'should fails on publish a version for non existing package',
        () => {
          return server.putVersion('testpxg', PKG_VERSION, getPackage('testpxg'))
            .status(HTTP_STATUS.NOT_FOUND)
            .body_error(/no such package/);
        }
      );

      test('should be a package not found', () => {
        return server.putTarball('nonExistingPackage', TARBALL, readfile('../fixtures/binary'))
          .status(HTTP_STATUS.NOT_FOUND)
          .body_error(/no such/);
      });

      test('should fails on publish package in a bad uplink', () => {
        return server.putPackage('baduplink', getPackage('baduplink'))
          .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
          .body_error(/one of the uplinks is down, refuse to publish/);
      });

    });
  });
}
