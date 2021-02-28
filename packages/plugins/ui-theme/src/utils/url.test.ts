import { isURL, isEmail, getRegistryURL, extractFileName } from './url';

describe('utils', () => {
  describe('url', () => {
    test('isURL() - should return true for localhost', () => {
      expect(isURL('http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz')).toBeTruthy();
    });

    test('isURL() - should return false when protocol is missing', () => {
      expect(isURL('localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz')).toBeFalsy();
    });

    test('isEmail() - should return true if valid', () => {
      expect(isEmail('email@domain.com')).toBeTruthy();
    });
    test('isEmail() - should return false if invalid', () => {
      expect(isEmail('')).toBeFalsy();
    });

    test('getRegistryURL() - should not change when location change', () => {
      expect(getRegistryURL()).toBe('http://localhost');
      history.pushState({}, 'page title', '/-/web/detail');
      expect(getRegistryURL()).toBe('http://localhost');
      history.pushState({}, 'page title', '/');
    });

    test('getRegistryURL() - should change when UI options change', () => {
      expect(getRegistryURL()).toBe('http://localhost');
      window.__VERDACCIO_BASENAME_UI_OPTIONS.basePath = 'http://localhost/test';
      expect(getRegistryURL()).toBe('http://localhost/test');
      window.__VERDACCIO_BASENAME_UI_OPTIONS.basePath = 'http://localhost';
    });
  });

  describe('extractFileName', () => {
    test('should return the file name', () => {
      expect(extractFileName('http://localhost:4872/juan_test_webpack1/-/test-10.0.0.tgz')).toBe(
        'test-10.0.0.tgz'
      );
    });
  });
});
