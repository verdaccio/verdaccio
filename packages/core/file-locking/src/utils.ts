import locker from 'lockfile';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'util';

const fsP = fs.promises ? fs.promises : require('fs/promises');

export const readFile = fsP.readFile;
const statPromise = fsP.stat;
// https://github.com/npm/lockfile/issues/33
const lfLock = promisify(locker.lock);
const lfUnlock = promisify(locker.unlock);

/**
 * Test to see if the directory exists
 * @param name
 * @returns
 */
export async function statDir(name: string): Promise<void> {
  const dirPath = path.dirname(name);
  const stats = await statPromise(dirPath);
  if (!stats.isDirectory()) {
    throw new Error(`${path.dirname(name)} is not a directory`);
  }
  return;
}

/**
 *  test to see if the directory exists
 * @param name
 * @returns
 */
export async function statFile(name: string): Promise<void> {
  const stats = await statPromise(name);
  if (!stats.isFile()) {
    throw new Error(`${path.dirname(name)} is not a file`);
  }
  return;
}

/**
 * Lock a file
 * @param name name of the file to lock
 */
export async function lockFileWithOptions(name: string, options?: any): Promise<void> {
  const lockOpts = {
    // time (ms) to wait when checking for stale locks
    wait: 1000,
    // how often (ms) to re-check stale locks
    pollPeriod: 100,
    // locks are considered stale after 5 minutes
    stale: 5 * 60 * 1000,
    // number of times to attempt to create a lock
    retries: 100,
    // time (ms) between tries
    retryWait: 100,
    ...options,
  };
  await lfLock(`${name}.lock`, lockOpts);
}

// unlocks file by removing existing lock file
export async function unlockFileNext(name: string): Promise<void> {
  const lockFileName = `${name}.lock`;
  return lfUnlock(lockFileName);
}
