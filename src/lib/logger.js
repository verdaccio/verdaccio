const Logger = require('bunyan');
const Error = require('http-errors');
const Stream = require('stream');
const chalk = require('chalk');
const Utils = require('./utils');
const pkgJSON = require('../../package.json');

/**
 * Match the level based on buyan severity scale
 * @param {*} x severity level
 * @return {String} security level
 */
function getlvl(x) {
  switch (true) {
    case x < 15: return 'trace';
    case x < 25: return 'debug';
    case x < 35: return 'info';
    case x == 35: return 'http';
    case x < 45: return 'warn';
    case x < 55: return 'error';
    default: return 'fatal';
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
    // create a stream for each log configuration
    const stream = new Stream();
    stream.writable = true;

    let dest;
    let destIsTTY = false;
    const prettyPrint = (obj) => print(obj.level, obj.msg, obj, destIsTTY) + '\n';
    const prettyTimestampedPrint = (obj) => obj.time.toISOString() + print(obj.level, obj.msg, obj, destIsTTY) + '\n';
    const jsonPrint = (obj) => {
      const msg = fillInMsgTemplate(obj.msg, obj, destIsTTY);
      return JSON.stringify({...obj, msg}, Logger.safeCycles()) + '\n';
    };

    if (target.type === 'file') {
      // destination stream
      dest = require('fs').createWriteStream(target.path, {flags: 'a', encoding: 'utf8'});
      dest.on('error', function(err) {
        Logger.emit('error', err);
      });
    } else if (target.type === 'stdout' || target.type === 'stderr') {
      dest = target.type === 'stdout' ? process.stdout : process.stderr;
      destIsTTY = dest.isTTY;
    } else {
      throw Error('wrong target type for a log');
    }

    if (target.format === 'pretty') {
      // making fake stream for prettypritting
      stream.write = (obj) => {
        dest.write(prettyPrint(obj));
      };
    } else if (target.format === 'pretty-timestamped') {
      // making fake stream for prettypritting
      stream.write = (obj) => {
        dest.write(prettyTimestampedPrint(obj));
      };
    } else {
      stream.write = (obj) => {
        dest.write(jsonPrint(obj));
      };
    }


    if (target.level === 'http') target.level = 35;
    streams.push({
      type: 'raw',
      level: target.level || 35,
      stream: stream,
    });
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

    if (typeof(str) === 'string') {
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

  const subsystems = [{
    in: chalk.green('<--'),
    out: chalk.yellow('-->'),
    fs: chalk.black('-=-'),
    default: chalk.blue('---'),
  }, {
    in: '<--',
    out: '-->',
    fs: '-=-',
    default: '---',
  }];

  const sub = subsystems[colors ? 0 : 1][obj.sub] || subsystems[+!colors].default;
  if (colors) {
    return ` ${levels[type]((pad(type)))}${chalk.white(`${sub} ${finalmsg}`)}`;
  } else {
    return ` ${(pad(type))}${sub} ${finalmsg}`;
  }
}

module.exports.setup = setup;
