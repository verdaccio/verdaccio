import buildDebug from 'debug';
import fs from 'node:fs';
import path from 'node:path';
import type { Readable, Writable } from 'node:stream';
import { addAbortSignal } from 'node:stream';
import sanitzers from 'sanitize-filename';

import type { VerdaccioError, pluginUtils } from '@verdaccio/core';
import { errorUtils } from '@verdaccio/core';
import { readFileNext, unlockFileNext } from '@verdaccio/file-locking';
import type { Logger, Manifest } from '@verdaccio/types';

import {
  accessPromise,
  mkdirPromise,
  openPromise,
  readFilePromise,
  renamePromise,
  rmdirPromise,
  statPromise,
  unlinkPromise,
  writeFilePromise,
} from './fs';

export const fileExist = 'EEXISTS';
export const noSuchFile = 'ENOENT';
export const resourceNotAvailable = 'EAGAIN';
export const packageJSONFileName = 'package.json';

export type ILocalFSPackageManager = pluginUtils.StorageHandler & { path: string };

const debug = buildDebug('verdaccio:plugin:local-storage:local-fs');

export const fSError = function (message: string, code = 409): VerdaccioError {
  const err: VerdaccioError = errorUtils.getCode(code, message);
  // FIXME: we should return http-status codes here instead, future improvement
  // @ts-ignore
  err.code = message;

  return err;
};

const tempFile = function (str): string {
  return `${str}.tmp${String(Math.random()).slice(2)}`;
};

export async function renameTmp(src: string, dst: string): Promise<void> {
  debug('rename %s to %s', src, dst);
  try {
    await renamePromise(src, dst);
  } catch (err: any) {
    debug('error rename %s error %s', src, err?.message);
    await unlinkPromise(src);
  }
}

export default class LocalFS implements ILocalFSPackageManager {
  public path: string;
  public logger: Logger;

  public constructor(path: string, logger: Logger) {
    this.path = path;
    this.logger = logger;
  }

