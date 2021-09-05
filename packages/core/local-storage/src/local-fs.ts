/* eslint-disable no-undef */

import fs from 'fs';
import path from 'path';
import buildDebug from 'debug';

import _ from 'lodash';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import { unlockFile, readFile } from '@verdaccio/file-locking';
import { Callback, Logger, Package, ILocalPackageManager, IUploadTarball } from '@verdaccio/types';
import { getCode, getInternalError, getNotFound, VerdaccioError } from '@verdaccio/commons-api';
import { unlinkPromise, rmdirPromise, readFilePromise } from './fs';

export const fileExist = 'EEXISTS';
export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export const packageJSONFileName = 'package.json';

const debug = buildDebug('verdaccio:plugin:local-storage:local-fs');

export const fSError = function (message: string, code = 409): VerdaccioError {
  const err: VerdaccioError = getCode(code, message);
  // FIXME: we should return http-status codes here instead, future improvement
  // @ts-ignore
  err.code = message;

  return err;
};

const tempFile = function (str): string {
  return `${str}.tmp${String(Math.random()).substr(2)}`;
};

const renameTmp = function (src, dst, _cb): void {
  const cb = (err): void => {
    if (err) {
      fs.unlink(src, () => {});
    }
    _cb(err);
  };

  if (process.platform !== 'win32') {
    return fs.rename(src, dst, cb);
  }

  // windows can't remove opened file,
  // but it seem to be able to rename it
  const tmp = tempFile(dst);
  fs.rename(dst, tmp, function (err) {
    fs.rename(src, dst, cb);
    if (!err) {
      fs.unlink(tmp, () => {});
    }
  });
};

export type ILocalFSPackageManager = ILocalPackageManager & { path: string };

export default class LocalFS implements ILocalFSPackageManager {
  public path: string;
  public logger: Logger;

