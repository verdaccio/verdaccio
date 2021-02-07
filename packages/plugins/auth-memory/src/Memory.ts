import buildDebug from 'debug';
import {
  PluginOptions,
  Callback,
  PackageAccess,
  IPluginAuth,
  RemoteUser,
  Logger,
} from '@verdaccio/types';
import {
  getConflict,
  getForbidden,
  getNotFound,
  getUnauthorized,
  API_ERROR,
} from '@verdaccio/commons-api';

import { VerdaccioMemoryConfig, Users, UserMemory } from './types';

const debug = buildDebug('verdaccio:plugin:storage:memory:user');

export default class Memory implements IPluginAuth<VerdaccioMemoryConfig> {
  public _logger: Logger;
  public _users: Users;
  public _config: {};
  public _app_config: VerdaccioMemoryConfig;

  public constructor(
    config: VerdaccioMemoryConfig,
    appOptions: PluginOptions<VerdaccioMemoryConfig>
  ) {
    this._users = config.users || {};
    this._config = config;
    this._logger = appOptions.logger;
    this._app_config = appOptions.config;
    debug('initialized');
  }

  public authenticate(user: string, password: string, done: Callback): void {
    debug('authenticate %o:%o', user, password);
    const userCredentials = this._users[user];

    if (!userCredentials) {
      debug('user %o does not exist', user);
      return done(null, false);
    }

    if (password !== userCredentials.password) {
      const err = getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD);
      debug('password invalid for: %o', user);

      return done(err);
    }

    // authentication succeeded!
    // return all usergroups this user has access to;
    debug('authentication succeed for %o', user);
    return done(null, [user]);
  }

  public adduser(user: string, password: string, done: Callback): void {
    if (this._users[user]) {
      debug('user %o already exist', user);
      return done(null, true);
    }

    if (this._app_config.max_users) {
      if (Object.keys(this._users).length >= this._app_config.max_users) {
        const err = getConflict(API_ERROR.MAX_USERS_REACHED);
        debug(API_ERROR.MAX_USERS_REACHED);
        return done(err);
      }
    }

    this._users[user] = { name: user, password: password };

    debug('user added succeeded for %o', user);
    done(null, user);
  }

  public changePassword(
    username: string,
    password: string,
    newPassword: string,
    cb: Callback
  ): void {
    const user: UserMemory = this._users[username];
    debug('init change password for %o', user.name);

    if (user && user.password === password) {
      user.password = newPassword;
      this._users[username] = user;
      debug('user changed password succeeded for %o', user.name);
      cb(null, user);
    } else {
      const err = getNotFound('user not found');
      this._logger.debug({ user: username }, 'change password user  @{user} not found');
      debug('change password user for %o not found', user.name);
      return cb(err);
    }
  }

  public allow_access(user: RemoteUser, pkg: PackageAccess, cb: Callback): void {
    if (pkg?.access?.includes('$all') || pkg?.access?.includes('$anonymous')) {
      debug('%o has been granted access', user.name);

      return cb(null, true);
    }

    if (!user.name) {
      const err = getForbidden('not allowed to access package');
      this._logger.debug({ user: user.name }, 'user: @{user} not allowed to access package');
      debug('%o not allowed to access package err', user.name, err.message);
      return cb(err);
    }

    if (pkg?.access?.includes(user.name) || pkg?.access?.includes('$authenticated')) {
      debug('%o has been granted access', user.name);
      return cb(null, true);
    }

    const err = getForbidden('not allowed to access package');
    debug('%o not allowed to access package err', user.name, err.message);
    return cb(err);
  }

  public allow_publish(user: RemoteUser, pkg: PackageAccess, cb: Callback): void {
    if (pkg?.publish?.includes('$all') || pkg?.publish?.includes('$anonymous')) {
      debug('%o has been granted to publish', user.name);
      return cb(null, true);
    }

    if (!user.name) {
      const err = getForbidden('not allowed to publish package');
      debug('%o not allowed to publish package err %o', user.name, err.message);
      return cb(err);
    }

    if (pkg?.publish?.includes(user.name) || pkg?.publish?.includes('$authenticated')) {
      return cb(null, true);
    }

    const err = getForbidden('not allowed to publish package');
    debug('%o not allowed to publish package err %o', user.name, err.message);

    return cb(err);
  }
}
