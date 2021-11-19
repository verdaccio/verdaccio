'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.fileExist = exports.noSuchFile = undefined;

let _httpErrors = require('http-errors');

let _httpErrors2 = _interopRequireDefault(_httpErrors);

let _memoryFs = require('memory-fs');

let _memoryFs2 = _interopRequireDefault(_memoryFs);

let _streams = require('@verdaccio/streams');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// $FlowFixMe
const noSuchFile = (exports.noSuchFile = 'ENOENT');

const fileExist = (exports.fileExist = 'EEXISTS');

const fSError = function fSError(message, code = 404) {
  const err = (0, _httpErrors2.default)(code, message);
  // $FlowFixMe
  err.code = message;

  return err;
};

const noPackageFoundError = function noPackageFoundError(message = 'no such package') {
  const err = (0, _httpErrors2.default)(404, message);
  // $FlowFixMe
  err.code = noSuchFile;
  return err;
};

// eslint-disable-next-line new-cap
const fs = new _memoryFs2.default();

class MemoryHandler {
  constructor(packageName, data, logger) {
    // this is not need it
    this.data = data;
    this.name = packageName;
    this.logger = logger;
  }

  updatePackage(pkgFileName, updateHandler, onWrite, transformPackage, onEnd) {
    let json = this._getStorage(pkgFileName);

    try {
      json = JSON.parse(json);
    } catch (err) {
      return onEnd(err);
    }

    updateHandler(json, (err) => {
      if (err) {
        return onEnd(err);
      }
      try {
        onWrite(pkgFileName, transformPackage(json), onEnd);
      } catch (err) {
        return onEnd(fSError('error on parse', 500));
      }
    });
  }

  deletePackage(pkgName, callback) {
    delete this.data[pkgName];
    callback(null);
  }

  removePackage(callback) {
    callback(null);
  }

  createPackage(name, value, cb) {
    this.savePackage(name, value, cb);
  }

  savePackage(name, value, cb) {
    try {
      const json = JSON.stringify(value, null, '\t');

      this.data[name] = json;
    } catch (err) {
      cb(fSError(err.message, 500));
    }

    cb(null);
  }

  readPackage(name, cb) {
    const json = this._getStorage(name);
    const isJson = typeof json === 'undefined';

    try {
      cb(isJson ? noPackageFoundError() : null, JSON.parse(json));
    } catch (err) {
      cb(noPackageFoundError());
    }
  }

  writeTarball(name) {
    const uploadStream = new _streams.UploadTarball();
    const temporalName = `/${name}`;

    process.nextTick(function () {
      fs.exists(temporalName, function (exists) {
        if (exists) {
          return uploadStream.emit('error', fSError(fileExist));
        }

        try {
          const file = fs.createWriteStream(temporalName);

          uploadStream.pipe(file);

          uploadStream.done = function () {
            const onEnd = function onEnd() {
              uploadStream.emit('success');
            };

            uploadStream.on('end', onEnd);
          };

          uploadStream.abort = function () {
            uploadStream.emit('error', fSError('transmision aborted', 400));
            file.end();
          };

          uploadStream.emit('open');
        } catch (err) {
          uploadStream.emit('error', err);
        }
      });
    });

    return uploadStream;
  }

  readTarball(name) {
    const pathName = `/${name}`;

    const readTarballStream = new _streams.ReadTarball();

    process.nextTick(function () {
      fs.exists(pathName, function (exists) {
        if (!exists) {
          readTarballStream.emit('error', noPackageFoundError());
        } else {
          const readStream = fs.createReadStream(pathName);

          readTarballStream.emit('content-length', fs.data[name].length);
          readTarballStream.emit('open');
          readStream.pipe(readTarballStream);
          readStream.on('error', (error) => {
            readTarballStream.emit('error', error);
          });

          readTarballStream.abort = function () {
            readStream.destroy(fSError('read has been aborted', 400));
          };
        }
      });
    });

    return readTarballStream;
  }

  _getStorage(name = '') {
    return this.data[name];
  }
}

exports.default = MemoryHandler;
