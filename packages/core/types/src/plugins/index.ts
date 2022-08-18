import { RemoteUser } from '../commons';
import { AllowAccess } from '../configuration';
import { PackageAccess } from '../manifest';
import { AuthAccessCallback, AuthCallback } from './auth';
import { IPlugin } from './commons';

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
