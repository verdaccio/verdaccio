import { PassThrough } from 'node:stream';

import type { Callback, CallbackAction, StringValue } from '../commons';
import type { Config, Logger } from '../configuration';
import type { MergeTags, Package, Token, Version } from '../manifest';
import type { IPlugin } from './commons';

export class IUploadTarball extends PassThrough {
  public abort(): void {}
  public done(): void {}
}

export class IReadTarball extends PassThrough {
  public abort(): void {}
}

export type StorageList = string[];

export interface LocalStorage {
  list: any;
  secret: string;
}

export interface ILocalStorage {
  add(name: string): void;
  remove(name: string): void;
  get(): StorageList;
  sync(): void;
}

interface TarballActions {
  addTarball(name: string, filename: string): IUploadTarball;
  getTarball(name: string, filename: string): IReadTarball;
  removeTarball(name: string, filename: string, revision: string, callback: Callback): void;
}

interface StoragePackageActions extends TarballActions {
  addVersion(
    name: string,
    version: string,
    metadata: Version,
    tag: StringValue,
    callback: Callback
  ): void;
  mergeTags(name: string, tags: MergeTags, callback: Callback): void;
  removePackage(name: string, callback: Callback): void;
  changePackage(name: string, metadata: Package, revision: string, callback: Callback): void;
}

export interface IStorageManager<T> extends StoragePackageActions {
  config: T & Config;
  logger: Logger;
  init(config: T & Config, filters: any): Promise<any>;
  addPackage(name: string, metadata: any, callback: Callback): Promise<any>;
  getPackage(options: any): void;
  search(startkey: string, options: any): IReadTarball;
  getLocalDatabase(callback: Callback): void;
}

export interface IBasicStorage<T> extends StoragePackageActions {
  addPackage(name: string, info: Package, callback: Callback): void;
  updateVersions(name: string, packageInfo: Package, callback: Callback): void;
  getPackageMetadata(name: string, callback: Callback): void;
  search(startKey: string, options: any): IReadTarball;
  getSecret(config: T & Config): Promise<any>;
}

export interface TokenFilter {
  user: string;
}

export interface ITokenActions {
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}
/**
 * This method expect return a Package object
 * eg:
 * {
 *   name: string;
 *   time: number;
 *   ... and other props
 * }
 *
 * The `cb` callback object will be executed if:
 *  - it might return object (truly)
 *  - it might reutrn null
 */
export type onSearchPackage = (item: Package, cb: CallbackAction) => void;
// FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
// but this type is on @verdaccio/commons-api and cannot be used here yet
export type onEndSearchPackage = (error?: any) => void;
export type onValidatePackage = (name: string) => boolean;

export type StorageUpdateCallback = (data: Package, cb: CallbackAction) => void;

export type StorageWriteCallback = (name: string, json: Package, callback: Callback) => void;
export type PackageTransformer = (pkg: Package) => Package;
export type ReadPackageCallback = (err: any | null, data?: Package) => void;

export interface ILocalPackageManager {
  logger: Logger;
  writeTarball(pkgName: string): IUploadTarball;
  readTarball(pkgName: string): IReadTarball;
  readPackage(fileName: string, callback: ReadPackageCallback): void;
  createPackage(pkgName: string, value: Package, cb: CallbackAction): void;
  deletePackage(fileName: string, callback: CallbackAction): void;
  removePackage(callback: CallbackAction): void;
  updatePackage(
    pkgFileName: string,
    updateHandler: StorageUpdateCallback,
    onWrite: StorageWriteCallback,
    transformPackage: PackageTransformer,
    onEnd: CallbackAction
  ): void;
  savePackage(fileName: string, json: Package, callback: CallbackAction): void;
}

export type IPackageStorage = ILocalPackageManager | void;

export type IPluginStorage<T> = ILocalData<T>;
export type IPackageStorageManager = ILocalPackageManager;

export interface ILocalData<T> extends IPlugin<T>, ITokenActions {
  logger: Logger;
  config: T & Config;
  add(name: string, callback: Callback): void;
  remove(name: string, callback: Callback): void;
  get(callback: Callback): void;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): IPackageStorage;
  search(
    onPackage: onSearchPackage,
    onEnd: onEndSearchPackage,
    validateName: onValidatePackage
  ): void;
}
