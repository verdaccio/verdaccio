/* eslint prefer-spread: "off" */

'use strict';

const fs = require('fs');
const Error = require('http-errors');
const mkdirp = require('mkdirp');
const Path = require('path');
const MyStreams = require('./streams');
const locker = require('./file-locking');

const fSError = function(code) {
  const err = Error(code);
  err.code = code;
  return err;
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
  let tmp = tempFile(dst);
  fs.rename(dst, tmp, function(err) {
    fs.rename(src, dst, cb);
    if (!err) {
      fs.unlink(tmp, () => {});
    }
  });
};

const write = function(dest, data, cb) {
  let safe_write = function(cb) {
    let tmpname = tempFile(dest);
    fs.writeFile(tmpname, data, function(err) {
      if (err) return cb(err);
      renameTmp(tmpname, dest, cb);
    });
  };

  safe_write(function(err) {
    if (err && err.code === 'ENOENT') {
      mkdirp(Path.dirname(dest), function(err) {
        if (err) return cb(err);
        safe_write(cb);
      });
    } else {
      cb(err);
    }
  });
};

const write_stream = function(name) {
  const stream = new MyStreams.UploadTarball();
  let _ended = 0;
  stream.on('end', function() {
    _ended = 1;
  });

  fs.exists(name, function(exists) {
    if (exists) {
      return stream.emit('error', fSError('EEXISTS'));
    }

    let tmpname = name + '.tmp-'+String(Math.random()).replace(/^0\./, '');
    let file = fs.createWriteStream(tmpname);
    let opened = false;
    stream.pipe(file);

    stream.done = function() {
      const onend = function() {
        file.on('close', function() {
          renameTmp(tmpname, name, function(err) {
            if (err) {
              stream.emit('error', err);
            } else {
              stream.emit('success');
            }
          });
        });
        file.destroySoon();
      };
      if (_ended) {
        onend();
      } else {
        stream.on('end', onend);
      }
    };
    stream.abort = function() {
      if (opened) {
        opened = false;
        file.on('close', function() {
          fs.unlink(tmpname, function() {});
        });
      }
      file.destroySoon();
    };
    file.on('open', function() {
      opened = true;
      // re-emitting open because it's handled in storage.js
      stream.emit('open');
    });
    file.on('error', function(err) {
      stream.emit('error', err);
    });
  });
  return stream;
};

const read_stream = function(name, stream, callback) {
  let rstream = fs.createReadStream(name);
  rstream.on('error', function(err) {
    stream.emit('error', err);
  });
  rstream.on('open', function(fd) {
    fs.fstat(fd, function(err, stats) {
      if (err) return stream.emit('error', err);
      stream.emit('content-length', stats.size);
      stream.emit('open');
      rstream.pipe(stream);
    });
  });

  stream = new MyStreams.ReadTarball();
  stream.abort = function() {
    rstream.close();
  };
  return stream;
};

const create = function(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (exists) {
      return callback( fSError('EEXISTS') );
    }
    write(name, contents, callback);
  });
};

const update = function(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (!exists) {
      return callback( fSError('ENOENT') );
    }
    write(name, contents, callback);
  });
};

const read = function(name, callback) {
  fs.readFile(name, callback);
};

module.exports.read = read;

module.exports.read_json = function(name, cb) {
  read(name, function(err, res) {
    if (err) {
      return cb(err);
    }

    let args = [];
    try {
      args = [null, JSON.parse(res.toString('utf8'))];
    } catch(err) {
      args = [err];
    }
    cb.apply(null, args);
  });
};

module.exports.lock_and_read = function(name, cb) {
  locker.readFile(name, {lock: true}, function(err, res) {
    if (err) {
      return cb(err);
    }
    return cb(null, res);
  });
};

module.exports.lock_and_read_json = function(name, cb) {
  locker.readFile(name, {lock: true, parse: true}, function(err, res) {
    if (err) {
      return cb(err);
    }
    return cb(null, res);
  });
};

module.exports.unlock_file = function(name, cb) {
  locker.unlockFile(name, cb);
};

module.exports.create = create;

module.exports.create_json = function(name, value, cb) {
  create(name, JSON.stringify(value, null, '\t'), cb);
};

module.exports.update = update;

module.exports.update_json = function(name, value, cb) {
  update(name, JSON.stringify(value, null, '\t'), cb);
};

module.exports.write = write;

module.exports.write_json = function(name, value, cb) {
  write(name, JSON.stringify(value, null, '\t'), cb);
};

module.exports.write_stream = write_stream;

module.exports.read_stream = read_stream;

module.exports.unlink = fs.unlink;

module.exports.rmdir = fs.rmdir;

