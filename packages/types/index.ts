import {
  IBasicStorage,
  Callback,
  RemoteUser,
  Config,
  Logger,
  IPluginStorage,
  Package,
  ITokenActions,
} from '@verdaccio/types';

export type JWTPayload = RemoteUser & {
  password?: string;
};

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

export interface IStorage extends IBasicStorage<Config>, ITokenActions {
  config: Config;
  storagePlugin: IPluginStorage<Config>;
  logger: Logger;
}

/**
 * @property { string | number | Styles }  [ruleOrSelector]
 */
export interface Styles {
  [ruleOrSelector: string]: string | number | Styles;
}
