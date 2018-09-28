/**
 * @prettier
 */

const cluster = require('cluster');
const Logger = require('bunyan');
const Error = require('http-errors');
const Stream = require('stream');
const chalk = require('chalk');
const Utils = require('./utils');
const pkgJSON = require('../../package.json');
const _ = require('lodash');
const {format} = require('date-fns');

/**
 * Match the level based on buyan severity scale
 * @param {*} x severity level
 * @return {String} security level
 */
function getlvl(x) {
  switch (true) {
    case x < 15:
      return 'trace';
    case x < 25:
      return 'debug';
    case x < 35:
      return 'info';
    case x == 35:
      return 'http';
    case x < 45:
      return 'warn';
    case x < 55:
      return 'error';
    default:
      return 'fatal';
  }
}

/**
 * A RotatingFileStream that modifes the message first
 */
class VerdaccioRotatingFileStream extends Logger.RotatingFileStream {
  // We depend on mv so that this is there
  write(obj) {
    const msg = fillInMsgTemplate(obj.msg, obj, false);
    super.write(JSON.stringify({...obj, msg}, Logger.safeCycles()) + '\n');
  }
}

/**
 * Setup the Buyan logger
 * @param {*} logs list of log configuration
 */
function setup(logs) {
  let streams = [];
  if (logs == null) {
    logs = [{type: 'stdout', format: 'pretty', level: 'http'}];
  }

  logs.forEach(function(target) {
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
        _.merge(
          {},
          // Defaults can be found here: https://github.com/trentm/node-bunyan#stream-type-rotating-file
          target.options || {},
          {path: target.path, level}
        )
      );

      streams.push({
        type: 'raw',
        level,
        stream,
      });
    } else {
      const stream = new Stream();
      stream.writable = true;

      let destination;
      let destinationIsTTY = false;
      if (target.type === 'file') {
        // destination stream
        destination = require('fs').createWriteStream(target.path, {flags: 'a', encoding: 'utf8'});
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
        // making fake stream for prettypritting
        stream.write = obj => {
          destination.write(`${print(obj.level, obj.msg, obj, destinationIsTTY)}\n`);
        };
      } else if (target.format === 'pretty-timestamped') {
        // making fake stream for pretty pritting
        stream.write = obj => {
          destination.write(`[${format(obj.time, 'YYYY-MM-DD HH:mm:ss')}] ${print(obj.level, obj.msg, obj, destinationIsTTY)}\n`);
        };
      } else {
        stream.write = obj => {
          const msg = fillInMsgTemplate(obj.msg, obj, destinationIsTTY);
          destination.write(`${JSON.stringify({...obj, msg}, Logger.safeCycles())}\n`);
        };
      }

      streams.push({
        type: 'raw',
        level,
        stream: stream,
      });
    }
  });

  // buyan default configuration
  const logger = new Logger({
    name: pkgJSON.name,
    streams: streams,
    serializers: {
      err: Logger.stdSerializers.err,
      req: Logger.stdSerializers.req,
      res: Logger.stdSerializers.res,
    },
  });

  process.on('SIGUSR2', function() {
    Logger.reopenFileStreams();
  });

  module.exports.logger = logger;
}

// adopted from socket.io
// this part was converted to coffee-script and back again over the years,
// so it might look weird

// level to color
const levels = {
  fatal: chalk.red,
  error: chalk.red,
  warn: chalk.yellow,
  http: chalk.magenta,
  info: chalk.cyan,
  debug: chalk.green,
  trace: chalk.white,
};

let max = 0;
for (let l in levels) {
  if (Object.prototype.hasOwnProperty.call(levels, l)) {
    max = Math.max(max, l.length);
  }
}

/**
 * Apply whitespaces based on the length
 * @param {*} str the log message
 * @return {String}
 */
function pad(str) {
  if (str.length < max) {
    return str + ' '.repeat(max - str.length);
  }
  return str;
}

function fillInMsgTemplate(msg, obj, colors) {
  return msg.replace(/@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g, (_, name) => {
    let str = obj;
    let is_error;
    if (name[0] === '!') {
      name = name.substr(1);
      is_error = true;
    }

    let _ref = name.split('.');
    for (let _i = 0; _i < _ref.length; _i++) {
      let id = _ref[_i];
      if (Utils.isObject(str) || Array.isArray(str)) {
        str = str[id];
      } else {
        str = undefined;
      }
    }

    if (typeof str === 'string') {
      if (!colors || str.includes('\n')) {
        return str;
      } else if (is_error) {
        return chalk.red(str);
      } else {
        return chalk.green(str);
      }
    } else {
      return require('util').inspect(str, null, null, colors);
    }
  });
}

/**
 * Apply colors to a string based on level parameters.
 * @param {*} type
 * @param {*} msg
 * @param {*} obj
 * @param {*} colors
 * @return {String}
 */
function print(type, msg, obj, colors) {
  if (typeof type === 'number') {
    type = getlvl(type);
  }
  const finalmsg = fillInMsgTemplate(msg, obj, colors);

  const subsystems = [
    {
      in: chalk.green('<--'),
      out: chalk.yellow('-->'),
      fs: chalk.black('-=-'),
      default: chalk.blue('---'),
    },
    {
      in: '<--',
      out: '-->',
      fs: '-=-',
      default: '---',
    },
  ];

  const sub = subsystems[colors ? 0 : 1][obj.sub] || subsystems[+!colors].default;
  if (colors) {
    return ` ${levels[type](pad(type))}${chalk.white(`${sub} ${finalmsg}`)}`;
  } else {
    return ` ${pad(type)}${sub} ${finalmsg}`;
  }
}

module.exports.setup = setup;
