#!/usr/bin/env node

const nodeVersion = process.version;
const versionParts = nodeVersion.slice(1).split('.');

const majorVersion = parseInt(versionParts[0]);
const minorVersion = parseInt(versionParts[1]);

if (majorVersion < 16 || (majorVersion === 16 && minorVersion < 0)) {
  throw Error(
    '"Error: Your Node.js version is not supported. Please upgrade to Node.js 16 or higher for this application to work correctly.'
  );
}

if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
}

// eslint-disable-next-line import/order
const logger = require('./logger');

require('./cli/cli');

process.on('uncaughtException', function (err) {
  logger?.logger?.fatal(
    {
      err: err,
    },
    'uncaught exception, please report this\n@{err.stack}'
  );
  process.exit(255);
});
