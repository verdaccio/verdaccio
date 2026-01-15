import type { Express, RequestHandler } from 'express';
import { Readable, Writable } from 'node:stream';

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

export interface PluginOptions {
  config: Config;
  logger: Logger;
}

/**
 * Base Plugin Class
 *
 * Set of utilities for developing plugins.
 */
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

// --- STORAGE PLUGIN ---

/**
 * Storage Handler
 *
 * Used in storage plugin for managing packages and tarballs.
 */
export interface StorageHandler {
  logger: Logger;
  deletePackage(fileName: string): Promise<void>;
  removePackage(packageName: string): Promise<void>;
  //  next packages migration (this list is meant to replace the callback parent functions)
  updatePackage(
    packageName: string,
    handleUpdate: (manifest: Manifest) => Promise<Manifest>
  ): Promise<Manifest>;
  readPackage(packageName: string): Promise<Manifest>;
  savePackage(packageName: string, manifest: Manifest): Promise<void>;
  readTarball(fileName: string, { signal }: { signal: AbortSignal }): Promise<Readable>;
  createPackage(packageName: string, manifest: Manifest): Promise<void>;
  writeTarball(fileName: string, { signal }: { signal: AbortSignal }): Promise<Writable>;
  // verify if tarball exist in the storage
  hasTarball(fileName: string): Promise<boolean>;
  // verify if package exist in the storage
  hasPackage(packageName: string): Promise<boolean>;
}

/**
 * Storage Plugin interface
 *
 * https://verdaccio.org/docs/plugin-storage
 */
export interface Storage<PluginConfig> extends Plugin<PluginConfig> {
  add(packageName: string): Promise<void>;
  remove(packageName: string): Promise<void>;
  get(): Promise<string[]>;
  init(): Promise<void>;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageName: string): StorageHandler;
  search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: TokenFilter): Promise<Token[]>;
}

// --- MIDDLEWARE PLUGIN ---

/**
 * Middleware Plugin Interface
 *
 * https://verdaccio.org/docs/plugin-middleware
 *
 * This function allow add middleware to the application.
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
 *  const [plugin] = await asyncLoadPlugin(...);
 *  plugin.register_middlewares(app, auth, storage);
 *  ```
 */
export interface ExpressMiddleware<PluginConfig, Storage, Auth> extends Plugin<PluginConfig> {
  register_middlewares(app: Express, auth: Auth, storage: Storage): void;
}

// --- AUTH PLUGIN ---

export type AuthCallback = (error: VerdaccioError | null, groups?: string[] | false) => void;

export type AuthAccessCallback = (error: VerdaccioError | null, access?: boolean) => void;
export type AuthUserCallback = (error: VerdaccioError | null, access?: boolean | string) => void;
export type AuthChangePasswordCallback = (error: VerdaccioError | null, access?: boolean) => void;
export type AccessCallback = (error: VerdaccioError | null, ok?: boolean) => void;

export interface AuthPluginPackage {
  packageName: string;
  packageVersion?: string;
  tag?: string;
}

/**
 * Authentication Plugin Interface
 *
 * https://verdaccio.org/docs/plugin-auth
 */
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

// --- FILTER PLUGIN ---

/**
 * Filter Plugin Interface
 *
 * https://verdaccio.org/docs/plugin-filter
 */
export interface ManifestFilter<T> extends Plugin<T> {
  filter_metadata(manifest: Manifest): Promise<Manifest>;
}
