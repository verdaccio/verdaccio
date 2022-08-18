import { Callback, HttpError, RemoteUser } from '../commons';
import { Config } from '../configuration';

export interface AuthPluginPackage {
  packageName: string;
  packageVersion?: string;
  tag?: string;
}

export type AuthError = HttpError & { code: number };
export type AuthAccessCallback = (error: AuthError | null, access: boolean) => void;
export type AuthCallback = (error: AuthError | null, groups: string[] | false) => void;

// @deprecated use IBasicAuth from @verdaccio/auth
export interface IBasicAuth<T> {
  config: T & Config;
  aesEncrypt(buf: Buffer): Buffer;
  authenticate(user: string, password: string, cb: Callback): void;
  changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
  allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
  add_user(user: string, password: string, cb: Callback): any;
}
