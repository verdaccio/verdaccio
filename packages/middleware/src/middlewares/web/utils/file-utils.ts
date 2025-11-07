import buildDebug from 'debug';

import { HTTP_STATUS, fileUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:middleware:web:utils');

export const sendFileCallback = (next) => (err) => {
  if (!err) {
    return;
  }
  if (err.status === HTTP_STATUS.NOT_FOUND) {
    next();
  } else {
    next(err);
  }
};

/**
 * Safely serve a file by validating and resolving the path to prevent directory traversal.
 * @param path Base directory path
 * @param filename Requested filename (user input)
 * @param res Express response object
 * @param next Express next function
 */
export function sendFileSafe(path: string, filename: string, res, next) {
  // CodeQL[js/path-injection] - filename is validated by resolveSafePath which prevents directory traversal
  // First validation layer: check filename for basic validity
  if (!filename || typeof filename !== 'string' || !fileUtils.isSecureFilename(filename)) {
    debug('invalid filename rejected %o', filename);
    return next();
  }

  // Second validation layer: resolve safe path within base directory
  const safe = fileUtils.resolveSafePath(path, filename);
  if (!safe) {
    debug('unsafe filename requested %o', filename);
    return next();
  }
  debug('serve file %o', safe);
  res.sendFile(safe, sendFileCallback(next));
}
