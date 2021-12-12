import { Callback, Config, IPluginStorageFilter } from '@verdaccio/types';

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

export type IPluginFilters = IPluginStorageFilter<Config>[];
