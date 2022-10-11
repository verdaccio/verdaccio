import { Express, RequestHandler } from 'express';
import { Readable, Writable } from 'stream';

import {
  AllowAccess,
  Callback,
  Config,
  Logger,
  Manifest,
  PackageAccess,
  RemoteUser,
  Token,
  TokenFilter,
} from '@verdaccio/types';

import { VerdaccioError, searchUtils } from '.';

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
export class Plugin<PluginConfig> {
  static version = 1;
  public readonly version: number;
  public readonly config: PluginConfig | unknown;
  public readonly options: PluginOptions;
  public constructor(config: PluginConfig, options: PluginOptions) {
    this.version = Plugin.version;
    this.config = config;
    this.options = options;
  }

  public getVersion() {
    return this.version;
  }
}
export interface StorageHandler {
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
  readTarball(pkgName: string, { signal }: { signal: AbortSignal }): Promise<Readable>;
  createPackage(name: string, manifest: Manifest): Promise<void>;
  writeTarball(tarballName: string, { signal }: { signal: AbortSignal }): Promise<Writable>;
  // verify if tarball exist in the storage
  hasTarball(fileName: string): Promise<boolean>;
  // verify if package exist in the storage
  hasPackage(): Promise<boolean>;
}

export interface Storage<PluginConfig> extends Plugin<PluginConfig> {
  add(name: string): Promise<void>;
  remove(name: string): Promise<void>;
  get(): Promise<any>;
  init(): Promise<void>;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): StorageHandler;
  search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}

/**
 * This function allow add additional middleware to the application.
 *
 *  ```ts
 *  import express, { Request, Response } from 'express';
 * 
 *  class Middleware extends Plugin {
 *    // instances of auth and storage are injected
 *    register_middlewares(app, auth, storage) {
 *      const router = express.Router();
 *      router.post('/my-endpoint', (req: Request, res: Response): void => {
        res.status(200).end();
      });
 *    }
 *  }
 * 
 *  
 *  const [plugin] = await asyncLoadPlugin(...);
 *  plugin.register_middlewares(app, auth, storage);
 *  ```
 */
export interface ExpressMiddleware<PluginConfig, Storage, Auth> extends Plugin<PluginConfig> {
  register_middlewares(app: Express, auth: Auth, storage: Storage): void;
}

/**
 * dasdsa
 */
export type AuthCallback = (error: VerdaccioError | null, groups?: string[] | false) => void;

export type AuthAccessCallback = (error: VerdaccioError | null, access?: boolean) => void;
export type AuthUserCallback = (error: VerdaccioError | null, access?: boolean | string) => void;
export type AuthChangePasswordCallback = (error: VerdaccioError | null, access?: boolean) => void;
export type AccessCallback = (error: VerdaccioError | null, ok?: boolean) => void;
export interface Auth<T> extends Plugin<T> {
  /**
   * Handles the authenticated method.
   * ```ts
   *  class Auth {
      public authenticate(user: string, password: string, done: AuthCallback): void {
        if (!password) {
          return done(errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
        }
        // always return an array of users
        return done(null, [user]);      
   *  }
   * ```
   */
  authenticate(user: string, password: string, cb: AuthCallback): void;
  /**
   * Handles the authenticated method.
   * ```ts
   *  class Auth {
      public adduser(user: string, password: string, done: AuthCallback): void {
        if (!password) {
          return done(errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
        }
        // return boolean
        return done(null, true);      
   *  }
   * ```
   */
  adduser?(user: string, password: string, cb: AuthUserCallback): void;
  changePassword?(
    user: string,
    password: string,
    newPassword: string,
    cb: AuthChangePasswordCallback
  ): void;
  allow_publish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_publish?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
  allow_access?(user: RemoteUser, pkg: T & PackageAccess, cb: AccessCallback): void;
  allow_access?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AccessCallback): void;
  allow_unpublish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_unpublish?(
    user: RemoteUser,
    pkg: AllowAccess & PackageAccess,
    cb: AuthAccessCallback
  ): void;
  apiJWTmiddleware?(helpers: any): RequestHandler;
}

export interface IBasicAuth {
  authenticate(user: string, password: string, cb: Callback): void;
  invalidateToken?(token: string): Promise<void>;
  changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
  allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
  add_user(user: string, password: string, cb: Callback): any;
}

export interface ManifestFilter<T> extends Plugin<T> {
  filterMetadata(packageInfo: Manifest): Promise<Manifest>;
}
