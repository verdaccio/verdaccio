/* eslint-disable @typescript-eslint/no-unused-vars */
import buildDebug from 'debug';
import { fs } from 'memfs';
import path from 'node:path';
import { Readable, Writable, addAbortSignal } from 'node:stream';

import { errorUtils, pluginUtils } from '@verdaccio/core';
import { Logger, Manifest } from '@verdaccio/types';

import { parsePackage, stringifyPackage } from './utils';

const debug = buildDebug('verdaccio:plugin:storage:memory-storage');

export type DataHandler = {
  [key: string]: string;
};

class MemoryHandler implements pluginUtils.StorageHandler {
  private data: DataHandler;
  private packageName: string;
  public logger: Logger;

  public constructor(packageName: string, data: DataHandler, logger: Logger) {
    this.data = data;
    this.logger = logger;
    this.packageName = packageName;
    // Ensure the root directory exists in memfs
    try {
      fs.mkdirSync('/');
    } catch (e) {
      // ignore if already exists
    }
  }

  public async hasTarball(fileName: string): Promise<boolean> {
    const exists = this.data[this.getStorageKey(fileName)] === 'true';
    debug('hasTarball for %o: %s', fileName, exists);
    return exists;
  }

  public async hasPackage(packageName: string): Promise<boolean> {
    return this.data[packageName] !== undefined;
  }

  public async deletePackage(fileName: string): Promise<void> {
    // manifest is deleted by removePackage
    if (fileName === 'package.json') {
      return;
    }
    debug('delete tarball %o', fileName);
    try {
      const tarballName = this.getStoragePath(fileName);
      const tarballKey = this.getStorageKey(fileName);
      debug('deleting tarball with key: %s', tarballKey);
      this.removeFile(tarballName);
      delete this.data[tarballKey];
    } catch (err: any) {
      throw errorUtils.getInternalError(err.message);
    }
  }

  public async removePackage(packageName: string): Promise<void> {
    debug('remove package %o', packageName);
    delete this.data[packageName];
  }

  public async createPackage(packageName: string, manifest: Manifest): Promise<void> {
    debug('create package %o', packageName);
    await this.savePackage(packageName, manifest);
  }

  public async savePackage(packageName: string, manifest: Manifest): Promise<void> {
    debug('save package %o', packageName);
    try {
      this.data[packageName] = stringifyPackage(manifest);
    } catch (err: any) {
      throw errorUtils.getInternalError(err.message);
    }
  }

  public async readPackage(packageName: string): Promise<Manifest> {
    debug('read package %o', packageName);
    const json = this.data[packageName];
    if (json === undefined) {
      throw errorUtils.getNotFound();
    }
    try {
      return parsePackage(json);
    } catch (err: any) {
      throw errorUtils.getInternalError(err.message);
    }
  }

  private getStorageKey(fileName: string): string {
    return `${this.packageName}/${fileName}`;
  }

  private getStoragePath(fileName: string): string {
    // Use the complete package name for proper directory structure
    // memfs works with Unix-style paths on all platforms, so use forward slashes consistently
    const storagePath = path.posix.normalize(path.posix.join('/', this.packageName, fileName));
    debug('storage path for %s: %s', fileName, storagePath);
    return storagePath;
  }

