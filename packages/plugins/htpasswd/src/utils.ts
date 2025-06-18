import md5 from 'apache-md5';
import bcrypt from 'bcryptjs';
import buildDebug from 'debug';
import createError, { type HttpError } from 'http-errors';
import crypto from 'node:crypto';

import { API_ERROR, HTTP_STATUS, constants } from '@verdaccio/core';
import { readFile } from '@verdaccio/file-locking';
import { Callback } from '@verdaccio/types';

import crypt3 from './crypt3';

const debug = buildDebug('verdaccio:plugin:htpasswd:utils');
export const DEFAULT_BCRYPT_ROUNDS = 10;

type HtpasswdHashAlgorithm = constants.HtpasswdHashAlgorithm;

export interface HtpasswdHashConfig {
  algorithm: HtpasswdHashAlgorithm;
  rounds?: number;
}

// this function neither unlocks file nor closes it
// it'll have to be done manually later
export function lockAndRead(name: string, cb: Callback): void {
  readFile(name, { lock: true }, (err, res) => {
    if (err) {
      return cb(err);
    }

    return cb(null, res);
  });
}

/**
 * parseHTPasswd - convert htpasswd lines to object.
 * @param {string} input
 * @returns {object}
 */
export function parseHTPasswd(input: string): Record<string, any> {
  // The input is split on line ending styles that are both windows and unix compatible
  return input.split(/[\r]?[\n]/).reduce((result, line) => {
    const args = line.split(':', 3).map((str) => str.trim());
    if (args.length > 1) {
      result[args[0]] = args[1];
    }
    return result;
  }, {});
}

/**
 * verifyPassword - matches password and it's hash.
 * @param {string} passwd
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(passwd: string, hash: string): Promise<boolean> {
  if (hash.match(/^\$2([aby])\$/)) {
    return await bcrypt.compare(passwd, hash);
  } else if (hash.indexOf('{PLAIN}') === 0) {
    return passwd === hash.slice(7);
  } else if (hash.indexOf('{SHA}') === 0) {
    return (
      crypto
        .createHash('sha1')
        // https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding
        .update(passwd, 'utf8')
        .digest('base64') === hash.slice(5)
    );
  }
  // for backwards compatibility, first check md5 then check crypt3
  return md5(passwd, hash) === hash || crypt3(passwd, hash) === hash;
}

/**
 * generateHtpasswdLine - generates line for htpasswd file.
 * @param {string} user
 * @param {string} passwd
 * @param {HtpasswdHashConfig} hashConfig
 * @returns {string}
 */
export async function generateHtpasswdLine(
  user: string,
  passwd: string,
  hashConfig: HtpasswdHashConfig
): Promise<string> {
  let hash: string;

  debug('algorithm %o', hashConfig.algorithm);
  switch (hashConfig.algorithm) {
    case constants.HtpasswdHashAlgorithm.bcrypt:
      hash = await bcrypt.hash(passwd, hashConfig.rounds || DEFAULT_BCRYPT_ROUNDS);
      break;
    case constants.HtpasswdHashAlgorithm.crypt:
      hash = crypt3(passwd);
      break;
    case constants.HtpasswdHashAlgorithm.md5:
      hash = md5(passwd);
      break;
    case constants.HtpasswdHashAlgorithm.sha1:
      hash = '{SHA}' + crypto.createHash('sha1').update(passwd, 'utf8').digest('base64');
      break;
    default:
      throw createError('Unexpected hash algorithm');
  }

  const comment = 'autocreated ' + new Date().toJSON();
  return `${user}:${hash}:${comment}\n`;
}

/**
 * addUserToHTPasswd - Generate a htpasswd format for .htpasswd
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @param {HtpasswdHashConfig} hashConfig
 * @returns {string}
 */
export async function addUserToHTPasswd(
  body: string,
  user: string,
  passwd: string,
  hashConfig: HtpasswdHashConfig
): Promise<string> {
  if (user !== encodeURIComponent(user)) {
    const err = createError('username should not contain non-uri-safe characters');

    err.status = HTTP_STATUS.CONFLICT;
    throw err;
  }

  let newline = await generateHtpasswdLine(user, passwd, hashConfig);

  if (body.length && body[body.length - 1] !== '\n') {
    newline = '\n' + newline;
  }
  return body + newline;
}

/**
 * Sanity check for a user
 * @param {string} user
 * @param {object} users
 * @param {string} password
 * @param {Callback} verifyFn
 * @param {number} maxUsers
 * @returns {object}
 */
export async function sanityCheck(
  user: string,
  password: string,
  verifyFn: Callback,
  users: {},
  maxUsers: number
): Promise<HttpError | null> {
  let err;

  // check for user or password
  if (!user || !password) {
    debug('username or password is missing');
    err = Error(API_ERROR.USERNAME_PASSWORD_REQUIRED);
    err.status = HTTP_STATUS.BAD_REQUEST;
    return err;
  }

  const hash = users[user];

  if (maxUsers < 0) {
    debug('registration is disabled');
    err = Error(API_ERROR.REGISTRATION_DISABLED);
    err.status = HTTP_STATUS.CONFLICT;
    return err;
  }

  if (hash) {
    const auth = await verifyFn(password, users[user]);
    if (auth) {
      debug(`user ${user} already exists`);
      err = Error(API_ERROR.USERNAME_ALREADY_REGISTERED);
      err.status = HTTP_STATUS.CONFLICT;
      return err;
    }
    debug(`user ${user} exists but password is wrong`);
    err = Error(API_ERROR.UNAUTHORIZED_ACCESS);
    err.status = HTTP_STATUS.UNAUTHORIZED;
    return err;
  } else if (Object.keys(users).length >= maxUsers) {
    debug('maximum amount of users reached');
    err = Error(API_ERROR.MAX_USERS_REACHED);
    err.status = HTTP_STATUS.FORBIDDEN;
    return err;
  }

  debug('sanity check passed');
  return null;
}

/**
 * /**
 * changePasswordToHTPasswd - change password for existing user
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @param {string} newPasswd
 * @param {HtpasswdHashConfig} hashConfig
 * @returns {Promise<string>}
 */
export async function changePasswordToHTPasswd(
  body: string,
  user: string,
  passwd: string,
  newPasswd: string,
  hashConfig: HtpasswdHashConfig
): Promise<string> {
  debug('change password for user %o', user);
  let lines = body.split('\n');
  const userLineIndex = lines.findIndex((line) => line.split(':', 1).shift() === user);
  if (userLineIndex === -1) {
    debug('user %o does not exist', user);
    throw new Error(`Unable to change password for user '${user}': user does not currently exist`);
  }
  const [username, hash] = lines[userLineIndex].split(':', 2);
  const passwordValid = await verifyPassword(passwd, hash);
  if (!passwordValid) {
    debug(`invalid old password`);
    throw new Error(`Unable to change password for user '${user}': invalid old password`);
  }
  const updatedUserLine = await generateHtpasswdLine(username, newPasswd, hashConfig);
  lines.splice(userLineIndex, 1, updatedUserLine);
  debug('password changed');
  return lines.join('\n');
}

export function stringToUtf8(authentication: string): string {
  return (authentication || '').toString();
}
