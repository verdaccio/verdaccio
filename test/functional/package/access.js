import {buildToken} from "../../../src/lib/utils";
import {API_ERROR, HTTP_STATUS, TOKEN_BASIC} from "../../../src/lib/constants";
import {CREDENTIALS} from "../config.functional";

export default function(server) {

  describe('package access control', () => {
    const buildAccesToken = (auth) => {
      return buildToken(TOKEN_BASIC, `${(new Buffer(auth).toString('base64'))}`);
    };

    /**
     * Check whether the user is allowed to fetch packages
     * @param auth {object} disable auth
     * @param pkg {string} package name
     * @param ok {boolean}
     */
    function checkAccess(auth, pkg, ok) {
      test(
        `${(ok ? 'allows' : 'forbids')} access ${auth} to ${pkg}`, () => {
          server.authstr = auth ? buildAccesToken(auth) : undefined;
          const req = server.getPackage(pkg);

          if (ok) {
            return req.status(HTTP_STATUS.NOT_FOUND).body_error(API_ERROR.NO_PACKAGE);
          } else {
            return req.status(HTTP_STATUS.FORBIDDEN).body_error(API_ERROR.NOT_ALLOWED);
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
        server.authstr = auth ? buildAccesToken(auth) : undefined;
        const req = server.putPackage(pkg, require('../fixtures/package')(pkg));
        if (ok) {
          return req.status(HTTP_STATUS.NOT_FOUND).body_error(/this package cannot be added/);
        } else {
          return req.status(HTTP_STATUS.FORBIDDEN).body_error(/not allowed to publish package/);
        }
      });
    }

    // credentials
    const badCredentials = 'test:badpass';
    // test user is logged by default
    const validCredentials = `${CREDENTIALS.user}:${CREDENTIALS.password}`;

    // defined on server1 configuration
    const testAccessOnly = 'test-access-only';
    const testPublishOnly = 'test-publish-only';
    const testOnlyTest = 'test-only-test';
    const testOnlyAuth = 'test-only-auth';

    describe('all are allowed to access', () => {
      checkAccess(validCredentials, testAccessOnly, true);
      checkAccess(undefined, testAccessOnly, true);
      checkAccess(badCredentials, testAccessOnly, true);
      checkPublish(validCredentials, testAccessOnly, false);
      checkPublish(undefined, testAccessOnly, false);
      checkPublish(badCredentials, testAccessOnly, false);
    });

    describe('all are allowed to publish', () => {
      checkAccess(validCredentials, testPublishOnly, false);
      checkAccess(undefined, testPublishOnly, false);
      checkAccess(badCredentials, testPublishOnly, false);
      checkPublish(validCredentials, testPublishOnly, true);
      checkPublish(undefined, testPublishOnly, true);
      checkPublish(badCredentials, testPublishOnly, true);
    });

    describe('only user "test" is allowed to publish and access', () => {
      checkAccess(validCredentials, testOnlyTest, true);
      checkAccess(undefined, testOnlyTest, false);
      checkAccess(badCredentials, testOnlyTest, false);
      checkPublish(validCredentials, testOnlyTest, true);
      checkPublish(undefined, testOnlyTest, false);
      checkPublish(badCredentials, testOnlyTest, false);
    });

    describe('only authenticated users are allowed', () => {
      checkAccess(validCredentials, testOnlyAuth, true);
      checkAccess(undefined, testOnlyAuth, false);
      checkAccess(badCredentials, testOnlyAuth, false);
      checkPublish(validCredentials, testOnlyAuth, true);
      checkPublish(undefined, testOnlyAuth, false);
      checkPublish(badCredentials, testOnlyAuth, false);
    });
  });
}
