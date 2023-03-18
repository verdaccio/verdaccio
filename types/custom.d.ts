/// <reference types="@verdaccio/types" />
import { ReadStream, WriteStream } from 'fs';

import { ReadTarball, UploadTarball } from '@verdaccio/streams';
import { Logger, RemoteUser } from '@verdaccio/types';

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }
  }
}

export interface StoragePluginLegacy<T> extends pluginUtils.Storage<T> {}
