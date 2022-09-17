import { createSessionToken, getAuthenticatedMessage } from '../src';

describe('Auth Utilities', () => {
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
