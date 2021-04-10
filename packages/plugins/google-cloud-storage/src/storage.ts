import { Readable } from 'stream';

import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import {
  Package,
  Callback,
  Logger,
  IPackageStorageManager,
  StorageUpdateCallback,
  StorageWriteCallback,
  PackageTransformer,
  CallbackAction,
  ReadPackageCallback,
} from '@verdaccio/types';
import { File, DownloadResponse } from '@google-cloud/storage';
import {
  VerdaccioError,
  getInternalError,
  getBadRequest,
  getNotFound,
  getConflict,
  HTTP_STATUS,
} from '@verdaccio/commons-api';
import { Response } from 'request';

import { IStorageHelper } from './storage-helper';
import { VerdaccioConfigGoogleStorage } from './types';

export const pkgFileName = 'package.json';
export const defaultValidation = 'crc32c';

const packageAlreadyExist = function (name: string): VerdaccioError {
  return getConflict(`${name} package already exist`);
};

class GoogleCloudStorageHandler implements IPackageStorageManager {
  public config: VerdaccioConfigGoogleStorage;
  public logger: Logger;
  private key: string;
  private helper: IStorageHelper;
  private name: string;

  public constructor(
    name: string,
    helper: IStorageHelper,
    config: VerdaccioConfigGoogleStorage,
    logger: Logger
  ) {
    this.name = name;
    this.logger = logger;
    this.helper = helper;
    this.config = config;
    this.key = 'VerdaccioMetadataStore';
  }

  public updatePackage(
    name: string,
    updateHandler: StorageUpdateCallback,
    onWrite: StorageWriteCallback,
    transformPackage: PackageTransformer,
    onEnd: CallbackAction
  ): void {
    this._readPackage(name)
      .then(
        (metadata: Package): void => {
          updateHandler(metadata, (err: VerdaccioError): void => {
            if (err) {
              this.logger.error(
                { name: name, err: err.message },
                'gcloud: on write update @{name} package has failed err: @{err}'
              );
              return onEnd(err);
            }
            try {
              onWrite(name, transformPackage(metadata), onEnd);
            } catch (err) {
              this.logger.error(
                { name: name, err: err.message },
                'gcloud: on write update @{name} package has failed err: @{err}'
              );
              return onEnd(getInternalError(err.message));
            }
          });
        },
        (err: Error): void => {
          this.logger.error(
            { name: name, err: err.message },
            'gcloud: update @{name} package has failed err: @{err}'
          );
          onEnd(getInternalError(err.message));
        }
      )
      .catch(
        (err: Error): Callback => {
          this.logger.error(
            { name, error: err },
            'gcloud: trying to update @{name} and was not found on storage err: @{error}'
          );
          // @ts-ignore
          return onEnd(getNotFound());
        }
      );
  }

  public deletePackage(fileName: string, cb: CallbackAction): void {
    const file = this.helper.buildFilePath(this.name, fileName);
    this.logger.debug({ name: file.name }, 'gcloud: deleting @{name} from storage');
    try {
      // @ts-ignore
      file
        .delete()
        // FIXME: after upgrade this is broken
        // @ts-ignore
        .then((_data: [Response]): void => {
          this.logger.debug(
            { name: file.name },
            'gcloud: @{name} was deleted successfully from storage'
          );
          cb(null);
        })
        .catch((err: Error): void => {
          this.logger.error(
            { name: file.name, err: err.message },
            'gcloud: delete @{name} file has failed err: @{err}'
          );
          cb(getInternalError(err.message));
        });
    } catch (err) {
      this.logger.error(
        { name: file.name, err: err.message },
        'gcloud: delete @{name} file has failed err: @{err}'
      );
      cb(getInternalError('something went wrong'));
    }
  }

  public removePackage(callback: CallbackAction): void {
    // remove all files from storage
    const file = this.helper.getBucket().file(`${this.name}`);
    this.logger.debug({ name: file.name }, 'gcloud: removing the package @{name} from storage');
    // @ts-ignore
    file.delete().then(
      (): void => {
        this.logger.debug(
          { name: file.name },
          'gcloud: package @{name} was deleted successfully from storage'
        );
        callback(null);
      },
      (err: Error): void => {
        this.logger.error(
          { name: file.name, err: err.message },
          'gcloud: delete @{name} package has failed err: @{err}'
        );
        callback(getInternalError(err.message));
      }
    );
  }

