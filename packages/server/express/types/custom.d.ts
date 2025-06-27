import type { NextFunction, Request, Response } from 'express';

import { Logger, RemoteUser } from '@verdaccio/types';

export type $RequestExtend = Request & { remote_user?: any; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;

declare global {
  namespace Express {
    export interface Request {
      remote_user: RemoteUser;
      log: Logger;
    }
  }
}
