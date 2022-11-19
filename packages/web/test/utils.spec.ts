import { validatePrimaryColor } from '../src/utils/web-utils';

describe('Utilities', () => {
  describe('validatePrimaryColor', () => {
    test('is valid', () => {
      expect(validatePrimaryColor('#222222')).toEqual('#222222');
      expect(validatePrimaryColor('#222fff')).toEqual('#222fff');
    });
    test('is invalid', () => {
      expect(validatePrimaryColor('fff')).toBeUndefined();
    });
  });
});
