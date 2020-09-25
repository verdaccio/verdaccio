import { API_ERROR, ROLES } from '@verdaccio/dev-commons';
import { VerdaccioError, getForbidden } from '@verdaccio/commons-api';
import {
  createAnonymousRemoteUser,
  createRemoteUser,
  validatePassword,
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

  describe('createSessionToken', () => {
    test('should generate session token', () => {
      expect(createSessionToken()).toHaveProperty('expires');
      expect(createSessionToken().expires).toBeInstanceOf(Date);
    });
  });

  describe('getAuthenticatedMessage', () => {
    test('should generate user message token', () => {
      expect(getAuthenticatedMessage('foo')).toEqual("you are authenticated as 'foo'");
    });
  });
});
