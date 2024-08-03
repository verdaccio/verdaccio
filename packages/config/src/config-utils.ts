import buildDebug from 'debug';
import fs from 'fs';

const debug = buildDebug('verdaccio:config:config-utils');

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function folderExists(path: string): boolean {
  try {
    debug('check folder exist', path);
    const stat = fs.statSync(path);
    const isDirectory = stat.isDirectory();
    debug('folder exist', isDirectory);
    return isDirectory;
  } catch (_: any) {
    debug('folder %s does not exist', path);
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
export function fileExists(path: string): boolean {
  try {
    debug('check file exist', path);
    const stat = fs.statSync(path);
    const isFile = stat.isFile();
    debug('file exist', isFile);
    return isFile;
  } catch (_: any) {
    debug('file %s does not exist', path);
    return false;
  }
}