  /**
    * This function allows to update the package
    * This function handle the update package logic, for this plugin
    * we need to lock/unlock handlers for thread-safely and then apply
    * the `handleUpdate` and return the result.
    *
    * The lock could fail on several steps so we need to ensure the
    * file does not get locked if the whole process fails.
    *
      Algorithm:
      1. lock package.json for writing
      2. read package.json
      3. apply external update package handler
      4. return manifest (write is being hanlded into the core)
      5. rename package.json.tmp package.json
    * @param {*} packageName
    * The update package handler could be different based
    * on the action and handled into the core.
    * @param {*} handleUpdate
    */
  public async updatePackage(
    packageName: string,
    handleUpdate: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest> {
    // this plugin lock files on write, we handle all possible scenarios
    let locked = false;
    let manifestUpdated: Manifest;
    try {
      const manifest = await this._lockAndReadJSON(packageJSONFileName);
      locked = true;
      manifestUpdated = await handleUpdate(manifest);
      if (locked) {
        debug('unlock %s', packageJSONFileName);
        await this._unlockJSON(packageJSONFileName);
        this.logger.debug({ packageName }, 'the package @{packageName} has been updated');
        return manifestUpdated;
      } else {
        this.logger.debug({ packageName }, 'the package @{packageName} has been updated');
        return manifestUpdated;
      }
    } catch (err: any) {
      // we ensure lock the file
      this.logger.error(
        { err, packageName },
        'error on update package @{packageName}: @{err.message}'
      );
      if (locked) {
        try {
          await this._unlockJSON(packageJSONFileName);
        } catch {
          // unlock could fail, we bubble up error
          throw errorUtils.getInternalError('resource temporarily unavailable');
        }
        // after unlock bubble up the original error (e.g. thrown by the handler)
        throw err;
      } else {
        if (err.code === resourceNotAvailable) {
          throw errorUtils.getInternalError('resource temporarily unavailable');
        } else if (err.code === noSuchFile) {
          throw errorUtils.getNotFound();
        } else {
          throw err;
        }
      }
    }
  }

  public async deletePackage(packageName: string): Promise<void> {
    debug('delete a file/package %o', packageName);

    return await unlinkPromise(this._getStorage(packageName));
  }

  public async removePackage(): Promise<void> {
    debug('remove a package folder %o', this.path);

    await rmdirPromise(this._getStorage('.'));
  }

  /**
   * Verify if the package exists already.
   * @param name package name
   * @returns
   */
  public async hasPackage(): Promise<boolean> {
    const pathName: string = this._getStorage(packageJSONFileName);
    try {
      const stat = await statPromise(pathName);
      return stat.isFile();
    } catch (err: any) {
      if (err.code === noSuchFile) {
        debug('dir: %o does not exist %s', pathName, err?.code);
        return false;
      } else {
        this.logger.error({ err }, 'error on verify a package exist: @{err.message}');
        throw errorUtils.getInternalError('error on verify a package exist');
      }
    }
  }

  /**
   * Create a package in the local storage, if package already exist fails.
   * @param name package name
   * @param manifest package manifest
   */
  public async createPackage(name: string, manifest: Manifest): Promise<void> {
    debug('create a new package %o', name);
    const pathPackage = this._getStorage(packageJSONFileName);
    try {
      // https://nodejs.org/dist/latest-v17.x/docs/api/fs.html#file-system-flags
      // 'wx': Like 'w' but fails if the path exists
      await openPromise(pathPackage, 'wx');
    } catch (err: any) {
      // cannot override a pacakge that already exist
      if (err.code === 'EEXIST') {
        debug('file %o cannot be created, it already exists: %o', name);
        throw fSError(fileExist);
      }
    }
    // Create a new file and it´s folder if does not exist previously
    await this.writeFile(pathPackage, this._convertToString(manifest));
  }

  public async savePackage(name: string, value: Manifest): Promise<void> {
    debug('save a package %o', name);

    await this.writeFile(this._getStorage(packageJSONFileName), this._convertToString(value));
  }

  public async readPackage(name: string): Promise<Manifest> {
    debug('read a package %o', name);
    try {
      const res = await this._readStorageFile(this._getStorage(packageJSONFileName));
      const data: any = JSON.parse(res.toString('utf8'));

      debug('read storage file %o has succeeded', name);
      return data;
    } catch (err: any) {
      if (err.code !== noSuchFile) {
        debug('parse error');
        this.logger.error({ err, name }, 'error on parse @{name}: @{err.message}');
      }
      throw err;
    }
  }

  public async hasTarball(fileName: string): Promise<boolean> {
    const pathName: string = this._getStorage(fileName);
    return new Promise((resolve) => {
      accessPromise(pathName)
        .then(() => {
          resolve(true);
        })
        .catch(() => resolve(false));
    });
  }

  /**
   * Best-effort removal of a temporary file. Error and abort can both try to
   * clean the same file from event listeners, so a missing file is fine and
   * nothing may throw — a rejection here becomes an uncaught exception.
   */
  private async removeTempFile(temporalName): Promise<void> {
    debug('remove temporal file %o', temporalName);
    try {
      await unlinkPromise(temporalName);
      debug('removed temporal file %o', temporalName);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        this.logger.warn(
          { temporalName, err: err.message },
          'unable to remove temporal file @{temporalName}: @{err}'
        );
      }
    }
  }

  /**
   * Write a tarball into the storage
   * @param fileName package name
   * @param param1
   * @returns
   */
  public async writeTarball(fileName: string, { signal }): Promise<Writable> {
    debug('write a tarball %o', fileName);
    const pathName: string = this._getStorage(fileName);
    await this.checkCreateFolder(pathName);
    // create a temporary file to avoid conflicts or prev corruption files
    const temporalName = path.join(
      this.path,
      sanitzers(`${fileName}.tmp-${String(Math.random()).replace(/^0\./, '')}`)
    );

    debug('write a temporal name %o', temporalName);
    const finalize = async (closeError: NodeJS.ErrnoException | null): Promise<void> => {
      if (closeError || writeStream.errored || !writeStream.writableFinished) {
        // An opening write may create the file after cancellation. Its
        // descriptor must be closed before removing the temporary file.
        await this.removeTempFile(temporalName);
        return;
      }
      try {
        // A failed rename must reject the upload: the final tarball is not
        // available to readers.
        await renamePromise(temporalName, pathName);
      } catch (err) {
        await this.removeTempFile(temporalName);
        throw err;
      }
    };
    const writeStream: fs.WriteStream = fs.createWriteStream(temporalName, {
      fs: {
        open: fs.open,
        write: fs.write,
        writev: fs.writev,
        close(fd, callback) {
          fs.close(fd, (err) => {
            // Include finalization in stream destruction. An async 'close'
            // listener would let pipeline and Store finish before the rename.
            finalize(err).then(() => callback(err), callback);
          });
        },
      },
    });

    writeStream.on('error', (err) => {
      this.logger.error({ err, fileName }, 'error writing tarball for @{fileName}: @{err.message}');
    });

    if (signal) {
      addAbortSignal(signal, writeStream);
    }

    return writeStream;
  }

