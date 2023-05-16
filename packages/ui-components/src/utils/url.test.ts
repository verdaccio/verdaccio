import { extractFileName, isEmail, isURL } from './url';

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

    test('git repo is valid', () => {
      expect(isURL('git://github.com/verdaccio/ui.git')).toBeTruthy();
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
