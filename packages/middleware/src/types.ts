import { NextFunction, Request, Response } from 'express';

import { Logger, RemoteUser } from '@verdaccio/types';

export type $RequestExtend = Request & { remote_user?: RemoteUser; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;

export interface MiddlewareError {
  error: string;
}
