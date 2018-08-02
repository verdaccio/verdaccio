import {HTTP_STATUS, API_ERROR} from "../../../src/lib/constants";

export default function(server2) {
  // credentials
  const USER1 = 'authtest';
  const USER2 = 'authtest2';
  const CORRECT_PASSWORD = 'blahblah-password';
  const WRONG_PASSWORD = 'wrongpass1';
  // package names
  const DENY_PKG_NAME = 'test-auth-deny';
  const AUTH_PKG_ACCESS_NAME = 'test-auth-regular';
  const ONLY_ACCESS_BY_USER_2 = 'test-deny';
  const UNEXISTING_PKG_NAME = 'test-auth-allow';

  const requestAuthFail = (user, pass, message, statusCode) => {
    return server2.auth(user, pass)
      .status(statusCode)
      .body_error(message)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        expect(username).toBeUndefined();
      });
  };
  const requestAuthOk = (user, pass, regex, statusCode) => {
    return server2.auth(user, pass)
      .status(statusCode)
      .body_ok(regex)
      .then(function() {
        return server2.whoami();
      })
      .then(function(username) {
        expect(username).toBe(user);
      });

  };

  describe('plugin authentication', () => {

    describe('test users authentication', () => {

      test('should not authenticate user1 with wrong password', () => {
        return requestAuthFail(USER1, WRONG_PASSWORD, 'i don\'t like your password', HTTP_STATUS.UNAUTHORIZED);
      });

      test('should not authenticate user2 with wrong password', () => {
        return requestAuthFail(USER2, WRONG_PASSWORD, 'i don\'t like your password', HTTP_STATUS.UNAUTHORIZED);
      });

      test('should right user2 password handled by plugin', () => {
        return requestAuthOk(USER2, CORRECT_PASSWORD, new RegExp(USER2), HTTP_STATUS.CREATED);
      });

      test('should right user1 password handled by plugin', () => {
        return requestAuthOk(USER1, CORRECT_PASSWORD, new RegExp(USER1), HTTP_STATUS.CREATED);
      });

    });

    describe('test package access authorization', () => {

     describe(`access with user ${USER1} on server2`, () => {
        beforeAll(function() {
          return server2.auth(USER1, CORRECT_PASSWORD)
                   .status(HTTP_STATUS.CREATED)
                   .body_ok(new RegExp(USER1));
        });

        test(`should fails (404) on access ${UNEXISTING_PKG_NAME}`, () => {
          return server2.getPackage(UNEXISTING_PKG_NAME)
                   .status(HTTP_STATUS.NOT_FOUND)
                   .body_error(API_ERROR.NO_PACKAGE);
        });

        test(`should fails (403) access ${ONLY_ACCESS_BY_USER_2}`, () => {
          return server2.getPackage(ONLY_ACCESS_BY_USER_2)
                   .status(HTTP_STATUS.FORBIDDEN)
                   .body_error(API_ERROR.NOT_ALLOWED);
        });

        test(`should fails (404) access ${AUTH_PKG_ACCESS_NAME}`, () => {
          return server2.getPackage(AUTH_PKG_ACCESS_NAME)
                   .status(HTTP_STATUS.NOT_FOUND)
                   .body_error(API_ERROR.NO_PACKAGE);
        });
      });

      describe(`access with user ${USER2} on server2`, () => {
        beforeAll(function() {
          return server2.auth(USER2, CORRECT_PASSWORD)
                   .status(HTTP_STATUS.CREATED)
                   .body_ok(new RegExp(USER2));
        });

        test(`should fails (403) on access ${UNEXISTING_PKG_NAME}`, () => {
          return server2.getPackage(UNEXISTING_PKG_NAME)
                   .status(HTTP_STATUS.FORBIDDEN)
                   .body_error(API_ERROR.NOT_ALLOWED);
        });

        test(`should fails (403) on access ${DENY_PKG_NAME}`, () => {
          return server2.getPackage(DENY_PKG_NAME)
                   .status(HTTP_STATUS.FORBIDDEN)
                   .body_error(API_ERROR.NOT_ALLOWED);
        });

        test(`should fails (404) access ${AUTH_PKG_ACCESS_NAME}`, () => {
          return server2.getPackage(AUTH_PKG_ACCESS_NAME)
                   .status(HTTP_STATUS.NOT_FOUND)
                   .body_error(API_ERROR.NO_PACKAGE);
        });
      });

    });
  });
}
