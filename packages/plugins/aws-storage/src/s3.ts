import {
  LocalStorage,
  Logger,
  Config,
  Callback,
  IPluginStorage,
  PluginOptions,
  Token,
  TokenFilter,
} from '@verdaccio/types';
import { getInternalError, VerdaccioError, getServiceUnavailable } from '@verdaccio/commons-api';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { S3Configuration } from './config';
import S3PackageManager from './s3PackageManager';
import { convertS3Error, is404Error } from './s3Errors';
import addTrailingSlash from './addTrailingSlash';
import setConfigValue from './setConfigValue';

// AWS v3 Documentation
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html

// console.log("s3------------------->");
// // Set the AWS region
// const REGION = "us-east-1"; // e.g., "us-east-1"

// // Set the bucket parameters
// const bucketName = "verdaccio1";
// const bucketParams = { Bucket: bucketName };

// // Create name for uploaded object key
// const keyName = "hello_world.txt";
// const objectParams = { Bucket: bucketName, Key: keyName, Body: "Hello World!" };

// // Create an S3 client service object
// const s3 = new S3Client({ region: REGION });
//   console.log("s3----->", s3);
// const run = async () => {
//   // Create S3 bucket
//   try {
//     const data = await s3.send(new CreateBucketCommand(bucketParams));
//     console.log("Success. Bucket created.");
//   } catch (err) {
//     console.log("Error", err);
//   }
//   try {
//     const results = await s3.send(new PutObjectCommand(objectParams));
//     console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
//   } catch (err) {
//     console.log("Error", err);
//   }
// };

// (async () => {
//   run();
// })();

export default class S3Database implements IPluginStorage<S3Configuration> {
  public logger: Logger;
  public config: S3Configuration;
  private s3: S3Client | null;
  private db: DynamoDBClient | null;
  private _localData: LocalStorage | null;

  public constructor(config: Config, options: PluginOptions<S3Configuration>) {
    this.logger = options.logger;
    // copy so we don't mutate
    if (!config) {
      throw new Error('s3 storage missing config. Add `store.s3-storage` to your config file');
    }
    this.config = Object.assign(config, config.store['aws-s3-storage']);

    if (!this.config.bucket) {
      throw new Error('s3 storage requires a bucket');
    }

    this.config.useDBFile = false;
    this.config.this.config.bucket = setConfigValue(this.config.bucket);
    this.config.keyPrefix = setConfigValue(this.config.keyPrefix);
    this.config.endpoint = setConfigValue(this.config.endpoint);
    this.config.region = setConfigValue(this.config.region);
    this.config.accessKeyId = setConfigValue(this.config.accessKeyId);
    this.config.secretAccessKey = setConfigValue(this.config.secretAccessKey);
    this.config.sessionToken = setConfigValue(this.config.sessionToken);
    const configKeyPrefix = this.config.keyPrefix;
    this._localData = null;
    this.config.keyPrefix = addTrailingSlash(configKeyPrefix);
    this.logger.debug(
      { config: JSON.stringify(this.config, null, 4) },
      's3: configuration: @{config}'
    );
    this.s3 = null;
    this.db = null;
  }

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line max-len
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html
      const credentials = {
        accessKeyId: this.config.accessKeyId || '',
        secretAccessKey: this.config.secretAccessKey || '',
        sessionToken: this.config.sessionToken,
      };

