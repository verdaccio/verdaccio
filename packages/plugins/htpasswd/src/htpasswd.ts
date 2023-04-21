import buildDebug from 'debug';
import fs from 'fs';
import { dirname, resolve } from 'path';

import { pluginUtils } from '@verdaccio/core';
import { unlockFile } from '@verdaccio/file-locking';
import { Callback, Logger } from '@verdaccio/types';

import {
  HtpasswdHashAlgorithm,
  HtpasswdHashConfig,
  addUserToHTPasswd,
  changePasswordToHTPasswd,
  lockAndRead,
  parseHTPasswd,
  sanityCheck,
  verifyPassword,
} from './utils';

const debug = buildDebug('verdaccio:plugin:htpasswd');

export type HTPasswdConfig = {
  file: string;
  algorithm?: HtpasswdHashAlgorithm;
  rounds?: number;
  max_users?: number;
  slow_verify_ms?: number;
};

export const DEFAULT_BCRYPT_ROUNDS = 10;
export const DEFAULT_SLOW_VERIFY_MS = 200;

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
  private logger: Logger;
  private lastTime: any;
  // constructor
  public constructor(config: HTPasswdConfig, options: pluginUtils.PluginOptions) {
    super(config, options);
    this.users = {};

    // verdaccio logger
    this.logger = options.logger;

    // all this "verdaccio_config" stuff is for b/w compatibility only
    this.maxUsers = config.max_users ? config.max_users : Infinity;

    let algorithm: HtpasswdHashAlgorithm;
    let rounds: number | undefined;

    if (config.algorithm === undefined) {
      algorithm = HtpasswdHashAlgorithm.bcrypt;
    } else if (HtpasswdHashAlgorithm[config.algorithm] !== undefined) {
      algorithm = HtpasswdHashAlgorithm[config.algorithm];
    } else {
      throw new Error(`Invalid algorithm "${config.algorithm}"`);
    }
    debug(`password hash algorithm: ${algorithm}`);
    if (algorithm === HtpasswdHashAlgorithm.bcrypt) {
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
      if (err) {
        return cb(err.code === 'ENOENT' ? null : err);
      }
      if (!this.users[user]) {
        return cb(null, false);
      }

      let passwordValid = false;
      try {
        const start = new Date();
        passwordValid = await verifyPassword(password, this.users[user]);
        const durationMs = new Date().getTime() - start.getTime();
        if (durationMs > this.slowVerifyMs) {
          this.logger.warn(
            { user, durationMs },
            'Password for user "@{user}" took @{durationMs}ms to verify'
          );
        }
      } catch ({ message }) {
        this.logger.error({ message }, 'Unable to verify user password: @{message}');
      }
      if (!passwordValid) {
        return cb(null, false);
      }

      // authentication succeeded!
      // return all usergroups this user has access to;
      // (this particular package has no concept of usergroups, so just return
      // user herself)
      return cb(null, [user]);
    });
  }

  /**
   * Add user
   * 1. lock file for writing (other processes can still read)
   * 2. reload .htpasswd
   * 3. write new data into .htpasswd.tmp
   * 4. move .htpasswd.tmp to .htpasswd
   * 5. reload .htpasswd
   * 6. unlock file
   *
   * @param {string} user
   * @param {string} password
   * @param {function} realCb
   * @returns {Promise<any>}
   */
  public async adduser(user: string, password: string, realCb: Callback): Promise<any> {
    const pathPass = this.path;
    debug('adduser %s', user);
    let sanity = await sanityCheck(user, password, verifyPassword, this.users, this.maxUsers);

    // preliminary checks, just to ensure that file won't be reloaded if it's
    // not needed
    if (sanity) {
      return realCb(sanity, false);
    }

    lockAndRead(pathPass, async (err, res): Promise<void> => {
      let locked = false;

      // callback that cleans up lock first
      const cb = (err): void => {
        if (locked) {
          unlockFile(pathPass, () => {
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

      // ignore ENOENT errors, we'll just create .htpasswd in that case
      if (err && err.code !== 'ENOENT') {
        return cb(err);
      }
      const body = (res || '').toString('utf8');
      this.users = parseHTPasswd(body);

      // real checks, to prevent race conditions
      // parsing users after reading file.
      sanity = await sanityCheck(user, password, verifyPassword, this.users, this.maxUsers);

      if (sanity) {
        return cb(sanity);
      }

      try {
        this._writeFile(addUserToHTPasswd(body, user, password, this.hashConfig), cb);
      } catch (err: any) {
        return cb(err);
      }
    });
  }

  /**
   * Reload users
   * @param {function} callback
   */
  public reload(callback: Callback): void {
    debug('reload users');
    fs.stat(this.path, (err, stats) => {
      if (err) {
        return callback(err);
      }
      if (this.lastTime === stats.mtime) {
        return callback();
      }

      this.lastTime = stats.mtime;

      fs.readFile(this.path, 'utf8', (err, buffer) => {
        if (err) {
          return callback(err);
        }
        debug('reload users total: %s', Object.keys(this.users).length);
        Object.assign(this.users, parseHTPasswd(buffer));
        callback();
      });
    });
  }

  private _stringToUt8(authentication: string): string {
    return (authentication || '').toString();
  }

  private _writeFile(body: string, cb: Callback): void {
    fs.writeFile(this.path, body, (err) => {
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
    lockAndRead(this.path, async (err, res) => {
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

      const body = this._stringToUt8(res);
      this.users = parseHTPasswd(body);

      try {
        this._writeFile(
          await changePasswordToHTPasswd(body, user, password, newPassword, this.hashConfig),
          cb
        );
      } catch (err: any) {
        return cb(err);
      }
    });
  }
}
