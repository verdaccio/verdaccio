import { Config, IPluginStorageFilter, Callback } from '@verdaccio/types';

export interface IGetPackageOptions {
  callback: Callback;
  name: string;
  keepUpLinkData?: boolean;
  uplinksLook: boolean;
  req: any;
}
export interface ISyncUplinks {
  uplinksLook?: boolean;
  etag?: string;
  req?: Request;
}

export type IPluginFilters = IPluginStorageFilter<Config>[];
