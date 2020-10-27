import { Storage } from '@google-cloud/storage';
import { Datastore, DatastoreOptions } from '@google-cloud/datastore';
import { getServiceUnavailable, getInternalError, VerdaccioError } from '@verdaccio/commons-api';
import {
  Logger,
  Callback,
  IPluginStorage,
  Token,
  TokenFilter,
  IPackageStorageManager,
} from '@verdaccio/types';
import { CommitResponse } from '@google-cloud/datastore/build/src/request';
import { RunQueryResponse } from '@google-cloud/datastore/build/src/query';
import { entity } from '@google-cloud/datastore/build/src/entity';

import { VerdaccioConfigGoogleStorage, GoogleDataStorage } from './types';
import StorageHelper, { IStorageHelper } from './storage-helper';
import GoogleCloudStorageHandler from './storage';
type Key = entity.Key;

export const ERROR_MISSING_CONFIG =
  'google cloud storage missing config. Add `store.google-cloud` to your config file';

class GoogleCloudDatabase implements IPluginStorage<VerdaccioConfigGoogleStorage> {
  private helper: IStorageHelper;
  public logger: Logger;
  public config: VerdaccioConfigGoogleStorage;
  private kind: string;
  private bucketName: string;
  private keyFilename: string | undefined;
  private GOOGLE_OPTIONS: DatastoreOptions | undefined;

  public constructor(config: VerdaccioConfigGoogleStorage, options: any) {
    if (!config) {
      throw new Error(ERROR_MISSING_CONFIG);
    }

    this.config = config;
    this.logger = options.logger;
    this.kind = config.kind || 'VerdaccioDataStore';
    // if (!this.keyFilename) {
    //   throw new Error('Google Storage requires a a key file');
    // }
    if (!config.bucket) {
      throw new Error('Google Cloud Storage requires a bucket name, please define one.');
    }
    this.bucketName = config.bucket;
    const { datastore, storage } = this._createEmptyDatabase();
    this.helper = new StorageHelper(datastore, storage, this.config);
  }

  private _getGoogleOptions(config: VerdaccioConfigGoogleStorage): DatastoreOptions {
    const GOOGLE_OPTIONS: DatastoreOptions = {};

    if (!config.projectId || typeof config.projectId !== 'string') {
      throw new Error('Google Cloud Storage requires a ProjectId.');
    }

    GOOGLE_OPTIONS.projectId = config.projectId || process.env.GOOGLE_CLOUD_VERDACCIO_PROJECT_ID;

    const keyFileName = config.keyFilename || process.env.GOOGLE_CLOUD_VERDACCIO_KEY;

    if (keyFileName) {
      GOOGLE_OPTIONS.keyFilename = keyFileName;
      this.logger.warn(
        `Using credentials in a file might be un-secure 
        and is only recommended for local development`
      );
    }

    this.logger.warn(
      { content: JSON.stringify(GOOGLE_OPTIONS) },
      'Google storage settings: @{content}'
    );
    return GOOGLE_OPTIONS;
  }

