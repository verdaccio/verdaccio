'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFile = exports.unlockFile = exports.lockFile = undefined;

var _lockfile = require('lockfile');

var locker = _interopRequireWildcard(_lockfile);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// locks a file by creating a lock file
var lockFile = function lockFile(name, callback) {

  var statDir = function statDir(name) {
    return new Promise(function (resolve, reject) {
      // test to see if the directory exists
      var dirPath = _path2.default.dirname(name);
      fs.stat(dirPath, function (err, stats) {
        if (err) {
          return reject(err);
        } else if (!stats.isDirectory()) {
          return resolve(new Error(`${_path2.default.dirname(name)} is not a directory`));
        } else {
          return resolve(null);
        }
      });
    });
  };

  var statfile = function statfile(name) {
    return new Promise(function (resolve, reject) {
      // test to see if the directory exists
      fs.stat(name, function (err, stats) {
        if (err) {
          return reject(err);
        } else if (!stats.isFile()) {
          return resolve(new Error(`${_path2.default.dirname(name)} is not a file`));
        } else {
          return resolve(null);
        }
      });
    });
  };

  var lockfile = function lockfile(name) {
    return new Promise(function (resolve) {
      var lockOpts = {
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
      var lockFileName = `${name}.lock`;
      locker.lock(lockFileName, lockOpts, function () {
        resolve();
      });
    });
  };

  Promise.resolve().then(function () {
    return statDir(name);
  }).then(function () {
    return statfile(name);
  }).then(function () {
    return lockfile(name);
  }).then(function () {
    callback(null);
  }).catch(function (err) {
    callback(err);
  });
};

// unlocks file by removing existing lock file


var unlockFile = function unlockFile(name, next) {
  var lockFileName = `${name}.lock`;
  locker.unlock(lockFileName, function () {
    return next(null);
  });
};

/**
 *  Reads a local file, which involves
 *  optionally taking a lock
 *  reading the file contents
 *  optionally parsing JSON contents
 * @param {*} name
 * @param {*} options
 * @param {*} callback
 */
function readFile(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options.lock = options.lock || false;
  options.parse = options.parse || false;

  var lock = function lock(options) {
    return new Promise(function (resolve, reject) {
      if (!options.lock) {
        return resolve(null);
      }

      lockFile(name, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve(null);
      });
    });
  };

  var read = function read() {
    return new Promise(function (resolve, reject) {
      fs.readFile(name, 'utf8', function (err, contents) {
        if (err) {
          return reject(err);
        }

        resolve(contents);
      });
    });
  };

  var parseJSON = function parseJSON(contents) {
    return new Promise(function (resolve, reject) {
      if (!options.parse) {
        return resolve(contents);
      }
      try {
        contents = JSON.parse(contents);
        return resolve(contents);
      } catch (err) {
        return reject(err);
      }
    });
  };

  Promise.resolve().then(function () {
    return lock(options);
  }).then(function () {
    return read();
  }).then(function (content) {
    return parseJSON(content);
  }).then(function (result) {
    callback(null, result);
  }, function (err) {
    callback(err);
  });
}

exports.lockFile = lockFile;
exports.unlockFile = unlockFile;
exports.readFile = readFile;