  private async removeFile(fileName: string): Promise<void> {
    debug('remove file %o', fileName);
    try {
      fs.unlinkSync(fileName);
    } catch (err: any) {
      // Ignore if file does not exist
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  public async writeTarball(
    fileName: string,
    { signal }: { signal: AbortSignal }
  ): Promise<Writable> {
    debug('write tarball %o', fileName);
    const tarballName = this.getStoragePath(fileName);
    const tarballKey = this.getStorageKey(fileName);

    // Create a temporary file path to avoid conflicts (similar to local-fs)
    const temporalName = `${tarballName}.tmp-${String(Math.random()).replace(/^0\./, '')}`;
    debug('using temporal file %o', temporalName);

    // Ensure the directory exists for the tarball BEFORE creating the stream
    const dirName = path.posix.dirname(temporalName);
    try {
      // Make sure all directory levels are created
      await fs.promises.mkdir(dirName, { recursive: true });
      debug('ensured directory exists %o', dirName);
    } catch (err: any) {
      debug('error creating directory %o: %s', dirName, err.message);
      throw errorUtils.getInternalError(`Failed to create directory: ${err.message}`);
    }

    let opened = false;
    let closed = false;
    // Create the write stream but don't rely on its built-in events entirely
    const writeStream = fs.createWriteStream(temporalName);

    // Emit 'open' event in the next tick to ensure consistent behavior with fs streams
    process.nextTick(() => {
      opened = true;
      debug('write stream opened for %o', temporalName);
      writeStream.emit('open');
    });

    writeStream.on('error', (err) => {
      debug('write stream error %o: %s', temporalName, err.message);
      delete this.data[tarballKey];
      if (opened) {
        this.logger.error(
          { err, fileName },
          'error on open write tarball for @{fileName}: @{err.message}'
        );
        writeStream.on('close', () => {
          this.removeFile(temporalName);
        });
      } else {
        this.logger.error(
          { err, fileName },
          'error on writing tarball for @{fileName}: @{err.message}'
        );
        this.removeFile(temporalName);
      }
    });

    writeStream.on('finish', () => {
      debug('write stream finished for %o', fileName);
    });

    // This is called when the underlying file descriptor is closed
    // which happens after the stream is finished/ended
    writeStream.on('close', async () => {
      // prevent double close event
      if (closed) {
        debug('close event already handled for %o', temporalName);
        return;
      }
      closed = true;
      try {
        // Check if temporary file exists before trying to rename
        if (!fs.existsSync(temporalName)) {
          debug('temporary file %o does not exist, skipping rename', temporalName);
          delete this.data[tarballKey];
          return;
        }

        // Rename the temporary file to the final location (atomic operation)
        await fs.promises.rename(temporalName, tarballName);
        // Store the mapping of key to true (indicating it exists)
        this.data[tarballKey] = 'true';
        debug(
          'write stream closed successfully, renamed %o to %o, stored with key %o',
          temporalName,
          tarballName,
          tarballKey
        );
      } catch (err: any) {
        debug('error renaming %o to %o: %s', temporalName, tarballName, err.message);
        this.logger.error(
          { err, temporalName, finalTarballPath: tarballName },
          'error renaming temporal file @{temporalName} to @{finalTarballPath}: @{err.message}'
        );
        // Clean up the mapping since rename failed
        delete this.data[tarballKey];
        this.removeFile(temporalName);
      }
    });

    signal?.addEventListener(
      'abort',
      () => {
        debug('upload aborted for %o', fileName);
        delete this.data[tarballKey];
        if (opened) {
          writeStream.once('close', () => {
            this.removeFile(temporalName);
          });
          writeStream.destroy();
        } else {
          this.removeFile(temporalName);
        }
      },
      { once: true }
    );

    return writeStream;
  }

  public async readTarball(
    fileName: string,
    { signal }: { signal: AbortSignal }
  ): Promise<Readable> {
    debug('read tarball %o', fileName);

    // Check if the tarball exists in our mapping
    if (!this.hasTarball(fileName)) {
      debug('tarball not found: %s', fileName);
      throw errorUtils.getNotFound('no such package');
    }

    const tarballName = this.getStoragePath(fileName);
    const tarballKey = this.getStorageKey(fileName);

    // Additional filesystem check
    try {
      const exists = fs.existsSync(tarballName);
      if (!exists) {
        debug('tarball file does not exist on filesystem: %s', tarballName);
        delete this.data[tarballKey]; // Clean up incorrect state
        throw errorUtils.getNotFound('no such package');
      }
    } catch (err: any) {
      debug('error checking tarball existence: %s', err.message);
      throw errorUtils.getNotFound('no such package');
    }

    const readStream = addAbortSignal(signal, fs.createReadStream(tarballName));

    // Check stats before emitting open event to ensure content-length is available
    const stats = fs.statSync(tarballName);

    // Manually emit 'open' event in the next tick to ensure consistent behavior with fs streams
    process.nextTick(() => {
      debug('read stream opened for %o', tarballName);
      readStream.emit('open');
      debug('file size %o', stats.size);
      readStream.emit('content-length', stats.size);
    });

    readStream.on('error', (error) => {
      debug('error reading tarball %o: %s', tarballName, error.message);
    });

    return readStream;
  }

  public async updatePackage(
    packageName: string,
    handleUpdate: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest> {
    debug('update package %o', packageName);
    try {
      const json = this.data[packageName];
      let manifest = parsePackage(json);
      const newManifest = await handleUpdate(manifest);
      return newManifest;
    } catch (err: any) {
      throw errorUtils.getInternalError(err.message);
    }
  }
}

export default MemoryHandler;
