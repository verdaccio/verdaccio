import { Callback } from '@verdaccio/types';

import { VerdaccioMemoryConfig } from '../src/types';
import Memory from '../src/index';

describe('Memory', function () {
  let auth;
  const logger = {
    child: jest.fn(() => {}),
    http: jest.fn(() => {}),
    trace: jest.fn(() => {}),
    warn: jest.fn(() => {}),
    info: jest.fn(() => {}),
    debug: jest.fn(() => {}),
    error: jest.fn(() => {}),
    fatal: jest.fn(() => {}),
  };

  beforeEach(function () {
    auth = new Memory({ max_users: 100 } as VerdaccioMemoryConfig, {
      config: {} as VerdaccioMemoryConfig,
      logger,
    });
  });

  describe('#adduser', function () {
    test('adds users', function (done) {
      auth.adduser('test', 'secret', function (err, user) {
        expect(err).toBeNull();
        expect(user).toEqual('test');
        done();
      });
    });

    test('login existing users', function (done) {
      auth.adduser('test', 'secret', function (err, user) {
        expect(err).toBeNull();
        expect(user).toEqual('test');
        auth.adduser('test', 'secret', function (err, user) {
          expect(err).toBeNull();
          expect(user).toBe(true);
          done();
        });
      });
    });

    test('max users reached', function (done) {
      const auth = new Memory({} as VerdaccioMemoryConfig, {
        config: {
          max_users: -1,
        } as VerdaccioMemoryConfig,
        logger,
      });
      auth.adduser('test', 'secret', function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/maximum amount of users reached/);
        done();
      });
    });
  });

  describe('replace user', function () {
    beforeAll(function (done) {
      auth.adduser('test', 'secret', function (_err) {
        done();
      });
    });

    test('replaces password', function (done) {
      auth.adduser('test', 'new_secret', function (err, user) {
        expect(err).toBeNull();
        expect(user).toEqual('test');
        auth.authenticate('test', 'new_secret', function (err) {
          expect(err).toBeNull();
          done();
        });
      });
    });
  });

  describe('#allow_access', function () {
    beforeEach(function (done) {
      auth.adduser('test', 'secret', function (_err, _user) {
        done();
      });
    });

    const accessBy = (roles: string[], done: Callback): void => {
      auth.allow_access(
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

    test('should be allowed to access as $all to the package', function (done) {
      accessBy(['$all'], done);
    });

    test('should be allowed to access as $anonymous to the package', function (done) {
      accessBy(['$anonymous'], done);
    });

    test('should be allowed to access as $authenticated to the package', function (done) {
      accessBy(['$authenticated'], done);
    });

    test('should be allowed to access as test to the package', function (done) {
      accessBy(['test'], done);
    });

    test('should not to be allowed to access any package', function (done) {
      auth.allow_access({}, { access: [], publish: [], proxy: [] }, function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/not allowed to access package/);
        done();
      });
    });

    test('should not to be allowed to access the anyOtherUser package', function (done) {
      auth.allow_access({}, { access: ['anyOtherUser'], publish: [], proxy: [] }, function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/not allowed to access package/);
        done();
      });
    });
  });

  describe('#allow_publish', function () {
    beforeEach(function (done) {
      auth.adduser('test', 'secret', function (_err, _user) {
        done();
      });
    });

    const accessBy = (roles: string[], done: Callback): void => {
      auth.allow_publish(
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

    test('should be allowed to access as $all to the package', function (done) {
      accessBy(['$all'], done);
    });

    test('should be allowed to access as $anonymous to the package', function (done) {
      accessBy(['$anonymous'], done);
    });

    test('should be allowed to access as $authenticated to the package', function (done) {
      accessBy(['$authenticated'], done);
    });

    test('should be allowed to access as test to the package', function (done) {
      accessBy(['test'], done);
    });

    test('should not to be allowed to access any package', function (done) {
      auth.allow_publish({}, { publish: [], proxy: [], access: [] }, function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/not allowed to publish package/);
        done();
      });
    });

    test('should not to be allowed to access the anyOtherUser package', function (done) {
      auth.allow_publish({}, { publish: ['anyOtherUser'], proxy: [], access: [] }, function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/not allowed to publish package/);
        done();
      });
    });
  });

  describe('#changePassword', function () {
    let auth;

    beforeEach(function (done) {
      auth = new Memory({} as VerdaccioMemoryConfig, {
        config: {} as VerdaccioMemoryConfig,
        logger,
      });
      auth.adduser('test', 'secret', function (_err, _user) {
        done();
      });
    });

    test('should change password', function (done) {
      auth.changePassword('test', 'secret', 'newSecret', function (err, user) {
        expect(err).toBeNull();
        expect(user.password).toEqual('newSecret');
        done();
      });
    });

    test('should fail change password with user not found', function (done) {
      auth.changePassword('NOTFOUND', 'secret', 'newSecret', function (err) {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/user not found/);
        done();
      });
    });
  });

  describe('#authenticate', function () {
    beforeEach(function (done) {
      auth.adduser('test', 'secret', function (_err, _user) {
        done();
      });
    });

    test('validates existing users', function (done) {
      auth.authenticate('test', 'secret', function (err, groups) {
        expect(err).toBeNull();
        expect(groups).toBeDefined();
        done();
      });
    });

    test('fails if wrong password', function (done) {
      auth.authenticate('test', 'no-secret', function (err) {
        expect(err).not.toBeNull();
        done();
      });
    });

    test('fails if user doesnt exist', function (done) {
      auth.authenticate('john', 'secret', function (err, groups) {
        expect(err).toBeNull();
        expect(groups).toBeFalsy();
        done();
      });
    });
  });
});
