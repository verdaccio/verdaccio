import type { Callback, HttpError, RemoteUser } from '../commons';
import type { Config } from '../configuration';

export interface AuthPluginPackage {
  packageName: string;
  packageVersion?: string;
  tag?: string;
}

export type AuthError = HttpError & { code: number };
export type AuthAccessCallback = (error: AuthError | null, access: boolean) => void;
export type AuthCallback = (error: AuthError | null, groups: string[] | false) => void;

export interface IBasicAuth<T> {
  config: T & Config;
  aesEncrypt(username: string, password: string): string;
  authenticate(user: string, password: string, cb: Callback): void;
  changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
  allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
  add_user(user: string, password: string, cb: Callback): any;
}
