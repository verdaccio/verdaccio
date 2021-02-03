import { isHTTPProtocol, sortByName } from '../src/web-utils2';

describe('Utilities', () => {
  describe('String utilities', () => {
    test('should check HTTP protocol correctly', () => {
      expect(isHTTPProtocol('http://domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('https://www.domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('//domain.com/-/static/logo.png')).toBeTruthy();
      expect(isHTTPProtocol('file:///home/user/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('file:///F:/home/user/logo.png')).toBeFalsy();
      // Note that uses ftp protocol in src was deprecated in modern browsers
      expect(isHTTPProtocol('ftp://1.2.3.4/home/user/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('./logo.png')).toBeFalsy();
      expect(isHTTPProtocol('.\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('../logo.png')).toBeFalsy();
      expect(isHTTPProtocol('..\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('../../static/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('..\\..\\static\\logo.png')).toBeFalsy();
      expect(isHTTPProtocol('logo.png')).toBeFalsy();
      expect(isHTTPProtocol('.logo.png')).toBeFalsy();
      expect(isHTTPProtocol('/static/logo.png')).toBeFalsy();
      expect(isHTTPProtocol('F:\\static\\logo.png')).toBeFalsy();
    });
  });
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
