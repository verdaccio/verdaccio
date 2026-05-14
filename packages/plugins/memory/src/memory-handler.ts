import MemoryFileSystem from 'memory-fs';
import path from 'node:path';

import type { VerdaccioError } from '@verdaccio/core';
import { errorUtils } from '@verdaccio/core';
import type {
  Callback,
  CallbackAction,
  IPackageStorageManager,
  IReadTarball,
  IUploadTarball,
  Logger,
  Package,
  PackageTransformer,
  ReadPackageCallback,
  StorageUpdateCallback,
  StorageWriteCallback,
} from '@verdaccio/legacy-types';
import { ReadTarball, UploadTarball } from '@verdaccio/streams';

import { parsePackage, stringifyPackage } from './utils';

const fs = new MemoryFileSystem();
const { getBadRequest, getInternalError, getConflict, getNotFound } = errorUtils;

export type DataHandler = {
  [key: string]: string;
};

class MemoryHandler implements IPackageStorageManager {
  private data: DataHandler;
  private name: string;
  private path: string;
  public logger: Logger;

  public constructor(packageName: string, data: DataHandler, logger: Logger) {
    // this is not need it
    this.data = data;
    this.name = packageName;
    this.logger = logger;
    this.path = `/${packageName}`;
  }

  public updatePackage(
    pkgFileName: string,
    updateHandler: StorageUpdateCallback,
    onWrite: StorageWriteCallback,
    transformPackage: PackageTransformer,
    onEnd: CallbackAction
  ): void {
    const json: string = this._getStorage(pkgFileName);
    let pkg: Package;

    try {
      pkg = parsePackage(json) as Package;
    } catch (err) {
      return onEnd(err);
    }

    updateHandler(pkg, (err: VerdaccioError) => {
      if (err) {
        return onEnd(err);
      }
      try {
        onWrite(pkgFileName, transformPackage(pkg), onEnd);
      } catch (err) {
        return onEnd(getInternalError('error on parse the metadata'));
      }
    });
  }

  public deletePackage(pkgName: string, callback: Callback): void {
    delete this.data[pkgName];
    return callback(null);
  }

  public removePackage(callback: CallbackAction): void {
    return callback(null);
  }

  public createPackage(name: string, value: Package, cb: CallbackAction): void {
    this.savePackage(name, value, cb);
  }

  public savePackage(name: string, value: Package, cb: CallbackAction): void {
    try {
      const json: string = stringifyPackage(value);

      this.data[name] = json;
      return cb(null);
    } catch (err: any) {
      return cb(getInternalError(err.message));
    }
  }

  public readPackage(name: string, cb: ReadPackageCallback): void {
    const json = this._getStorage(name);
    const isJson = typeof json === 'undefined';

    try {
      return cb(isJson ? getNotFound() : null, parsePackage(json));
    } catch (err) {
      return cb(getNotFound());
    }
  }

  public writeTarball(name: string): IUploadTarball {
    const uploadStream: IUploadTarball = new UploadTarball({});
    const temporalName = `${this.path}/${name}`;

    process.nextTick(function () {
      fs.mkdirp(path.dirname(temporalName), function (mkdirpError) {
        if (mkdirpError) {
          return uploadStream.emit('error', mkdirpError);
        }
        fs.stat(temporalName, function (fileError, stats) {
          if (!fileError && stats) {
            return uploadStream.emit('error', getConflict());
          }

          try {
            const file = fs.createWriteStream(temporalName);

            uploadStream.pipe(file);

            uploadStream.done = function (): void {
              const onEnd = function (): void {
                uploadStream.emit('success');
              };

              uploadStream.on('end', onEnd);
            };

            uploadStream.abort = function (): void {
              uploadStream.emit('error', getBadRequest('transmision aborted'));
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

  public readTarball(name: string): IReadTarball {
    const pathName = `${this.path}/${name}`;

    const readTarballStream: IReadTarball = new ReadTarball({});

    process.nextTick(function () {
      fs.stat(pathName, function (fileError, stats) {
        if (fileError && !stats) {
          return readTarballStream.emit('error', getNotFound());
        }

        try {
          const readStream = fs.createReadStream(pathName);

          const pathMeta = fs.meta(pathName);
          const contentLength: number = (pathMeta && pathMeta.length) || 0;
          readTarballStream.emit('content-length', contentLength);
          readTarballStream.emit('open');
          readStream.pipe(readTarballStream);
          readStream.on('error', (error: VerdaccioError) => {
            readTarballStream.emit('error', error);
          });

          readTarballStream.abort = function (): void {
            readStream.destroy(getBadRequest('read has been aborted'));
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

  private _getStorage(name = ''): string {
    return this.data[name];
  }
}

export default MemoryHandler;
