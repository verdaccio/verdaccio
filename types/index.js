// @flow

import type {
  IBasicAuth,
  IBasicStorage,
  IStorageManager,
  UpLinkConf,
  Callback,
  Versions,
  Version,
  Config,
  Logger,
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

export type JWTPayload = {
  user: string;
  group: string | void;
}

export type JWTSignOptions = {
  expiresIn: string;
}

export type ProxyList = {
  [key: string]: IProxy;
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

export type $RequestExtend = $Request & {remote_user?: any}
export type $ResponseExtend = $Response & {cookies?: any}
export type $NextFunctionVer = NextFunction & mixed;
export type $SidebarPackage = Package & {latest: mixed}


interface IAuthWebUI {
  issueUIjwt(user: string, time: string): string;
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

export interface IStorageHandler extends IStorageManager {
  localStorage: IStorage;
  uplinks: ProxyList;
  _syncUplinksMetadata(name: string, packageInfo: Package, options: any, callback: Callback): void;
  _updateVersionsHiddenUpLink(versions: Versions, upLink: IProxy): void;
}
