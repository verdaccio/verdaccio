import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import MockDate from 'mockdate';
import path from 'path';

import { Config, parseConfigFile } from '@verdaccio/config';
import { constants, pluginUtils } from '@verdaccio/core';

import HTPasswd, { DEFAULT_SLOW_VERIFY_MS, HTPasswdConfig } from '../src/htpasswd';

const options = {
  logger: { warn: jest.fn(), info: jest.fn() },
  config: new Config(parseConfigFile(path.join(__dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions<HTPasswdConfig>;

const config = {
  file: './htpasswd',
  max_users: 1000,
} as HTPasswdConfig;

describe('HTPasswd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = new HTPasswd(config, options);
    jest.resetModules();
    jest.clearAllMocks();

    // @ts-ignore
    crypto.randomBytes = jest.fn(() => {
      return {
        toString: (): string => '$6',
      };
    });
  });

  describe('constructor()', () => {
    const error = jest.fn();
    const warn = jest.fn();
    const info = jest.fn();
    const emptyPluginOptions = {
      config: {
        configPath: '',
      },
      logger: { warn, info, error },
    } as any as pluginUtils.PluginOptions<HTPasswdConfig>;

    test('should ensure file path configuration exists', () => {
      expect(function () {
        new HTPasswd({} as HTPasswdConfig, emptyPluginOptions);
      }).toThrow(/should specify "file" in config/);
    });

    test('should switch to bcrypt if incorrect algorithm is set', () => {
      let invalidConfig = { algorithm: 'invalid', ...config } as HTPasswdConfig;
      new HTPasswd(invalidConfig, emptyPluginOptions);
      expect(warn).toHaveBeenCalledWith(
        'The algorithm selected %s is invalid, switching to to default one "bcrypt", password validation can be affected',
        'invalid'
      );
      expect(info).toHaveBeenCalled();
    });
  });

  describe('authenticate()', () => {
    test('it should authenticate user with given credentials', (done) => {
      const users = [
        { username: 'test', password: 'test' },
        { username: 'username', password: 'password' },
        { username: 'bcrypt', password: 'password' },
      ];
      let usersAuthenticated = 0;
      const generateCallback = (username) => (error, userGroups) => {
        usersAuthenticated += 1;
        expect(error).toBeNull();
        expect(userGroups).toContain(username);
        usersAuthenticated === users.length && done();
      };
      users.forEach(({ username, password }) =>
        wrapper.authenticate(username, password, generateCallback(username))
      );
    });

    test('it should not authenticate user with given credentials', (done) => {
      const users = ['test', 'username', 'bcrypt'];
      let usersAuthenticated = 0;
      const generateCallback = () => (error, userGroups) => {
        usersAuthenticated += 1;
        expect(error).toBeNull();
        expect(userGroups).toBeFalsy();
        usersAuthenticated === users.length && done();
      };
      users.forEach((username) =>
        wrapper.authenticate(username, 'somerandompassword', generateCallback())
      );
    });

    test('it should warn on slow password verification', (done) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      bcrypt.compare = jest.fn((_passwd, _hash) => {
        return new Promise((resolve) => setTimeout(resolve, DEFAULT_SLOW_VERIFY_MS + 1)).then(
          () => true
        );
      });
      const callback = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toContain('bcrypt');
        const mockWarn = options.logger.warn as jest.MockedFn<jest.MockableFunction>;
        expect(mockWarn.mock.calls.length).toBe(1);
        const [{ user, durationMs }, message] = mockWarn.mock.calls[0];
        expect(user).toEqual('bcrypt');
        expect(durationMs).toBeGreaterThan(DEFAULT_SLOW_VERIFY_MS);
        expect(message).toEqual('Password for user "@{user}" took @{durationMs}ms to verify');
        done();
      };
      wrapper.authenticate('bcrypt', 'password', callback);
    }, 18000);
  });

  describe('addUser()', () => {
    test('it should not pass sanity check', (done) => {
      const callback = (a): void => {
        expect(a.message).toEqual('unauthorized access');
        done();
      };
      wrapper.adduser('test', 'somerandompassword', callback);
    });

    test('it should add the user', (done) => {
      let dataToWrite;
      // @ts-ignore
      fs.writeFile = jest.fn((name, data, callback) => {
        dataToWrite = data;
        callback();
      });

      MockDate.set('2018-01-14T11:17:40.712Z');

      const callback = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toBeTruthy();
        expect(fs.writeFile).toHaveBeenCalled();
        expect(dataToWrite.indexOf('usernotpresent')).not.toEqual(-1);
        done();
      };
      wrapper.adduser('usernotpresent', 'somerandompassword', callback);
    });

    describe('addUser() error handling', () => {
      test('sanityCheck should return an Error', (done) => {
        jest.doMock('../src/utils.ts', () => {
          return {
            sanityCheck: (): Error => Error('some error'),
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.adduser('sanityCheck', 'test', (sanity) => {
          expect(sanity.message).toBeDefined();
          expect(sanity.message).toMatch('some error');
          done();
        });
      });

      test('lockAndRead should return an Error', (done) => {
        jest.doMock('../src/utils.ts', () => {
          return {
            sanityCheck: (): any => null,
            lockAndRead: (_a, b): any => b(new Error('lock error')),
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.adduser('lockAndRead', 'test', (sanity) => {
          expect(sanity.message).toBeDefined();
          expect(sanity.message).toMatch('lock error');
          done();
        });
      });

      test('addUserToHTPasswd should return an Error', (done) => {
        jest.doMock('../src/utils.ts', () => {
          return {
            sanityCheck: (): any => null,
            parseHTPasswd: (): void => {},
            lockAndRead: (_a, b): any => b(null, ''),
            unlockFile: (_a, b): any => b(),
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.adduser('addUserToHTPasswd', 'test', () => {
          done();
        });
      });

      test('writeFile should return an Error', (done) => {
        jest.doMock('../src/utils.ts', () => {
          return {
            sanityCheck: () => Promise.resolve(null),
            parseHTPasswd: (): void => {},
            lockAndRead: (_a, b): any => b(null, ''),
            addUserToHTPasswd: (): void => {},
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });
        jest.doMock('fs', () => {
          const original = jest.requireActual('fs');
          return {
            ...original,
            writeFile: jest.fn((_name, _data, callback) => {
              callback(new Error('write error'));
            }),
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.adduser('addUserToHTPasswd', 'test', (err) => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch('write error');
          done();
        });
      });
    });

    describe('reload()', () => {
      test('it should read the file and set the users', (done) => {
        const output = {
          test: '$6FrCaT/v0dwE',
          username: '$66to3JK5RgZM',
          bcrypt: '$2y$04$K2Cn3StiXx4CnLmcTW/ymekOrj7WlycZZF9xgmoJ/U0zGPqSLPVBe',
        };
        const callback = (): void => {
          expect(wrapper.users).toEqual(output);
          done();
        };
        wrapper.reload(callback);
      });

      test('reload should fails on check file', (done) => {
        jest.doMock('fs', () => {
          return {
            stat: (_name, callback): void => {
              callback(new Error('stat error'), null);
            },
          };
        });
        const callback = (err): void => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch('stat error');
          done();
        };

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.reload(callback);
      });

      test('reload times match', (done) => {
        jest.doMock('fs', () => {
          return {
            stat: (_name, callback): void => {
              callback(null, {
                mtime: null,
              });
            },
          };
        });
        const callback = (err): void => {
          expect(err).toBeUndefined();
          done();
        };

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.reload(callback);
      });

      test('reload should fails on read file', (done) => {
        jest.doMock('fs', () => {
          return {
            stat: jest.requireActual('fs').stat,
            readFile: (_name, _format, callback): void => {
              callback(new Error('read error'), null);
            },
          };
        });
        const callback = (err): void => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch('read error');
          done();
        };

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, options);
        wrapper.reload(callback);
      });
    });
  });

  test('changePassword - it should throw an error for user not found', (done) => {
    const callback = (error, isSuccess): void => {
      expect(error).not.toBeNull();
      expect(error.message).toBe(
        `Unable to change password for user 'usernotpresent': user does not currently exist`
      );
      expect(isSuccess).toBeFalsy();
      done();
    };
    wrapper.changePassword('usernotpresent', 'oldPassword', 'newPassword', callback);
  });

  test('changePassword - it should throw an error for wrong password', (done) => {
    const callback = (error, isSuccess): void => {
      expect(error).not.toBeNull();
      expect(error.message).toBe(
        `Unable to change password for user 'username': invalid old password`
      );
      expect(isSuccess).toBeFalsy();
      done();
    };
    wrapper.changePassword('username', 'wrongPassword', 'newPassword', callback);
  });

  test('changePassword - it should change password', (done) => {
    let dataToWrite;
    // @ts-ignore
    fs.writeFile = jest.fn((_name, data, callback) => {
      dataToWrite = data;
      callback();
    });
    const callback = (error, isSuccess): void => {
      expect(error).toBeNull();
      expect(isSuccess).toBeTruthy();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(dataToWrite.indexOf('username')).not.toEqual(-1);
      done();
    };
    wrapper.changePassword('username', 'password', 'newPassword', callback);
  });
});
