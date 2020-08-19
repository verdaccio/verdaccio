import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import mkdirp from 'mkdirp';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import { unlockFile, readFile } from '@verdaccio/file-locking';
import { Callback, Logger, Package, ILocalPackageManager, IUploadTarball } from '@verdaccio/types';
import { getCode, getInternalError, getNotFound, VerdaccioError } from '@verdaccio/commons-api';

export const fileExist = 'EEXISTS';
export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export const pkgFileName = 'package.json';

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
  public updatePackage(name: string, updateHandler: Callback, onWrite: Callback, transformPackage: Function, onEnd: Callback): void {
    this._lockAndReadJSON(pkgFileName, (err, json) => {
      let locked = false;
      const self = this;
      // callback that cleans up lock first
      const unLockCallback = function (lockError: Error): void {
        // eslint-disable-next-line prefer-rest-params
        const _args = arguments;

        if (locked) {
          self._unlockJSON(pkgFileName, () => {
            // ignore any error from the unlock
            if (lockError !== null) {
              self.logger.trace(
                {
                  name,
                  lockError,
                },
                '[local-storage/updatePackage/unLockCallback] file: @{name} lock has failed lockError: @{lockError}'
              );
            }

            onEnd.apply(lockError, _args);
          });
        } else {
          self.logger.trace({ name }, '[local-storage/updatePackage/unLockCallback] file: @{name} has been updated');

          onEnd(..._args);
        }
      };

      if (!err) {
        locked = true;
        this.logger.trace(
          {
            name,
          },
          '[local-storage/updatePackage] file: @{name} has been locked'
        );
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

  public deletePackage(packageName: string, callback: (err: NodeJS.ErrnoException | null) => void): void {
    this.logger.debug({ packageName }, '[local-storage/deletePackage] delete a package @{packageName}');

    return fs.unlink(this._getStorage(packageName), callback);
  }

  public removePackage(callback: (err: NodeJS.ErrnoException | null) => void): void {
    this.logger.debug({ packageName: this.path }, '[local-storage/removePackage] remove a package: @{packageName}');

    fs.rmdir(this._getStorage('.'), callback);
  }

  public createPackage(name: string, value: Package, cb: Callback): void {
    this.logger.debug({ packageName: name }, '[local-storage/createPackage] create a package: @{packageName}');

    this._createFile(this._getStorage(pkgFileName), this._convertToString(value), cb);
  }

  public savePackage(name: string, value: Package, cb: Callback): void {
    this.logger.debug({ packageName: name }, '[local-storage/savePackage] save a package: @{packageName}');

    this._writeFile(this._getStorage(pkgFileName), this._convertToString(value), cb);
  }

  public readPackage(name: string, cb: Callback): void {
    this.logger.debug({ packageName: name }, '[local-storage/readPackage] read a package: @{packageName}');

    this._readStorageFile(this._getStorage(pkgFileName)).then(
      (res) => {
        try {
          const data: any = JSON.parse(res.toString('utf8'));

          this.logger.trace({ packageName: name }, '[local-storage/readPackage/_readStorageFile] read a package succeed: @{packageName}');
          cb(null, data);
        } catch (err) {
          this.logger.trace({ err }, '[local-storage/readPackage/_readStorageFile] error on read a package: @{err}');
          cb(err);
        }
      },
      (err) => {
        this.logger.trace({ err }, '[local-storage/readPackage/_readStorageFile] error on read a package: @{err}');

        return cb(err);
      }
    );
  }

  public writeTarball(name: string): IUploadTarball {
    const uploadStream = new UploadTarball({});
    this.logger.debug({ packageName: name }, '[local-storage/writeTarball] write a tarball for package: @{packageName}');

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
        const temporalName = path.join(this.path, `${name}.tmp-${String(Math.random()).replace(/^0\./, '')}`);
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
    this.logger.debug({ packageName: name }, '[local-storage/readTarball] read a tarball for package: @{packageName}');

    const readTarballStream = new ReadTarball({});

    const readStream = fs.createReadStream(pathName);

    readStream.on('error', function (err) {
      readTarballStream.emit('error', err);
    });

    readStream.on('open', function (fd) {
      fs.fstat(fd, function (err, stats) {
        if (_.isNil(err) === false) {
          return readTarballStream.emit('error', err);
        }
        readTarballStream.emit('content-length', stats.size);
        readTarballStream.emit('open');
        readStream.pipe(readTarballStream);
      });
    });

    readTarballStream.abort = function (): void {
      readStream.close();
    };

    return readTarballStream;
  }

  private _createFile(name: string, contents: any, callback: Function): void {
    this.logger.trace({ name }, '[local-storage/_createFile] create a new file: @{name}');

    fs.open(name, 'wx', (err) => {
      if (err) {
        // native EEXIST used here to check exception on fs.open
        if (err.code === 'EEXIST') {
          this.logger.trace({ name }, '[local-storage/_createFile] file cannot be created, it already exists: @{name}');
          return callback(fSError(fileExist));
        }
      }

      this._writeFile(name, contents, callback);
    });
  }

  private _readStorageFile(name: string): Promise<any> {
    return new Promise((resolve, reject): void => {
      this.logger.trace({ name }, '[local-storage/_readStorageFile] read a file: @{name}');

      fs.readFile(name, (err, data) => {
        if (err) {
          this.logger.trace({ err }, '[local-storage/_readStorageFile] error on read the file: @{name}');
          reject(err);
        } else {
          this.logger.trace({ name }, '[local-storage/_readStorageFile] read file succeed: @{name}');

          resolve(data);
        }
      });
    });
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
          this.logger.trace({ name: dest }, '[local-storage/_writeFile] new file: @{name} has been created');

          return cb(err);
        }

        this.logger.trace({ name: dest }, '[local-storage/_writeFile] creating a new file: @{name}');
        renameTmp(tempFilePath, dest, cb);
      });
    };

    createTempFile((err) => {
      if (err && err.code === noSuchFile) {
        mkdirp(path.dirname(dest), function (err) {
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

    readFile(
      fileName,
      {
        lock: true,
        parse: true,
      },
      (err, res) => {
        if (err) {
          this.logger.trace({ name }, '[local-storage/_lockAndReadJSON] read new file: @{name} has failed');

          return cb(err);
        }

        this.logger.trace({ name }, '[local-storage/_lockAndReadJSON] file: @{name} read');
        return cb(null, res);
      }
    );
  }

  private _unlockJSON(name: string, cb: Function): void {
    unlockFile(this._getStorage(name), cb);
  }
}
