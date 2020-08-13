import { buildToken } from '@verdaccio/utils';
import { API_ERROR, HTTP_STATUS, TOKEN_BASIC } from '@verdaccio/dev-commons';

import { CREDENTIALS } from '../config.functional';
import fixturePkg from '../fixtures/package';

export default function (server) {
  describe('package access control', () => {
    const buildAccesToken = (auth) => {
      return buildToken(TOKEN_BASIC, `${new Buffer(auth).toString('base64')}`);
    };

    /**
     * Check whether the user is allowed to fetch packages
     * @param auth {object} disable auth
     * @param pkg {string} package name
     * @param status {boolean}
     */
    function checkAccess(auth, pkg, status) {
      test(`${status ? 'allows' : 'forbids'} access ${auth} to ${pkg}`, () => {
        server.authstr = auth ? buildAccesToken(auth) : undefined;
        const req = server.getPackage(pkg);

        if (status === HTTP_STATUS.NOT_FOUND) {
          return req.status(HTTP_STATUS.NOT_FOUND).body_error(API_ERROR.NO_PACKAGE);
        } else if (status === HTTP_STATUS.FORBIDDEN) {
          return req.status(HTTP_STATUS.FORBIDDEN).body_error(API_ERROR.NOT_ALLOWED);
        }
      });
    }

    /**
     * Check whether the user is allowed to publish packages
     * @param auth {object} disable auth
     * @param pkg {string} package name
     * @param status {boolean}
     */
    function checkPublish(auth, pkg, status) {
      test(`${status ? 'allows' : 'forbids'} publish ${auth} to ${pkg}`, () => {
        server.authstr = auth ? buildAccesToken(auth) : undefined;
        const req = server.putPackage(pkg, fixturePkg(pkg));
        if (status === HTTP_STATUS.NOT_FOUND) {
          return req.status(HTTP_STATUS.NOT_FOUND).body_error(API_ERROR.PACKAGE_CANNOT_BE_ADDED);
        } else if (status === HTTP_STATUS.FORBIDDEN) {
          return req.status(HTTP_STATUS.FORBIDDEN).body_error(API_ERROR.NOT_ALLOWED_PUBLISH);
        } else if (status === HTTP_STATUS.CREATED) {
          return req.status(HTTP_STATUS.CREATED);
        } else if (status === HTTP_STATUS.CONFLICT) {
          return req.status(HTTP_STATUS.CONFLICT);
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
      checkAccess(validCredentials, testAccessOnly, HTTP_STATUS.NOT_FOUND);
      checkAccess(undefined, testAccessOnly, HTTP_STATUS.NOT_FOUND);
      checkAccess(badCredentials, testAccessOnly, HTTP_STATUS.NOT_FOUND);
      checkPublish(validCredentials, testAccessOnly, HTTP_STATUS.FORBIDDEN);
      checkPublish(undefined, testAccessOnly, HTTP_STATUS.FORBIDDEN);
      checkPublish(badCredentials, testAccessOnly, HTTP_STATUS.FORBIDDEN);
    });

    describe('all are allowed to publish', () => {
      checkAccess(validCredentials, testPublishOnly, HTTP_STATUS.FORBIDDEN);
      checkAccess(undefined, testPublishOnly, HTTP_STATUS.FORBIDDEN);
      checkAccess(badCredentials, testPublishOnly, HTTP_STATUS.FORBIDDEN);
      checkPublish(validCredentials, testPublishOnly, HTTP_STATUS.CREATED);
      checkPublish(undefined, testPublishOnly, HTTP_STATUS.CONFLICT);
      checkPublish(badCredentials, testPublishOnly, HTTP_STATUS.CONFLICT);
    });

    describe('only user "test" is allowed to publish and access', () => {
      checkAccess(validCredentials, testOnlyTest, HTTP_STATUS.NOT_FOUND);
      checkAccess(undefined, testOnlyTest, HTTP_STATUS.FORBIDDEN);
      checkAccess(badCredentials, testOnlyTest, HTTP_STATUS.FORBIDDEN);
      checkPublish(validCredentials, testOnlyTest, HTTP_STATUS.CREATED);
      checkPublish(undefined, testOnlyTest, HTTP_STATUS.FORBIDDEN);
      checkPublish(badCredentials, testOnlyTest, HTTP_STATUS.FORBIDDEN);
    });

    describe('only authenticated users are allowed', () => {
      checkAccess(validCredentials, testOnlyAuth, HTTP_STATUS.NOT_FOUND);
      checkAccess(undefined, testOnlyAuth, HTTP_STATUS.FORBIDDEN);
      checkAccess(badCredentials, testOnlyAuth, HTTP_STATUS.FORBIDDEN);
      checkPublish(validCredentials, testOnlyAuth, HTTP_STATUS.CREATED);
      checkPublish(undefined, testOnlyAuth, HTTP_STATUS.FORBIDDEN);
      checkPublish(badCredentials, testOnlyAuth, HTTP_STATUS.FORBIDDEN);
    });
  });
}
