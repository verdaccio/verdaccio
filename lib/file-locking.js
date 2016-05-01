/**
 * file-locking.js - file system locking (replaces fs-ext)
 */

var async = require('async'),
  locker = require('lockfile'),
  fs = require('fs'),
  path = require('path')

// locks a file by creating a lock file
function lockFile(name, next) {
  var lockFileName = name + '.lock',
    lockOpts = {
      wait: 1000,             // time (ms) to wait when checking for stale locks
      pollPeriod: 100,              // how often (ms) to re-check stale locks

      stale: 5 * 60 * 1000,    // locks are considered stale after 5 minutes

      retries: 100,              // number of times to attempt to create a lock
      retryWait: 100               // time (ms) between tries
    }

  async.series({

    statdir: function (callback) {
      // test to see if the directory exists
      fs.stat(path.dirname(name), function (err, stats) {
        if (err) {
          callback(err)
        } else if (!stats.isDirectory()) {
          callback(new Error(path.dirname(name) + ' is not a directory'))
        } else {
          callback(null)
        }
      })
    },

    statfile: function (callback) {
      // test to see if the file to lock exists
      fs.stat(name, function (err, stats) {
        if (err) {
          callback(err)
        } else if (!stats.isFile()) {
          callback(new Error(path.dirname(name) + ' is not a file'))
        } else {
          callback(null)
        }
      });
    },

    lockfile: function (callback) {
      // try to lock the file
      locker.lock(lockFileName, lockOpts, callback)
    }

  }, function (err) {
    if (err) {
      // lock failed
      return next(err)
    }

    // lock succeeded
    return next(null);
  })

}

// unlocks file by removing existing lock file
function unlockFile(name, next) {
  var lockFileName = name + '.lock'

  locker.unlock(lockFileName, function (err) {
    if (err) {
      return next(err)
    }

    return next(null)
  })
}

/**
 * reads a local file, which involves
 *  optionally taking a lock
 *  reading the file contents
 *  optionally parsing JSON contents
 */
function readFile(name, options, next) {
  if (typeof options === 'function' && next === null) {
    next = options;
    options = {}
  }

  options = options || {}
  options.lock = options.lock || false
  options.parse = options.parse || false

  function lock(callback) {
    if (!options.lock) {
      return callback(null)
    }

    lockFile(name, function (err) {
      if (err) {
        return callback(err)
      }
      return callback(null)
    })
  }

  function read(callback) {
    fs.readFile(name, 'utf8', function (err, contents) {
      if (err) {
        return callback(err)
      }

      callback(null, contents)

    })
  }

  function parseJSON(contents, callback) {
    if (!options.parse) {
      return callback(null, contents)
    }

    try {
      contents = JSON.parse(contents)
      return callback(null, contents)
    } catch (err) {
      return callback(err)
    }
  }

  async.waterfall([
    lock,
    read,
    parseJSON
  ],

    function (err, result) {
      if (err) {
        return next(err)
      } else {
        return next(null, result)
      }
    })
}

exports.lockFile = lockFile;
exports.unlockFile = unlockFile;

exports.readFile = readFile;
