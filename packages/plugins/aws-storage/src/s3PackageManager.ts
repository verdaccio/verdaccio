import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';
import { HEADERS, HTTP_STATUS, VerdaccioError } from '@verdaccio/commons-api';
import {
  Callback,
  Logger,
  Package,
  ILocalPackageManager,
  CallbackAction,
  ReadPackageCallback,
} from '@verdaccio/types';
import { HttpError } from 'http-errors';

import { is404Error, convertS3Error, create409Error } from './s3Errors';
import { deleteKeyPrefix } from './deleteKeyPrefix';
import { S3Configuration } from './config';
import addTrailingSlash from './addTrailingSlash';
import uploadTarballToS3 from './uploadTarball';

const pkgFileName = 'package.json';

export default class S3PackageManager implements ILocalPackageManager {
  public config: S3Configuration;
  public logger: Logger;
  private readonly packageName: string;
  private readonly s3: S3Client;
  private readonly packagePath: string;

  public constructor(config: S3Configuration, packageName: string, logger: Logger) {
    this.config = config;
    this.packageName = packageName;
    this.logger = logger;
    const { endpoint, region, s3ForcePathStyle, accessKeyId, secretAccessKey, sessionToken } =
      config;

    this.s3 = new S3Client({
      endpoint,
      region,
      s3ForcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    });
    this.logger.trace(
      { packageName },
      's3: [S3PackageManager constructor] packageName @{packageName}'
    );
    this.logger.trace({ endpoint }, 's3: [S3PackageManager constructor] endpoint @{endpoint}');
    this.logger.trace({ region }, 's3: [S3PackageManager constructor] region @{region}');
    this.logger.trace(
      { s3ForcePathStyle },
      's3: [S3PackageManager constructor] s3ForcePathStyle @{s3ForcePathStyle}'
    );
    this.logger.trace(
      { accessKeyId },
      's3: [S3PackageManager constructor] accessKeyId @{accessKeyId}'
    );
    this.logger.trace(
      { secretAccessKey },
      's3: [S3PackageManager constructor] secretAccessKey @{secretAccessKey}'
    );
    this.logger.trace(
      { sessionToken },
      's3: [S3PackageManager constructor] sessionToken @{sessionToken}'
    );

    const packageAccess = this.config.getMatchedPackagesSpec(packageName);
    if (packageAccess) {
      const storage = packageAccess.storage;
      const packageCustomFolder = addTrailingSlash(storage);
      this.packagePath = `${this.config.keyPrefix}${packageCustomFolder}${this.packageName}`;
    } else {
      this.packagePath = `${this.config.keyPrefix}${this.packageName}`;
    }
  }

  public updatePackage(
    name: string,
    updateHandler: Callback,
    onWrite: Callback,
    transformPackage: Function,
    onEnd: Callback
  ): void {
    this.logger.debug({ name }, 's3: [S3PackageManager updatePackage init] @{name}');
    (async (): Promise<any> => {
      try {
        const json = await this._getData();
        updateHandler(json, (err) => {
          if (err) {
            this.logger.error(
              { err },
              's3: [S3PackageManager updatePackage updateHandler onEnd] @{err}'
            );
            onEnd(err);
          } else {
            const transformedPackage = transformPackage(json);
            this.logger.debug(
              { transformedPackage },
              's3: [S3PackageManager updatePackage updateHandler onWrite] @{transformedPackage}'
            );
            onWrite(name, transformedPackage, onEnd);
          }
        });
      } catch (err) {
        this.logger.error(
          { err },
          's3: [S3PackageManager updatePackage updateHandler onEnd catch] @{err}'
        );

        return onEnd(err);
      }
    })();
  }

