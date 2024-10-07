/* eslint-disable new-cap */
import MockDate from 'mockdate';
import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { API_ERROR, constants, fileUtils, pluginUtils } from '@verdaccio/core';

import HTPasswd, { HTPasswdConfig } from '../src/htpasswd';

const options = {
  logger: { warn: vi.fn(), info: vi.fn() },
  config: new Config(parseConfigFile(path.join(__dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions;

const config = {
  file: './htpasswd',
  max_users: 1000,
} as HTPasswdConfig;

vi.mock('../src/crypto-utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/crypto-utils')>()),
  randomBytes: (): { toString: () => string } => {
    return {
      toString: (): string => 'token',
    };
  },
}));

describe('HTPasswd', () => {
  let wrapper;

  beforeEach(async () => {
    const tempPath = await fileUtils.createTempFolder('htpasswd');
    const file = path.join(tempPath, './htpasswd');
    wrapper = new HTPasswd({ ...config, file }, options);
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe('addUser()', () => {
    test('it should not pass sanity check', async () => {
      vi.doMock('../src/utils.ts', async (importOriginal) => {
        return {
          ...(await importOriginal<typeof import('../src/utils')>()),
          sanityCheck: vi.fn((): Error => Error(API_ERROR.UNAUTHORIZED_ACCESS)),
        };
      });
      const HTPasswd = (await import('../src/htpasswd')).default;
      const wrapper = new HTPasswd(config, options);
      return new Promise((done) => {
        const callback = (error: Error): void => {
          expect(error.message).toEqual(API_ERROR.UNAUTHORIZED_ACCESS);
          done(true);
        };
        wrapper.adduser('test', 'somerandompassword', callback);
      });
    });

    test('it should add the user', async () => {
      const tempPath = await fileUtils.createTempFolder('htpasswd');
      const file = path.join(tempPath, './htpasswd');
      const wrapper = new HTPasswd(
        {
          ...config,
          file,
        },
        options
      );
      return new Promise((done) => {
        MockDate.set('2018-01-14T11:17:40.712Z');
        const callback = (a, b): void => {
          expect(a).toBeNull();
          expect(b).toBeTruthy();
          done(true);
        };
        wrapper.adduser('usernotpresent', 'somerandompassword', callback);
      });
    });

    describe('addUser() error handling', () => {
      test('sanityCheck should return an Error', async () => {
        vi.doMock('../src/utils.ts', async (importOriginal) => {
          return {
            ...(await importOriginal<typeof import('../src/utils')>()),
            sanityCheck: vi.fn((): Error => Error('some error')),
          };
        });
        const HTPasswd = (await import('../src/htpasswd')).default;
        await new Promise((done) => {
          const wrapper = new HTPasswd(config, options);
          wrapper.adduser('sanityCheck', 'test', (sanity) => {
            expect(sanity.message).toBeDefined();
            expect(sanity.message).toMatch('some error');
            done(true);
          });
        });
      });

      test('lockAndRead should return an Error', async () => {
        vi.doMock('../src/utils.ts', async (importOriginal) => {
          return {
            ...(await importOriginal<typeof import('../src/utils')>()),
            lockAndRead: (_a, b): any => b(new Error('lock error')),
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });
        const HTPasswd = (await import('../src/htpasswd')).default;
        await new Promise((done) => {
          const wrapper = new HTPasswd(config, options);
          wrapper.adduser('lockAndRead', 'test', (sanity) => {
            expect(sanity.message).toBeDefined();
            expect(sanity.message).toMatch('lock error');
            done(true);
          });
        });
      });

      test('addUserToHTPasswd should return an Error', async () => {
        vi.doMock('../src/utils.ts', async (importOriginal) => {
          return {
            ...(await importOriginal<typeof import('../src/utils')>()),
            addUserToHTPasswd: () => {
              throw new Error('addUserToHTPasswd error');
            },
            lockAndRead: (_a, b): any => b(null, ''),
            unlockFile: (_a, b): any => b(),
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });
        const HTPasswd = (await import('../src/htpasswd')).default;
        await new Promise((done) => {
          const wrapper = new HTPasswd(config, options);
          wrapper.adduser('addUserToHTPasswd', 'test', () => {
            done(true);
          });
        });
      });

      test.skip('writeFile should return an Error', async () => {
        vi.doMock('../src/utils.ts', async (importOriginal) => {
          return {
            ...(await importOriginal<typeof import('../src/utils')>()),
            sanityCheck: () => Promise.resolve(null),
            parseHTPasswd: (): void => {},
            lockAndRead: (_a, b): any => b(null, ''),
            addUserToHTPasswd: (): void => {},
            HtpasswdHashAlgorithm: constants.HtpasswdHashAlgorithm,
          };
        });
        const HTPasswd = (await import('../src/htpasswd')).default;
        await new Promise((done) => {
          vi.doMock('fs', async (importOriginal) => {
            return {
              ...(await importOriginal<typeof import('fs')>()),
              writeFile: vi.fn((_name, _data, callback) => {
                callback(new Error('write error'));
              }),
            };
          });

          const wrapper = new HTPasswd(config, options);
          wrapper.adduser('addUserToHTPasswd', 'test', (err) => {
            expect(err).not.toBeNull();
            expect(err.message).toMatch('write error');
            done(true);
          });
        });
      });
    });
  });
  describe('reload()', () => {
    test('it should read the file and set the users', () => {
      return new Promise((done) => {
        wrapper.adduser('sanityCheck', 'test', () => {
          const callback = (): void => {
            expect(wrapper.users).toHaveProperty('sanityCheck');
            done(true);
          };
          wrapper.reload(callback);
        });
      });
    });

    test('reload should fails on check file', async () => {
      vi.doMock('fs', async (importOriginal) => {
        return {
          ...(await importOriginal<typeof import('fs')>()),
          stat: vi.fn((path, callback) => {
            callback(new Error('stat error'), null);
          }),
        };
      });
      const HTPasswd = (await import('../src/htpasswd')).default;
      await new Promise((done) => {
        wrapper.adduser('sanityCheck', 'test', () => {
          const callback = (err): void => {
            expect(err).not.toBeNull();
            expect(err.message).toMatch('stat error');
            done(true);
          };

          const wrapper = new HTPasswd(config, options);
          wrapper.reload(callback);
        });
      });
    });

    test('reload times match', async () => {
      vi.doMock('fs', async (importOriginal) => {
        return {
          ...(await importOriginal<typeof import('fs')>()),
          stat: vi.fn((_path, callback) => {
            callback(null, {
              mtime: null,
            });
          }),
        };
      });
      const HTPasswd = (await import('../src/htpasswd')).default;
      await new Promise((done) => {
        const callback = (err): void => {
          expect(err).toBeUndefined();
          done(true);
        };

        const wrapper = new HTPasswd(config, options);
        wrapper.reload(callback);
      });
    });

    test('reload should fails on read file', async () => {
      vi.doMock('fs', async (importOriginal) => {
        return {
          ...(await importOriginal<typeof import('fs')>()),
          readFile: vi.fn((_name, _format, callback) => {
            callback(new Error('read error'), null);
          }),
        };
      });
      const HTPasswd = (await import('../src/htpasswd')).default;
      await new Promise((done) => {
        const callback = (err): void => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch('read error');
          done(true);
        };

        const wrapper = new HTPasswd(config, options);
        wrapper.reload(callback);
      });
    });
  });
});
