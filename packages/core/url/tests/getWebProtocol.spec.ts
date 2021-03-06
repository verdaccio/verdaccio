import { getWebProtocol } from '../src';

describe('getWebProtocol', () => {
  test('should handle undefined header', () => {
    expect(getWebProtocol(undefined, 'http')).toBe('http');
  });

  test('should handle emtpy string', () => {
    expect(getWebProtocol('', 'http')).toBe('http');
  });

  test('should have header priority over request protocol', () => {
    expect(getWebProtocol('https', 'http')).toBe('https');
  });

  test('should have handle empty protocol', () => {
    expect(getWebProtocol('https', '')).toBe('https');
  });

  test('should have handle invalid protocol', () => {
    expect(getWebProtocol('ftp', '')).toBe('http');
  });

  describe('getWebProtocol and HAProxy variant', () => {
    // https://github.com/verdaccio/verdaccio/issues/695
    test('should handle http', () => {
      expect(getWebProtocol('http,http', 'https')).toBe('http');
    });

    test('should handle https', () => {
      expect(getWebProtocol('https,https', 'http')).toBe('https');
    });
  });
});
