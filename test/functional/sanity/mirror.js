import {readFile} from '../lib/test.utils';
import {API_MESSAGE, HTTP_STATUS} from "../../../src/lib/constants";
import generatePkg  from '../fixtures/package';
import {TARBALL} from '../config.functional';

const getBinary = () =>  readFile('../fixtures/binary');

export default function (server, server2) {

  describe('anti-loop testing', () => {
    test('testing anti-loop', () => {
      return server2.getPackage('testloop').status(HTTP_STATUS.NOT_FOUND)
        .body_error(/no such package/);
    });
  });

  describe('mirror', () => {
    const pkgList = ['pkg1', 'pkg2', 'pkg3'];

    pkgList.forEach(function (pkg) {
      let prefix = pkg;
      pkg = `test-mirror-${pkg}`;

      describe(`testing mirror for ${pkg}`, () => {
        beforeAll(function () {
          return server2.putPackage(pkg, generatePkg(pkg))
            .status(HTTP_STATUS.CREATED)
            .body_ok(API_MESSAGE.PKG_CREATED);
        });

        test(prefix + 'creating new package', () => {});

        describe(pkg, () => {
          beforeAll(function () {
            return server2.putVersion(pkg, '0.1.1', generatePkg(pkg))
              .status(HTTP_STATUS.CREATED)
              .body_ok(/published/);
          });

          test(`should ${prefix} uploading new package version`, () => {});

          test(`${prefix} uploading incomplete tarball`, () => {
            return server2.putTarballIncomplete(pkg, pkg + '.bad', getBinary(), 3000);
          });

          describe('should put a tarball', () => {
            beforeAll(function () {
              return server2.putTarball(pkg, TARBALL, getBinary())
                .status(HTTP_STATUS.CREATED)
                .body_ok(/.*/);
            });

            test(`should ${prefix} uploading new tarball`, () => {});

            test(`should ${prefix} downloading tarball from server2`, () => {
              return server2.getTarball(pkg, TARBALL)
                .status(HTTP_STATUS.OK)
                .then(function (body) {
                  expect(body).toEqual(getBinary());
                });
            });

            test('testing mirror server1', () => {
              return server.getPackage(pkg).status(HTTP_STATUS.OK);
            });

            test(`should ${prefix} downloading tarball from server1`, () => {
              return server.getTarball(pkg, TARBALL)
                .status(HTTP_STATUS.OK)
                .then(function (body) {
                  expect(body).toEqual(getBinary());
                });
            });
          });
        });
      });
    });
  });
}
