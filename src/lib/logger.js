'use strict';

const merge = require('merge-options');
const pino = require('pino');
const noir = require('pino-noir')(
  ['req.headers.authorization', `req.headers.cookie`],
  '<Classified>'
);
const defaultConfig = {
  serializers: {
    err: pino.stdSerializers.err,
  },
};

let log;
let currentConfig = {};
module.exports = function getLogger(config, newInstance) {
  if (log && !newInstance) {
    return log;
  }
  currentConfig = merge(
    {},
    defaultConfig, // User may wish to override the `err` serializer.
    config || currentConfig,
    {serializers: noir} // Always apply redaction.
  );
  log = pino(currentConfig);
  return log;
};
