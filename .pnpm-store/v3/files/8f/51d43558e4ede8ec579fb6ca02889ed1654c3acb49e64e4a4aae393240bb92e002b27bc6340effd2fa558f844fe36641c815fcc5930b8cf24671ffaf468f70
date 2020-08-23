"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockfile = exports.statfile = exports.statDir = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lockfile = _interopRequireDefault(require("lockfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const statDir = name => {
  return new Promise((resolve, reject) => {
    // test to see if the directory exists
    const dirPath = _path.default.dirname(name);

    _fs.default.stat(dirPath, function (err, stats) {
      if (err) {
        return reject(err);
      } else if (!stats.isDirectory()) {
        return resolve(new Error(`${_path.default.dirname(name)} is not a directory`));
      } else {
        return resolve(null);
      }
    });
  });
};

exports.statDir = statDir;

const statfile = name => {
  return new Promise((resolve, reject) => {
    // test to see if the directory exists
    _fs.default.stat(name, function (err, stats) {
      if (err) {
        return reject(err);
      } else if (!stats.isFile()) {
        return resolve(new Error(`${_path.default.dirname(name)} is not a file`));
      } else {
        return resolve(null);
      }
    });
  });
};

exports.statfile = statfile;

const lockfile = name => {
  return new Promise(resolve => {
    const lockOpts = {
      // time (ms) to wait when checking for stale locks
      wait: 1000,
      // how often (ms) to re-check stale locks
      pollPeriod: 100,
      // locks are considered stale after 5 minutes
      stale: 5 * 60 * 1000,
      // number of times to attempt to create a lock
      retries: 100,
      // time (ms) between tries
      retryWait: 100
    };
    const lockFileName = `${name}.lock`;

    _lockfile.default.lock(lockFileName, lockOpts, () => {
      resolve();
    });
  });
};

exports.lockfile = lockfile;