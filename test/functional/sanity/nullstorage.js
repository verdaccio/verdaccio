import {readFile} from '../lib/test.utils';
import {createTarballHash} from "../../../src/lib/crypto-utils";
import {API_ERROR, HTTP_STATUS} from "../../../src/lib/constants";
import {DOMAIN_SERVERS, PORT_SERVER_1, TARBALL} from '../config.functional';
import generatePkg  from '../fixtures/package';
import {DIST_TAGS} from '../../../src/lib/constants';

function getBinary() {
  return readFile('../fixtures/binary');
}

export default function (server, server2) {

  const PKG_NAME = 'test-nullstorage2';
  const PKG_VERSION = '0.0.1';
  // const TARBALL = `${PKG_NAME}-file.name`;

  describe('should test a scenario when tarball is being fetch from uplink', () => {

    describe(`should check whether ${PKG_NAME} is on server1`, () => {
      test('should fails on fetch non-existent package on server1', () => {
        return server.getPackage('test-nullstorage-nonexist').status(HTTP_STATUS.NOT_FOUND)
                 .body_error(API_ERROR.NO_PACKAGE);
      });
    });

    describe(`should check whether ${PKG_NAME} is on server2`, () => {
      beforeAll(function() {
        return server2.addPackage(PKG_NAME);
      });

      test('should create a new package on server2', () => {/* test for before() */});

      test('should fails on download a non existent tarball from server1', () => {
        return server.getTarball(PKG_NAME, TARBALL)
                 .status(HTTP_STATUS.NOT_FOUND)
                 .body_error(/no such file/);
      });

      describe(`should succesfully publish ${PKG_NAME} package on server2`, () => {
        beforeAll(function() {
          return server2.putTarball(PKG_NAME, TARBALL, getBinary()).status(HTTP_STATUS.CREATED).body_ok(/.*/);
        });

        beforeAll(function() {
          let pkg = generatePkg(PKG_NAME);
          pkg.dist.shasum = createTarballHash().update(getBinary()).digest('hex');
          return server2.putVersion(PKG_NAME, PKG_VERSION, pkg)
                   .status(HTTP_STATUS.CREATED).body_ok(/published/);
        });

        test(`should publish a new version for ${PKG_NAME} on server 2`, () => {/* test for before() */});

        test(`should fetch the newly created published tarball for ${PKG_NAME} from server1 on server2`, () => {
          return server.getTarball(PKG_NAME, TARBALL)
                   .status(HTTP_STATUS.OK)
                   .then(function(body) {
                     expect(body).toEqual(getBinary());
                   });
        });

        test(`should fetch metadata for ${PKG_NAME} match from server1`, () => {
          return server.getPackage(PKG_NAME)
                   .status(HTTP_STATUS.OK)
                   .then(function(body) {
                     expect(body.name).toBe(PKG_NAME);
                     expect(body.versions[PKG_VERSION].name).toBe(PKG_NAME);
                     expect(body.versions[PKG_VERSION].dist.tarball).toBe(`http://${DOMAIN_SERVERS}:${PORT_SERVER_1}/${PKG_NAME}/-/${TARBALL}`);
                     expect(body[DIST_TAGS]).toEqual({latest: PKG_VERSION});
                   });
        });
      });
  });
  });
}
