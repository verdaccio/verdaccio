#!/usr/bin/env node

/* eslint no-sync:0 */
/* eslint no-empty:0 */

if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
}

// eslint-disable-next-line import/order
const logger = require('./logger');
logger.setup(null, { logStart: false }); // default setup

require('./cli/cli');

process.on('uncaughtException', function (err) {
  logger.logger.fatal(
    {
      err: err,
    },
    'uncaught exception, please report this\n@{err.stack}'
  );
  process.exit(255);
});
