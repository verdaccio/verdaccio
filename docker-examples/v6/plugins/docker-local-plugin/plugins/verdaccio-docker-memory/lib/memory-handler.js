'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _debug = _interopRequireDefault(require('debug'));

var _memfs = require('memfs');

var _path = _interopRequireDefault(require('path'));

var _core = require('@verdaccio/core');

var _streams = require('@verdaccio/streams');

var _utils = require('./utils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const debug = (0, _debug.default)('verdaccio:plugin:storage:memory-storage');

class MemoryHandler {
  constructor(packageName, data, logger) {
    // this is not need it
    this.data = data;
    this.name = packageName;
    this.logger = logger;
    this.path = `/${packageName}`;
    debug('initialized');
  }

  updatePackage(pkgFileName, updateHandler, onWrite, transformPackage, onEnd) {
    const json = this._getStorage(pkgFileName);

    let pkg;

    try {
      pkg = (0, _utils.parsePackage)(json);
    } catch (err) {
      return onEnd(err);
    }

    updateHandler(pkg, (err) => {
      if (err) {
        return onEnd(err);
      }

      try {
        onWrite(pkgFileName, transformPackage(pkg), onEnd);
      } catch (err) {
        return onEnd(_core.errorUtils.getInternalError('error on parse the metadata'));
      }
    });
  }

  deletePackage(pkgName) {
    delete this.data[pkgName];
    return Promise.resolve();
  }

  removePackage() {
    return Promise.resolve();
  }

  createPackage(name, value, cb) {
    debug('create package %o', name);
    this.savePackage(name, value, cb);
  }

  savePackage(name, value, cb) {
    try {
      debug('save package %o', name);
      this.data[name] = (0, _utils.stringifyPackage)(value);
      return cb(null);
    } catch (err) {
      return cb(_core.errorUtils.getInternalError(err.message));
    }
  }

  async readPackageNext(name) {
    const json = this._getStorage(name);

    try {
      return (
        typeof json === 'undefined' ? _core.errorUtils.getNotFound() : null,
        (0, _utils.parsePackage)(json)
      );
    } catch (err) {
      throw _core.errorUtils.getNotFound();
    }
  }

  readPackage(name, cb) {
    debug('read package %o', name);

    const json = this._getStorage(name);

    const isJson = typeof json === 'undefined';

    try {
      return cb(isJson ? _core.errorUtils.getNotFound() : null, (0, _utils.parsePackage)(json));
    } catch (err) {
      return cb(_core.errorUtils.getNotFound());
    }
  }

  writeTarball(name) {
    const uploadStream = new _streams.UploadTarball({});
    const temporalName = `${this.path}/${name}`;
    debug('write tarball %o', temporalName);
    process.nextTick(function () {
      _memfs.fs.mkdirp(_path.default.dirname(temporalName), (mkdirpError) => {
        if (mkdirpError) {
          return uploadStream.emit('error', mkdirpError);
        }

        _memfs.fs.stat(temporalName, function (fileError, stats) {
          if (!fileError && stats) {
            return uploadStream.emit('error', _core.errorUtils.getConflict());
          }

          try {
            const file = _memfs.fs.createWriteStream(temporalName);

            uploadStream.pipe(file);

            uploadStream.done = function () {
              const onEnd = function () {
                uploadStream.emit('success');
              };

              uploadStream.on('end', onEnd);
            };

            uploadStream.abort = function () {
              uploadStream.emit('error', _core.errorUtils.getBadRequest('transmision aborted'));
              file.end();
            };

            uploadStream.emit('open');
            return;
          } catch (err) {
            uploadStream.emit('error', err);
            return;
          }
        });
      });
    });
    return uploadStream;
  }

  readTarball(name) {
    const pathName = `${this.path}/${name}`;
    debug('read tarball %o', pathName);
    const readTarballStream = new _streams.ReadTarball({});
    process.nextTick(function () {
      _memfs.fs.stat(pathName, function (error, stats) {
        if (error && !stats) {
          return readTarballStream.emit('error', _core.errorUtils.getNotFound());
        }

        try {
          const readStream = _memfs.fs.createReadStream(pathName);

          readTarballStream.emit(
            'content-length',
            stats === null || stats === void 0 ? void 0 : stats.size
          );
          readTarballStream.emit('open');
          readStream.pipe(readTarballStream);
          readStream.on('error', (error) => {
            readTarballStream.emit('error', error);
          });

          readTarballStream.abort = function () {
            readStream.destroy(_core.errorUtils.getBadRequest('read has been aborted'));
          };

          return;
        } catch (err) {
          readTarballStream.emit('error', err);
          return;
        }
      });
    });
    return readTarballStream;
  }

  _getStorage(name = '') {
    debug('get storage %o', name);
    return this.data[name];
  } // migration pending

  async updatePackageNext(packageName, handleUpdate) {
    debug(packageName); // @ts-expect-error

    await handleUpdate({}); // @ts-expect-error

    return Promise.resolve({});
  }

  async savePackageNext(name, value) {
    debug(name);
    debug(value);
  }
}

var _default = MemoryHandler;
exports.default = _default;
//# sourceMappingURL=memory-handler.js.map
