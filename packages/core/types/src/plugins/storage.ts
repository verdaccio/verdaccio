import { PassThrough, PipelinePromise, Readable, Stream, Writable } from 'stream';

import { Callback, CallbackAction, StringValue } from '../commons';
import { Config, Logger } from '../configuration';
import { Manifest, MergeTags, Token, Version } from '../manifest';
import { IPlugin } from './commons';

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
export type onSearchPackage = (item: Manifest, cb: CallbackAction) => void;
// FIXME: error should be export type `VerdaccioError = HttpError & { code: number };`
// but this type is on @verdaccio/commons-api and cannot be used here yet
export type onEndSearchPackage = (error?: any) => void;
export type onValidatePackage = (name: string) => boolean;

export type StorageUpdateCallback = (data: Manifest, cb: CallbackAction) => void;

export type StorageWriteCallback = (name: string, json: Manifest, callback: Callback) => void;
export type PackageTransformer = (pkg: Manifest) => Manifest;
export type ReadPackageCallback = (err: any | null, data?: Manifest) => void;

export interface ILocalPackageManager {
  logger: Logger;
  deletePackage(fileName: string): Promise<void>;
  removePackage(): Promise<void>;
  //  next packages migration (this list is meant to replace the callback parent functions)
  updatePackage(
    packageName: string,
    handleUpdate: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest>;
  readPackage(name: string): Promise<Manifest>;
  savePackage(pkgName: string, value: Manifest): Promise<void>;
  readTarball(pkgName: string, { signal }): Promise<Readable>;
  createPackage(name: string, manifest: Manifest): Promise<void>;
  writeTarball(tarballName: string, { signal }): Promise<Writable>;
  // verify if tarball exist in the storage
  hasTarball(fileName: string): Promise<boolean>;
  // verify if package exist in the storage
  hasPackage(): Promise<boolean>;
}

export type IPackageStorage = ILocalPackageManager | void;

export type IPluginStorage<T> = ILocalData<T>;
export type IPackageStorageManager = ILocalPackageManager;

/**
 * @deprecated use @verdaccio/core pluginUtils instead
 */
interface ILocalData<T> extends IPlugin<T>, ITokenActions {
  logger: Logger;
  config: T & Config;
  add(name: string): Promise<void>;
  remove(name: string): Promise<void>;
  get(): Promise<any>;
  init(): Promise<void>;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): IPackageStorage;
}
