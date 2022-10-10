import { Readable, Writable } from 'stream';

import {
  AllowAccess,
  Callback,
  Config,
  HttpError,
  Logger,
  Manifest,
  PackageAccess,
  RemoteUser,
  Token,
  TokenFilter,
} from '@verdaccio/types';

import { searchUtils } from '.';

export type AuthError = HttpError & { code: number };
export type AuthAccessCallback = (error: AuthError | null, access: boolean) => void;
export type AuthCallback = (error: AuthError | null, groups: string[] | false) => void;

export interface AuthPluginPackage {
  packageName: string;
  packageVersion?: string;
  tag?: string;
}
export interface PluginOptions {
  config: Config;
  logger: Logger;
}

/**
 * The base plugin class, set of utilities for developing
 * plugins.
 * @alpha
 * */
export class Plugin<T> {
  static version = 1;
  public version: number;
  public config: T;
  public options: PluginOptions;
  public constructor(config: T, options: PluginOptions) {
    this.version = Plugin.version;
    this.config = config;
    this.options = options;
  }

  public getVersion() {
    return this.version;
  }
}
export interface IPackageStorage {
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

export interface IPluginStorage<T> extends Plugin<T> {
  add(name: string): Promise<void>;
  remove(name: string): Promise<void>;
  get(): Promise<any>;
  init(): Promise<void>;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): IPackageStorage;
  search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}

export interface IBasicAuth {
  authenticate(user: string, password: string, cb: Callback): void;
  invalidateToken?(token: string): Promise<void>;
  changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
  allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
  add_user(user: string, password: string, cb: Callback): any;
}

export interface IPluginMiddleware<T, K, L> extends Plugin<T> {
  register_middlewares(app: any, auth: L, storage: K): void;
}

export interface IPluginAuth<T> extends Plugin<T> {
  /**
   * @param props user from Application component
   */
  authenticate(user: string, password: string, cb: AuthCallback): void;
  adduser?(user: string, password: string, cb: AuthCallback): void;
  changePassword?(user: string, password: string, newPassword: string, cb: AuthCallback): void;
  allow_publish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_publish?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
  allow_access?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_access?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
  allow_unpublish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_unpublish?(
    user: RemoteUser,
    pkg: AllowAccess & PackageAccess,
    cb: AuthAccessCallback
  ): void;
  apiJWTmiddleware?(helpers: any): Function;
}

export interface IPluginStorageFilter<T> extends Plugin<T> {
  filterMetadata(packageInfo: Manifest): Promise<Manifest>;
}
