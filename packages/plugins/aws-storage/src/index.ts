import { S3 } from 'aws-sdk';

import { VerdaccioError, errorUtils } from '@verdaccio/core';
import {
  Config,
  IPluginStorage,
  LocalStorage,
  Logger,
  PluginOptions,
  Token,
  TokenFilter,
} from '@verdaccio/types';

import addTrailingSlash from './addTrailingSlash';
import { S3Config } from './config';
import { convertS3Error, is404Error } from './s3Errors';
import S3PackageManager from './s3PackageManager';
import setConfigValue from './setConfigValue';

export default class S3Database implements IPluginStorage<S3Config> {
  public logger: Logger;
  public config: S3Config;
  private s3: S3;
  private _localData: LocalStorage | null;
  private _tokensData: Record<string, Token[]> | null;

  public constructor(config: Config, options: PluginOptions<S3Config>) {
    this.logger = options.logger;
    // copy so we don't mutate
    if (!config) {
      throw new Error('s3 storage missing config. Add `store.s3-storage` to your config file');
    }
    this.config = Object.assign(config, config.store['aws-s3-storage']);

    if (!this.config.bucket) {
      throw new Error('s3 storage requires a bucket');
    }

    this.config.bucket = setConfigValue(this.config.bucket);
    this.config.keyPrefix = setConfigValue(this.config.keyPrefix);
    this.config.endpoint = setConfigValue(this.config.endpoint);
    this.config.region = setConfigValue(this.config.region);
    this.config.accessKeyId = setConfigValue(this.config.accessKeyId);
    this.config.secretAccessKey = setConfigValue(this.config.secretAccessKey);
    this.config.sessionToken = setConfigValue(this.config.sessionToken);
    this.config.keyPrefix = addTrailingSlash(this.config.keyPrefix);

    this.logger.debug(
      { config: JSON.stringify(this.config, null, 4) },
      's3: configuration: @{config}'
    );

    this.s3 = new S3({
      endpoint: this.config.endpoint,
      region: this.config.region,
      s3ForcePathStyle: this.config.s3ForcePathStyle,
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
      sessionToken: this.config.sessionToken,
    });

    this._localData = null;
    this._tokensData = null;
  }

  public init() {
    return Promise.resolve();
  }

  public async getSecret(): Promise<string> {
    return Promise.resolve((await this._getData()).secret);
  }

  public async setSecret(secret: string): Promise<void> {
    (await this._getData()).secret = secret;
    await this._sync();
  }

  async add(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.debug({ name }, 's3: [add] private package @{name}');
      this._getData().then(async (data) => {
        if (data.list.indexOf(name) === -1) {
          data.list.push(name);
          this.logger.trace({ name }, 's3: [add] @{name} has been added');
          try {
            await this._sync();
            resolve();
          } catch (err: any) {
            reject(err);
          }
        } else {
          resolve();
        }
      });
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
    return new Promise((resolve): void => {
      this.s3.headObject(
        {
          Bucket: bucket,
          Key: `${keyPrefix + packageName}/package.json`,
        },
        (err, response) => {
          if (err) {
            this.logger.debug({ err }, 's3: [_fetchPackageInfo] error: @{err}');
            return resolve();
          }
          if (response.LastModified) {
            const { LastModified } = response;
            this.logger.trace(
              { LastModified },
              's3: [_fetchPackageInfo] LastModified: @{LastModified}'
            );
            return onPackage(
              {
                name: packageName,
                path: packageName,
                time: LastModified.getTime(),
              },
              resolve
            );
          }
          resolve();
        }
      );
    });
  }

  async remove(name: string): Promise<void> {
    this.logger.debug({ name }, 's3: [remove] @{name}');
    let data;
    try {
      data = await this.get();
    } catch (err) {
      this.logger.error({ err }, 's3: [remove] error: @{err}');
      throw errorUtils.getInternalError('something went wrong on remove a package');
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
    } catch (err: any) {
      this.logger.error({ err }, 's3: [remove] sync error: @{err}');
      throw err;
    }
  }

  async get(): Promise<any> {
    this.logger.debug('s3: [get]');
    return this._getData().then((data) => Promise.resolve(data.list));
  }

  // Create/write database file to s3
  private async _sync(): Promise<void> {
    await new Promise<void>((resolve, reject): void => {
      const { bucket, keyPrefix } = this.config;
      this.logger.debug(
        { keyPrefix, bucket },
        's3: [_sync] bucket: @{bucket} prefix: @{keyPrefix}'
      );
      this.s3.putObject(
        {
          Bucket: this.config.bucket,
          Key: `${this.config.keyPrefix}verdaccio-s3-db.json`,
          Body: JSON.stringify(this._localData),
        },
        (err) => {
          if (err) {
            this.logger.error({ err }, 's3: [_sync] error: @{err}');
            reject(err);
            return;
          }
          this.logger.debug('s3: [_sync] sucess');
          resolve();
        }
      );
    });
  }

