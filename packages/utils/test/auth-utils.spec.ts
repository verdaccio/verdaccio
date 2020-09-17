import { API_ERROR, ROLES } from '@verdaccio/dev-commons';
import { VerdaccioError, getForbidden } from '@verdaccio/commons-api';
import {
  allow_action,
  createAnonymousRemoteUser,
  createRemoteUser,
  validatePassword,
  ActionsAllowed,
  AllowActionCallbackResponse,
  getDefaultPlugins,
  createSessionToken,
  getAuthenticatedMessage,
} from '../src';
jest.mock('@verdaccio/logger', () => ({
  logger: { trace: jest.fn() },
}));

describe('Auth Utilities', () => {
  describe('validatePassword', () => {
    test('should validate password according the length', () => {
      expect(validatePassword('12345', 1)).toBeTruthy();
    });

    test('should fails on validate password according the length', () => {
      expect(validatePassword('12345', 10)).toBeFalsy();
    });

    test('should fails on validate password according the length and default config', () => {
      expect(validatePassword('12')).toBeFalsy();
    });

    test('should validate password according the length and default config', () => {
      expect(validatePassword('1235678910')).toBeTruthy();
    });
  });

  describe('createRemoteUser and createAnonymousRemoteUser', () => {
    test('should create a remote user with default groups', () => {
      expect(createRemoteUser('12345', ['foo', 'bar'])).toEqual({
        groups: [
          'foo',
          'bar',
          ROLES.$ALL,
          ROLES.$AUTH,
          ROLES.DEPRECATED_ALL,
          ROLES.DEPRECATED_AUTH,
          ROLES.ALL,
        ],
        name: '12345',
        real_groups: ['foo', 'bar'],
      });
    });

    test('should create a anonymous remote user with default groups', () => {
      expect(createAnonymousRemoteUser()).toEqual({
        groups: [ROLES.$ALL, ROLES.$ANONYMOUS, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_ANONYMOUS],
        name: undefined,
        real_groups: [],
      });
    });
  });

  describe('allow_action', () => {
    describe('access/publish/unpublish and anonymous', () => {
      const packageAccess = {
        name: 'foo',
        version: undefined,
        access: ['foo'],
        unpublish: false,
      };

      // const type = 'access';
      test.each(['access', 'publish', 'unpublish'])(
        'should restrict %s to anonymous users',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
            createAnonymousRemoteUser(),
            {
              ...packageAccess,
              [type]: ['foo'],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s to anonymous users',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
            createAnonymousRemoteUser(),
            {
              ...packageAccess,
              [type]: [ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).toBeNull();
              expect(allowed).toBe(true);
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s only if user is anonymous if the logged user has groups',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: [ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should allow %s only if user is anonymous match any other groups',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: ['admin', 'some-other-group', ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).toBeNull();
              expect(allowed).toBe(true);
            }
          );
        }
      );

      test.each(['access', 'publish', 'unpublish'])(
        'should not allow %s anonymous if other groups are defined and does not match',
        (type) => {
          allow_action(type as ActionsAllowed, { trace: jest.fn() })(
            createRemoteUser('juan', ['maintainer', 'admin']),
            {
              ...packageAccess,
              [type]: ['bla-bla-group', 'some-other-group', ROLES.$ANONYMOUS],
            },
            (error: VerdaccioError | null, allowed: AllowActionCallbackResponse) => {
              expect(error).not.toBeNull();
              expect(allowed).toBeUndefined();
            }
          );
        }
      );
    });
  });
  describe('createSessionToken', () => {
    test('should generate session token', () => {
      expect(createSessionToken()).toHaveProperty('expires');
      expect(createSessionToken().expires).toBeInstanceOf(Date);
    });
  });

  describe('getDefaultPlugins', () => {
    test('authentication should fail by default (default)', () => {
      const plugin = getDefaultPlugins({ trace: jest.fn() });
      plugin.authenticate('foo', 'bar', (error: any) => {
        expect(error).toEqual(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      });
    });

    test('add user should fail by default (default)', () => {
      const plugin = getDefaultPlugins({ trace: jest.fn() });
      // @ts-ignore
      plugin.adduser('foo', 'bar', (error: any) => {
        expect(error).toEqual(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      });
    });
  });

  describe('getAuthenticatedMessage', () => {
    test('should generate user message token', () => {
      expect(getAuthenticatedMessage('foo')).toEqual("you are authenticated as 'foo'");
    });
  });
});
