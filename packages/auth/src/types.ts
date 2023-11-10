import { NextFunction, Request, Response } from 'express';

import { VerdaccioError } from '@verdaccio/core';
import { AuthPackageAllow, JWTSignOptions, Logger, RemoteUser } from '@verdaccio/types';

export interface AESPayload {
  user: string;
  password: string;
}

export type BasicPayload = AESPayload | void;
export type AuthMiddlewarePayload = RemoteUser | BasicPayload;

export interface AuthTokenHeader {
  scheme: string;
  token: string;
}
export type AllowActionCallbackResponse = boolean | undefined;
export type AllowActionCallback = (
  error: VerdaccioError | null,
  allowed?: AllowActionCallbackResponse
) => void;

export type AllowAction = (
  user: RemoteUser,
  pkg: AuthPackageAllow,
  callback: AllowActionCallback
) => void;

export interface TokenEncryption {
  jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): Promise<string>;
  aesEncrypt(buf: string): string | void;
}

export type ActionsAllowed = 'publish' | 'unpublish' | 'access';

// remove
export interface IAuthMiddleware {
  apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
}

export type $RequestExtend = Request & { remote_user?: any; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;
export { NextFunction };