  /**
   * Read a tarball from the storage
   * @param tarballName tarball name eg: foo-1.0.0.tgz
   * @param options {signal} abort signal
   * @returns Readable stream
   */
  public async readTarball(tarballName: string, { signal }): Promise<Readable> {
    const pathName: string = this._getStorage(tarballName);
    debug('read a tarball %o', pathName);
    const readStream = addAbortSignal(signal, fs.createReadStream(pathName));
    readStream.on('open', function (fileDescriptorId: number) {
      // if abort, the descriptor is null
      debug('file descriptor id %o', fileDescriptorId);
      if (fileDescriptorId) {
        // sync on purpose: the size must be emitted before the first data
        // chunk flushes the response headers (an async fstat races it)
        let size: number | undefined;
        try {
          size = fs.fstatSync(fileDescriptorId).size;
        } catch {
          // the stream 'error' event surfaces any real problem
        }
        if (size !== undefined) {
          debug('file size %o', size);
          readStream.emit('content-length', size);
        }
      }
    });
    readStream.on('error', (error) => {
      debug('no tarball found %o for %s message %s', pathName, tarballName, error.message);
    });
    return readStream;
  }

  private async _readStorageFile(name: string): Promise<any> {
    debug('reading the file: %o', name);
    try {
      return await readFilePromise(name);
    } catch (err: any) {
      debug('error reading the file: %o with error %o', name, err.message);
      throw err;
    }
  }

  private _convertToString(value: Manifest): string {
    return JSON.stringify(value);
  }

  public _getStorage(fileName = ''): string {
    const storagePath: string = path.join(this.path, sanitzers(fileName));
    debug('get storage %s', storagePath);
    return storagePath;
  }

  private async writeTempFileAndRename(dest: string, fileContent: string): Promise<any> {
    const tempFilePath = tempFile(dest);
    try {
      // write file on temp location
      await this.checkCreateFolder(tempFilePath);
      await writeFilePromise(tempFilePath, fileContent);
      debug('creating a new file:: %o', dest);
      // rename tmp file to original
      await renameTmp(tempFilePath, dest);
    } catch (err: any) {
      debug('error on write the file: %o', dest);
      throw err;
    }
  }

  private async writeFile(destiny: string, fileContent: string): Promise<void> {
    try {
      await this.writeTempFileAndRename(destiny, fileContent);
      debug('write file success %s', destiny);
    } catch (err: any) {
      if (err && err.code === noSuchFile) {
        await this.checkCreateFolder(destiny);
        // we try again create the temp file
        debug('writing a temp file %s', destiny);
        await this.writeTempFileAndRename(destiny, fileContent);
        debug('write file success %s', destiny);
      } else {
        this.logger.error({ err }, 'error on write file: @{err.message}');
        throw err;
      }
    }
  }

  private async checkCreateFolder(pathName: string): Promise<void> {
    // Check if folder exists and create it if not
    const dir = path.dirname(pathName);
    try {
      await accessPromise(dir);
    } catch (err: any) {
      if (err.code === noSuchFile) {
        debug('folder does not exist %o', dir);
        await mkdirPromise(dir, { recursive: true });
        debug('folder %o created', dir);
      } else {
        debug('error on check folder %o', dir);
        throw err;
      }
    }
  }

  private async _lockAndReadJSON(name: string): Promise<Manifest> {
    const fileName: string = this._getStorage(name);
    debug('lock and read a file %o', fileName);
    try {
      const data = await readFileNext<Manifest>(fileName, {
        lock: true,
        parse: true,
      });
      return data;
    } catch (err) {
      this.logger.error({ err }, 'error on lock file: @{err.message}');
      debug('error on lock and read json for file: %o', name);

      throw err;
    }
  }

  private async _unlockJSON(name: string): Promise<void> {
    await unlockFileNext(this._getStorage(name));
  }
}
