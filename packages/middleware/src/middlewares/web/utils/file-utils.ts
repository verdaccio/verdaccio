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

export function sendFileSafe(path: string, filename: string, res, next) {
  const safe = fileUtils.resolveSafePath(path, filename);
  if (!safe) {
    debug('unsafe filename requested %o', filename);
    return next();
  }
  debug('serve file %o', safe);
  res.sendFile(safe, sendFileCallback(next));
}
