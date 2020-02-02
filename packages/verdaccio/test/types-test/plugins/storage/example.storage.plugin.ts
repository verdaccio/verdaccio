// this file is not aim to be tested, just to check typescript definitions

import {
  Callback,
  Config as AppConfig,
  Logger,
  Package,
  Token,
  TokenFilter,
  IUploadTarball, IReadTarball
} from '@verdaccio/types';

import {
  IPluginStorage,
  IPackageStorageManager,
  IPackageStorage
} from '@verdaccio/types';
import { UploadTarball, ReadTarball} from '@verdaccio/streams';

import Config from '../../../../packages/config/src/config';
import {logger} from '../../../../packages/logger/src/logger';
import { generatePackageTemplate } from '@verdaccio/store';

class PackageStorage implements IPackageStorageManager {
  path: string;
  logger: Logger;

  constructor(path: string, logger: Logger) {
    this.path = path;
    this.logger = logger;
  }

  updatePackage(name: string, updateHandler: Callback,
    onWrite: Callback,
    transformPackage: Function,
    onEnd: Callback) {
    onEnd();
  }

  deletePackage(fileName: string, callback: Callback) {
    callback();
  }

  removePackage(callback: Callback): void {
    callback();
  }

  createPackage(name: string, value: Package, cb: Callback) {
    cb();
  }

  savePackage(name: string, value: Package, cb: Callback) {
    cb();
  }

  readPackage(name: string, cb: Callback) {
    cb();
  }

  writeTarball(name): IUploadTarball {
    this.logger.debug({name}, 'some name @name');
    const uploadStream = new UploadTarball({});
    uploadStream.on('close', () => {});
    if (uploadStream.abort) {
      uploadStream.abort();
    }

    if (uploadStream.done) {
      uploadStream.done();
    }

    return uploadStream;
  }

  readTarball(name): IReadTarball {
    this.logger.debug({name}, 'some name @name');
    const readTarballStream: IReadTarball = new ReadTarball({});

    if (readTarballStream.abort) {
      readTarballStream.abort();
    }

    return readTarballStream;
  }
}

class ExampleStoragePlugin implements IPluginStorage<{}> {
  logger: Logger;
  config: AppConfig;

  constructor(config: AppConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  saveToken(token: Token): Promise<any> {
    return Promise.resolve(token)
  }
  deleteToken(user: string, tokenKey: string): Promise<any>{
    return Promise.resolve([user, tokenKey]);
  }

  readTokens(filter: TokenFilter): Promise<Token[]> {
    const token: Token = {
      user: filter.user,
      key: '12312',
      token: '12321', // pragma: allowlist secret
      readonly: false,
      created: '123232'
    }

    return Promise.resolve([token, token]);
  }

  getSecret(): Promise<any> {
    return Promise.resolve();
  }

  setSecret(secret: string): Promise<any> { // pragma: allowlist secret
    return Promise.resolve(secret); // pragma: allowlist secret
  }

  add(name: string, cb: Callback) {
    cb();
  }

  remove(name: string, cb: Callback) {
    cb();
  }

  get(cb: Callback) {
    cb();
  }

  getPackageStorage(packageInfo: string): IPackageStorage {
    return new PackageStorage(packageInfo, this.logger);
  }

  search(onPackage: Callback, onEnd: Callback, validateName: any): void {
    onPackage(onEnd(validateName()));
  }
}

export default ExampleStoragePlugin;

const config1: AppConfig = new Config({
  storage: './storage',
  self_path: '/home/sotrage'
});


const storage = new ExampleStoragePlugin(config1, logger.child());

storage.add('test', () => {});
storage.remove('test', () => {});
storage.getSecret().then(() => {});
storage.setSecret('newSecret').then(() => {});
storage.search(() => {}, () => {}, 'validateName');
storage.get(() => {});

const storageManager: IPackageStorage = storage.getPackageStorage('test');

if (storageManager) {
  storageManager.createPackage('test', generatePackageTemplate('test'), () => {});
  storageManager.savePackage('fileName', generatePackageTemplate('test'), () => {});
  // @ts-ignore
  storageManager.updatePackage('pkgFileName', () => {}, () => {}, () => {}, () => {});
  storageManager.deletePackage('test', () => {});
  storageManager.removePackage(() => {});
  storageManager.readPackage('test', () => {});
  storageManager.writeTarball('test');
}
