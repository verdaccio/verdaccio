import { spliceURL } from '../src/string';
import { createAnonymousRemoteUser, createRemoteUser, ROLES } from '../src';

describe('spliceURL', () => {
  test('should splice two strings and generate a url', () => {
    const url: string = spliceURL('http://domain.com', '/-/static/logo.png');

    expect(url).toMatch('http://domain.com/-/static/logo.png');
  });

  test('should splice a empty strings and generate a url', () => {
    const url: string = spliceURL('', '/-/static/logo.png');

    expect(url).toMatch('/-/static/logo.png');
  });

  describe('createRemoteUser and createAnonymousRemoteUser', () => {
    test('should create a remote user with default groups', () => {
      expect(createRemoteUser('12345', ['foo', 'bar'])).toEqual({
        groups: [
          'foo',
          'bar',
          ROLES.$ALL,
          ROLES.$AUTH,
          ROLES.DEPRECATED_ALL,
          ROLES.DEPRECATED_AUTH,
          ROLES.ALL,
        ],
        name: '12345',
        real_groups: ['foo', 'bar'],
      });
    });

    test('should create a anonymous remote user with default groups', () => {
      expect(createAnonymousRemoteUser()).toEqual({
        groups: [ROLES.$ALL, ROLES.$ANONYMOUS, ROLES.DEPRECATED_ALL, ROLES.DEPRECATED_ANONYMOUS],
        name: undefined,
        real_groups: [],
      });
    });
  });
});
