import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { pluginUtils } from '@verdaccio/core';

import Memory from '../src/index';
import { Users, VerdaccioMemoryConfig } from '../src/types';

describe('Memory', function () {
  let auth: pluginUtils.Auth<VerdaccioMemoryConfig>;
  const logger = {
    child: vi.fn(() => {}),
    http: vi.fn(() => {}),
    trace: vi.fn(() => {}),
    warn: vi.fn(() => {}),
    info: vi.fn(() => {}),
    debug: vi.fn(() => {}),
    error: vi.fn(() => {}),
    fatal: vi.fn(() => {}),
  };

  const config = new Config(getDefaultConfig());
  const users: Users = {
    test: {
      name: 'foo',
      password: 'foo',
    },
  };

  beforeEach(function () {
    auth = new Memory(
      { max_users: 100, users },
      {
        config,
        logger,
      }
    ) as pluginUtils.Auth<VerdaccioMemoryConfig>;
  });

  describe('#adduser', function () {
    test('adds users', function () {
      return new Promise((done) => {
        auth.adduser?.('test', 'secret', function (err, user) {
          expect(err).toBeNull();
          expect(user).toEqual(true);
          done(true);
        });
      });
    });

    test('login existing users', function () {
      return new Promise((done) => {
        auth.adduser?.('test', 'secret', function (err, user) {
          expect(err).toBeNull();
          expect(user).toEqual(true);
          auth.adduser?.('test', 'secret', function (err, user) {
            expect(err).toBeNull();
            expect(user).toBe(true);
            done(true);
          });
        });
      });
    });

    test('max users reached', function () {
      return new Promise((done) => {
        const auth = new Memory({ users } as VerdaccioMemoryConfig, {
          // @ts-expect-error
          config: { ...config, max_users: -1 },
          logger,
        });
        auth.adduser?.('fooooooooo', 'secret', function (err) {
          expect(err).not.toBeNull();
          expect(err?.message).toMatch(/maximum amount of users reached/);
          done(true);
        });
      });
    });
  });

  describe('#allow_access', function () {
    beforeEach(function () {
      return new Promise((done) => {
        auth.adduser?.('test', 'secret', function () {
          done();
        });
      });
    });

    const accessBy = (roles: string[], done): void => {
      auth.allow_access?.(
        {
          name: 'test',
          groups: [],
          real_groups: [],
        },
        { access: roles, publish: [], proxy: [] },
        function (err, groups) {
          expect(err).toBeNull();
          expect(groups).toBe(true);
          done();
        }
      );
    };

    test('should be allowed to access as $all to the package', function () {
      return new Promise((done) => {
        accessBy(['$all'], done);
      });
    });

    test('should be allowed to access as $anonymous to the package', function () {
      return new Promise((done) => {
        accessBy(['$anonymous'], done);
      });
    });

    test('should be allowed to access as $authenticated to the package', function () {
      return new Promise((done) => {
        accessBy(['$authenticated'], done);
      });
    });

    test('should be allowed to access as test to the package', function () {
      return new Promise((done) => {
        accessBy(['test'], done);
      });
    });

    test('should not to be allowed to access any package', function () {
      return new Promise((done) => {
        // @ts-expect-error
        auth.allow_access?.({}, { access: [], publish: [], proxy: [] }, function (err) {
          expect(err).not.toBeNull();
          expect(err?.message).toMatch(/not allowed to access package/);
          done(true);
        });
      });
    });

    test('should not to be allowed to access the anyOtherUser package', function () {
      return new Promise((done) => {
        // @ts-expect-error
        auth.allow_access?.(
          {},
          { access: ['anyOtherUser'], publish: [], proxy: [] },
          function (err) {
            expect(err).not.toBeNull();
            expect(err?.message).toMatch(/not allowed to access package/);
            done();
          }
        );
      });
    });
  });

  describe('#allow_publish', function () {
    beforeEach(function () {
      return new Promise((done) => {
        auth.adduser?.('test', 'secret', function () {
          done();
        });
      });
    });

    const accessBy = (roles: string[], done): void => {
      auth.allow_publish?.(
        {
          name: 'test',
          groups: [],
          real_groups: [],
        },
        { publish: roles, proxy: [], access: [] },
        function (err, groups) {
          expect(err).toBeNull();
          expect(groups).toBe(true);
          done();
        }
      );
    };

    test('should be allowed to access as $all to the package', function () {
      return new Promise((done) => {
        accessBy(['$all'], done);
      });
    });

    test('should be allowed to access as $anonymous to the package', function () {
      return new Promise((done) => {
        accessBy(['$anonymous'], done);
      });
    });

    test('should be allowed to access as $authenticated to the package', function () {
      return new Promise((done) => {
        accessBy(['$authenticated'], done);
      });
    });

    test('should be allowed to access as test to the package', function () {
      return new Promise((done) => {
        accessBy(['test'], done);
      });
    });

    test('should not to be allowed to access any package', function () {
      return new Promise((done) => {
        // @ts-expect-error
        auth.allow_publish?.({}, { publish: [], proxy: [], access: [] }, function (err) {
          expect(err).not.toBeNull();
          expect(err?.message).toMatch(/not allowed to publish package/);
          done(true);
        });
      });
    });

    test('should not to be allowed to access the anyOtherUser package', function () {
      return new Promise((done) => {
        // @ts-expect-error
        auth.allow_publish(
          {},
          { publish: ['anyOtherUser'], proxy: [], access: [] },
          function (err) {
            expect(err).not.toBeNull();
            expect(err?.message).toMatch(/not allowed to publish package/);
            done(true);
          }
        );
      });
    });
  });

  describe('#changePassword', function () {
    let auth;

    beforeEach(function () {
      return new Promise((done) => {
        auth = new Memory(
          { users: {} },
          {
            config,
            logger,
          }
        );
        auth.adduser('test', 'secret', function () {
          done();
        });
      });
    });

    test('should change password', function () {
      return new Promise((done) => {
        auth.changePassword('test', 'secret', 'newSecret', function (err, ok) {
          expect(err).toBeNull();
          expect(ok).toBe(true);
          done(true);
        });
      });
    });

    test('should fail change password with user not found', function () {
      return new Promise((done) => {
        auth.changePassword('NOTFOUND', 'secret', 'newSecret', function (err) {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/user not found/);
          done(true);
        });
      });
    });
  });

  describe('#authenticate', function () {
    beforeEach(function () {
      return new Promise((done) => {
        auth = new Memory(
          { users: {} },
          {
            config,
            logger,
          }
        );
        auth.adduser?.('test', 'secret', function () {
          done();
        });
      });
    });

    test('validates existing users', function () {
      return new Promise((done) => {
        auth.authenticate('test', 'secret', function (err, groups) {
          expect(err).toBeNull();
          expect(groups).toBeDefined();
          done(true);
        });
      });
    });

    test('fails if wrong password', function () {
      return new Promise((done) => {
        auth.authenticate('test', 'no-secret', function (err) {
          expect(err).not.toBeNull();
          done(true);
        });
      });
    });

    test('fails if user does not exist', function () {
      return new Promise((done) => {
        auth.authenticate('john', 'secret', function (err, groups) {
          expect(err).toBeNull();
          expect(groups).toBeFalsy();
          done(true);
        });
      });
    });
  });
});