  public createPackage(name: string, metadata: Package, cb: CallbackAction): void {
    this.logger.debug({ name }, 'gcloud: creating new package for @{name}');
    this._fileExist(name, pkgFileName).then(
      (exist: boolean): void => {
        if (exist) {
          this.logger.debug({ name }, 'gcloud: creating @{name} has failed, it already exist');
          cb(packageAlreadyExist(name));
        } else {
          this.logger.debug({ name }, 'gcloud: creating @{name} on storage');
          this.savePackage(name, metadata, cb);
        }
      },
      (err: Error): void => {
        this.logger.error(
          { name: name, err: err.message },
          'gcloud: create package @{name} has failed err: @{err}'
        );
        cb(getInternalError(err.message));
      }
    );
  }

  public savePackage(name: string, value: Package, cb: CallbackAction): void {
    this.logger.debug({ name }, 'gcloud: saving package for @{name}');
    this._savePackage(name, value)
      .then((): void => {
        this.logger.debug({ name }, 'gcloud: @{name} has been saved successfully on storage');
        cb(null);
      })
      .catch((err: Error): void => {
        this.logger.error(
          { name: name, err: err.message },
          'gcloud: save package @{name} has failed err: @{err}'
        );
        return cb(err);
      });
  }

  /* eslint-disable no-async-promise-executor */
  private _savePackage(name: string, metadata: Package): Promise<null | VerdaccioError> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const file = this.helper.buildFilePath(name, pkgFileName);
        try {
          await file.save(this._convertToString(metadata), {
            validation: this.config.validation || defaultValidation,
            /**
             *  When resumable is `undefined` - it will default to `true`as
             *  per GC Storage documentation:
             * `Resumable uploads are automatically enabled and must be shut
             *  off explicitly by setting options.resumable to false`
             *  @see
             *  https://cloud.google.com/nodejs/docs/reference/storage/2.5.x/File#createWriteStream
             */
            resumable: this.config.resumable,
          });
          resolve(null);
        } catch (err) {
          reject(getInternalError(err.message));
        }
      }
    );
  }
  /* eslint-enable no-async-promise-executor */

  private _convertToString(value: Package): string {
    return JSON.stringify(value, null, '\t');
  }

  public readPackage(name: string, cb: ReadPackageCallback): void {
    this.logger.debug({ name }, 'gcloud: reading package for @{name}');
    this._readPackage(name)
      .then((json: Package): void => {
        this.logger.debug({ name }, 'gcloud: package @{name} was fetched from storage');
        cb(null, json);
      })
      .catch((err: Error): void => {
        this.logger.debug(
          { name: name, err: err.message },
          'gcloud: read package @{name} has failed err: @{err}'
        );
        cb(err);
      });
  }

  /* eslint-disable no-async-promise-executor */
  private _fileExist(name: string, fileName: string): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const file: File = this.helper.buildFilePath(name, fileName);
        try {
          // @ts-ignore
          const data = await file.exists();
          const exist = data[0];

          resolve(exist);
          this.logger.debug(
            { name: name, exist },
            'gcloud: check whether @{name} exist successfully: @{exist}'
          );
        } catch (err) {
          this.logger.error(
            { name: file.name, err: err.message },
            'gcloud: check exist package @{name} has failed, cause: @{err}'
          );

          reject(getInternalError(err.message));
        }
      }
    );
  }

  private async _readPackage(name: string): Promise<Package> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        const file = this.helper.buildFilePath(name, pkgFileName);

        try {
          const content: DownloadResponse = await file.download();
          this.logger.debug({ name: this.name }, 'gcloud: @{name} was found on storage');
          const response: Package = JSON.parse(content[0].toString('utf8'));

          resolve(response);
        } catch (err) {
          this.logger.debug({ name: this.name }, 'gcloud: @{name} package not found on storage');
          reject(getNotFound());
        }
      }
    );
  }
  /* eslint-disable no-async-promise-executor */

  public writeTarball(name: string): UploadTarball {
    const uploadStream: UploadTarball = new UploadTarball({});

    try {
      this._fileExist(this.name, name).then(
        (exist: boolean): void => {
          if (exist) {
            this.logger.debug(
              { url: this.name },
              'gcloud:  @{url} package already exist on storage'
            );
            uploadStream.emit('error', packageAlreadyExist(name));
          } else {
            const file = this.helper.getBucket().file(`${this.name}/${name}`);
            this.logger.info(
              { url: file.name },
              'gcloud: the @{url} is being uploaded to the storage'
            );
            const fileStream = file.createWriteStream({
              validation: this.config.validation || defaultValidation,
            });
            uploadStream.done = (): void => {
              uploadStream.on('end', (): void => {
                fileStream.on('response', (): void => {
                  this.logger.debug(
                    { url: file.name },
                    'gcloud: @{url} has been successfully uploaded to the storage'
                  );
                  uploadStream.emit('success');
                });
              });
            };

            fileStream._destroy = function (err: Error): void {
              // this is an error when user is not authenticated
              // [BadRequestError: Could not authenticate request
              //  getaddrinfo ENOTFOUND www.googleapis.com www.googleapis.com:443]
              if (err) {
                uploadStream.emit('error', getBadRequest(err.message));
                fileStream.emit('close');
              }
            };

            fileStream.on('open', (): void => {
              this.logger.debug(
                { url: file.name },
                'gcloud: upload streem has been opened for @{url}'
              );
              uploadStream.emit('open');
            });

            fileStream.on('error', (err: Error): void => {
              this.logger.error({ url: file.name }, 'gcloud: upload stream has failed for @{url}');
              fileStream.end();
              uploadStream.emit('error', getBadRequest(err.message));
            });

            uploadStream.abort = (): void => {
              this.logger.warn(
                { url: file.name },
                'gcloud: upload stream has been aborted for @{url}'
              );
              fileStream.destroy(undefined);
            };

            uploadStream.pipe(fileStream);
            uploadStream.emit('open');
          }
        },
        (err: Error): void => {
          uploadStream.emit('error', getInternalError(err.message));
        }
      );
    } catch (err) {
      uploadStream.emit('error', err);
    }
    return uploadStream;
  }

  public readTarball(name: string): ReadTarball {
    const localReadStream: ReadTarball = new ReadTarball({});
    const file: File = this.helper.getBucket().file(`${this.name}/${name}`);
    const bucketStream: Readable = file.createReadStream();
    this.logger.debug({ url: file.name }, 'gcloud: reading tarball from @{url}');

    localReadStream.abort = function abortReadTarballCallback(): void {
      bucketStream.destroy(undefined);
    };

    bucketStream
      .on('error', (err: VerdaccioError): void => {
        if (err.code === HTTP_STATUS.NOT_FOUND) {
          this.logger.debug({ url: file.name }, 'gcloud: tarball @{url} do not found on storage');
          localReadStream.emit('error', getNotFound());
        } else {
          this.logger.error(
            { url: file.name },
            'gcloud: tarball @{url} has failed to be retrieved from storage'
          );
          localReadStream.emit('error', getBadRequest(err.message));
        }
      })
      .on('response', (response): void => {
        const size = response.headers['content-length'];
        const { statusCode } = response;
        if (statusCode !== HTTP_STATUS.NOT_FOUND) {
          if (size) {
            localReadStream.emit('open');
          }

          if (parseInt(size, 10) === 0) {
            this.logger.error(
              { url: file.name },
              'gcloud: tarball @{url} was fetched from storage and it is empty'
            );
            localReadStream.emit('error', getInternalError('file content empty'));
          } else if (parseInt(size, 10) > 0 && statusCode === HTTP_STATUS.OK) {
            localReadStream.emit('content-length', response.headers['content-length']);
          }
        } else {
          this.logger.debug({ url: file.name }, 'gcloud: tarball @{url} do not found on storage');
          localReadStream.emit('error', getNotFound());
        }
      })
      .pipe(localReadStream);
    return localReadStream;
  }
}

export default GoogleCloudStorageHandler;
