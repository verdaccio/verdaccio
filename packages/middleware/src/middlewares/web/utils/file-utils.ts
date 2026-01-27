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
  // First validation layer: check filename for basic validity
  const safeFilename = fileUtils.sanitizeFilename(filename);

  // Second validation layer: resolve safe path within base directory
  const safe = fileUtils.resolveSafePath(path, safeFilename);
  if (!safe) {
    debug('unsafe filename requested %o', safeFilename);
    return next();
  }
  debug('serve file %o', safe);
  res.sendFile(safe, sendFileCallback(next));
}
