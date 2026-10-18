import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import type { pluginUtils } from '@verdaccio/core';
import { fileUtils } from '@verdaccio/core';

import type { HTPasswdConfig } from '../src/htpasswd';
import HTPasswd, { DEFAULT_SLOW_VERIFY_MS, DEFAULT_VERIFY_CACHE_MS } from '../src/htpasswd';
import { parseHTPasswd } from '../src/utils';

const options = {
  logger: { warn: vi.fn(), info: vi.fn() },
  config: new Config(parseConfigFile(path.join(import.meta.dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions;

const config = {
  file: './htpasswd',
  max_users: 1000,
} as HTPasswdConfig;

describe('HTPasswd', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = new HTPasswd(config, options);
    vi.resetModules();
    vi.clearAllMocks();

    // @ts-ignore
    crypto.randomBytes = vi.fn(() => {
      return {
        toString: (): string => '$6',
      };
    });
  });

  describe('constructor()', () => {
    const error = vi.fn();
    const warn = vi.fn();
    const info = vi.fn();
    const emptyPluginOptions = {
      config: {
        configPath: '',
      },
      logger: { warn, info, error },
    } as any as pluginUtils.PluginOptions;

    test('should ensure file path configuration exists', () => {
      expect(function () {
        new HTPasswd({} as HTPasswdConfig, emptyPluginOptions);
      }).toThrow(/should specify "file" in config/);
    });

    test('should switch to bcrypt if incorrect algorithm is set', () => {
      const invalidConfig = { algorithm: 'invalid', ...config } as HTPasswdConfig;
      new HTPasswd(invalidConfig, emptyPluginOptions);
      expect(warn).toHaveBeenCalledWith(
        'The algorithm selected %s is invalid, switching to to default one "bcrypt", password validation can be affected',
        'invalid'
      );
      expect(info).toHaveBeenCalled();
    });
  });

  describe('authenticate()', () => {
    test.each([
      { username: 'test1111', password: 'test1111' },
      { username: 'username', password: 'password' },
      { username: 'bcrypt', password: 'password' },
    ])('it should authenticate user $username with given credentials', ({ username, password }) => {
      return new Promise((done) => {
        const generateCallback = (username) => (error, userGroups) => {
          expect(error).toBeNull();
          expect(userGroups).toContain(username);
          done();
        };
        wrapper.adduser(username, password, () => {
          wrapper.authenticate(username, password, generateCallback(username));
        });
      });
    });

    test.each([
      { username: 'test1111', password: 'test1111' },
      { username: 'username', password: 'password' },
      { username: 'bcrypt', password: 'password' },
    ])('it should not authenticate use $username with given credentials', ({ username }) => {
      return new Promise((done) => {
        const generateCallback = () => (error) => {
          expect(error).toBeNull();
          // expect(userGroups).toBeFalsy();
          done();
        };
        wrapper.authenticate(username, 'somerandompassword', generateCallback());
      });
    });

    // TODO: flakes on CI
    test.skip('it should warn on slow password verification', () => {
      return new Promise((done) => {
        // @ts-ignore

        bcrypt.compare = vi.fn((_passwd, _hash) => {
          return new Promise((resolve) => setTimeout(resolve, DEFAULT_SLOW_VERIFY_MS + 1)).then(
            () => true
          );
        });
        const callback = (a, b): void => {
          expect(a).toBeNull();
          expect(b).toContain('bcrypt');
          const mockWarn = options.logger.warn as any;
          expect(mockWarn.mock.calls.length).toBe(1);
          const [{ user, durationMs }, message] = mockWarn.mock.calls[0];
          expect(user).toEqual('bcrypt');
          expect(durationMs).toBeGreaterThan(DEFAULT_SLOW_VERIFY_MS);
          expect(message).toEqual('Password for user "@{user}" took @{durationMs}ms to verify');
          done(true);
        };
        wrapper.authenticate('bcrypt', 'password', callback);
      });
    });
  });
});

describe('reload()', () => {
  test('stops authenticating a user removed from the file', async () => {
    const folder = await fileUtils.createTempFolder('htpasswd-reload');
    const file = path.join(folder, 'htpasswd');
    const hash = bcrypt.hashSync('secret', 4);
    await writeFile(file, `removed:${hash}\nkept:${hash}\n`);
    const plugin = new HTPasswd({ file } as HTPasswdConfig, options);
    const authenticate = (user: string) =>
      new Promise((resolve) =>
        plugin.authenticate(user, 'secret', (_err, groups) => resolve(groups))
      );

    await expect(authenticate('removed')).resolves.toEqual(['removed']);
    await writeFile(file, `kept:${hash}\n`);

    await expect(authenticate('removed')).resolves.toBe(false);
    await expect(authenticate('kept')).resolves.toEqual(['kept']);
  });
});

describe('password verification cache', () => {
  const TTL = 60_000;
  const setup = async (extra: Partial<HTPasswdConfig> = { verify_cache_ms: TTL }) => {
    const folder = await fileUtils.createTempFolder('htpasswd-verify-cache');
    const file = path.join(folder, 'htpasswd');
    await writeFile(file, `alice:${bcrypt.hashSync('secret', 4)}\n`);
    const plugin = new HTPasswd({ file, ...extra } as HTPasswdConfig, options);
    const authenticate = (password: string) =>
      new Promise((resolve) =>
        plugin.authenticate('alice', password, (_err, groups) => resolve(groups))
      );
    const compare = vi.spyOn(bcrypt, 'compare');
    const cacheSize = () => (plugin as any).verifyCache.size as number;
    return { file, authenticate, compare, cacheSize };
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('skips bcrypt for a repeated successful login', async () => {
    const { authenticate, compare } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    await expect(authenticate('secret')).resolves.toEqual(['alice']);

    expect(compare).toHaveBeenCalledTimes(1);
  });

  test('runs bcrypt once for a burst of identical concurrent logins', async () => {
    const { authenticate, compare } = await setup();

    const results = await Promise.all(Array.from({ length: 8 }, () => authenticate('secret')));

    expect(results).toEqual(Array.from({ length: 8 }, () => ['alice']));
    expect(compare).toHaveBeenCalledTimes(1);
  });

  test('a concurrent burst with a wrong password fails for every request', async () => {
    const { authenticate } = await setup();

    const results = await Promise.all(Array.from({ length: 4 }, () => authenticate('wrong')));

    expect(results).toEqual([false, false, false, false]);
  });

  test('never caches a failed login', async () => {
    const { authenticate, compare } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    await expect(authenticate('wrong')).resolves.toBe(false);
    await expect(authenticate('wrong')).resolves.toBe(false);

    expect(compare).toHaveBeenCalledTimes(3);
  });

  test('rejects the old password right after a password change', async () => {
    const { file, authenticate } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    await writeFile(file, `alice:${bcrypt.hashSync('changed', 4)}\n`);

    await expect(authenticate('secret')).resolves.toBe(false);
    await expect(authenticate('changed')).resolves.toEqual(['alice']);
  });

  test('verifies again once the entry expires', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { authenticate, compare } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    vi.setSystemTime(Date.now() + TTL + 1);
    await expect(authenticate('secret')).resolves.toEqual(['alice']);

    expect(compare).toHaveBeenCalledTimes(2);
  });

  test('removes expired entries from memory on the next lookup', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const { authenticate, cacheSize } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    expect(cacheSize()).toBe(1);
    vi.setSystemTime(Date.now() + TTL + 1);
    await expect(authenticate('wrong')).resolves.toBe(false);

    expect(cacheSize()).toBe(0);
  });

  test('removes expired entries from memory while idle', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    const { authenticate, cacheSize } = await setup();

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    expect(cacheSize()).toBe(1);
    vi.advanceTimersByTime(2 * TTL);

    expect(cacheSize()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  test('is disabled by default', async () => {
    expect(DEFAULT_VERIFY_CACHE_MS).toBe(0);
    const { authenticate, compare, cacheSize } = await setup({});

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    await expect(authenticate('secret')).resolves.toEqual(['alice']);

    expect(compare).toHaveBeenCalledTimes(2);
    expect(cacheSize()).toBe(0);
  });

  test('verify_cache_ms: 0 disables the cache', async () => {
    const { authenticate, compare } = await setup({ verify_cache_ms: 0 });

    await expect(authenticate('secret')).resolves.toEqual(['alice']);
    await expect(authenticate('secret')).resolves.toEqual(['alice']);

    expect(compare).toHaveBeenCalledTimes(2);
  });
});

describe('adduser()', () => {
  test('keeps both users when the first registrations run concurrently', async () => {
    const file = path.join(await fileUtils.createTempFolder('htpasswd-create'), 'htpasswd');
    const plugin = new HTPasswd({ file } as HTPasswdConfig, options);
    const add = (user: string) =>
      new Promise((resolve) => plugin.adduser(user, 'secret', (err, ok) => resolve([err, ok])));

    await expect(Promise.all([add('alice'), add('bob')])).resolves.toEqual([
      [null, true],
      [null, true],
    ]);

    const users = Object.keys(parseHTPasswd(await readFile(file, 'utf8')));
    expect(users.sort()).toEqual(['alice', 'bob']);
  });
});