      try {
        this.s3 = new S3Client({
          endpoint: this.config.endpoint,
          region: this.config.region,
          // s3ForcePathStyle: this.config.s3ForcePathStyle,
          credentials,
        });
        // for storing private packages and secret
        this.db = new DynamoDBClient({
          region: this.config.region,
          endpoint: this.config.endpoint,
          credentials,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  public async getSecret(): Promise<string> {
    if (this.config.useDBFile) {
      return Promise.resolve((await this._getData()).secret);
    }
    return Promise.resolve('');
  }

  public async setSecret(secret: string): Promise<void> {
    (await this._getData()).secret = secret;
    await this._sync();
  }

  public add(name: string, callback: Callback): void {
    this.logger.debug({ name }, 's3: [add] private package @{name}');
    this._getData().then(async (data) => {
      if (data.list.indexOf(name) === -1) {
        data.list.push(name);
        this.logger.trace({ name }, 's3: [add] @{name} has been added');
        try {
          await this._sync();
          callback(null);
        } catch (err) {
          callback(err);
        }
      } else {
        callback(null);
      }
    });
  }

  public async search(onPackage: Function, onEnd: Function): Promise<void> {
    this.logger.debug('s3: [search]');
    const storage = await this._getData();
    const storageInfoMap = storage.list.map(this._fetchPackageInfo.bind(this, onPackage));
    this.logger.debug({ l: storageInfoMap.length }, 's3: [search] storageInfoMap length is @{l}');
    await Promise.all(storageInfoMap);
    onEnd();
  }

  private async _fetchPackageInfo(onPackage: Function, packageName: string): Promise<void> {
    const { bucket, keyPrefix } = this.config;
    this.logger.debug({ packageName }, 's3: [_fetchPackageInfo] @{packageName}');
    this.logger.trace(
      { keyPrefix, bucket },
      's3: [_fetchPackageInfo] bucket: @{bucket} prefix: @{keyPrefix}'
    );

    try {
      const headObjectCommand = new HeadObjectCommand({
        Bucket: bucket,
        Key: `${keyPrefix + packageName}/package.json`,
      });
      const response = await this.s3.send(headObjectCommand);

      if (response.LastModified) {
        const { LastModified } = response;
        this.logger.trace(
          { LastModified },
          's3: [_fetchPackageInfo] LastModified: @{LastModified}'
        );

        return await new Promise((resolve) =>
          onPackage(
            {
              name: packageName,
              path: packageName,
              time: LastModified.getTime(),
            },
            resolve
          )
        );
      }
    } catch (err) {
      this.logger.debug({ err }, 's3: [_fetchPackageInfo] error: @{err}');
    }
  }

  public remove(name: string, callback: Callback): void {
    this.logger.debug({ name }, 's3: [remove] @{name}');
    this.get(async (err, data) => {
      if (err) {
        this.logger.error({ err }, 's3: [remove] error: @{err}');
        callback(getInternalError('something went wrong on remove a package'));
      }

      const pkgName = data.indexOf(name);
      if (pkgName !== -1) {
        const data = await this._getData();
        data.list.splice(pkgName, 1);
        this.logger.debug({ pkgName }, 's3: [remove] sucessfully removed @{pkgName}');
      }

      try {
        this.logger.trace('s3: [remove] starting sync');
        await this._sync();
        this.logger.trace('s3: [remove] finish sync');
        callback(null);
      } catch (err) {
        this.logger.error({ err }, 's3: [remove] sync error: @{err}');
        callback(err);
      }
    });
  }

  public get(callback: Callback): void {
    this.logger.debug('s3: [get]');
    this._getData().then((data) => callback(null, data.list));
  }

  // Create/write database file to s3
  private async _sync(): Promise<void> {
    const { bucket, keyPrefix } = this.config;
    this.logger.debug({ keyPrefix, bucket }, 's3: [_sync] bucket: @{bucket} prefix: @{keyPrefix}');

    try {
      const putObjectCommand = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: `${this.config.keyPrefix}verdaccio-s3-db.json`,
        Body: JSON.stringify(this._localData),
      });

      await this.s3.send(putObjectCommand);
      this.logger.debug('s3: [_sync] sucess');
    } catch (err) {
      this.logger.error({ err }, 's3: [_sync] error: @{err}');

      throw err;
    }
  }

  // returns an instance of a class managing the storage for a single package
  public getPackageStorage(packageName: string): S3PackageManager {
    this.logger.debug({ packageName }, 's3: [getPackageStorage] @{packageName}');

    return new S3PackageManager(this.config, packageName, this.logger);
  }

  private async _getData(): Promise<LocalStorage> {
    if (!this._localData) {
      const { bucket, keyPrefix } = this.config;
      this.logger.debug(
        { keyPrefix, bucket },
        's3: [_getData] bucket: @{bucket} prefix: @{keyPrefix}'
      );
      this.logger.trace('s3: [_getData] get database object');

      try {
        const getObjectCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: `${keyPrefix}verdaccio-s3-db.json`,
        });

        const response = this.s3.send(getObjectCommand);
        const body = response.Body ? response.Body.toString() : '';
        const data = JSON.parse(body);
        this.logger.trace({ body }, 's3: [_getData] get data @{body}');

        return data;
      } catch (err) {
        const s3Err: VerdaccioError = convertS3Error(err);
        this.logger.error({ err: s3Err.message }, 's3: [_getData] err: @{err}');
        if (is404Error(s3Err)) {
          this.logger.error('s3: [_getData] err 404 create new database');
          return { list: [], secret: '' };
        } else {
          throw err;
        }
      }
    } else {
      this.logger.trace('s3: [_getData] already exist');
    }

    return this._localData as LocalStorage;
  }

  public saveToken(token: Token): Promise<void> {
    this.logger.warn({ token }, 'save token has not been implemented yet @{token}');

    return Promise.reject(getServiceUnavailable('[saveToken] method not implemented'));
  }

  public deleteToken(user: string, tokenKey: string): Promise<void> {
    this.logger.warn({ tokenKey, user }, 'delete token has not been implemented yet @{user}');

    return Promise.reject(getServiceUnavailable('[deleteToken] method not implemented'));
  }

  public readTokens(filter: TokenFilter): Promise<Token[]> {
    this.logger.warn({ filter }, 'read tokens has not been implemented yet @{filter}');

    return Promise.reject(getServiceUnavailable('[readTokens] method not implemented'));
  }
}
