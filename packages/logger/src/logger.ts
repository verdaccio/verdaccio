/* eslint-disable */

const cluster = require('cluster');
const Logger = require('bunyan');
const Error = require('http-errors');
const Stream = require('stream');
const _ = require('lodash');
const dayjs = require('dayjs');

const pkgJSON = require('../package.json');


import {prettyTimestamped} from "./format/pretty-timestamped";
import {pretty} from "./format/pretty";
import {jsonFormat} from "./format/json";

/**
 * A RotatingFileStream that modifies the message first
 */
class VerdaccioRotatingFileStream extends Logger.RotatingFileStream {
  // We depend on mv so that this is there
  write(obj) {
    super.write(jsonFormat(obj, false));
  }

  rotate(): void {
    super.rotate();
    this.emit('rotated');
  }
}

let logger;

export interface LoggerTarget {
  type?: string;
  format?: string;
  level?: string;
  options?: any;
  path?: string;
}

const DEFAULT_LOGGER_CONF = [{ type: 'stdout', format: 'pretty', level: 'http' }];

/**
 * Setup the Buyan logger
 * @param {*} logs list of log configuration
 */
function setup(logs, { logStart } = { logStart: true }) {
  const streams: any = [];
  if (logs == null) {
    logs = DEFAULT_LOGGER_CONF;
  }

  logs.forEach(function(target: LoggerTarget) {
    let level = target.level || 35;
    if (level === 'http') {
      level = 35;
    }

    // create a stream for each log configuration
    if (target.type === 'rotating-file') {
      if (target.format !== 'json') {
        throw new Error('Rotating file streams only work with JSON!');
      }
      if (cluster.isWorker) {
        // https://github.com/trentm/node-bunyan#stream-type-rotating-file
        throw new Error('Cluster mode is not supported for rotating-file!');
      }

      const stream = new VerdaccioRotatingFileStream(
        // @ts-ignore
        _.merge(
          {},
          // Defaults can be found here: https://github.com/trentm/node-bunyan#stream-type-rotating-file
          target.options || {},
          { path: target.path, level }
        )
      );

      const rotateStream = {
        type: 'raw',
        level,
        stream,
      };

      if (logStart) {
        stream.on('rotated', () => logger.warn('Start of logfile'));
      }

      streams.push(rotateStream);
    } else {
      const stream = new Stream();
      stream.writable = true;

      let destination;
      let destinationIsTTY = false;
      if (target.type === 'file') {
        // destination stream
        destination = require('fs').createWriteStream(target.path, { flags: 'a', encoding: 'utf8' });
        destination.on('error', function(err) {
          stream.emit('error', err);
        });
      } else if (target.type === 'stdout' || target.type === 'stderr') {
        destination = target.type === 'stdout' ? process.stdout : process.stderr;
        destinationIsTTY = destination.isTTY;
      } else {
        throw Error('wrong target type for a log');
      }

      if (target.format === 'pretty') {
        // making fake stream for pretty printing
        stream.write = obj => {
          destination.write(pretty(obj, destinationIsTTY));
        };
      } else if (target.format === 'pretty-timestamped') {
        // making fake stream for pretty printing
        stream.write = obj => {
          destination.write(prettyTimestamped(obj, destinationIsTTY));
        };
      } else {
        stream.write = obj => {
          destination.write(jsonFormat(obj, destinationIsTTY));
        };
      }

      streams.push({
        // @ts-ignore
        type: 'raw',
        // @ts-ignore
        level,
        // @ts-ignore
        stream: stream,
      });
    }
  });

  // buyan default configuration
  logger = new Logger({
    name: pkgJSON.name,
    streams: streams,
    serializers: {
      err: Logger.stdSerializers.err,
      req: Logger.stdSerializers.req,
      res: Logger.stdSerializers.res,
    },
  });

  // In case of an empty log file, we ensure there is always something logged. This also helps see if the server
  // was restarted in any cases
  if (logStart) {
    logger.warn('Verdaccio started');
  }

  process.on('SIGUSR2', function() {
    Logger.reopenFileStreams();
  });
}

export { setup, logger };
