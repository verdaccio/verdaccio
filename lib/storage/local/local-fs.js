/* eslint prefer-spread: "off" */

'use strict';

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const mkdirp = require('mkdirp');
const MyStream = require('../streams');
const locker = require('../../file-locking');
const fileExist = 'EEXISTS';
const noSuchFile = 'ENOENT';

const fSError = function(code) {
  const err = createError(code);
  err.code = code;
  return err;
};

const readFile = function(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(name, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const tempFile = function(str) {
  return `${str}.tmp${String(Math.random()).substr(2)}`;
};

const renameTmp = function(src, dst, _cb) {
   const cb = function(err) {
    if (err) {
      fs.unlink(src, function() {});
    }
    _cb(err);
  };

  if (process.platform !== 'win32') {
    return fs.rename(src, dst, cb);
  }

  // windows can't remove opened file,
  // but it seem to be able to rename it
  const tmp = tempFile(dst);
  fs.rename(dst, tmp, function(err) {
    fs.rename(src, dst, cb);
    if (!err) {
      fs.unlink(tmp, () => {});
    }
  });
};

const writeFile = function(dest, data, cb) {
  const createTempFile = function(cb) {
    const tempFilePath = tempFile(dest);
    fs.writeFile(tempFilePath, data, function(err) {
      if (err) {
        return cb(err);
      }
      renameTmp(tempFilePath, dest, cb);
    });
  };

  createTempFile(function(err) {
    if (err && err.code === noSuchFile) {
      mkdirp(path.dirname(dest), function(err) {
        if (err) {
          return cb(err);
        }
        createTempFile(cb);
      });
    } else {
      cb(err);
    }
  });
};

const createWriteStream = function(name) {
  const uploadStream = new MyStream.UploadTarball();
  let _ended = 0;
  uploadStream.on('end', function() {
    _ended = 1;
  });

  fs.exists(name, function(exists) {
    if (exists) {
      return uploadStream.emit('error', fSError(fileExist));
    }

    const temporalName = `${name}.tmp-${String(Math.random()).replace(/^0\./, '')}`;
    const file = fs.createWriteStream(temporalName);
    let opened = false;
    uploadStream.pipe(file);

    uploadStream.done = function() {
      const onend = function() {
        file.on('close', function() {
          renameTmp(temporalName, name, function(err) {
            if (err) {
              uploadStream.emit('error', err);
            } else {
              uploadStream.emit('success');
            }
          });
        });
        file.destroySoon();
      };
      if (_ended) {
        onend();
      } else {
        uploadStream.on('end', onend);
      }
    };
    uploadStream.abort = function() {
      if (opened) {
        opened = false;
        file.on('close', function() {
          fs.unlink(temporalName, function() {});
        });
      }
      file.destroySoon();
    };
    file.on('open', function() {
      opened = true;
      // re-emitting open because it's handled in storage.js
      uploadStream.emit('open');
    });
    file.on('error', function(err) {
      uploadStream.emit('error', err);
    });
  });
  return uploadStream;
};

const createReadStream = function(name, readTarballStream, callback) {
  let readStream = fs.createReadStream(name);
  readStream.on('error', function(err) {
    readTarballStream.emit('error', err);
  });
  readStream.on('open', function(fd) {
    fs.fstat(fd, function(err, stats) {
      if (err) return readTarballStream.emit('error', err);
      readTarballStream.emit('content-length', stats.size);
      readTarballStream.emit('open');
      readStream.pipe(readTarballStream);
    });
  });

  readTarballStream = new MyStream.ReadTarball();
  readTarballStream.abort = function() {
    readStream.close();
  };
  return readTarballStream;
};

const createFile = function(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (exists) {
      return callback( fSError(fileExist) );
    }
    writeFile(name, contents, callback);
  });
};

const updateFile = function(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (!exists) {
      return callback( fSError(noSuchFile) );
    }
    writeFile(name, contents, callback);
  });
};

const readJSON = function(name, cb) {
  readFile(name).then(function(res) {
    let args = [];
    try {
      args = [null, JSON.parse(res.toString('utf8'))];
    } catch(err) {
      args = [err];
    }
    cb.apply(null, args);
  }, function(err) {
    return cb(err);
  });
};

const lock_and_read = function(name, cb) {
  locker.readFile(name, {lock: true}, function(err, res) {
    if (err) {
      return cb(err);
    }
    return cb(null, res);
  });
};

const lockAndReadJSON = function(name, cb) {
  locker.readFile(name, {lock: true, parse: true}, function(err, res) {
    if (err) {
      return cb(err);
    }
    return cb(null, res);
  });
};

const unlock_file = function(name, cb) {
  locker.unlockFile(name, cb);
};

const createJSON = function(name, value, cb) {
  createFile(name, JSON.stringify(value, null, '\t'), cb);
};


const updateJSON = function(name, value, cb) {
  updateFile(name, JSON.stringify(value, null, '\t'), cb);
};


const writeJSON = function(name, value, cb) {
  writeFile(name, JSON.stringify(value, null, '\t'), cb);
};

// fs
module.exports.unlink = fs.unlink;
module.exports.rmdir = fs.rmdir;

// streams
module.exports.createWriteStream = createWriteStream;
module.exports.createReadStream = createReadStream;

// io
module.exports.read = readFile;
module.exports.write = writeFile;
module.exports.update = updateFile;
module.exports.create = createFile;

// json
module.exports.readJSON = readJSON;
module.exports.lockAndReadJSON = lockAndReadJSON;
module.exports.writeJSON = writeJSON;
module.exports.updateJSON = updateJSON;
module.exports.createJSON = createJSON;

// lock
module.exports.unlock_file = unlock_file;
module.exports.lock_and_read = lock_and_read;
