import { combineBaseUrl } from '../src';

describe('combineBaseUrl', () => {
  test('should create a URI', () => {
    expect(combineBaseUrl('http', 'domain')).toEqual('http://domain/');
  });

  test('should create a base url for registry', () => {
    expect(combineBaseUrl('http', 'domain.com', '')).toEqual('http://domain.com/');
    expect(combineBaseUrl('http', 'domain.com', '/')).toEqual('http://domain.com/');
    expect(combineBaseUrl('http', 'domain.com', '/prefix/')).toEqual('http://domain.com/prefix/');
    expect(combineBaseUrl('http', 'domain.com', '/prefix/deep')).toEqual(
      'http://domain.com/prefix/deep/'
    );
    expect(combineBaseUrl('http', 'domain.com', 'prefix/')).toEqual('http://domain.com/prefix/');
    expect(combineBaseUrl('http', 'domain.com', 'prefix')).toEqual('http://domain.com/prefix/');
  });

  test('invalid url prefix', () => {
    expect(combineBaseUrl('http', 'domain.com', 'only-prefix')).toEqual(
      'http://domain.com/only-prefix/'
    );
    expect(combineBaseUrl('https', 'domain.com', 'only-prefix')).toEqual(
      'https://domain.com/only-prefix/'
    );
  });
});
