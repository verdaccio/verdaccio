import buildDebug from 'debug';
import { createHmac, randomBytes } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { constants, pluginUtils } from '@verdaccio/core';
import { unlockFile } from '@verdaccio/file-locking';
import type { Callback, Logger } from '@verdaccio/types';

import type { HtpasswdHashConfig } from './utils';
import {
  DEFAULT_BCRYPT_ROUNDS,
  addUserToHTPasswd,
  changePasswordToHTPasswd,
  lockAndRead,
  parseHTPasswd,
  sanityCheck,
  stringToUtf8,
  verifyPassword,
} from './utils';

type HtpasswdHashAlgorithm = constants.HtpasswdHashAlgorithm;

const debug = buildDebug('verdaccio:plugin:htpasswd');

export type HTPasswdConfig = {
  file: string;
  algorithm?: HtpasswdHashAlgorithm;
  rounds?: number;
  max_users?: number;
  slow_verify_ms?: number;
  verify_cache_ms?: number;
};

export const DEFAULT_SLOW_VERIFY_MS = 200;
export const DEFAULT_VERIFY_CACHE_MS = 60_000;
const MAX_VERIFY_CACHE_ENTRIES = 1000;

/**
 * HTPasswd - Verdaccio auth class
 */
export default class HTPasswd
  extends pluginUtils.Plugin<HTPasswdConfig>
  implements pluginUtils.Auth<HTPasswdConfig>
{
  /**
   *
   * @param {*} config htpasswd file
   * @param {object} options config.yaml in object from
   */
  private users: {};
  private maxUsers: number;
  private hashConfig: HtpasswdHashConfig;
  private path: string;
  private slowVerifyMs: number;
  // Successful password verifications, keyed by an HMAC of user, password and
  // stored hash, so repeated basic-auth requests skip bcrypt. Value: expiry time.
  private verifyCacheMs: number;
  private verifyCache: Map<string, number>;
  // In-flight verifications by the same key, so a burst of identical logins
  // (a package manager fetching in parallel) runs bcrypt once, not per request.
  private pendingVerify: Map<string, Promise<boolean>>;
  private verifyCacheSecret: Buffer;
  private logger: Logger;
  private lastTime: any;
  // constructor
  public constructor(config: HTPasswdConfig, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.users = Object.create(null);

    // verdaccio logger
    this.logger = options.logger;

    // all this "verdaccio_config" stuff is for b/w compatibility only
    this.maxUsers = config.max_users ? config.max_users : Infinity;

    let algorithm: HtpasswdHashAlgorithm;
    let rounds: number | undefined;

    if (typeof config.algorithm === 'undefined') {
      algorithm = constants.HtpasswdHashAlgorithm.bcrypt;
    } else if (constants.HtpasswdHashAlgorithm[config.algorithm] !== undefined) {
      algorithm = constants.HtpasswdHashAlgorithm[config.algorithm];
    } else {
      this.logger.warn(
        `The algorithm selected %s is invalid, switching to to default one "bcrypt", password validation can be affected`,
        config.algorithm
      );
      algorithm = constants.HtpasswdHashAlgorithm.bcrypt;
    }
    debug(`password hash algorithm: ${algorithm}`);
    if (algorithm === constants.HtpasswdHashAlgorithm.bcrypt) {
      rounds = config.rounds || DEFAULT_BCRYPT_ROUNDS;
    } else if (config.rounds !== undefined) {
      this.logger.warn({ algo: algorithm }, 'Option "rounds" is not valid for "@{algo}" algorithm');
    }

    this.hashConfig = {
      algorithm,
      rounds,
    };

    this.lastTime = null;

    const { file } = config;
    debug('file: %s', file);
    if (!file) {
      throw new Error('should specify "file" in config');
    }
    debug('config path: %s', options?.config?.configPath);
    this.path = resolve(dirname(options?.config?.configPath), file);
    this.logger.info({ file: this.path }, 'using htpasswd file: @{file}');
    debug('htpasswd path:', this.path);
    if (config.slow_verify_ms) {
      this.logger.info({ ms: config.slow_verify_ms }, 'slow_verify_ms enabled for @{ms}');
    }
    this.slowVerifyMs = config.slow_verify_ms || DEFAULT_SLOW_VERIFY_MS;
    this.verifyCacheMs =
      typeof config.verify_cache_ms === 'number' && config.verify_cache_ms >= 0
        ? config.verify_cache_ms
        : DEFAULT_VERIFY_CACHE_MS;
    this.verifyCache = new Map();
    this.pendingVerify = new Map();
    this.verifyCacheSecret = randomBytes(32);
  }

  /**
   * Key for the verification cache. The stored hash is part of the key, so a
   * password change or a removed user can never match a stale entry, and the
   * per-process secret keeps the key useless for guessing passwords offline.
   */
  private verifyCacheKey(user: string, password: string, hash: string): string {
    return createHmac('sha256', this.verifyCacheSecret)
      .update(JSON.stringify([user, password, hash]))
      .digest('base64');
  }

  private rememberVerified(key: string): void {
    const now = Date.now();
    if (this.verifyCache.size >= MAX_VERIFY_CACHE_ENTRIES) {
      for (const [entry, expiresAt] of this.verifyCache) {
        if (expiresAt <= now) this.verifyCache.delete(entry);
      }
      // Still full: drop the oldest entry (Map keeps insertion order).
      if (this.verifyCache.size >= MAX_VERIFY_CACHE_ENTRIES) {
        this.verifyCache.delete(this.verifyCache.keys().next().value as string);
      }
    }
    this.verifyCache.set(key, now + this.verifyCacheMs);
  }

  /**
   * authenticate - Authenticate user.
   * @param {string} user
   * @param {string} password
   * @param {function} cb
   * @returns {void}
   */
  public authenticate(user: string, password: string, cb: Callback): void {
    debug('authenticate %s', user);
    this.reload(async (err) => {
      debug('reloaded');
      if (err) {
        debug('error %o', err);
        return cb(err.code === 'ENOENT' ? null : err);
      }
      if (!Object.hasOwn(this.users, user)) {
        debug('user %s not found', user);
        return cb(null, false);
      }

      const hash: string = this.users[user];
      const cacheKey = this.verifyCacheMs > 0 ? this.verifyCacheKey(user, password, hash) : null;
      if (cacheKey !== null && (this.verifyCache.get(cacheKey) ?? 0) > Date.now()) {
        debug('password for %s verified from cache', user);
        return cb(null, [user]);
      }

      const pending = cacheKey !== null ? this.pendingVerify.get(cacheKey) : undefined;
      if (pending) {
        debug('password for %s joins an in-flight verification', user);
        return cb(null, (await pending) ? [user] : false);
      }

      let passwordValid = false;
      let settle: ((valid: boolean) => void) | undefined;
      if (cacheKey !== null) {
        this.pendingVerify.set(
          cacheKey,
          new Promise<boolean>((resolve) => {
            settle = resolve;
          })
        );
      }
      try {
        const start = new Date();
        passwordValid = await verifyPassword(password, hash);
        const durationMs = new Date().getTime() - start.getTime();
        if (durationMs > this.slowVerifyMs) {
          debug('password for user "%s" took %sms to verify', user, durationMs);
          this.logger.warn(
            { user, durationMs },
            'Password for user "@{user}" took @{durationMs}ms to verify'
          );
        }
      } catch (error: any) {
        this.logger.error({ message: error.message }, 'Unable to verify user password: @{message}');
      }
      if (cacheKey !== null) {
        if (passwordValid) {
          this.rememberVerified(cacheKey);
        }
        this.pendingVerify.delete(cacheKey);
        settle?.(passwordValid);
      }
      if (!passwordValid) {
        debug('password invalid for %s', user);
        return cb(null, false);
      }

      // authentication succeeded!
      // return all usergroups this user has access to;
      // (this particular package has no concept of usergroups, so just return
      // user herself)
      return cb(null, [user]);
    });
  }

  /** Register a user and report the result through the callback. */
  public adduser(user: string, password: string, realCb: Callback): void {
    const pathPass = this.path;
    debug('adduser %s', user);
    // Rejection handlers are passed to then() so a throwing callback is never invoked twice.
    void sanityCheck(user, password, verifyPassword, this.users, this.maxUsers).then(
      (rejection) => {
        if (rejection) {
          return realCb(rejection, false);
        }

        // Create the file first so the lock also serializes the very first registrations.
        writeFile(pathPass, '', { flag: 'wx' }, (createError) => {
          if (createError && createError.code !== 'EEXIST') {
            return realCb(createError, false);
          }

          lockAndRead(pathPass, (err, res): void => {
            if (err) {
              return realCb(err, false);
            }
            const cb = (error): void => {
              unlockFile(pathPass, () => realCb(error, !error));
            };

            try {
              const body = (res || '').toString('utf8');
              this.users = parseHTPasswd(body);
              // Recheck after locking and reading to avoid concurrent registration races.
              void sanityCheck(user, password, verifyPassword, this.users, this.maxUsers)
                .then((rejection) => {
                  if (rejection) {
                    throw rejection;
                  }
                  return addUserToHTPasswd(body, user, password, this.hashConfig);
                })
                .then((updated) => this._writeFile(updated, cb), cb);
            } catch (error) {
              cb(error);
            }
          });
        });
      },
      (error) => realCb(error, false)
    );
  }

  /**
   * Reload users
   * @param {function} callback
   */
  public reload(callback: Callback): void {
    debug('reload users');
    debug('path: %s', this.path);
    stat(this.path, (err, stats) => {
      if (err) {
        return callback(err);
      }
      if (this.lastTime === stats.mtime) {
        return callback();
      }

      this.lastTime = stats.mtime;

      readFile(this.path, 'utf8', (err, buffer) => {
        if (err) {
          return callback(err);
        }
        this.users = parseHTPasswd(buffer);
        debug('reload users total: %s', Object.keys(this.users).length);
        callback();
      });
    });
  }

  private _writeFile(body: string, cb: Callback): void {
    writeFile(this.path, body, (err) => {
      if (err) {
        cb(err);
      } else {
        this.reload(() => {
          cb(null);
        });
      }
    });
  }

  /**
   * changePassword - change password for existing user.
   * @param {string} user
   * @param {string} password
   * @param {string} newPassword
   * @param {function} realCb
   * @returns {function}
   */
  public changePassword(
    user: string,
    password: string,
    newPassword: string,
    realCb: Callback
  ): void {
    debug('change password %s', user);
    lockAndRead(this.path, async (err, res) => {
      debug('locked and read');
      let locked = false;
      const pathPassFile = this.path;

      // callback that cleans up lock first
      const cb = (err): void => {
        if (locked) {
          unlockFile(pathPassFile, () => {
            // ignore any error from the unlock
            realCb(err, !err);
          });
        } else {
          realCb(err, !err);
        }
      };

      if (!err) {
        locked = true;
      }

      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }

      const body = stringToUtf8(res);
      this.users = parseHTPasswd(body);

      try {
        debug('change password for user %s', user);
        this._writeFile(
          await changePasswordToHTPasswd(body, user, password, newPassword, this.hashConfig),
          cb
        );
      } catch (err: any) {
        debug('error changing password %o', err);
        return cb(err);
      }
    });
  }
}
