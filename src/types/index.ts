import { NextFunction, Request, Response } from 'express';

import { pluginUtils } from '@verdaccio/core';
import {
  Author,
  Callback,
  Config,
  JWTSignOptions,
  Logger,
  Package,
  PackageAccess,
  RemoteUser,
  Version,
  StringValue as verdaccio$StringValue,
} from '@verdaccio/types';

import Storage from '../lib/storage';

export type StringValue = verdaccio$StringValue;

// legacy should be removed in long term

export interface LegacyPackageList {
  [key: string]: LegacyPackageAccess;
}

export type LegacyPackageAccess = PackageAccess & {
  allow_publish?: string[];
  allow_proxy?: string[];
  allow_access?: string[];
  proxy_access?: string[];
  // FIXME: should be published on @verdaccio/types
  unpublish?: string[];
};

export type MatchedPackage = PackageAccess | void;

export type JWTPayload = RemoteUser & {
  password?: string;
};

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

export type $RequestExtend = Request & { remote_user?: any; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;
export type $SidebarPackage = Package & { latest: any };

export interface IAuthWebUI {
  jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): Promise<string>;
  aesEncrypt(value: string): string | void;
}

interface IAuthMiddleware {
  apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
}

export interface ISyncUplinks {
  uplinksLook?: boolean;
  etag?: string;
  req?: Request;
}

export type IPluginFilters = pluginUtils.ManifestFilter<Config>[];

/**
 * @property { string | number | Styles }  [ruleOrSelector]
 */
export interface Styles {
  [ruleOrSelector: string]: string | number | Styles;
}

export type AuthorAvatar = Author & { avatar?: string };
