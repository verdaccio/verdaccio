import pino from 'pino';
import _ from 'lodash';
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:logger');

const DEFAULT_LOG_FORMAT = 'pretty';

export let logger;

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function getPrettifier() {
  // TODO: this module can be loaded dynamically and allow custom formatting
  return require('@verdaccio/logger-prettify');
}

export type LogPlugin = {
  dest: string;
  options?: any[];
};

export type LogType = 'file' | 'stdout';
export type LogFormat = 'json' | 'pretty-timestamped' | 'pretty';

export function createLogger(
  options = {},
  destination = pino.destination(1),
  format: LogFormat = DEFAULT_LOG_FORMAT,
  prettyPrintOptions = {
    // we hide warning since the prettifier should not be used in production
    // https://getpino.io/#/docs/pretty?id=prettifier-api
    suppressFlushSyncWarning: true,
  }
) {
  if (_.isNil(format)) {
    format = DEFAULT_LOG_FORMAT;
  }

  let pinoConfig = {
    ...options,
    customLevels: {
      http: 35,
    },
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  };

  debug('has prettifier? %o', !isProd());
  // pretty logs are not allowed in production for performance reason
  if ((format === DEFAULT_LOG_FORMAT || format !== 'json') && isProd() === false) {
    pinoConfig = Object.assign({}, pinoConfig, {
      // FIXME: this property cannot be used in combination with pino.final
      // https://github.com/pinojs/pino-pretty/issues/37
      prettyPrint: {
        levelFirst: true,
        prettyStamp: format === 'pretty-timestamped',
        ...prettyPrintOptions,
      },
      prettifier: getPrettifier(),
    });
  }

  return pino(pinoConfig, destination);
}

export function getLogger() {
  if (_.isNil(logger)) {
    console.warn('logger is not defined');
    return;
  }

  return logger;
}

const DEFAULT_LOGGER_CONF: LoggerConfigItem = {
  type: 'stdout',
  format: 'pretty',
  level: 'http',
};

export type LoggerConfigItem = {
  type?: LogType;
  plugin?: LogPlugin;
  format?: LogFormat;
  path?: string;
  level?: string;
};

export type LoggerConfig = LoggerConfigItem[];

export function setup(options: LoggerConfig | LoggerConfigItem = [DEFAULT_LOGGER_CONF]) {
  debug('setup logger');
  const isLegacyConf = _.isArray(options);
  // verdaccio 4 allows array configuration
  // backward compatible, pick only the first option
  let loggerConfig = isLegacyConf ? options[0] : options;
  if (!loggerConfig?.level) {
    loggerConfig = Object.assign({}, loggerConfig, {
      level: 'http',
    });
  }

  const pinoConfig = { level: loggerConfig.level };
  if (loggerConfig.type === 'file') {
    logger = createLogger(pinoConfig, pino.destination(loggerConfig.path), loggerConfig.format);
  } else if (loggerConfig.type === 'rotating-file') {
    throw new Error('rotating-file type is not longer supported, consider use [logrotate] instead');
  } else {
    logger = createLogger(pinoConfig, pino.destination(1), loggerConfig.format);
  }

  if (isProd()) {
    process.on(
      'uncaughtException',
      pino.final(logger, (err, finalLogger) => {
        finalLogger.fatal(err, 'uncaughtException');
        process.exit(1);
      })
    );

    process.on(
      'unhandledRejection',
      pino.final(logger, (err, finalLogger) => {
        finalLogger.fatal(err, 'uncaughtException');
        process.exit(1);
      })
    );
  }
}
