import buildDebug from 'debug';
import {
  VerdaccioError,
  getBadRequest,
  getInternalError,
  getConflict,
  getNotFound,
} from '@verdaccio/commons-api';
import MemoryFileSystem from 'memory-fs';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import {
  Callback,
  Logger,
  IPackageStorageManager,
  IUploadTarball,
  IReadTarball,
  CallbackAction,
  StorageUpdateCallback,
  StorageWriteCallback,
  PackageTransformer,
  Package,
  ReadPackageCallback,
} from '@verdaccio/types';

import { parsePackage, stringifyPackage } from './utils';

const debug = buildDebug('verdaccio:plugin:storage:memory-storage');
const fs = new MemoryFileSystem();

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
    this.path = '/';
    debug('initialized');
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
    debug('create package %o', name);
    this.savePackage(name, value, cb);
  }

  public savePackage(name: string, value: Package, cb: CallbackAction): void {
    try {
      debug('save package %o', name);
      this.data[name] = stringifyPackage(value);
      return cb(null);
    } catch (err) {
      return cb(getInternalError(err.message));
    }
  }

  public readPackage(name: string, cb: ReadPackageCallback): void {
    debug('read package %o', name);
    const json = this._getStorage(name);
    const isJson = typeof json === 'undefined';

    try {
      return cb(isJson ? getNotFound() : null, parsePackage(json));
    } catch (err) {
      return cb(getNotFound());
    }
  }

  public writeTarball(name: string): IUploadTarball {
    debug('write tarball %o', name);
    const uploadStream: IUploadTarball = new UploadTarball({});
    const temporalName = `/${name}`;

    process.nextTick(function () {
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

    return uploadStream;
  }

  public readTarball(name: string): IReadTarball {
    const pathName = `/${name}`;
    debug('read tarball %o', name);

    const readTarballStream: IReadTarball = new ReadTarball({});

    process.nextTick(function () {
      fs.stat(pathName, function (fileError, stats) {
        if (fileError && !stats) {
          return readTarballStream.emit('error', getNotFound());
        }

        try {
          const readStream = fs.createReadStream(pathName);

          const contentLength: number = fs?.data[name]?.length || 0;
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
    debug('get storage %o', name);
    return this.data[name];
  }
}

export default MemoryHandler;
