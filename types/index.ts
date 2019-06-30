/* eslint-disable @typescript-eslint/interface-name-prefix */
// @flow

import {
  IBasicAuth,
  IBasicStorage,
  IStorageManager,
  UpLinkConf,
  Callback,
  Versions,
  Version,
  RemoteUser,
  Config,
  Logger,
  JWTSignOptions,
  PackageAccess,
  ILocalData,
  StringValue as verdaccio$StringValue, IReadTarball, Package, IPluginStorageFilter} from '@verdaccio/types';
import lunrMutable from 'lunr-mutable-indexes';
import {NextFunction, Request, Response} from 'express';

export type StringValue = verdaccio$StringValue;

export interface StartUpConfig {
  storage: string;
  plugins?: string;
  self_path: string;
}

export type MatchedPackage = PackageAccess | void;

export type JWTPayload = RemoteUser & {
  password?: string;
}

export interface AESPayload {
  user: string;
  password: string;
}

export interface AuthTokenHeader {
  scheme: string;
  token: string;
}

export type BasicPayload = AESPayload | void;
export type AuthMiddlewarePayload = RemoteUser | BasicPayload;

export interface ProxyList {
  [key: string]: IProxy;
}

export interface CookieSessionToken {
  expires: Date;
}

export interface Utils {
  ErrorCode: any;
  getLatestVersion: Callback;
  isObject: (value: any) => boolean;
  validate_name: (value: any) => boolean;
  tag_version: (value: any, version: string, tag: string) => void;
  normalizeDistTags: (pkg: Package) => void;
  semverSort: (keys: string[]) => string[];
}

export interface Profile {
  tfa: boolean;
  name: string;
  email: string;
  email_verified: string;
  created: string;
  updated: string;
  cidr_whitelist: any;
  fullname: string;
}

export type $RequestExtend = Request & {remote_user?: any, log: Logger}
export type $ResponseExtend = Response & {cookies?: any}
export type $NextFunctionVer = NextFunction & any;
export type $SidebarPackage = Package & {latest: any}

export interface IAuthWebUI {
  jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): string;
}

interface IAuthMiddleware {
  apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
}

export interface IAuth extends IBasicAuth<Config>, IAuthMiddleware, IAuthWebUI {
  config: Config;
  logger: Logger;
  secret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any[];
}

export interface IWebSearch {
  index: lunrMutable.index;
  storage: IStorageHandler;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(query: string): any;
  add(pkg: Version): void;
  remove(name: string): void;
  reindex(): void;
  configureStorage(storage: IStorageHandler): void;
}

export interface IProxy {
  config: UpLinkConf;
  failed_requests: number;
  userAgent: string;
  ca?: string | void;
  logger: Logger;
  server_id: string;
  url: any;
  maxage: number;
  timeout: number;
  max_fails: number;
  fail_timeout: number;
  upname: string;
  fetchTarball(url: string): IReadTarball;
  isUplinkValid(url: string): boolean;
  getRemoteMetadata(name: string, options: any, callback: Callback): void;
}

export interface IStorage extends IBasicStorage<Config> {
  config: Config;
  localData: ILocalData<Config>;
  logger: Logger;
}

export interface IGetPackageOptions {
  callback: Callback;
  name: string;
  keepUpLinkData: boolean;
  uplinksLook: boolean;
  req: any;
}

export interface ISyncUplinks {
  uplinksLook?: boolean;
  etag?: string;
}

export type IPluginFilters = Array<IPluginStorageFilter<Config>>;

export interface IStorageHandler extends IStorageManager<Config> {
  config: Config;
  localStorage: IStorage | null;
  filters: IPluginFilters;
  uplinks: ProxyList;
  init(config: Config, filters: IPluginFilters): string;
  _syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
  _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
}

/**
 * @property { string | number | Styles }  [ruleOrSelector]
 */
export interface Styles {
  [ruleOrSelector: string]: string | number | Styles;
};
