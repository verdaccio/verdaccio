'use strict';

module.exports = function() {
  describe('access control', function() {
    let server = process.server;
    let oldauth;

    before(function() {
      oldauth = server.authstr;
    });

    after(function() {
      server.authstr = oldauth;
    });

    function check_access(auth, pkg, ok) {
      it((ok ? 'allows' : 'forbids') +' access ' + auth + ' to ' + pkg, function() {
        server.authstr = auth? `Basic ${(new Buffer(auth).toString('base64'))}`: undefined;
        let req = server.get_package(pkg);
        if (ok) {
          return req.status(404).body_error(/no such package available/);
        } else {
          return req.status(403).body_error(/not allowed to access package/);
        }
      });
    }

    function check_publish(auth, pkg, ok) {
      it(`${(ok ? 'allows' : 'forbids')} publish ${auth} to ${pkg}`, function() {
        server.authstr = auth? `Basic ${(new Buffer(auth).toString('base64'))}`: undefined;
        let req = server.put_package(pkg, require('./lib/package')(pkg));
        if (ok) {
          return req.status(404).body_error(/this package cannot be added/);
        } else {
          return req.status(403).body_error(/not allowed to publish package/);
        }
      });
    }
    const badPass = 'test:badpass';
    const testPass = 'test:test';
    const testAccessOnly = 'test-access-only';
    const testPublishOnly = 'test-publish-only';
    const testOnlyTest = 'test-only-test';
    const testOnlyAuth = 'test-only-auth';
    check_access(testPass, testAccessOnly, true);
    check_access(undefined, testAccessOnly, true);
    check_access(badPass, testAccessOnly, true);
    check_publish(testPass, testAccessOnly, false);
    check_publish(undefined, testAccessOnly, false);
    check_publish(badPass, testAccessOnly, false);

    check_access(testPass, testPublishOnly, false);
    check_access(undefined, testPublishOnly, false);
    check_access(badPass, testPublishOnly, false);
    check_publish(testPass, testPublishOnly, true);
    check_publish(undefined, testPublishOnly, true);
    check_publish(badPass, testPublishOnly, true);

    check_access(testPass, testOnlyTest, true);
    check_access(undefined, testOnlyTest, false);
    check_access(badPass, testOnlyTest, false);
    check_publish(testPass, testOnlyTest, true);
    check_publish(undefined, testOnlyTest, false);
    check_publish(badPass, testOnlyTest, false);

    check_access(testPass, testOnlyAuth, true);
    check_access(undefined, testOnlyAuth, false);
    check_access(badPass, testOnlyAuth, false);
    check_publish(testPass, testOnlyAuth, true);
    check_publish(undefined, testOnlyAuth, false);
    check_publish(badPass, testOnlyAuth, false);
  });
};
