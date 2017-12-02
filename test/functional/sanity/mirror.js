import assert from 'assert';
import {readFile} from '../lib/test.utils';

const getBinary = () =>  readFile('../fixtures/binary');

export default function (server, server2) {

  test('testing anti-loop', () => {
    return server2.getPackage('testloop')
      .status(404)
      .body_error(/no such package/);
  })

  ;['fwd'].forEach(function (pkg) {
    let prefix = pkg + ': ';
    pkg = 'test' + pkg;

    describe(pkg, () => {
      beforeAll(function () {
        return server.putPackage(pkg, require('../fixtures/package')(pkg))
          .status(201)
          .body_ok(/created new package/);
      });

      test(prefix + 'creating new package', () => {});

      describe(pkg, () => {
        beforeAll(function () {
          return server.putVersion(pkg, '0.1.1', require('../fixtures/package')(pkg))
            .status(201)
            .body_ok(/published/);
        });

        test(prefix + 'uploading new package version', () => {});

        test(prefix + 'uploading incomplete tarball', () => {
          return server.putTarballIncomplete(pkg, pkg + '.bad', getBinary(), 3000);
        });

        describe('tarball', () => {
          beforeAll(function () {
            return server.putTarball(pkg, pkg + '.file', getBinary())
              .status(201)
              .body_ok(/.*/);
          });

          test(prefix + 'uploading new tarball', () => {
          });

          test(prefix + 'downloading tarball from server1', () => {
            return server.getTarball(pkg, pkg + '.file')
              .status(200)
              .then(function (body) {
                assert.deepEqual(body, getBinary());
              });
          });
        });
      });
    });
  });
}
