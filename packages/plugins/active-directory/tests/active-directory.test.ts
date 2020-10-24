import ActiveDirectory from 'activedirectory2';
import { HTTP_STATUS } from '@verdaccio/commons-api';

import ActiveDirectoryPlugin, { NotAuthMessage } from '../src/active-directory';

// eslint-disable-next-line jest/no-mocks-import
import logger from './__mocks__/Logger';

describe('Active Directory Plugin', () => {
  let adPlugin;
  let adPluginSingleGroup;
  let adPluginMultiGroups;

  const config = {
    url: 'ldap://localhost',
    baseDN: 'dc=local,dc=host',
    domainSuffix: 'local.host',
  };

  const configSingleGroup = {
    ...config,
    groupName: 'singleGroup',
  };

  const configMultiGroups = {
    ...config,
    groupName: ['group1', 'group2', 'group3'],
  };

  beforeAll(() => {
    adPlugin = new ActiveDirectoryPlugin(config, { logger });
    adPluginSingleGroup = new ActiveDirectoryPlugin(configSingleGroup, { logger });
    adPluginMultiGroups = new ActiveDirectoryPlugin(configMultiGroups, { logger });
  });

  beforeEach(() => {
    jest.resetModules();
  });

  test('get error when connection fails', (done) => {
    const errorMessage = 'Unknown error';
    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(errorMessage, undefined));

    adPlugin.authenticate('', '', (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(error.code).toBe(HTTP_STATUS.INTERNAL_ERROR);
      expect(error.message).toBe(errorMessage);
      expect(authUser).toBeUndefined();
      done();
    });
  });

  test('get error when not authenticated satisfactory', (done) => {
    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, false));

    adPlugin.authenticate('', '', (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(NotAuthMessage);
      expect(error.code).toBe(HTTP_STATUS.UNAUTHORIZED);
      expect(error.message).toBe(NotAuthMessage);
      expect(authUser).toBeUndefined();
      done();
    });
  });

  test('connect satisfactory without groups', (done) => {
    const user = 'user';
    const password = 'password';

    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, true));

    adPlugin.authenticate(user, password, (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(authUser).toStrictEqual([user]);
      done();
    });
  });

  test('get error when getting groups for user', (done) => {
    const errorMessage = 'Unknown error retrieving groups';
    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, true));
    ActiveDirectory.prototype.getGroupMembershipForUser = jest.fn((_, cb) =>
      cb((errorMessage as unknown) as object, null)
    ) as jest.Mock;

    adPluginSingleGroup.authenticate('', '', (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(ActiveDirectory.prototype.getGroupMembershipForUser).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(error.code).toBe(HTTP_STATUS.INTERNAL_ERROR);
      expect(error.message).toBe(errorMessage);
      expect(authUser).toBeUndefined();
      done();
    });
  });

  test('get error when user groups do not match', (done) => {
    const user = 'user';
    const password = 'password';

    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, true));
    ActiveDirectory.prototype.getGroupMembershipForUser = jest.fn((_, cb) =>
      cb(null, [{ cn: 'notMatchGroup' }])
    ) as jest.Mock;

    adPluginSingleGroup.authenticate(user, password, (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(ActiveDirectory.prototype.getGroupMembershipForUser).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(error.code).toBe(HTTP_STATUS.FORBIDDEN);
      expect(error.message).toBe(
        `AD - User ${user} is not member of group(s): ${configSingleGroup.groupName}`
      );
      expect(authUser).toBeUndefined();
      done();
    });
  });

  test('connect satisfactory when connection has only one group defined', (done) => {
    const { groupName } = configSingleGroup;
    const user = 'user';
    const password = 'password';

    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, true));
    ActiveDirectory.prototype.getGroupMembershipForUser = jest.fn((_, cb) =>
      cb(null, [{ cn: groupName }])
    ) as jest.Mock;

    adPluginSingleGroup.authenticate(user, password, (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(ActiveDirectory.prototype.getGroupMembershipForUser).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(authUser).toStrictEqual([groupName, user]);
      done();
    });
  });

  test('connect satisfactory when connection has multiple groups defined', (done) => {
    const [, group2, group3] = configMultiGroups.groupName;
    const user = 'user';
    const password = 'password';

    ActiveDirectory.prototype.authenticate = jest.fn((_1, _2, cb) => cb(null, true));
    ActiveDirectory.prototype.getGroupMembershipForUser = jest.fn((_, cb) =>
      cb(null, [{ cn: group2 }, { dn: group3 }])
    ) as jest.Mock;

    adPluginMultiGroups.authenticate(user, password, (error, authUser) => {
      expect(ActiveDirectory.prototype.authenticate).toHaveBeenCalled();
      expect(ActiveDirectory.prototype.getGroupMembershipForUser).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(authUser).toStrictEqual([group2, group3, user]);
      done();
    });
  });
});
