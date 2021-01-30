/* eslint-disable jest/no-mocks-import */
import crypto from 'crypto';
// @ts-ignore
import fs from 'fs';

import MockDate from 'mockdate';

import HTPasswd, { VerdaccioConfigApp } from '../src/htpasswd';
import { HtpasswdHashAlgorithm } from '../src/utils';

// FIXME: remove this mocks imports
import Logger from './__mocks__/Logger';
import Config from './__mocks__/Config';

const stuff = {
  logger: new Logger(),
  config: new Config(),
};

const config = {
  file: './htpasswd',
  max_users: 1000,
};

const getDefaultConfig = (): VerdaccioConfigApp => ({
  file: './htpasswd',
  max_users: 1000,
});

describe('HTPasswd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = new HTPasswd(getDefaultConfig(), (stuff as unknown) as VerdaccioConfigApp);
    jest.resetModules();

    crypto.randomBytes = jest.fn(() => {
      return {
        toString: (): string => '$6',
      };
    });
  });

  describe('constructor()', () => {
    const emptyPluginOptions = { config: {} } as VerdaccioConfigApp;

    test('should files whether file path does not exist', () => {
      expect(function () {
        new HTPasswd({}, emptyPluginOptions);
      }).toThrow(/should specify "file" in config/);
    });

    test('should throw error about incorrect algorithm', () => {
      expect(function () {
        let config = getDefaultConfig();
        config.algorithm = 'invalid' as any;
        new HTPasswd(config, emptyPluginOptions);
      }).toThrow(/Invalid algorithm "invalid"/);
    });
  });

  describe('authenticate()', () => {
    test('it should authenticate user with given credentials', (done) => {
      const callbackTest = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toContain('test');
        done();
      };
      const callbackUsername = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toContain('username');
        done();
      };
      wrapper.authenticate('test', 'test', callbackTest);
      wrapper.authenticate('username', 'password', callbackUsername);
    });

    test('it should not authenticate user with given credentials', (done) => {
      const callback = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toBeFalsy();
        done();
      };
      wrapper.authenticate('test', 'somerandompassword', callback);
    });
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
            HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, stuff);
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
            HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, stuff);
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
            HtpasswdHashAlgorithm,
          };
        });

        const HTPasswd = require('../src/htpasswd.ts').default;
        const wrapper = new HTPasswd(config, stuff);
        wrapper.adduser('addUserToHTPasswd', 'test', () => {
          done();
        });
      });

      test('writeFile should return an Error', (done) => {
        jest.doMock('../src/utils.ts', () => {
          return {
            sanityCheck: (): any => null,
            parseHTPasswd: (): void => {},
            lockAndRead: (_a, b): any => b(null, ''),
            addUserToHTPasswd: (): void => {},
            HtpasswdHashAlgorithm,
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
        const wrapper = new HTPasswd(config, stuff);
        wrapper.adduser('addUserToHTPasswd', 'test', (err) => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch('write error');
          done();
        });
      });
    });

    describe('reload()', () => {
      test('it should read the file and set the users', (done) => {
        const output = { test: '$6FrCaT/v0dwE', username: '$66to3JK5RgZM' };
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
        const wrapper = new HTPasswd(config, stuff);
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
        const wrapper = new HTPasswd(config, stuff);
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
        const wrapper = new HTPasswd(config, stuff);
        wrapper.reload(callback);
      });
    });
  });

  test('changePassword - it should throw an error for user not found', (done) => {
    const callback = (error, isSuccess): void => {
      expect(error).not.toBeNull();
      expect(error.message).toBe('User not found');
      expect(isSuccess).toBeFalsy();
      done();
    };
    wrapper.changePassword('usernotpresent', 'oldPassword', 'newPassword', callback);
  });

  test('changePassword - it should throw an error for wrong password', (done) => {
    const callback = (error, isSuccess): void => {
      expect(error).not.toBeNull();
      expect(error.message).toBe('Invalid old Password');
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
