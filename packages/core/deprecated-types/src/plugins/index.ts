import type { RemoteUser } from '../commons';
import type { PackageAccess } from '../manifest';
import type { AuthAccessCallback, AuthCallback } from './auth';
import type { IPlugin } from './commons';

export interface AllowAccess {
  name: string;
  version?: string;
  tag?: string;
}

/**
 * ```typescript
 *  dasdsadsa()
 * ```
 */
export interface IPluginAuth<T> extends IPlugin<T> {
  /**
   * @param props user from Application component
   */
  authenticate(user: string, password: string, cb: AuthCallback): void;
  adduser?(user: string, password: string, cb: AuthCallback): void;
  changePassword?(user: string, password: string, newPassword: string, cb: AuthCallback): void;
  allow_publish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_access?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_unpublish?(user: RemoteUser, pkg: T & PackageAccess, cb: AuthAccessCallback): void;
  allow_publish?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
  allow_access?(user: RemoteUser, pkg: AllowAccess & PackageAccess, cb: AuthAccessCallback): void;
  allow_unpublish?(
    user: RemoteUser,
    pkg: AllowAccess & PackageAccess,
    cb: AuthAccessCallback
  ): void;
  apiJWTmiddleware?(helpers: any): Function;
}

export * from './auth';
export * from './storage';
export * from './middleware';
export * from './commons';
export * from './filter';
