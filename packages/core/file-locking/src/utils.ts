import fs from 'fs';
import path from 'path';

import locker from 'lockfile';

export const statDir = (name: string): Promise<Error | null> => {
  return new Promise((resolve, reject): void => {
    // test to see if the directory exists
    const dirPath = path.dirname(name);
    fs.stat(dirPath, function (err, stats) {
      if (err) {
        return reject(err);
      } else if (!stats.isDirectory()) {
        return resolve(new Error(`${path.dirname(name)} is not a directory`));
      } else {
        return resolve(null);
      }
    });
  });
};

export const statfile = (name: string): Promise<Error | null> => {
  return new Promise((resolve, reject): void => {
    // test to see if the directory exists
    fs.stat(name, function (err, stats) {
      if (err) {
        return reject(err);
      } else if (!stats.isFile()) {
        return resolve(new Error(`${path.dirname(name)} is not a file`));
      } else {
        return resolve(null);
      }
    });
  });
};

export const lockfile = (name: string): Promise<unknown> => {
  return new Promise<void>((resolve): void => {
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
    };
    const lockFileName = `${name}.lock`;
    locker.lock(lockFileName, lockOpts, () => {
      resolve();
    });
  });
};
