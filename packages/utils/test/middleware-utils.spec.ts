import { getVersionFromTarball } from '../src/middleware-utils';

describe('Utilities', () => {
  describe('getVersionFromTarball', () => {
    test('should get the right version', () => {
      const simpleName = 'test-name-4.2.12.tgz';
      const complexName = 'test-5.6.4-beta.2.tgz';
      const otherComplexName = 'test-3.5.0-6.tgz';
      expect(getVersionFromTarball(simpleName)).toEqual('4.2.12');
      expect(getVersionFromTarball(complexName)).toEqual('5.6.4-beta.2');
      expect(getVersionFromTarball(otherComplexName)).toEqual('3.5.0-6');
    });

    test("should don'n fall at incorrect tarball name", () => {
      expect(getVersionFromTarball('incorrectName')).toBeUndefined();
    });
  });
});
