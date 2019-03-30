// @flow

import type {
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
  StringValue as verdaccio$StringValue,
  Package} from '@verdaccio/types';
import type {
  IReadTarball,
} from '@verdaccio/streams';
import type {ILocalData} from '@verdaccio/local-storage';
import lunrMutable from 'lunr-mutable-indexes';
import type {NextFunction, $Request, $Response} from 'request';

export type StringValue = verdaccio$StringValue;

export type StartUpConfig = {
  storage: string;
  plugins?: string;
  self_path: string;
}

export type MatchedPackage = PackageAccess | void;

export type JWTPayload = RemoteUser & {
  password?: string;
}

export type AESPayload = {
  user: string;
  password: string;
}

export type AuthTokenHeader = {
  scheme: string;
  token: string;
}

export type BasicPayload = AESPayload | void;
export type AuthMiddlewarePayload = RemoteUser | BasicPayload;

export type ProxyList = {
  [key: string]: IProxy;
}

export type CookieSessionToken = {
  expires: Date;
}

export type Utils = {
  ErrorCode: any;
  getLatestVersion: Callback;
  isObject: (value: any) => boolean;
  validate_name: (value: any) => boolean;
  tag_version: (value: any, version: string, tag: string) => void;
  normalizeDistTags: (pkg: Package) => void;
  semverSort: (keys: Array<string>) => Array<string>;
}

export type Profile = {
  tfa: boolean;
  name: string;
  email: string;
  email_verified: string;
  created: string;
  updated: string;
  cidr_whitelist: any;
  fullname: string;
}

export type $RequestExtend = $Request & {remote_user?: any}
export type $ResponseExtend = $Response & {cookies?: any}
export type $NextFunctionVer = NextFunction & mixed;
export type $SidebarPackage = Package & {latest: mixed}


export interface IAuthWebUI {
  jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): string;
  aesEncrypt(buf: Buffer): Buffer;
}

interface IAuthMiddleware {
  apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
}

export interface IAuth extends IBasicAuth, IAuthMiddleware, IAuthWebUI {
  config: verdaccio$Config;
  logger: verdaccio$Logger;
  secret: string;
  plugins: Array<any>;
}

export interface IWebSearch {
  index: lunrMutable.index;
  storage: IStorageHandler;
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

export interface IStorage extends IBasicStorage {
  config: Config;
  localData: ILocalData;
  logger: Logger;
}

export type IGetPackageOptions = {
  callback: Callback;
  name: string;
  keepUpLinkData: boolean;
  uplinksLook: boolean;
  req: any;
}

export type ISyncUplinks = {
  uplinksLook?: boolean;
  etag?: string;
}

export interface IStorageHandler extends IStorageManager {
  localStorage: IStorage;
  uplinks: ProxyList;
  _syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
  _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
}

/**
 * @property { string | number | Styles }  [ruleOrSelector]
 */
export type Styles = {
  [ruleOrSelector: string]: string | number | Styles,
};