  public search(onPackage: Callback, onEnd: Callback): void {
    this.logger.warn('search method has not been implemented yet');

    onEnd();
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

  public getSecret(): Promise<string> {
    const key: Key = this.helper.datastore.key(['Secret', 'secret']);
    this.logger.debug('gcloud: [datastore getSecret] init');

    return this.helper.datastore
      .get(key)
      .then((data: object): string => {
        this.logger.trace({ data }, 'gcloud: [datastore getSecret] response @{data}');
        const entities = data[0];
        if (!entities) {
          // @ts-ignore
          return null;
        }
        // "{\"secret\":\"181bc38698078f880564be1e4d7ec107ac8a3b344a924c6d86cea4a84a885ae0\"}"
        return entities.secret;
      })
      .catch(
        (err: Error): Promise<string> => {
          const error: VerdaccioError = getInternalError(err.message);

          this.logger.warn({ error }, 'gcloud: [datastore getSecret] init error @{error}');
          return Promise.reject(getServiceUnavailable('[getSecret] permissions error'));
        }
      );
  }

  public setSecret(secret: string): Promise<CommitResponse> {
    const key = this.helper.datastore.key(['Secret', 'secret']);
    const entity = {
      key,
      data: { secret },
    };
    this.logger.debug('gcloud: [datastore setSecret] added');

    return this.helper.datastore.upsert(entity);
  }

  public add(name: string, cb: Callback): void {
    const datastore = this.helper.datastore;
    const key = datastore.key([this.kind, name]);
    const data = {
      name: name,
    };
    this.logger.debug('gcloud: [datastore add] @{name} init');

    datastore
      .save({
        key: key,
        data: data,
      })
      .then((response: CommitResponse): void => {
        const res = response[0];

        this.logger.debug('gcloud: [datastore add] @{name} has been added');
        this.logger.trace({ res }, 'gcloud: [datastore add] @{name} response: @{res}');

        cb(null);
      })
      .catch((err: Error): void => {
        const error: VerdaccioError = getInternalError(err.message);

        this.logger.debug({ error }, 'gcloud: [datastore add] @{name} error @{error}');
        cb(getInternalError(error.message));
      });
  }

  public async _deleteItem(name: string, item: any): Promise<void | Error> {
    try {
      const datastore = this.helper.datastore;
      const key = datastore.key([this.kind, datastore.int(item.id)]);
      await datastore.delete(key);
    } catch (err) {
      return getInternalError(err.message);
    }
  }

  public remove(name: string, cb: Callback): void {
    this.logger.debug('gcloud: [datastore remove] @{name} init');

    // const deletedItems: any = [];
    // const sanityCheck = (deletedItems: any): null | Error => {
    //    if (typeof deletedItems === 'undefined' || deletedItems.length === 0
    //    || deletedItems[0][0].indexUpdates === 0) {
    //     return getNotFound('trying to remove a package that does not exist');
    //   } else if (deletedItems[0][0].indexUpdates > 0) {
    //     return null;
    //   } else {
    //     return getInternalError('this should not happen');
    //   }
    // };
    this.helper
      .getEntities(this.kind)
      .then(
        async (entities: any): Promise<void> => {
          for (const item of entities) {
            if (item.name === name) {
              await this._deleteItem(name, item);
              // deletedItems.push(deletedItem);
            }
          }
          cb(null);
        }
      )
      .catch((err: Error): void => {
        cb(getInternalError(err.message));
      });
  }

  public get(cb: Callback): void {
    this.logger.debug('gcloud: [datastore get] init');

    const query = this.helper.datastore.createQuery(this.kind);
    this.logger.trace({ query }, 'gcloud: [datastore get] query @{query}');

    this.helper.runQuery(query).then((data: RunQueryResponse): void => {
      const response: object[] = data[0];

      this.logger.trace({ response }, 'gcloud: [datastore get] query results @{response}');

      const names = response.reduce((accumulator: string[], task: any): string[] => {
        accumulator.push(task.name);
        return accumulator;
      }, []);

      this.logger.trace({ names }, 'gcloud: [datastore get] names @{names}');
      cb(null, names);
    });
  }

  public sync(): void {
    this.logger.warn('synk method has not been implemented yet @{user}');
  }

  public getPackageStorage(packageInfo: string): IPackageStorageManager {
    const { helper, config, logger } = this;

    return new GoogleCloudStorageHandler(packageInfo, helper, config, logger);
  }

  private _createEmptyDatabase(): GoogleDataStorage {
    const options: DatastoreOptions = this._getGoogleOptions(this.config);
    const datastore = new Datastore(options);
    const storage = new Storage(options);

    const list: any = [];
    const files: any = {};
    const emptyDatabase = {
      datastore,
      storage,
      list, // not used
      files, // not used
      secret: '',
    };

    return emptyDatabase;
  }
}

export default GoogleCloudDatabase;
