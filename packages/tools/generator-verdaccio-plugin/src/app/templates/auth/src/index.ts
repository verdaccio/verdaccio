import { getInternalError } from '@verdaccio/commons-api';
import {
  AuthAccessCallback,
  AuthCallback,
  IPluginAuth,
  Logger,
  PackageAccess,
  PluginOptions,
  RemoteUser,
} from '@verdaccio/types';

import { CustomConfig } from '../types/index';

/**
 * Custom Verdaccio Authenticate Plugin.
 */
export default class AuthCustomPlugin implements IPluginAuth<CustomConfig> {
  public logger: Logger;
  private foo: string;
  public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
    this.logger = options.logger;
    this.foo = config.foo;
    return this;
  }
  /**
   * Authenticate an user.
   * @param user user to log
   * @param password provided password
   * @param cb callback function
   */
  public authenticate(user: string, password: string, cb: AuthCallback): void {
    /**
     * This code is just an example for demostration purpose
      if (this.foo) {
        cb(null, ['group-foo', 'group-bar']);
      } else {
        cb(getInternalError("error, try again"), false);
      }
    */
  }

  /**
   * Triggered on each access request
   * @param user
   * @param pkg
   * @param cb
   */
  public allow_access(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
    /**
     * This code is just an example for demostration purpose
    if (user.name === this.foo && pkg?.access?.includes[user.name]) {
      this.logger.debug({name: user.name}, 'your package has been granted for @{name}');
      cb(null, true)
    } else {
      this.logger.error({name: user.name}, '@{name} is not allowed to access this package');
       cb(getInternalError("error, try again"), false);
    }
     */
  }

  /**
   * Triggered on each publish request
   * @param user
   * @param pkg
   * @param cb
   */
  public allow_publish(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
    /**
     * This code is just an example for demostration purpose
    if (user.name === this.foo && pkg?.access?.includes[user.name]) {
      this.logger.debug({name: user.name}, '@{name} has been granted to publish');
      cb(null, true)
    } else {
      this.logger.error({name: user.name}, '@{name} is not allowed to publish this package');
       cb(getInternalError("error, try again"), false);
    }
     */
  }

  public allow_unpublish(user: RemoteUser, pkg: PackageAccess, cb: AuthAccessCallback): void {
    /**
     * This code is just an example for demostration purpose
    if (user.name === this.foo && pkg?.access?.includes[user.name]) {
      this.logger.debug({name: user.name}, '@{name} has been granted to unpublish');
      cb(null, true)
    } else {
      this.logger.error({name: user.name}, '@{name} is not allowed to publish this package');
      cb(getInternalError("error, try again"), false);
    }
     */
  }
}
