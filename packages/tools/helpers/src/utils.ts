import fs from 'fs-extra';
import os from 'os';
import path from 'path';

/**
 * Create a temporary folder.
 * @param prefix The prefix of the folder name.
 * @returns string
 * @deprecated use @verdaccio/core:createTempFolder async function instead
 */
export function createTempFolder(prefix: string): string {
  return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), prefix));
}

export const getTarball = (name: string): string => {
  const r = name.split('/');
  if (r.length === 1) {
    return r[0];
  } else {
    return r[1];
  }
};
