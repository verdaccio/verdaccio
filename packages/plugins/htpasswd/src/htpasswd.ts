import fs from 'fs';
import { HttpError } from 'http-errors';
import { dirname, resolve } from 'path';

import { unlockFile } from '@verdaccio/file-locking';
import { Callback, Config, IPluginAuth, Logger, PluginOptions } from '@verdaccio/types';

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

export type HTPasswdConfig = {
  file: string;
  algorithm?: HtpasswdHashAlgorithm;
  rounds?: number;
} & Config;

export const DEFAULT_BCRYPT_ROUNDS = 10;

/**
 * HTPasswd - Verdaccio auth class
 */
export default class HTPasswd implements IPluginAuth<HTPasswdConfig> {
  /**
   *
   * @param {*} config htpasswd file
   * @param {object} stuff config.yaml in object from
   */
  private users: {};
  private stuff: {};
  private config: {};
  private verdaccioConfig: Config;
  private maxUsers: number;
  private hashConfig: HtpasswdHashConfig;
  private path: string;
  private logger: Logger;
  private lastTime: any;
  // constructor
  public constructor(config: HTPasswdConfig, stuff: PluginOptions<{}>) {
    this.users = {};

    // config for this module
    this.config = config;
    this.stuff = stuff;

    // verdaccio logger
    this.logger = stuff.logger;

    // verdaccio main config object
    this.verdaccioConfig = stuff.config;

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

    if (!file) {
      throw new Error('should specify "file" in config');
    }

    this.path = this.getPath(file);
  }

  public getPath(file) {
    return resolve(dirname(this.verdaccioConfig.config_path), file);
  }

  /**
   * authenticate - Authenticate user.
   * @param {string} user
   * @param {string} password
   * @param {function} cd
   * @returns {function}
   */
  public authenticate(user: string, password: string, cb: Callback): void {
    this.reload((err) => {
      if (err) {
        return cb(err.code === 'ENOENT' ? null : err);
      }
      if (!this.users[user]) {
        return cb(null, false);
      }
      if (!this.verifyPassword(password, this.users[user])) {
        return cb(null, false);
      }

      // authentication succeeded!
      // return all usergroups this user has access to;
      // (this particular package has no concept of usergroups, so just return
      // user herself)
      return cb(null, [user]);
    });
  }

  public verifyPassword(passwd: string, hash: string) {
    return verifyPassword(passwd, hash);
  }

  public sanityCheck(user: string, password: string, verifyPassword): HttpError | null {
    return sanityCheck(user, password, verifyPassword, this.users, this.maxUsers);
  }

  public lockAndRead(name: string, cb: Callback): void {
    lockAndRead(name, cb);
  }

  public unlockFile(name: string, cb: Callback): void {
    unlockFile(name, cb);
  }

  public parseHTPasswd(input: string): Record<string, any> {
    return parseHTPasswd(input);
  }

  public addUserToHTPasswd(
    body: string,
    user: string,
    passwd: string,
    hashConfig: HtpasswdHashConfig
  ): string {
    return addUserToHTPasswd(body, user, passwd, hashConfig);
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
   * @returns {function}
   */
  public adduser(user: string, password: string, realCb: Callback): any {
    const pathPass = this.path;
    let sanity = this.sanityCheck(user, password, this.verifyPassword);

    // preliminary checks, just to ensure that file won't be reloaded if it's
    // not needed
    if (sanity) {
      return realCb(sanity, false);
    }

    this.lockAndRead(pathPass, (err, res): void => {
      let locked = false;

      // callback that cleans up lock first
      const cb = (err): void => {
        if (locked) {
          this.unlockFile(pathPass, () => {
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
      this.users = this.parseHTPasswd(body);

      // real checks, to prevent race conditions
      // parsing users after reading file.
      sanity = sanityCheck(user, password, verifyPassword, this.users, this.maxUsers);

      if (sanity) {
        return cb(sanity);
      }

      try {
        const htpasswUser: string = this.addUserToHTPasswd(body, user, password, this.hashConfig);
        this.writeFile(htpasswUser, cb);
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

        Object.assign(this.users, this.parseHTPasswd(buffer));

        callback(null, this.users);
      });
    });
  }

  private _stringToUt8(authentication: string): string {
    return (authentication || '').toString();
  }

  public writeFile(body: string, cb: Callback): void {
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
   * @param {function} cd
   * @returns {function}
   */
  public changePassword(
    user: string,
    password: string,
    newPassword: string,
    realCb: Callback
  ): void {
    this.lockAndRead(this.path, (err, res) => {
      let locked = false;
      const pathPassFile = this.path;

      // callback that cleans up lock first
      const cb = (err): void => {
        if (locked) {
          this.unlockFile(pathPassFile, () => {
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
      this.users = this.parseHTPasswd(body);

      if (!this.users[user]) {
        return cb(new Error('User not found'));
      }

      try {
        this.writeFile(
          changePasswordToHTPasswd(body, user, password, newPassword, this.hashConfig),
          cb
        );
      } catch (err: any) {
        return cb(err);
      }
    });
  }
}
