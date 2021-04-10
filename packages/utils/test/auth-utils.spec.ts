import { validatePassword, createSessionToken, getAuthenticatedMessage } from '../src';

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
