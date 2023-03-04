import { ROLES, createAnonymousRemoteUser, createRemoteUser } from '../src';

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
