'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chalk = _interopDefault(require('chalk'));
var util = _interopDefault(require('util'));

let prefix = "🦋 ";

function format(args, customPrefix) {
  let fullPrefix = prefix + (customPrefix === undefined ? "" : " " + customPrefix);
  return fullPrefix + util.format("", ...args).split("\n").join("\n" + fullPrefix + " ");
}

function error(...args) {
  console.error(format(args, chalk.red("error")));
}
function info(...args) {
  console.info(format(args, chalk.cyan("info")));
}
function log(...args) {
  console.log(format(args));
}
function success(...args) {
  console.log(format(args, chalk.green("success")));
}
function warn(...args) {
  console.warn(format(args, chalk.yellow("warn")));
}

exports.error = error;
exports.info = info;
exports.log = log;
exports.prefix = prefix;
exports.success = success;
exports.warn = warn;
