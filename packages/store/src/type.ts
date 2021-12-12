import { Callback, Config, IPluginStorageFilter, RemoteUser } from '@verdaccio/types';

// @deprecated
export interface IGetPackageOptions {
  callback: Callback;
  name: string;
  keepUpLinkData?: boolean;
  uplinksLook: boolean;
  req: any;
}

export type IGetPackageOptionsNext = {
  // @deprecated remove this soon
  req: any;
  name: string;
  version?: string;
  keepUpLinkData?: boolean;
  remoteUser?: RemoteUser;
  uplinksLook: boolean;
  requestOptions: {
    // RequestOptions from url package
    host: string;
    protocol: string;
    headers: { [key: string]: string };
  };
};

export interface ISyncUplinks {
  uplinksLook?: boolean;
  etag?: string;
  req?: Request;
}

export type Users = {
  [key: string]: string;
};
export interface StarBody {
  _id: string;
  _rev: string;
  users: Users;
}

export type IPluginFilters = IPluginStorageFilter<Config>[];
