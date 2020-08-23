import { HttpError } from 'http-errors';
import { Callback } from '@verdaccio/types';
export declare function lockAndRead(name: string, cb: Callback): void;
export declare function unlockFile(name: string, cb: Callback): void;
/**
 * parseHTPasswd - convert htpasswd lines to object.
 * @param {string} input
 * @returns {object}
 */
export declare function parseHTPasswd(input: string): Record<string, any>;
/**
 * verifyPassword - matches password and it's hash.
 * @param {string} passwd
 * @param {string} hash
 * @returns {boolean}
 */
export declare function verifyPassword(passwd: string, hash: string): boolean;
/**
 * addUserToHTPasswd - Generate a htpasswd format for .htpasswd
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @returns {string}
 */
export declare function addUserToHTPasswd(body: string, user: string, passwd: string): string;
/**
 * Sanity check for a user
 * @param {string} user
 * @param {object} users
 * @param {number} maxUsers
 * @returns {object}
 */
export declare function sanityCheck(user: string, password: string, verifyFn: Callback, users: {}, maxUsers: number): HttpError | null;
export declare function getCryptoPassword(password: string): string;
/**
 * changePasswordToHTPasswd - change password for existing user
 * @param {string} body
 * @param {string} user
 * @param {string} passwd
 * @param {string} newPasswd
 * @returns {string}
 */
export declare function changePasswordToHTPasswd(body: string, user: string, passwd: string, newPasswd: string): string;
