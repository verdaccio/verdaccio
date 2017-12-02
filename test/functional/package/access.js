export default function(server) {

  describe('package access control', () => {
    const buildToken = (auth) => {
      return `Basic ${(new Buffer(auth).toString('base64'))}`;
    };
    let oldAuth;

    beforeAll(function() {
      oldAuth = server.authstr;
    });

    afterAll(function() {
      server.authstr = oldAuth;
    });

    /**
     * Check whether the user is allowed to fetch packages
     * @param auth {object} disable auth
     * @param pkg {string} package name
     * @param ok {boolean}
     */
    function checkAccess(auth, pkg, ok) {
      test(
        (ok ? 'allows' : 'forbids') +' access ' + auth + ' to ' + pkg,
        () => {
          server.authstr = auth ? buildToken(auth) : undefined;
          let req = server.getPackage(pkg);
          if (ok) {
            return req.status(404).body_error(/no such package available/);
          } else {
            return req.status(403).body_error(/not allowed to access package/);
          }
        }
      );
    }

    /**
     * Check whether the user is allowed to publish packages
     * @param auth {object} disable auth
     * @param pkg {string} package name
     * @param ok {boolean}
     */
    function checkPublish(auth, pkg, ok) {
      test(`${(ok ? 'allows' : 'forbids')} publish ${auth} to ${pkg}`, () => {
        server.authstr = auth ? buildToken(auth) : undefined;
        const req = server.putPackage(pkg, require('../fixtures/package')(pkg));
        if (ok) {
          return req.status(404).body_error(/this package cannot be added/);
        } else {
          return req.status(403).body_error(/not allowed to publish package/);
        }
      });
    }

    // credentials
    const badCredentials = 'test:badpass';
    // test user is logged by default
    const validCredentials = 'test:test';

    // defined on server1 configuration
    const testAccessOnly = 'test-access-only';
    const testPublishOnly = 'test-publish-only';
    const testOnlyTest = 'test-only-test';
    const testOnlyAuth = 'test-only-auth';

    // all are allowed to access
    checkAccess(validCredentials, testAccessOnly, true);
    checkAccess(undefined, testAccessOnly, true);
    checkAccess(badCredentials, testAccessOnly, true);
    checkPublish(validCredentials, testAccessOnly, false);
    checkPublish(undefined, testAccessOnly, false);
    checkPublish(badCredentials, testAccessOnly, false);

    // // all are allowed to publish
    checkAccess(validCredentials, testPublishOnly, false);
    checkAccess(undefined, testPublishOnly, false);
    checkAccess(badCredentials, testPublishOnly, false);
    checkPublish(validCredentials, testPublishOnly, true);
    checkPublish(undefined, testPublishOnly, true);
    checkPublish(badCredentials, testPublishOnly, true);

    // only user "test" is allowed to publish and access
    checkAccess(validCredentials, testOnlyTest, true);
    checkAccess(undefined, testOnlyTest, false);
    checkAccess(badCredentials, testOnlyTest, false);
    checkPublish(validCredentials, testOnlyTest, true);
    checkPublish(undefined, testOnlyTest, false);
    checkPublish(badCredentials, testOnlyTest, false);

    // only authenticated users are allowed
    checkAccess(validCredentials, testOnlyAuth, true);
    checkAccess(undefined, testOnlyAuth, false);
    checkAccess(badCredentials, testOnlyAuth, false);
    checkPublish(validCredentials, testOnlyAuth, true);
    checkPublish(undefined, testOnlyAuth, false);
    checkPublish(badCredentials, testOnlyAuth, false);
  });
}
