import type { ReadTarball, UploadTarball } from '@verdaccio/streams';
import type {
  Callback,
  CallbackAction,
  Config,
  Logger,
  Package,
  PackageTransformer,
  ReadPackageCallback,
  StorageUpdateCallback,
  StorageWriteCallback,
  Token,
  TokenFilter,
} from '@verdaccio/types';

/**
 * Legacy storage plugin API, previously provided by the removed
 * @verdaccio/legacy-types package. This plugin still implements the legacy
 * storage contract, so the interfaces live here now.
 */
export interface PluginOptions<T> {
  config: T & Config;
  logger: Logger;
}

export interface IPlugin<_T> {
  version?: string;
}

export interface ITokenActions {
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}

export type onSearchPackage = (item: Package, cb: CallbackAction) => void;
export type onEndSearchPackage = (error?: any) => void;
export type onValidatePackage = (name: string) => boolean;

export interface ILocalPackageManager {
  logger: Logger;
  writeTarball(pkgName: string): UploadTarball;
  readTarball(pkgName: string): ReadTarball;
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

export type IPluginStorage<T> = ILocalData<T>;
