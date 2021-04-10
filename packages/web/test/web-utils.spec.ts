import { sortByName } from '../src/utils/web-utils';

describe('Utilities', () => {
  describe('Sort packages', () => {
    const packages = [
      {
        name: 'ghc',
      },
      {
        name: 'abc',
      },
      {
        name: 'zxy',
      },
    ];
    test('should order ascending', () => {
      expect(sortByName(packages)).toEqual([
        {
          name: 'abc',
        },
        {
          name: 'ghc',
        },
        {
          name: 'zxy',
        },
      ]);
    });

    test('should order descending', () => {
      expect(sortByName(packages, false)).toEqual([
        {
          name: 'zxy',
        },
        {
          name: 'ghc',
        },
        {
          name: 'abc',
        },
      ]);
    });
  });
});