  private async _getData(): Promise<unknown> {
    this.logger.debug('s3: [S3PackageManager _getData init]');

    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: `${this.packagePath}/${pkgFileName}`,
      });
      const response = await this.s3.send(getObjectCommand);
      const body = response.Body ? response.Body.toString() : '';
      let data;

      data = JSON.parse(body);
      this.logger.trace({ data }, 's3: [S3PackageManager _getData body] @{data.name}');
      return data;
    } catch (err) {
      this.logger.error({ err: err.message }, 's3: [S3PackageManager _getData] aws @{err}');
      const error: HttpError = convertS3Error(err);
      this.logger.error({ error: err.message }, 's3: [S3PackageManager _getData] @{error}');

      throw error;
    }
  }

  public deletePackage(fileName: string, callback: Callback): void {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${fileName}`,
    });

    this.s3
      .send(deleteObjectCommand)
      .then(() => callback(null))
      .catch(callback);
  }

  public removePackage(callback: CallbackAction): void {
    deleteKeyPrefix(this.s3, {
      Bucket: this.config.bucket,
      Prefix: addTrailingSlash(this.packagePath),
    })
      .then(() => callback(null))
      .catch((err) => {
        if (is404Error(err as VerdaccioError)) {
          callback(null);
        } else {
          callback(err);
        }
      });
  }

  public createPackage(name: string, value: Package, callback: CallbackAction): void {
    this.logger.debug(
      { name, packageName: this.packageName },
      's3: [S3PackageManager createPackage init] name @{name}/@{packageName}'
    );
    this.logger.trace({ value }, 's3: [S3PackageManager createPackage init] name @value');
    const headObjectCommand = new HeadObjectCommand({
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${pkgFileName}`,
    });

    this.s3
      .send(headObjectCommand)
      .then(() => {
        this.logger.debug('s3: [S3PackageManager createPackage ] package exist already');
        callback(create409Error());
      })
      .catch((err) => {
        const s3Err = convertS3Error(err);
        // only allow saving if this file doesn't exist already
        if (is404Error(s3Err)) {
          this.logger.debug(
            { s3Err },
            's3: [S3PackageManager createPackage] 404 package not found]'
          );
          this.savePackage(name, value, callback);
          this.logger.trace(
            { name },
            's3: [S3PackageManager createPackage] package saved data from s3: @data'
          );
        } else {
          this.logger.error(
            { s3Err: s3Err.message },
            's3: [S3PackageManager createPackage error] @s3Err'
          );
          callback(s3Err);
        }
      });
  }

  public savePackage(name: string, value: Package, callback: CallbackAction): void {
    this.logger.debug(
      { name, packageName: this.packageName },
      's3: [S3PackageManager savePackage init] name @{name}/@{packageName}'
    );
    this.logger.trace({ value }, 's3: [S3PackageManager savePackage ] init value @value');

    const putObjectCommand = new PutObjectCommand({
      // TODO: not sure whether save the object with spaces will increase storage size
      Body: JSON.stringify(value, null, '  '),
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${pkgFileName}`,
    });
    this.s3
      .send(putObjectCommand)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  public readPackage(name: string, callback: ReadPackageCallback): void {
    this.logger.debug(
      { name, packageName: this.packageName },
      's3: [S3PackageManager readPackage init] name @{name}/@{packageName}'
    );
    (async (): Promise<void> => {
      try {
        const data: Package = (await this._getData()) as Package;
        this.logger.trace(
          { data, packageName: this.packageName },
          's3: [S3PackageManager readPackage] packageName: @{packageName} / data @data'
        );
        callback(null, data);
      } catch (err) {
        this.logger.error({ err: err.message }, 's3: [S3PackageManager readPackage] @{err}');

        callback(err);
      }
    })();
  }

  public writeTarball(name: string): UploadTarball {
    this.logger.debug(
      { name, packageName: this.packageName },
      's3: [S3PackageManager writeTarball init] name @{name}/@{packageName}'
    );
    const uploadStream = new UploadTarball({});

    const streamEnded = { value: false };
    uploadStream.on('end', () => {
      this.logger.debug(
        { name, packageName: this.packageName },
        's3: [S3PackageManager writeTarball event: end] name @{name}/@{packageName}'
      );
      streamEnded.value = true;
    });

    const baseS3Params = {
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${name}`,
    };

    const headObjectCommand = new HeadObjectCommand({
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${name}`,
    });

    this.s3
      .send(headObjectCommand)
      .then(() => {
        const error = create409Error();
        this.logger.error(
          { error: error.message },
          's3: [S3PackageManager writeTarball headObject] @{error}'
        );
        uploadStream.emit('error', error);
      })
      .catch((err) => {
        const error = convertS3Error(err);

        if (is404Error(error)) {
          uploadTarballToS3({
            s3Client: this.s3,
            logger: this.logger,
            baseS3Params,
            uploadStream,
            streamEnded,
          });
        } else {
          this.logger.error(
            { error: error.message },
            's3: [S3PackageManager writeTarball headObject] non a 404 emit error: @{error}'
          );

          uploadStream.emit('error', error);
        }
      });

    return uploadStream;
  }

  public readTarball(name: string): ReadTarball {
    this.logger.debug(
      { name, packageName: this.packageName },
      's3: [S3PackageManager readTarball init] name @{name}/@{packageName}'
    );
    const readTarballStream = new ReadTarball({});
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: `${this.packagePath}/${name}`,
    });
    const abortController = new AbortController();

    this.s3.send(getObjectCommand, { abortSignal: abortController.signal }).then((response) => {
      // FIXME: Find a way to remove the ts-ignore
      // @ts-ignore
      const headers = response.Body?.headers || {};
      // @ts-ignore
      const statusCode = response.Body?.statusCode;

      this.logger.debug(
        { name, packageName: this.packageName },
        's3: [S3PackageManager readTarball httpHeaders] name @{name}/@{packageName}'
      );
      this.logger.trace(
        { headers },
        's3: [S3PackageManager readTarball httpHeaders event] headers @headers'
      );
      this.logger.trace(
        { statusCode },
        's3: [S3PackageManager readTarball httpHeaders event] statusCode @statusCode'
      );

      if (statusCode !== HTTP_STATUS.NOT_FOUND) {
        if (headers[HEADERS.CONTENT_LENGTH]) {
          const contentLength = parseInt(headers[HEADERS.CONTENT_LENGTH], 10);

          this.logger.debug(
            's3: [S3PackageManager readTarball readTarballStream event] emit content-length'
          );
          readTarballStream.emit(HEADERS.CONTENT_LENGTH, contentLength);
          readTarballStream.emit('open');
          this.logger.debug('s3: [S3PackageManager readTarball readTarballStream event] emit open');
        }
      } else {
        this.logger.trace(
          's3: [S3PackageManager readTarball httpHeaders event] not found, avoid emit open file'
        );
      }

      // @ts-ignore
      response.Body.on('error', (err) => {
        const error: HttpError = convertS3Error(err);

        readTarballStream.emit('error', error);
        this.logger.error(
          { error: error.message },
          's3: [S3PackageManager readTarball readTarballStream event] error @{error}'
        );
      });

      this.logger.trace('s3: [S3PackageManager readTarball readTarballStream event] pipe');
      // @ts-ignore
      response.Body.pipe(readTarballStream);

      readTarballStream.abort = (): void => {
        this.logger.debug(
          's3: [S3PackageManager readTarball readTarballStream event] request abort'
        );
        abortController.abort();
        this.logger.debug(
          's3: [S3PackageManager readTarball readTarballStream event] request destroy'
        );
        // @ts-ignore
        response.Body.destroy();
      };
    });

    return readTarballStream;
  }
}
