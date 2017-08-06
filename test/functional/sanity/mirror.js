'use strict';

const assert = require('assert');
const util = require('../lib/test.utils');

const getBinary = () =>  util.readFile('../fixtures/binary');

module.exports = function () {
  let server = process.server;
  let server2 = process.server2;

  it('testing anti-loop', function () {
    return server2.getPackage('testloop')
      .status(404)
      .body_error(/no such package/);
  })

  ;['fwd'].forEach(function (pkg) {
    let prefix = pkg + ': ';
    pkg = 'test' + pkg;

    describe(pkg, function () {
      before(function () {
        return server.putPackage(pkg, require('../fixtures/package')(pkg))
          .status(201)
          .body_ok(/created new package/);
      });

      it(prefix + 'creating new package', function () {});

      describe(pkg, function () {
        before(function () {
          return server.putVersion(pkg, '0.1.1', require('../fixtures/package')(pkg))
            .status(201)
            .body_ok(/published/);
        });

        it(prefix + 'uploading new package version', function () {});

        it(prefix + 'uploading incomplete tarball', function () {
          return server.putTarballIncomplete(pkg, pkg + '.bad', getBinary(), 3000);
        });

        describe('tarball', function () {
          before(function () {
            return server.putTarball(pkg, pkg + '.file', getBinary())
              .status(201)
              .body_ok(/.*/);
          });

          it(prefix + 'uploading new tarball', function () {
          });

          it(prefix + 'downloading tarball from server1', function () {
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
};