  // returns an instance of a class managing the storage for a single package
  public getPackageStorage(packageName: string): S3PackageManager {
    this.logger.debug({ packageName }, 's3: [getPackageStorage] @{packageName}');

    return new S3PackageManager(this.config, packageName, this.logger);
  }

  private async _getData(): Promise<LocalStorage> {
    if (!this._localData) {
      this._localData = await new Promise((resolve, reject): void => {
        const { bucket, keyPrefix } = this.config;
        this.logger.debug(
          { keyPrefix, bucket },
          's3: [_getData] bucket: @{bucket} prefix: @{keyPrefix}'
        );
        this.logger.trace('s3: [_getData] get database object');
        this.s3.getObject(
          {
            Bucket: bucket,
            Key: `${keyPrefix}verdaccio-s3-db.json`,
          },
          (err, response) => {
            if (err) {
              const s3Err: VerdaccioError = convertS3Error(err);
              this.logger.error({ err: s3Err.message }, 's3: [_getData] err: @{err}');
              if (is404Error(s3Err)) {
                this.logger.error('s3: [_getData] err 404 create new database');
                resolve({ list: [], secret: '' });
              } else {
                reject(err);
              }
              return;
            }

            const body = response.Body ? response.Body.toString() : '';
            const data = JSON.parse(body);
            this.logger.trace({ body }, 's3: [_getData] get data @{body}');
            resolve(data);
          }
        );
      });
    } else {
      this.logger.trace('s3: [_getData] already exist');
    }

    return this._localData as LocalStorage;
  }

  public async saveToken(token: Token): Promise<void> {
    this.logger.debug(token, 's3: [saveToken] token key @{key}');

    const data = await this._getTokensData();
    const userData = data[token.user];
    this.logger.debug({ userData }, 's3: [saveToken] user data @{userData}');

    if (userData == null) {
      data[token.user] = [token];
      this.logger.trace(token, 's3: [saveToken] token user @{user} new database');
    } else {
      userData.push(token);
    }

    await this._syncTokens();
    this.logger.debug(token, 's3: [saveToken] token saved @{user}');
  }

  public async deleteToken(user: string, tokenKey: string): Promise<void> {
    const data = await this._getTokensData();
    const userData = data[user];

    if (userData == null) {
      throw new Error('user not found');
    }

    this.logger.debug(
      { userData, count: userData.length },
      's3: [deleteToken] tokens @{userData} - @{count}'
    );

    data[user] = userData.filter(({ key }) => key !== tokenKey);
    await this._syncTokens();
    this.logger.debug({ tokenKey }, 's3: [deleteToken] removed tokens key @{tokenKey}');
  }

  public async readTokens(filter: TokenFilter): Promise<Token[]> {
    const { user } = filter;
    this.logger.debug({ user }, 'read tokens with @{user}');

    const data = await this._getTokensData();
    const userData = data[user];
    return userData ?? [];
  }

  private async _getTokensData(): Promise<Record<string, Token[]>> {
    if (this._tokensData) {
      this.logger.trace('s3: [_getTokensData] already exist');
      return this._tokensData;
    }

    this._tokensData = await new Promise((resolve, reject): void => {
      const { bucket, keyPrefix } = this.config;
      this.logger.debug(
        { keyPrefix, bucket },
        's3: [_getTokensData] bucket: @{bucket} prefix: @{keyPrefix}'
      );
      this.logger.trace('s3: [_getTokensData] get database object');

      this.s3.getObject(
        {
          Bucket: bucket,
          Key: `${keyPrefix}token-db.json`,
        },
        (err, response) => {
          if (err) {
            const s3Err: VerdaccioError = convertS3Error(err);
            this.logger.error({ err: s3Err.message }, 's3: [_getTokensData] err: @{err}');
            if (is404Error(s3Err)) {
              this.logger.error('s3: [_getTokensData] err 404 create new database');
              resolve({});
            } else {
              reject(err);
            }
            return;
          }

          const body = response.Body ? response.Body.toString() : '';
          const data = JSON.parse(body);
          this.logger.trace({ body }, 's3: [_getTokensData] get data @{body}');
          resolve(data);
        }
      );
    });

    return this._tokensData as Record<string, Token[]>;
  }

  private async _syncTokens(): Promise<void> {
    await new Promise<void>((resolve, reject): void => {
      const { bucket, keyPrefix } = this.config;
      this.logger.debug(
        { keyPrefix, bucket },
        's3: [_syncTokens] bucket: @{bucket} prefix: @{keyPrefix}'
      );
      this.s3.putObject(
        {
          Bucket: this.config.bucket,
          Key: `${this.config.keyPrefix}token-db.json`,
          Body: JSON.stringify(this._localData),
        },
        (err) => {
          if (err) {
            this.logger.error({ err }, 's3: [_syncTokens] error: @{err}');
            reject(err);
            return;
          }
          this.logger.debug('s3: [_syncTokens] sucess');
          resolve();
        }
      );
    });
  }
}
