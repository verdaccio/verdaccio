/// <reference types="@verdaccio/types" />
import { Logger, RemoteUser } from '@verdaccio/types';

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }
  }
}

declare module '@verdaccio/types' {
  export type PackageAccessYaml = any;
  export type FlagsConfig = any;
}