  public constructor(path: string, logger: Logger) {
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
  public updatePackage(
    name: string,
    updateHandler: Callback,
    onWrite: Callback,
    transformPackage: Function,
    onEnd: Callback
  ): void {
    this._lockAndReadJSON(packageJSONFileName, (err, json) => {
      let locked = false;
      const self = this;
      // callback that cleans up lock first
      const unLockCallback = function (lockError: Error): void {
        // eslint-disable-next-line prefer-rest-params
        const _args = arguments;

        if (locked) {
          debug('unlock %s', packageJSONFileName);
          self._unlockJSON(packageJSONFileName, () => {
            // ignore any error from the unlock
            if (lockError !== null) {
              debug('lock file: %o has failed with error %o', name, lockError);
            }

            onEnd.apply(lockError, _args);
          });
        } else {
          debug('file: %o has been updated', name);
          onEnd(..._args);
        }
      };

      if (!err) {
        locked = true;
        debug('file: %o has been locked', name);
      }

      if (_.isNil(err) === false) {
        if (err.code === resourceNotAvailable) {
          return unLockCallback(getInternalError('resource temporarily unavailable'));
        } else if (err.code === noSuchFile) {
          return unLockCallback(getNotFound());
        } else {
          return unLockCallback(err);
        }
      }

      updateHandler(json, (err) => {
        if (err) {
          return unLockCallback(err);
        }

        onWrite(name, transformPackage(json), unLockCallback);
      });
    });
  }

  public async deletePackage(packageName: string): Promise<void> {
    debug('delete a file/package %o', packageName);

    return await unlinkPromise(this._getStorage(packageName));
  }

  public async removePackage(): Promise<void> {
    debug('remove a package folder %o', this.path);

    await rmdirPromise(this._getStorage('.'));
  }

  public createPackage(name: string, value: Package, cb: Callback): void {
    debug('create a package %o', name);

    this._createFile(this._getStorage(packageJSONFileName), this._convertToString(value), cb);
  }

  public savePackage(name: string, value: Package, cb: Callback): void {
    debug('save a package %o', name);

    this._writeFile(this._getStorage(packageJSONFileName), this._convertToString(value), cb);
  }

  public readPackage(name: string, cb: Callback): void {
    debug('read a package %o', name);

    this._readStorageFile(this._getStorage(packageJSONFileName))
      .then((res) => {
        try {
          const data: any = JSON.parse(res.toString('utf8'));

          debug('read storage file %o has succeed', name);
          cb(null, data);
        } catch (err: any) {
          debug('parse error');
          this.logger.error({ err, name }, 'error @{err.message}  on parse @{name}');
          throw err;
        }
      })
      .catch((err) => {
        this.logger.error({ err }, 'error on read storage file @{err.message}');
        return cb(err);
      });
  }

  public writeTarball(name: string): IUploadTarball {
    const uploadStream = new UploadTarball({});
    debug('write a tarball for a package %o', name);

    let _ended = 0;
    uploadStream.on('end', function () {
      _ended = 1;
    });

    const pathName: string = this._getStorage(name);

    fs.access(pathName, (fileNotFound) => {
      const exists = !fileNotFound;
      if (exists) {
        uploadStream.emit('error', fSError(fileExist));
      } else {
        const temporalName = path.join(
          this.path,
          `${name}.tmp-${String(Math.random()).replace(/^0\./, '')}`
        );
        debug('write a temporal name %o', temporalName);
        const file = fs.createWriteStream(temporalName);
        const removeTempFile = (): void => fs.unlink(temporalName, () => {});
        let opened = false;
        uploadStream.pipe(file);

        uploadStream.done = function (): void {
          const onend = function (): void {
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

        uploadStream.abort = function (): void {
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
          opened = true;
          // re-emitting open because it's handled in storage.js
          uploadStream.emit('open');
        });

        file.on('error', function (err) {
          uploadStream.emit('error', err);
        });
      }
    });

    return uploadStream;
  }

  public readTarball(name: string): ReadTarball {
    const pathName: string = this._getStorage(name);
    debug('read a a tarball %o on path %o', name, pathName);

    const readTarballStream = new ReadTarball({});

    const readStream = fs.createReadStream(pathName);

    readStream.on('error', function (err) {
      debug('error on read a tarball %o with error %o', name, err);
      readTarballStream.emit('error', err);
    });

    readStream.on('open', function (fd) {
      fs.fstat(fd, function (err, stats) {
        if (_.isNil(err) === false) {
          debug('error on read a tarball %o with error %o', name, err);
          return readTarballStream.emit('error', err);
        }
        readTarballStream.emit('content-length', stats.size);
        readTarballStream.emit('open');
        debug('open on read a tarball %o', name);
        readStream.pipe(readTarballStream);
      });
    });

    readTarballStream.abort = function (): void {
      debug('abort on read a tarball %o', name);
      readStream.close();
    };

    return readTarballStream;
  }

  private _createFile(name: string, contents: any, callback: Function): void {
    debug(' create a new file: %o', name);

    fs.open(name, 'wx', (err) => {
      if (err) {
        // native EEXIST used here to check exception on fs.open
        if (err.code === 'EEXIST') {
          debug('file %o cannot be created, it already exists: %o', name);
          return callback(fSError(fileExist));
        }
      }

      this._writeFile(name, contents, callback);
    });
  }

  private async _readStorageFile(name: string): Promise<any> {
    debug('reading the file: %o', name);
    try {
      debug('reading the file: %o', name);
      return await readFilePromise(name);
    } catch (err: any) {
      debug('error reading the file: %o with error %o', name, err.message);
      throw err;
    }
  }

  private _convertToString(value: Package): string {
    return JSON.stringify(value, null, '\t');
  }

  private _getStorage(fileName = ''): string {
    const storagePath: string = path.join(this.path, fileName);

    return storagePath;
  }

  private _writeFile(dest: string, data: string, cb: Callback): void {
    const createTempFile = (cb): void => {
      const tempFilePath = tempFile(dest);

      fs.writeFile(tempFilePath, data, (err) => {
        if (err) {
          debug('error on write the file: %o', dest);
          return cb(err);
        }

        debug('creating a new file:: %o', dest);
        renameTmp(tempFilePath, dest, cb);
      });
    };

    createTempFile((err) => {
      if (err && err.code === noSuchFile) {
        fs.mkdir(path.dirname(dest), { recursive: true }, function (err) {
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

  private _lockAndReadJSON(name: string, cb: Function): void {
    const fileName: string = this._getStorage(name);
    debug('lock and read a file %o', fileName);
    readFile(
      fileName,
      {
        lock: true,
        parse: true,
      },
      (err, res) => {
        if (err) {
          this.logger.error({ err }, 'error on lock file @{err.message}');
          debug('error on lock and read json for file: %o', name);

          return cb(err);
        }
        debug('lock and read json for file: %o', name);

        return cb(null, res);
      }
    );
  }

  private _unlockJSON(name: string, cb: Function): void {
    unlockFile(this._getStorage(name), cb);
  }
}
