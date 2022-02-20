/* eslint-disable jest/no-mocks-import */
import crypto from 'crypto';
import fs from 'fs-extra';
import { HttpError } from 'http-errors';
import MockDate from 'mockdate';
import os from 'os';
import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import HTPasswd, { VerdaccioConfigApp } from '../src/htpasswd';
// import { HtpasswdHashAlgorithm } from '../src/utils';
import Config from './__mocks__/Config';
// FIXME: remove this mocks imports
import Logger from './__mocks__/Logger';

export function createTempFolder(prefix: string) {
  return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), prefix));
}

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
    stuff.config.config_path = path.join(createTempFolder('test_htpassw'), 'config.yaml');
    wrapper = new HTPasswd(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);

    // @ts-expect-error
    crypto.randomBytes = vi.fn(() => {
      return {
        toString: (): string => '$6',
      };
    });
  });

  describe('constructor()', () => {
    const emptyPluginOptions = { config: {} } as VerdaccioConfigApp;

    test('should files whether file path does not exist', () => {
      expect(function () {
        // @ts-expect-error
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
      wrapper.adduser('test', 'test', () => {
        wrapper.authenticate('test', 'test', (a, b) => {
          expect(a).toBeNull();
          expect(b).toContain('test');
          wrapper.adduser('username', 'password', () => {
            wrapper.authenticate('username', 'password', (a, b) => {
              expect(a).toBeNull();
              expect(b).toContain('username');
              done();
            });
          });
        });
      });
    });

    test('it should not authenticate user with given credentials', (done) => {
      wrapper.authenticate('test', 'somerandompassword', (a, b) => {
        expect(a).toBeNull();
        expect(b).toBeFalsy();
        done();
      });
    });
  });

  describe('addUser()', () => {
    test('it should not pass sanity check', (done) => {
      wrapper.adduser('test', 'test', () => {
        wrapper.adduser('test', 'somerandompassword', (a) => {
          expect(a?.message).toEqual('unauthorized access');
          done();
        });
      });
    });

    test('it should add the user', (done) => {
      let dataToWrite;
      class MockAddUser extends HTPasswd {
        public writeFile(body: string, cb: any): void {
          dataToWrite = body;
          cb(null);
        }
      }
      const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);
      MockDate.set('2018-01-14T11:17:40.712Z');

      const callback = (a, b): void => {
        expect(a).toBeNull();
        expect(b).toBeTruthy();
        expect(dataToWrite.indexOf('usernotpresent')).not.toEqual(-1);
        done();
      };

      wrapper.adduser('usernotpresent', 'somerandompassword', callback);
    });
  });

  describe('addUser() error handling', () => {
    test('sanityCheck should return an Error', (done) => {
      class MockAddUser extends HTPasswd {
        public sanityCheck(): HttpError<number> {
          // @ts-expect-error
          return Error('some error');
        }
      }
      const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);
      wrapper.adduser('sanityCheck', 'test', (sanity) => {
        expect(sanity.message).toBeDefined();
        expect(sanity.message).toMatch('some error');
        done();
      });
    });
    test('lockAndRead should return an Error', (done) => {
      class MockAddUser extends HTPasswd {
        public sanityCheck(): HttpError<number> {
          return null;
        }
        lockAndRead(_a, b) {
          return b(new Error('lock error'));
        }
      }
      const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);
      wrapper.adduser('lockAndRead', 'test', (sanity) => {
        expect(sanity.message).toBeDefined();
        expect(sanity.message).toMatch('lock error');
        done();
      });
    });
    test('addUserToHTPasswd should return an Error', (done) => {
      class MockAddUser extends HTPasswd {
        public sanityCheck(): HttpError<number> {
          return null;
        }
        lockAndRead(_a, b) {
          return b(null, '');
        }
        unlockFile(_a, b) {
          return b();
        }
        parseHTPasswd() {
          return {};
        }
      }

      const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);

      wrapper.adduser('addUserToHTPasswd', 'test', () => {
        done();
      });
    });

    test('writeFile should return an Error', (done) => {
      class MockAddUser extends HTPasswd {
        public sanityCheck(): HttpError<number> {
          return null;
        }
        lockAndRead(_a, b) {
          return b(null, '');
        }
        unlockFile(_a, b) {
          return b();
        }
        parseHTPasswd() {
          return {};
        }
        writeFile(_n, callback) {
          callback(new Error('write error'));
        }
      }

      const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);
      wrapper.adduser('thisWillFail', 'test', (err) => {
        expect(err).not.toBeNull();
        expect(err.message).toMatch('write error');
        done();
      });
    });
  });

  describe('reload()', () => {
    test('it should read the file and set the users', (done) => {
      wrapper.adduser('test', 'test', () => {
        wrapper.adduser('username', 'username', () => {
          wrapper.reload((error, users) => {
            expect(error).toBeNull();
            expect(users.test).toBeDefined();
            expect(users.username).toBeDefined();
            done();
          });
        });
      });

      // test('reload should fails on check file', (done) => {
      //   jest.doMock('fs', () => {
      //     return {
      //       readFile: (_name, callback): void => {
      //         callback(new Error('stat error'), null);
      //       },
      //       stat: (_name, callback): void => {
      //         callback(new Error('stat error'), null);
      //       },
      //     };
      //   });
      //   const callback = (err): void => {
      //     expect(err).not.toBeNull();
      //     expect(err.message).toMatch('stat error');
      //     done();
      //   };
      //
      //   const HTPasswd = require('../src/htpasswd.ts').default;
      //   const wrapper = new HTPasswd(config, stuff);
      //   wrapper.reload(callback);
      // });

      // test('reload times match', (done) => {
      //   jest.doMock('fs', () => {
      //     return {
      //       readFile: (_name, callback): void => {
      //         callback(new Error('stat error'), null);
      //       },
      //       stat: (_name, callback): void => {
      //         callback(null, {
      //           mtime: null,
      //         });
      //       },
      //     };
      //   });
      //   const callback = (err): void => {
      //     expect(err).toBeUndefined();
      //     done();
      //   };
      //       test('reload should fails on read file', (done) => {
      //         jest.doMock('fs', () => {
      //           return {
      //             stat: jest.requireActual('fs').stat,
      //             readFile: (_name, _format, callback): void => {
      //               callback(new Error('read error'), null);
      //             },
      //           };
      //         });
      //         const callback = (err): void => {
      //           expect(err).not.toBeNull();
      //           expect(err.message).toMatch('read error');
      //           done();
      //         };
      //         const HTPasswd = require('../src/htpasswd.ts').default;
      //         const wrapper = new HTPasswd(config, stuff);
      //         wrapper.reload(callback);
      //       });
      //     });
    });
    describe('changePassword', () => {
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
        wrapper.adduser('username', 'test', () => {
          wrapper.changePassword(
            'username',
            'wrongPassword',
            'newPassword',
            (error, isSuccess): void => {
              expect(error).not.toBeNull();
              expect(error?.message).toBe('Invalid old Password');
              expect(isSuccess).toBeFalsy();
              done();
            }
          );
        });
      });

      test('changePassword - it should change password', (done) => {
        let dataToWrite;
        class MockAddUser extends HTPasswd {
          public writeFile(body: string, cb: any): void {
            dataToWrite = body;
            cb(null);
          }
          public _stringToUt8() {
            return 'username:$66to3JK5RgZM:autocreated 2018-01-17T03:40:46.315Z';
          }
        }
        const wrapper = new MockAddUser(getDefaultConfig(), stuff as unknown as VerdaccioConfigApp);
        const callback = (error, isSuccess): void => {
          expect(error).toBeNull();
          expect(isSuccess).toBeTruthy();
          expect(dataToWrite.indexOf('username')).not.toEqual(-1);
          done();
        };
        wrapper.adduser('username', 'password', () => {
          wrapper.changePassword('username', 'password', 'newPassword', callback);
        });
      });
    });
  });
});
