// @flow

// this file is not aim to be tested, just to check flow definitions

import Config from '../../../../src/lib/config';
import LoggerApi from '../../../../src/lib/logger';
import {generatePackageTemplate} from '../../../../src/lib/storage-utils';
import { UploadTarball, ReadTarball } from '@verdaccio/streams';

import {
  Callback,
  Config as AppConfig,
  Logger,
  Package,
  // PluginOptions
} from '@verdaccio/types';

import {
  IPluginStorage,
  IPackageStorageManager,
  IPackageStorage
} from '@verdaccio/local-storage';
import { IUploadTarball, IReadTarball } from '@verdaccio/streams';

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

  writeTarball(name: string): IUploadTarball {
    const uploadStream = new UploadTarball();

    return uploadStream;
  }

  readTarball(name: string): IReadTarball {
    const readTarballStream: IReadTarball = new ReadTarball();

    return readTarballStream;
  }
}

class ExampleStoragePlugin implements IPluginStorage {
  logger: Logger;
  config: AppConfig;

  constructor(config: AppConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  getSecret(): Promise<any> {
    return Promise.resolve();
  }

  setSecret(secret: string): Promise<any> {
    return Promise.resolve();
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
    onPackage(onEnd());
  }
}

export default ExampleStoragePlugin;

const config1: AppConfig = new Config({
  storage: './storage',
  self_path: '/home/sotrage'
});


const storage = new ExampleStoragePlugin(config1, LoggerApi.logger.child());

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
  storageManager.updatePackage('pkgFileName', () =>{}, () => {}, () => {}, () => {});
  storageManager.deletePackage('test', () => {});
  storageManager.removePackage(() => {});
  storageManager.readPackage('test', () => {});
  storageManager.writeTarball('test');
}
