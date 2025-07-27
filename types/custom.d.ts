import { pluginUtils } from '@verdaccio/core';
import { Logger, RemoteUser } from '@verdaccio/types';

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }
  }
}

export type StoragePluginLegacy<T> = pluginUtils.Storage<T>;
