"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.fSError = exports.pkgFileName = exports.resourceNotAvailable = exports.noSuchFile = exports.fileExist = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _streams = require("@verdaccio/streams");

var _fileLocking = require("@verdaccio/file-locking");

var _lib = require("@verdaccio/commons-api/lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const fileExist = 'EEXISTS';
exports.fileExist = fileExist;
const noSuchFile = 'ENOENT';
exports.noSuchFile = noSuchFile;
const resourceNotAvailable = 'EAGAIN';
exports.resourceNotAvailable = resourceNotAvailable;
const pkgFileName = 'package.json';
exports.pkgFileName = pkgFileName;

const fSError = function (message, code = 409) {
  const err = (0, _lib.getCode)(code, message); // FIXME: we should return http-status codes here instead, future improvement
  // @ts-ignore

  err.code = message;
  return err;
};

exports.fSError = fSError;

const tempFile = function (str) {
  return `${str}.tmp${String(Math.random()).substr(2)}`;
};

const renameTmp = function (src, dst, _cb) {
  const cb = err => {
    if (err) {
      _fs.default.unlink(src, () => {});
    }

    _cb(err);
  };

  if (process.platform !== 'win32') {
    return _fs.default.rename(src, dst, cb);
  } // windows can't remove opened file,
  // but it seem to be able to rename it


  const tmp = tempFile(dst);

  _fs.default.rename(dst, tmp, function (err) {
    _fs.default.rename(src, dst, cb);

    if (!err) {
      _fs.default.unlink(tmp, () => {});
    }
  });
};

class LocalFS {
  constructor(path, logger) {
    _defineProperty(this, "path", void 0);

    _defineProperty(this, "logger", void 0);

    this.path = path;
    this.logger = logger;
  }
  /**
    *  This function allows to update the package thread-safely
      Algorithm:
      1. lock package.json for writing
      2. read package.json
      3. updateFn(pkg, cb), and wait for cb
      4. write package.json.tmp
      5. move package.json.tmp package.json
      6. callback(err?)
    * @param {*} name
    * @param {*} updateHandler
    * @param {*} onWrite
    * @param {*} transformPackage
    * @param {*} onEnd
    */


  updatePackage(name, updateHandler, onWrite, transformPackage, onEnd) {
    this._lockAndReadJSON(pkgFileName, (err, json) => {
      let locked = false;
      const self = this; // callback that cleans up lock first

      const unLockCallback = function (lockError) {
        // eslint-disable-next-line prefer-rest-params
        const _args = arguments;

        if (locked) {
          self._unlockJSON(pkgFileName, () => {
            // ignore any error from the unlock
            if (lockError !== null) {
              self.logger.trace({
                name,
                lockError
              }, '[local-storage/updatePackage/unLockCallback] file: @{name} lock has failed lockError: @{lockError}');
            }

            onEnd.apply(lockError, _args);
          });
        } else {
          self.logger.trace({
            name
          }, '[local-storage/updatePackage/unLockCallback] file: @{name} has been updated');
          onEnd(..._args);
        }
      };

      if (!err) {
        locked = true;
        this.logger.trace({
          name
        }, '[local-storage/updatePackage] file: @{name} has been locked');
      }

      if (_lodash.default.isNil(err) === false) {
        if (err.code === resourceNotAvailable) {
          return unLockCallback((0, _lib.getInternalError)('resource temporarily unavailable'));
        } else if (err.code === noSuchFile) {
          return unLockCallback((0, _lib.getNotFound)());
        } else {
          return unLockCallback(err);
        }
      }

      updateHandler(json, err => {
        if (err) {
          return unLockCallback(err);
        }

        onWrite(name, transformPackage(json), unLockCallback);
      });
    });
  }

  deletePackage(packageName, callback) {
    this.logger.debug({
      packageName
    }, '[local-storage/deletePackage] delete a package @{packageName}');
    return _fs.default.unlink(this._getStorage(packageName), callback);
  }

  removePackage(callback) {
    this.logger.debug({
      packageName: this.path
    }, '[local-storage/removePackage] remove a package: @{packageName}');

    _fs.default.rmdir(this._getStorage('.'), callback);
  }

  createPackage(name, value, cb) {
    this.logger.debug({
      packageName: name
    }, '[local-storage/createPackage] create a package: @{packageName}');

    this._createFile(this._getStorage(pkgFileName), this._convertToString(value), cb);
  }

  savePackage(name, value, cb) {
    this.logger.debug({
      packageName: name
    }, '[local-storage/savePackage] save a package: @{packageName}');

    this._writeFile(this._getStorage(pkgFileName), this._convertToString(value), cb);
  }

  readPackage(name, cb) {
    this.logger.debug({
      packageName: name
    }, '[local-storage/readPackage] read a package: @{packageName}');

    this._readStorageFile(this._getStorage(pkgFileName)).then(res => {
      try {
        const data = JSON.parse(res.toString('utf8'));
        this.logger.trace({
          packageName: name
        }, '[local-storage/readPackage/_readStorageFile] read a package succeed: @{packageName}');
        cb(null, data);
      } catch (err) {
        this.logger.trace({
          err
        }, '[local-storage/readPackage/_readStorageFile] error on read a package: @{err}');
        cb(err);
      }
    }, err => {
      this.logger.trace({
        err
      }, '[local-storage/readPackage/_readStorageFile] error on read a package: @{err}');
      return cb(err);
    });
  }

  writeTarball(name) {
    const uploadStream = new _streams.UploadTarball({});
    this.logger.debug({
      packageName: name
    }, '[local-storage/writeTarball] write a tarball for package: @{packageName}');
    let _ended = 0;
    uploadStream.on('end', function () {
      _ended = 1;
    });

    const pathName = this._getStorage(name);

    _fs.default.access(pathName, fileNotFound => {
      const exists = !fileNotFound;

      if (exists) {
        uploadStream.emit('error', fSError(fileExist));
      } else {
        const temporalName = _path.default.join(this.path, `${name}.tmp-${String(Math.random()).replace(/^0\./, '')}`);

        const file = _fs.default.createWriteStream(temporalName);

        const removeTempFile = () => _fs.default.unlink(temporalName, () => {});

        let opened = false;
        uploadStream.pipe(file);

        uploadStream.done = function () {
          const onend = function () {
            file.on('close', function () {
              renameTmp(temporalName, pathName, function (err) {
                if (err) {
                  uploadStream.emit('error', err);
                } else {
                  uploadStream.emit('success');
                }
              });
            });
            file.end();
          };

          if (_ended) {
            onend();
          } else {
            uploadStream.on('end', onend);
          }
        };

        uploadStream.abort = function () {
          if (opened) {
            opened = false;
            file.on('close', function () {
              removeTempFile();
            });
          } else {
            // if the file does not recieve any byte never is opened and has to be removed anyway.
            removeTempFile();
          }

          file.end();
        };

        file.on('open', function () {
          opened = true; // re-emitting open because it's handled in storage.js

          uploadStream.emit('open');
        });
        file.on('error', function (err) {
          uploadStream.emit('error', err);
        });
      }
    });

    return uploadStream;
  }

  readTarball(name) {
    const pathName = this._getStorage(name);

    this.logger.debug({
      packageName: name
    }, '[local-storage/readTarball] read a tarball for package: @{packageName}');
    const readTarballStream = new _streams.ReadTarball({});

    const readStream = _fs.default.createReadStream(pathName);

    readStream.on('error', function (err) {
      readTarballStream.emit('error', err);
    });
    readStream.on('open', function (fd) {
      _fs.default.fstat(fd, function (err, stats) {
        if (_lodash.default.isNil(err) === false) {
          return readTarballStream.emit('error', err);
        }

        readTarballStream.emit('content-length', stats.size);
        readTarballStream.emit('open');
        readStream.pipe(readTarballStream);
      });
    });

    readTarballStream.abort = function () {
      readStream.close();
    };

    return readTarballStream;
  }

  _createFile(name, contents, callback) {
    this.logger.trace({
      name
    }, '[local-storage/_createFile] create a new file: @{name}');

    _fs.default.open(name, 'wx', err => {
      if (err) {
        // native EEXIST used here to check exception on fs.open
        if (err.code === 'EEXIST') {
          this.logger.trace({
            name
          }, '[local-storage/_createFile] file cannot be created, it already exists: @{name}');
          return callback(fSError(fileExist));
        }
      }

      this._writeFile(name, contents, callback);
    });
  }

  _readStorageFile(name) {
    return new Promise((resolve, reject) => {
      this.logger.trace({
        name
      }, '[local-storage/_readStorageFile] read a file: @{name}');

      _fs.default.readFile(name, (err, data) => {
        if (err) {
          this.logger.trace({
            err
          }, '[local-storage/_readStorageFile] error on read the file: @{name}');
          reject(err);
        } else {
          this.logger.trace({
            name
          }, '[local-storage/_readStorageFile] read file succeed: @{name}');
          resolve(data);
        }
      });
    });
  }

  _convertToString(value) {
    return JSON.stringify(value, null, '\t');
  }

  _getStorage(fileName = '') {
    const storagePath = _path.default.join(this.path, fileName);

    return storagePath;
  }

  _writeFile(dest, data, cb) {
    const createTempFile = cb => {
      const tempFilePath = tempFile(dest);

      _fs.default.writeFile(tempFilePath, data, err => {
        if (err) {
          this.logger.trace({
            name: dest
          }, '[local-storage/_writeFile] new file: @{name} has been created');
          return cb(err);
        }

        this.logger.trace({
          name: dest
        }, '[local-storage/_writeFile] creating a new file: @{name}');
        renameTmp(tempFilePath, dest, cb);
      });
    };

    createTempFile(err => {
      if (err && err.code === noSuchFile) {
        (0, _mkdirp.default)(_path.default.dirname(dest), function (err) {
          if (err) {
            return cb(err);
          }

          createTempFile(cb);
        });
      } else {
        cb(err);
      }
    });
  }

  _lockAndReadJSON(name, cb) {
    const fileName = this._getStorage(name);

    (0, _fileLocking.readFile)(fileName, {
      lock: true,
      parse: true
    }, (err, res) => {
      if (err) {
        this.logger.trace({
          name
        }, '[local-storage/_lockAndReadJSON] read new file: @{name} has failed');
        return cb(err);
      }

      this.logger.trace({
        name
      }, '[local-storage/_lockAndReadJSON] file: @{name} read');
      return cb(null, res);
    });
  }

  _unlockJSON(name, cb) {
    (0, _fileLocking.unlockFile)(this._getStorage(name), cb);
  }

}

exports.default = LocalFS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2NhbC1mcy50cyJdLCJuYW1lcyI6WyJmaWxlRXhpc3QiLCJub1N1Y2hGaWxlIiwicmVzb3VyY2VOb3RBdmFpbGFibGUiLCJwa2dGaWxlTmFtZSIsImZTRXJyb3IiLCJtZXNzYWdlIiwiY29kZSIsImVyciIsInRlbXBGaWxlIiwic3RyIiwiU3RyaW5nIiwiTWF0aCIsInJhbmRvbSIsInN1YnN0ciIsInJlbmFtZVRtcCIsInNyYyIsImRzdCIsIl9jYiIsImNiIiwiZnMiLCJ1bmxpbmsiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJyZW5hbWUiLCJ0bXAiLCJMb2NhbEZTIiwiY29uc3RydWN0b3IiLCJwYXRoIiwibG9nZ2VyIiwidXBkYXRlUGFja2FnZSIsIm5hbWUiLCJ1cGRhdGVIYW5kbGVyIiwib25Xcml0ZSIsInRyYW5zZm9ybVBhY2thZ2UiLCJvbkVuZCIsIl9sb2NrQW5kUmVhZEpTT04iLCJqc29uIiwibG9ja2VkIiwic2VsZiIsInVuTG9ja0NhbGxiYWNrIiwibG9ja0Vycm9yIiwiX2FyZ3MiLCJhcmd1bWVudHMiLCJfdW5sb2NrSlNPTiIsInRyYWNlIiwiYXBwbHkiLCJfIiwiaXNOaWwiLCJkZWxldGVQYWNrYWdlIiwicGFja2FnZU5hbWUiLCJjYWxsYmFjayIsImRlYnVnIiwiX2dldFN0b3JhZ2UiLCJyZW1vdmVQYWNrYWdlIiwicm1kaXIiLCJjcmVhdGVQYWNrYWdlIiwidmFsdWUiLCJfY3JlYXRlRmlsZSIsIl9jb252ZXJ0VG9TdHJpbmciLCJzYXZlUGFja2FnZSIsIl93cml0ZUZpbGUiLCJyZWFkUGFja2FnZSIsIl9yZWFkU3RvcmFnZUZpbGUiLCJ0aGVuIiwicmVzIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwid3JpdGVUYXJiYWxsIiwidXBsb2FkU3RyZWFtIiwiVXBsb2FkVGFyYmFsbCIsIl9lbmRlZCIsIm9uIiwicGF0aE5hbWUiLCJhY2Nlc3MiLCJmaWxlTm90Rm91bmQiLCJleGlzdHMiLCJlbWl0IiwidGVtcG9yYWxOYW1lIiwiam9pbiIsInJlcGxhY2UiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJyZW1vdmVUZW1wRmlsZSIsIm9wZW5lZCIsInBpcGUiLCJkb25lIiwib25lbmQiLCJlbmQiLCJhYm9ydCIsInJlYWRUYXJiYWxsIiwicmVhZFRhcmJhbGxTdHJlYW0iLCJSZWFkVGFyYmFsbCIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiZmQiLCJmc3RhdCIsInN0YXRzIiwic2l6ZSIsImNsb3NlIiwiY29udGVudHMiLCJvcGVuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZWFkRmlsZSIsInN0cmluZ2lmeSIsImZpbGVOYW1lIiwic3RvcmFnZVBhdGgiLCJkZXN0IiwiY3JlYXRlVGVtcEZpbGUiLCJ0ZW1wRmlsZVBhdGgiLCJ3cml0ZUZpbGUiLCJkaXJuYW1lIiwibG9jayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFTyxNQUFNQSxTQUFTLEdBQUcsU0FBbEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLFFBQW5COztBQUNBLE1BQU1DLG9CQUFvQixHQUFHLFFBQTdCOztBQUNBLE1BQU1DLFdBQVcsR0FBRyxjQUFwQjs7O0FBRUEsTUFBTUMsT0FBTyxHQUFHLFVBQVNDLE9BQVQsRUFBMEJDLElBQUksR0FBRyxHQUFqQyxFQUFzRDtBQUMzRSxRQUFNQyxHQUFtQixHQUFHLGtCQUFRRCxJQUFSLEVBQWNELE9BQWQsQ0FBNUIsQ0FEMkUsQ0FFM0U7QUFDQTs7QUFDQUUsRUFBQUEsR0FBRyxDQUFDRCxJQUFKLEdBQVdELE9BQVg7QUFFQSxTQUFPRSxHQUFQO0FBQ0QsQ0FQTTs7OztBQVNQLE1BQU1DLFFBQVEsR0FBRyxVQUFTQyxHQUFULEVBQXNCO0FBQ3JDLFNBQVEsR0FBRUEsR0FBSSxPQUFNQyxNQUFNLENBQUNDLElBQUksQ0FBQ0MsTUFBTCxFQUFELENBQU4sQ0FBc0JDLE1BQXRCLENBQTZCLENB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LEVBRUU7QUFDRU8sTUFBQUEsSUFBSSxFQUFFLElBRFI7QUFFRWhELE1BQUFBLEtBQUssRUFBRTtBQUZULEtBRkYsRUFNRSxDQUFDNUQsR0FBRCxFQUFNeUQsR0FBTixLQUFjO0FBQ1osVUFBSXpELEdBQUosRUFBUztBQUNQLGFBQUtxQixNQUFMLENBQVlnQixLQUFaLENBQWtCO0FBQUVkLFVBQUFBO0FBQUYsU0FBbEIsRUFBNEIsb0VBQTVCO0FBRUEsZUFBT1osRUFBRSxDQUFDWCxHQUFELENBQVQ7QUFDRDs7QUFFRCxXQUFLcUIsTUFBTCxDQUFZZ0IsS0FBWixDQUFrQjtBQUFFZCxRQUFBQTtBQUFGLE9BQWxCLEVBQTRCLHFEQUE1QjtBQUNBLGFBQU9aLEVBQUUsQ0FBQyxJQUFELEVBQU84QyxHQUFQLENBQVQ7QUFDRCxLQWZIO0FBaUJEOztBQUVPckIsRUFBQUEsV0FBUixDQUFvQmIsSUFBcEIsRUFBa0NaLEVBQWxDLEVBQXNEO0FBQ3BELGlDQUFXLEtBQUtrQyxXQUFMLENBQWlCdEIsSUFBakIsQ0FBWCxFQUFtQ1osRUFBbkM7QUFDRDs7QUFyVjREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IHsgVXBsb2FkVGFyYmFsbCwgUmVhZFRhcmJhbGwgfSBmcm9tICdAdmVyZGFjY2lvL3N0cmVhbXMnO1xuaW1wb3J0IHsgdW5sb2NrRmlsZSwgcmVhZEZpbGUgfSBmcm9tICdAdmVyZGFjY2lvL2ZpbGUtbG9ja2luZyc7XG5pbXBvcnQgeyBDYWxsYmFjaywgTG9nZ2VyLCBQYWNrYWdlLCBJTG9jYWxQYWNrYWdlTWFuYWdlciwgSVVwbG9hZFRhcmJhbGwgfSBmcm9tICdAdmVyZGFjY2lvL3R5cGVzJztcbmltcG9ydCB7IGdldENvZGUsIGdldEludGVybmFsRXJyb3IsIGdldE5vdEZvdW5kLCBWZXJkYWNjaW9FcnJvciB9IGZyb20gJ0B2ZXJkYWNjaW8vY29tbW9ucy1hcGkvbGliJztcblxuZXhwb3J0IGNvbnN0IGZpbGVFeGlzdCA9ICdFRVhJU1RTJztcbmV4cG9ydCBjb25zdCBub1N1Y2hGaWxlID0gJ0VOT0VOVCc7XG5leHBvcnQgY29uc3QgcmVzb3VyY2VOb3RBdmFpbGFibGUgPSAnRUFHQUlOJztcbmV4cG9ydCBjb25zdCBwa2dGaWxlTmFtZSA9ICdwYWNrYWdlLmpzb24nO1xuXG5leHBvcnQgY29uc3QgZlNFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZywgY29kZSA9IDQwOSk6IFZlcmRhY2Npb0Vycm9yIHtcbiAgY29uc3QgZXJyOiBWZXJkYWNjaW9FcnJvciA9IGdldENvZGUoY29kZSwgbWVzc2FnZSk7XG4gIC8vIEZJWE1FOiB3ZSBzaG91bGQgcmV0dXJuIGh0dHAtc3RhdHVzIGNvZGVzIGhlcmUgaW5zdGVhZCwgZnV0dXJlIGltcHJvdmVtZW50XG4gIC8vIEB0cy1pZ25vcmVcbiAgZXJyLmNvZGUgPSBtZXNzYWdlO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG5jb25zdCB0ZW1wRmlsZSA9IGZ1bmN0aW9uKHN0cik6IHN0cmluZyB7XG4gIHJldHVybiBgJHtzdHJ9LnRtcCR7U3RyaW5nKE1hdGgucmFuZG9tKCkpLnN1YnN0cigyKX1gO1xufTtcblxuY29uc3QgcmVuYW1lVG1wID0gZnVuY3Rpb24oc3JjLCBkc3QsIF9jYik6IHZvaWQge1xuICBjb25zdCBjYiA9IChlcnIpOiB2b2lkID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBmcy51bmxpbmsoc3JjLCAoKSA9PiB7fSk7XG4gICAgfVxuICAgIF9jYihlcnIpO1xuICB9O1xuXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIGZzLnJlbmFtZShzcmMsIGRzdCwgY2IpO1xuICB9XG5cbiAgLy8gd2luZG93cyBjYW4ndCByZW1vdmUgb3BlbmVkIGZpbGUsXG4gIC8vIGJ1dCBpdCBzZWVtIHRvIGJlIGFibGUgdG8gcmVuYW1lIGl0XG4gIGNvbnN0IHRtcCA9IHRlbXBGaWxlKGRzdCk7XG4gIGZzLnJlbmFtZShkc3QsIHRtcCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgZnMucmVuYW1lKHNyYywgZHN0LCBjYik7XG4gICAgaWYgKCFlcnIpIHtcbiAgICAgIGZzLnVubGluayh0bXAsICgpID0+IHt9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IHR5cGUgSUxvY2FsRlNQYWNrYWdlTWFuYWdlciA9IElMb2NhbFBhY2thZ2VNYW5hZ2VyICYgeyBwYXRoOiBzdHJpbmcgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxGUyBpbXBsZW1lbnRzIElMb2NhbEZTUGFja2FnZU1hbmFnZXIge1xuICBwdWJsaWMgcGF0aDogc3RyaW5nO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICB9XG5cbiAgLyoqXG4gICAgKiAgVGhpcyBmdW5jdGlvbiBhbGxvd3MgdG8gdXBkYXRlIHRoZSBwYWNrYWdlIHRocmVhZC1zYWZlbHlcbiAgICAgIEFsZ29yaXRobTpcbiAgICAgIDEuIGxvY2sgcGFja2FnZS5qc29uIGZvciB3cml0aW5nXG4gICAgICAyLiByZWFkIHBhY2thZ2UuanNvblxuICAgICAgMy4gdXBkYXRlRm4ocGtnLCBjYiksIGFuZCB3YWl0IGZvciBjYlxuICAgICAgNC4gd3JpdGUgcGFja2FnZS5qc29uLnRtcFxuICAgICAgNS4gbW92ZSBwYWNrYWdlLmpzb24udG1wIHBhY2thZ2UuanNvblxuICAgICAgNi4gY2FsbGJhY2soZXJyPylcbiAgICAqIEBwYXJhbSB7Kn0gbmFtZVxuICAgICogQHBhcmFtIHsqfSB1cGRhdGVIYW5kbGVyXG4gICAgKiBAcGFyYW0geyp9IG9uV3JpdGVcbiAgICAqIEBwYXJhbSB7Kn0gdHJhbnNmb3JtUGFja2FnZVxuICAgICogQHBhcmFtIHsqfSBvbkVuZFxuICAgICovXG4gIHB1YmxpYyB1cGRhdGVQYWNrYWdlKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB1cGRhdGVIYW5kbGVyOiBDYWxsYmFjayxcbiAgICBvbldyaXRlOiBDYWxsYmFjayxcbiAgICB0cmFuc2Zvcm1QYWNrYWdlOiBGdW5jdGlvbixcbiAgICBvbkVuZDogQ2FsbGJhY2tcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5fbG9ja0FuZFJlYWRKU09OKHBrZ0ZpbGVOYW1lLCAoZXJyLCBqc29uKSA9PiB7XG4gICAgICBsZXQgbG9ja2VkID0gZmFsc2U7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIC8vIGNhbGxiYWNrIHRoYXQgY2xlYW5zIHVwIGxvY2sgZmlyc3RcbiAgICAgIGNvbnN0IHVuTG9ja0NhbGxiYWNrID0gZnVuY3Rpb24obG9ja0Vycm9yOiBFcnJvcik6IHZvaWQge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG4gICAgICAgIGNvbnN0IF9hcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmIChsb2NrZWQpIHtcbiAgICAgICAgICBzZWxmLl91bmxvY2tKU09OKHBrZ0ZpbGVOYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgYW55IGVycm9yIGZyb20gdGhlIHVubG9ja1xuICAgICAgICAgICAgaWYgKGxvY2tFcnJvciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBzZWxmLmxvZ2dlci50cmFjZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgbG9ja0Vycm9yLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1tsb2NhbC1zdG9yYWdlL3VwZGF0ZVBhY2thZ2UvdW5Mb2NrQ2FsbGJhY2tdIGZpbGU6IEB7bmFtZX0gbG9jayBoYXMgZmFpbGVkIGxvY2tFcnJvcjogQHtsb2NrRXJyb3J9J1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvbkVuZC5hcHBseShsb2NrRXJyb3IsIF9hcmdzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmxvZ2dlci50cmFjZSh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL3VwZGF0ZVBhY2thZ2UvdW5Mb2NrQ2FsbGJhY2tdIGZpbGU6IEB7bmFtZX0gaGFzIGJlZW4gdXBkYXRlZCcpO1xuXG4gICAgICAgICAgb25FbmQoLi4uX2FyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoIWVycikge1xuICAgICAgICBsb2NrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZShcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1tsb2NhbC1zdG9yYWdlL3VwZGF0ZVBhY2thZ2VdIGZpbGU6IEB7bmFtZX0gaGFzIGJlZW4gbG9ja2VkJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoXy5pc05pbChlcnIpID09PSBmYWxzZSkge1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IHJlc291cmNlTm90QXZhaWxhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuIHVuTG9ja0NhbGxiYWNrKGdldEludGVybmFsRXJyb3IoJ3Jlc291cmNlIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVyci5jb2RlID09PSBub1N1Y2hGaWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHVuTG9ja0NhbGxiYWNrKGdldE5vdEZvdW5kKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB1bkxvY2tDYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZUhhbmRsZXIoanNvbiwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiB1bkxvY2tDYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Xcml0ZShuYW1lLCB0cmFuc2Zvcm1QYWNrYWdlKGpzb24pLCB1bkxvY2tDYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVQYWNrYWdlKHBhY2thZ2VOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyOiBOb2RlSlMuRXJybm9FeGNlcHRpb24gfCBudWxsKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoeyBwYWNrYWdlTmFtZSB9LCAnW2xvY2FsLXN0b3JhZ2UvZGVsZXRlUGFja2FnZV0gZGVsZXRlIGEgcGFja2FnZSBAe3BhY2thZ2VOYW1lfScpO1xuXG4gICAgcmV0dXJuIGZzLnVubGluayh0aGlzLl9nZXRTdG9yYWdlKHBhY2thZ2VOYW1lKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZVBhY2thZ2UoY2FsbGJhY2s6IChlcnI6IE5vZGVKUy5FcnJub0V4Y2VwdGlvbiB8IG51bGwpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1Zyh7IHBhY2thZ2VOYW1lOiB0aGlzLnBhdGggfSwgJ1tsb2NhbC1zdG9yYWdlL3JlbW92ZVBhY2thZ2VdIHJlbW92ZSBhIHBhY2thZ2U6IEB7cGFja2FnZU5hbWV9Jyk7XG5cbiAgICBmcy5ybWRpcih0aGlzLl9nZXRTdG9yYWdlKCcuJyksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVQYWNrYWdlKG5hbWU6IHN0cmluZywgdmFsdWU6IFBhY2thZ2UsIGNiOiBDYWxsYmFjayk6IHZvaWQge1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKHsgcGFja2FnZU5hbWU6IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL2NyZWF0ZVBhY2thZ2VdIGNyZWF0ZSBhIHBhY2thZ2U6IEB7cGFja2FnZU5hbWV9Jyk7XG5cbiAgICB0aGlzLl9jcmVhdGVGaWxlKHRoaXMuX2dldFN0b3JhZ2UocGtnRmlsZU5hbWUpLCB0aGlzLl9jb252ZXJ0VG9TdHJpbmcodmFsdWUpLCBjYik7XG4gIH1cblxuICBwdWJsaWMgc2F2ZVBhY2thZ2UobmFtZTogc3RyaW5nLCB2YWx1ZTogUGFja2FnZSwgY2I6IENhbGxiYWNrKTogdm9pZCB7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoeyBwYWNrYWdlTmFtZTogbmFtZSB9LCAnW2xvY2FsLXN0b3JhZ2Uvc2F2ZVBhY2thZ2VdIHNhdmUgYSBwYWNrYWdlOiBAe3BhY2thZ2VOYW1lfScpO1xuXG4gICAgdGhpcy5fd3JpdGVGaWxlKHRoaXMuX2dldFN0b3JhZ2UocGtnRmlsZU5hbWUpLCB0aGlzLl9jb252ZXJ0VG9TdHJpbmcodmFsdWUpLCBjYik7XG4gIH1cblxuICBwdWJsaWMgcmVhZFBhY2thZ2UobmFtZTogc3RyaW5nLCBjYjogQ2FsbGJhY2spOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2dlci5kZWJ1Zyh7IHBhY2thZ2VOYW1lOiBuYW1lIH0sICdbbG9jYWwtc3RvcmFnZS9yZWFkUGFja2FnZV0gcmVhZCBhIHBhY2thZ2U6IEB7cGFja2FnZU5hbWV9Jyk7XG5cbiAgICB0aGlzLl9yZWFkU3RvcmFnZUZpbGUodGhpcy5fZ2V0U3RvcmFnZShwa2dGaWxlTmFtZSkpLnRoZW4oXG4gICAgICByZXMgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IEpTT04ucGFyc2UocmVzLnRvU3RyaW5nKCd1dGY4JykpO1xuXG4gICAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoXG4gICAgICAgICAgICB7IHBhY2thZ2VOYW1lOiBuYW1lIH0sXG4gICAgICAgICAgICAnW2xvY2FsLXN0b3JhZ2UvcmVhZFBhY2thZ2UvX3JlYWRTdG9yYWdlRmlsZV0gcmVhZCBhIHBhY2thZ2Ugc3VjY2VlZDogQHtwYWNrYWdlTmFtZX0nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjYihudWxsLCBkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoeyBlcnIgfSwgJ1tsb2NhbC1zdG9yYWdlL3JlYWRQYWNrYWdlL19yZWFkU3RvcmFnZUZpbGVdIGVycm9yIG9uIHJlYWQgYSBwYWNrYWdlOiBAe2Vycn0nKTtcbiAgICAgICAgICBjYihlcnIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoeyBlcnIgfSwgJ1tsb2NhbC1zdG9yYWdlL3JlYWRQYWNrYWdlL19yZWFkU3RvcmFnZUZpbGVdIGVycm9yIG9uIHJlYWQgYSBwYWNrYWdlOiBAe2Vycn0nKTtcblxuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHdyaXRlVGFyYmFsbChuYW1lOiBzdHJpbmcpOiBJVXBsb2FkVGFyYmFsbCB7XG4gICAgY29uc3QgdXBsb2FkU3RyZWFtID0gbmV3IFVwbG9hZFRhcmJhbGwoe30pO1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKFxuICAgICAgeyBwYWNrYWdlTmFtZTogbmFtZSB9LFxuICAgICAgJ1tsb2NhbC1zdG9yYWdlL3dyaXRlVGFyYmFsbF0gd3JpdGUgYSB0YXJiYWxsIGZvciBwYWNrYWdlOiBAe3BhY2thZ2VOYW1lfSdcbiAgICApO1xuXG4gICAgbGV0IF9lbmRlZCA9IDA7XG4gICAgdXBsb2FkU3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIF9lbmRlZCA9IDE7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwYXRoTmFtZTogc3RyaW5nID0gdGhpcy5fZ2V0U3RvcmFnZShuYW1lKTtcblxuICAgIGZzLmFjY2VzcyhwYXRoTmFtZSwgZmlsZU5vdEZvdW5kID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0cyA9ICFmaWxlTm90Rm91bmQ7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIHVwbG9hZFN0cmVhbS5lbWl0KCdlcnJvcicsIGZTRXJyb3IoZmlsZUV4aXN0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZW1wb3JhbE5hbWUgPSBwYXRoLmpvaW4odGhpcy5wYXRoLCBgJHtuYW1lfS50bXAtJHtTdHJpbmcoTWF0aC5yYW5kb20oKSkucmVwbGFjZSgvXjBcXC4vLCAnJyl9YCk7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0ZW1wb3JhbE5hbWUpO1xuICAgICAgICBjb25zdCByZW1vdmVUZW1wRmlsZSA9ICgpOiB2b2lkID0+IGZzLnVubGluayh0ZW1wb3JhbE5hbWUsICgpID0+IHt9KTtcbiAgICAgICAgbGV0IG9wZW5lZCA9IGZhbHNlO1xuICAgICAgICB1cGxvYWRTdHJlYW0ucGlwZShmaWxlKTtcblxuICAgICAgICB1cGxvYWRTdHJlYW0uZG9uZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgIGNvbnN0IG9uZW5kID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBmaWxlLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZW5hbWVUbXAodGVtcG9yYWxOYW1lLCBwYXRoTmFtZSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdXBsb2FkU3RyZWFtLmVtaXQoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWxlLmVuZCgpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKF9lbmRlZCkge1xuICAgICAgICAgICAgb25lbmQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBsb2FkU3RyZWFtLm9uKCdlbmQnLCBvbmVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHVwbG9hZFN0cmVhbS5hYm9ydCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgIGlmIChvcGVuZWQpIHtcbiAgICAgICAgICAgIG9wZW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgZmlsZS5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmVtb3ZlVGVtcEZpbGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgZmlsZSBkb2VzIG5vdCByZWNpZXZlIGFueSBieXRlIG5ldmVyIGlzIG9wZW5lZCBhbmQgaGFzIHRvIGJlIHJlbW92ZWQgYW55d2F5LlxuICAgICAgICAgICAgcmVtb3ZlVGVtcEZpbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZS5lbmQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmaWxlLm9uKCdvcGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgb3BlbmVkID0gdHJ1ZTtcbiAgICAgICAgICAvLyByZS1lbWl0dGluZyBvcGVuIGJlY2F1c2UgaXQncyBoYW5kbGVkIGluIHN0b3JhZ2UuanNcbiAgICAgICAgICB1cGxvYWRTdHJlYW0uZW1pdCgnb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmaWxlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHVwbG9hZFN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVwbG9hZFN0cmVhbTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkVGFyYmFsbChuYW1lOiBzdHJpbmcpOiBSZWFkVGFyYmFsbCB7XG4gICAgY29uc3QgcGF0aE5hbWU6IHN0cmluZyA9IHRoaXMuX2dldFN0b3JhZ2UobmFtZSk7XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoeyBwYWNrYWdlTmFtZTogbmFtZSB9LCAnW2xvY2FsLXN0b3JhZ2UvcmVhZFRhcmJhbGxdIHJlYWQgYSB0YXJiYWxsIGZvciBwYWNrYWdlOiBAe3BhY2thZ2VOYW1lfScpO1xuXG4gICAgY29uc3QgcmVhZFRhcmJhbGxTdHJlYW0gPSBuZXcgUmVhZFRhcmJhbGwoe30pO1xuXG4gICAgY29uc3QgcmVhZFN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aE5hbWUpO1xuXG4gICAgcmVhZFN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlYWRUYXJiYWxsU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9KTtcblxuICAgIHJlYWRTdHJlYW0ub24oJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgICAgZnMuZnN0YXQoZmQsIGZ1bmN0aW9uKGVyciwgc3RhdHMpIHtcbiAgICAgICAgaWYgKF8uaXNOaWwoZXJyKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZFRhcmJhbGxTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJlYWRUYXJiYWxsU3RyZWFtLmVtaXQoJ2NvbnRlbnQtbGVuZ3RoJywgc3RhdHMuc2l6ZSk7XG4gICAgICAgIHJlYWRUYXJiYWxsU3RyZWFtLmVtaXQoJ29wZW4nKTtcbiAgICAgICAgcmVhZFN0cmVhbS5waXBlKHJlYWRUYXJiYWxsU3RyZWFtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmVhZFRhcmJhbGxTdHJlYW0uYWJvcnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgIHJlYWRTdHJlYW0uY2xvc2UoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlYWRUYXJiYWxsU3RyZWFtO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRmlsZShuYW1lOiBzdHJpbmcsIGNvbnRlbnRzOiBhbnksIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMubG9nZ2VyLnRyYWNlKHsgbmFtZSB9LCAnW2xvY2FsLXN0b3JhZ2UvX2NyZWF0ZUZpbGVdIGNyZWF0ZSBhIG5ldyBmaWxlOiBAe25hbWV9Jyk7XG5cbiAgICBmcy5vcGVuKG5hbWUsICd3eCcsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIG5hdGl2ZSBFRVhJU1QgdXNlZCBoZXJlIHRvIGNoZWNrIGV4Y2VwdGlvbiBvbiBmcy5vcGVuXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VFWElTVCcpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL19jcmVhdGVGaWxlXSBmaWxlIGNhbm5vdCBiZSBjcmVhdGVkLCBpdCBhbHJlYWR5IGV4aXN0czogQHtuYW1lfScpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhmU0Vycm9yKGZpbGVFeGlzdCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3dyaXRlRmlsZShuYW1lLCBjb250ZW50cywgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZFN0b3JhZ2VGaWxlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpOiB2b2lkID0+IHtcbiAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKHsgbmFtZSB9LCAnW2xvY2FsLXN0b3JhZ2UvX3JlYWRTdG9yYWdlRmlsZV0gcmVhZCBhIGZpbGU6IEB7bmFtZX0nKTtcblxuICAgICAgZnMucmVhZEZpbGUobmFtZSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIudHJhY2UoeyBlcnIgfSwgJ1tsb2NhbC1zdG9yYWdlL19yZWFkU3RvcmFnZUZpbGVdIGVycm9yIG9uIHJlYWQgdGhlIGZpbGU6IEB7bmFtZX0nKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL19yZWFkU3RvcmFnZUZpbGVdIHJlYWQgZmlsZSBzdWNjZWVkOiBAe25hbWV9Jyk7XG5cbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnZlcnRUb1N0cmluZyh2YWx1ZTogUGFja2FnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAnXFx0Jyk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTdG9yYWdlKGZpbGVOYW1lID0gJycpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0b3JhZ2VQYXRoOiBzdHJpbmcgPSBwYXRoLmpvaW4odGhpcy5wYXRoLCBmaWxlTmFtZSk7XG5cbiAgICByZXR1cm4gc3RvcmFnZVBhdGg7XG4gIH1cblxuICBwcml2YXRlIF93cml0ZUZpbGUoZGVzdDogc3RyaW5nLCBkYXRhOiBzdHJpbmcsIGNiOiBDYWxsYmFjayk6IHZvaWQge1xuICAgIGNvbnN0IGNyZWF0ZVRlbXBGaWxlID0gKGNiKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0ZW1wRmlsZVBhdGggPSB0ZW1wRmlsZShkZXN0KTtcblxuICAgICAgZnMud3JpdGVGaWxlKHRlbXBGaWxlUGF0aCwgZGF0YSwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLnRyYWNlKHsgbmFtZTogZGVzdCB9LCAnW2xvY2FsLXN0b3JhZ2UvX3dyaXRlRmlsZV0gbmV3IGZpbGU6IEB7bmFtZX0gaGFzIGJlZW4gY3JlYXRlZCcpO1xuXG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSh7IG5hbWU6IGRlc3QgfSwgJ1tsb2NhbC1zdG9yYWdlL193cml0ZUZpbGVdIGNyZWF0aW5nIGEgbmV3IGZpbGU6IEB7bmFtZX0nKTtcbiAgICAgICAgcmVuYW1lVG1wKHRlbXBGaWxlUGF0aCwgZGVzdCwgY2IpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNyZWF0ZVRlbXBGaWxlKGVyciA9PiB7XG4gICAgICBpZiAoZXJyICYmIGVyci5jb2RlID09PSBub1N1Y2hGaWxlKSB7XG4gICAgICAgIG1rZGlycChwYXRoLmRpcm5hbWUoZGVzdCksIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjcmVhdGVUZW1wRmlsZShjYik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2IoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2xvY2tBbmRSZWFkSlNPTihuYW1lOiBzdHJpbmcsIGNiOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGZpbGVOYW1lOiBzdHJpbmcgPSB0aGlzLl9nZXRTdG9yYWdlKG5hbWUpO1xuXG4gICAgcmVhZEZpbGUoXG4gICAgICBmaWxlTmFtZSxcbiAgICAgIHtcbiAgICAgICAgbG9jazogdHJ1ZSxcbiAgICAgICAgcGFyc2U6IHRydWUsXG4gICAgICB9LFxuICAgICAgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL19sb2NrQW5kUmVhZEpTT05dIHJlYWQgbmV3IGZpbGU6IEB7bmFtZX0gaGFzIGZhaWxlZCcpO1xuXG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci50cmFjZSh7IG5hbWUgfSwgJ1tsb2NhbC1zdG9yYWdlL19sb2NrQW5kUmVhZEpTT05dIGZpbGU6IEB7bmFtZX0gcmVhZCcpO1xuICAgICAgICByZXR1cm4gY2IobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfdW5sb2NrSlNPTihuYW1lOiBzdHJpbmcsIGNiOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHVubG9ja0ZpbGUodGhpcy5fZ2V0U3RvcmFnZShuYW1lKSwgY2IpO1xuICB9XG59XG4iXX0=