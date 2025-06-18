/* eslint-disable @typescript-eslint/no-unused-vars */
import buildDebug from 'debug';
import { fs } from 'memfs';
import { Stats } from 'memfs/lib/Stats';
import path from 'node:path';
import { PassThrough, Writable, addAbortSignal } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { errorUtils, pluginUtils } from '@verdaccio/core';
import { Logger, Manifest } from '@verdaccio/types';

import { parsePackage, stringifyPackage } from './utils';

const debug = buildDebug('verdaccio:plugin:storage:memory-storage');

function fstatPromise(fd): Promise<Stats | undefined> {
  return new Promise((resolve, reject) => {
    fs.fstat(fd, function (err, stats) {
      if (err) {
        return reject(err);
      }
      return resolve(stats);
    });
  });
}

function mkdirPPromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.mkdirp(path.dirname(fileName), function (err) {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
}

export type DataHandler = {
  [key: string]: string;
};

class MemoryHandler implements pluginUtils.StorageHandler {
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
    debug('initialized');
  }

  public async hasTarball(fileName: string): Promise<boolean> {
    throw new Error('not  implemented');
  }

  public async hasPackage(): Promise<boolean> {
    return false;
  }

  public async deletePackage(pkgName: string): Promise<void> {
    delete this.data[pkgName];
    return;
  }

  public removePackage() {
    return Promise.resolve();
  }

  public async createPackage(name: string, value: Manifest): Promise<void> {
    debug('create package %o', name);
    await this.savePackage(name, value);
  }

  public async savePackage(name: string, value: Manifest): Promise<void> {
    try {
      debug('save package %o', name);
      this.data[name] = stringifyPackage(value);
    } catch (err: any) {
      throw errorUtils.getInternalError(err.message);
    }
  }

  public async readPackage(name: string): Promise<Manifest> {
    debug('read package %o', name);
    const json = this._getStorage(name);
    const isJson = typeof json === 'undefined';
    if (isJson) {
      throw errorUtils.getNotFound();
    }
    return parsePackage(json);
  }

  public async writeTarball(name: string): Promise<Writable> {
    const temporalName = `${this.path}/${name}`;
    debug('write tarball %o', temporalName);
    await mkdirPPromise(temporalName);
    const writeStream = fs.createWriteStream(temporalName);
    return writeStream;
  }

  public async readTarball(pkgName: string, { signal }): Promise<PassThrough> {
    const pathName: string = this._getStorage(pkgName);
    const passStream = new PassThrough();
    const readStream = addAbortSignal(signal, fs.createReadStream(pathName));
    readStream.on('open', async function (fileDescriptor) {
      const stats = await fstatPromise(fileDescriptor);
      passStream.emit('content-length', stats?.size);
    });
    readStream.on('error', (err) => {
      passStream.emit('error', err);
    });

    await pipeline(readStream, passStream);

    return passStream;
  }

  // public readTarball(name: string): IReadTarball {
  //   const pathName = `${this.path}/${name}`;
  //   debug('read tarball %o', pathName);

  //   const readTarballStream: IReadTarball = new ReadTarball({});

  //   process.nextTick(function () {
  //     fs.stat(pathName, function (error, stats) {
  //       if (error && !stats) {
  //         return readTarballStream.emit('error', errorUtils.getNotFound());
  //       }

  //       try {
  //         const readStream = fs.createReadStream(pathName);

  //         readTarballStream.emit('content-length', stats?.size);
  //         readTarballStream.emit('open');
  //         readStream.pipe(readTarballStream);
  //         readStream.on('error', (error: VerdaccioError) => {
  //           readTarballStream.emit('error', error);
  //         });

  //         readTarballStream.abort = function (): void {
  //           readStream.destroy(errorUtils.getBadRequest('read has been aborted'));
  //         };
  //         return;
  //       } catch (err: any) {
  //         readTarballStream.emit('error', err);
  //         return;
  //       }
  //     });
  //   });

  //   return readTarballStream;
  // }

  private _getStorage(name = ''): string {
    debug('get storage %o', name);
    return this.data[name];
  }

  public async updatePackage(
    packageName: string,
    handleUpdate: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest> {
    const json: string = this._getStorage(packageName);
    let pkg: Manifest = parsePackage(json) as Manifest;
    const newManifest = await handleUpdate(pkg);
    return newManifest;
  }
}

export default MemoryHandler;
