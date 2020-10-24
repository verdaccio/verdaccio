import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import buildDebug from 'debug';

import {
  VerdaccioError,
  getBadRequest,
  getInternalError,
  getForbidden,
} from '@verdaccio/commons-api';
import { API_ERROR, SUPPORT_ERRORS, TOKEN_BASIC, TOKEN_BEARER } from '@verdaccio/dev-commons';
import { loadPlugin } from '@verdaccio/loaders';

import {
  Config,
  Logger,
  Callback,
  IPluginAuth,
  RemoteUser,
  JWTSignOptions,
  Security,
  AuthPluginPackage,
  AllowAccess,
  PackageAccess,
} from '@verdaccio/types';

import {
  isNil,
  isFunction,
  getMatchedPackagesSpec,
  createAnonymousRemoteUser,
  convertPayloadToBase64,
  createRemoteUser,
} from '@verdaccio/utils';

import {
  getMiddlewareCredentials,
  getSecurity,
  getDefaultPlugins,
  verifyJWTPayload,
  parseAuthTokenHeader,
  isAuthHeaderValid,
  isAESLegacy,
} from './utils';

import { signPayload } from './jwt-token';
import { aesEncrypt } from './legacy-token';
import { parseBasicPayload } from './token';

/* eslint-disable @typescript-eslint/no-var-requires */
const LoggerApi = require('@verdaccio/logger');

const debug = buildDebug('verdaccio:auth');

export interface IBasicAuth<T> {
  config: T & Config;
  authenticate(user: string, password: string, cb: Callback): void;
  changePassword(user: string, password: string, newPassword: string, cb: Callback): void;
  allow_access(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
  add_user(user: string, password: string, cb: Callback): any;
}

export interface TokenEncryption {
  jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): Promise<string>;
  aesEncrypt(buf: string): string | void;
}

export interface AESPayload {
  user: string;
  password: string;
}

export type $RequestExtend = Request & { remote_user?: any; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;

export interface IAuthMiddleware {
  apiJWTmiddleware(): $NextFunctionVer;
  webUIJWTmiddleware(): $NextFunctionVer;
}

export interface IAuth extends IBasicAuth<Config>, IAuthMiddleware, TokenEncryption {
  config: Config;
  logger: Logger;
  secret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any[];
  allow_unpublish(pkg: AuthPluginPackage, user: RemoteUser, callback: Callback): void;
}

class Auth implements IAuth {
  public config: Config;
  public logger: Logger;
  public secret: string;
  public plugins: IPluginAuth<Config>[];

  public constructor(config: Config) {
    this.config = config;
    this.logger = LoggerApi.logger.child({ sub: 'auth' });
    this.secret = config.secret;
    this.plugins = this._loadPlugin(config);
    this._applyDefaultPlugins();
  }

  private _loadPlugin(config: Config): IPluginAuth<Config>[] {
    const pluginOptions = {
      config,
      logger: this.logger,
    };

    return loadPlugin<IPluginAuth<Config>>(
      config,
      config.auth,
      pluginOptions,
      (plugin: IPluginAuth<Config>): boolean => {
        const { authenticate, allow_access, allow_publish } = plugin;

        // @ts-ignore
        return authenticate || allow_access || allow_publish;
      }
    );
  }

  private _applyDefaultPlugins(): void {
    this.plugins.push(getDefaultPlugins(this.logger));
  }

  public changePassword(
    username: string,
    password: string,
    newPassword: string,
    cb: Callback
  ): void {
    const validPlugins = _.filter(this.plugins, (plugin) => isFunction(plugin.changePassword));

    if (_.isEmpty(validPlugins)) {
      return cb(getInternalError(SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
    }

    for (const plugin of validPlugins) {
      if (isNil(plugin) || isFunction(plugin.changePassword) === false) {
        debug('auth plugin does not implement changePassword, trying next one');
        continue;
      } else {
        debug('updating password for %o', username);
        plugin.changePassword!(username, password, newPassword, (err, profile): void => {
          if (err) {
            this.logger.error(
              { username, err },
              `An error has been produced
            updating the password for @{username}. Error: @{err.message}`
            );
            return cb(err);
          }

          debug('updated password for %o was successful', username);
          return cb(null, profile);
        });
      }
    }
  }

  public authenticate(username: string, password: string, cb: Callback): void {
    const plugins = this.plugins.slice(0);
    (function next(): void {
      const plugin = plugins.shift() as IPluginAuth<Config>;

      if (isFunction(plugin.authenticate) === false) {
        return next();
      }

      debug('authenticating %o', username);
      plugin.authenticate(username, password, function (err, groups): void {
        if (err) {
          debug('authenticating for user %o failed. Error: %o', username, err?.message);
          return cb(err);
        }

        // Expect: SKIP if groups is falsey and not an array
        //         with at least one item (truthy length)
        // Expect: CONTINUE otherwise (will error if groups is not
        //         an array, but this is current behavior)
        // Caveat: STRING (if valid) will pass successfully
        //         bug give unexpected results
        // Info: Cannot use `== false to check falsey values`
        if (!!groups && groups.length !== 0) {
          // TODO: create a better understanding of expectations
          if (_.isString(groups)) {
            throw new TypeError('plugin group error: invalid type for function');
          }
          const isGroupValid: boolean = _.isArray(groups);
          if (!isGroupValid) {
            throw new TypeError(API_ERROR.BAD_FORMAT_USER_GROUP);
          }

          debug('authentication for user %o was successfully. Groups: %o', username, groups);
          return cb(err, createRemoteUser(username, groups));
        }
        next();
      });
    })();
  }

  public add_user(user: string, password: string, cb: Callback): void {
    const self = this;
    const plugins = this.plugins.slice(0);
    debug('add user %o', user);

    (function next(): void {
      const plugin = plugins.shift() as IPluginAuth<Config>;
      let method = 'adduser';
      if (isFunction(plugin[method]) === false) {
        method = 'add_user';
        self.logger.warn(
          'the plugin method add_user in the auth plugin is deprecated and will' +
            ' be removed in next major release, notify to the plugin author'
        );
      }

      if (isFunction(plugin[method]) === false) {
        next();
      } else {
        // p.add_user() execution
        plugin[method](user, password, function (err, ok): void {
          if (err) {
            debug('the user  %o could not being added. Error: %o', user, err?.message);
            return cb(err);
          }
          if (ok) {
            debug('the user %o has been added', user);
            return self.authenticate(user, password, cb);
          }
          next();
        });
      }
    })();
  }

  /**
   * Allow user to access a package.
   */
  public allow_access(
    { packageName, packageVersion }: AuthPluginPackage,
    user: RemoteUser,
    callback: Callback
  ): void {
    const plugins = this.plugins.slice(0);
    const pkgAllowAcces: AllowAccess = { name: packageName, version: packageVersion };
    const pkg = Object.assign(
      {},
      pkgAllowAcces,
      getMatchedPackagesSpec(packageName, this.config.packages)
    ) as AllowAccess & PackageAccess;
    debug('allow access for %o', packageName);

    (function next(): void {
      const plugin: IPluginAuth<Config> = plugins.shift() as IPluginAuth<Config>;

      if (_.isNil(plugin) || isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access!(user, pkg, function (err, ok: boolean): void {
        if (err) {
          debug('aforbidden access for %o. Error: %o', packageName, err?.message);
          return callback(err);
        }

        if (ok) {
          debug('allowed access for %o', packageName);
          return callback(null, ok);
        }

        next(); // cb(null, false) causes next plugin to roll
      });
    })();
  }

  public allow_unpublish(
    { packageName, packageVersion }: AuthPluginPackage,
    user: RemoteUser,
    callback: Callback
  ): void {
    const pkg = Object.assign(
      { name: packageName, version: packageVersion },
      getMatchedPackagesSpec(packageName, this.config.packages)
    );
    debug('allow unpublish for %o', packageName);

    for (const plugin of this.plugins) {
      if (_.isNil(plugin) || isFunction(plugin.allow_unpublish) === false) {
        debug('allow unpublish for %o plugin does not implement allow_unpublish', packageName);
        continue;
      } else {
        plugin.allow_unpublish!(user, pkg, (err, ok: boolean): void => {
          if (err) {
            debug(
              'forbidden publish for %o, it will fallback on unpublish permissions',
              packageName
            );
            return callback(err);
          }

          if (_.isNil(ok) === true) {
            debug('bypass unpublish for %o, publish will handle the access', packageName);
            // @ts-ignore
            // eslint-disable-next-line
            return this.allow_publish(...arguments);
          }

          if (ok) {
            debug('allowed unpublish for %o', packageName);
            return callback(null, ok);
          }
        });
      }
    }
  }

  /**
   * Allow user to publish a package.
   */
  public allow_publish(
    { packageName, packageVersion }: AuthPluginPackage,
    user: RemoteUser,
    callback: Callback
  ): void {
    const plugins = this.plugins.slice(0);
    const pkg = Object.assign(
      { name: packageName, version: packageVersion },
      getMatchedPackagesSpec(packageName, this.config.packages)
    );
    debug('allow publish for %o init | plugins: %o', packageName, plugins.length);

    (function next(): void {
      const plugin = plugins.shift();

      if (_.isNil(plugin) || isFunction(plugin.allow_publish) === false) {
        debug('allow publish for %o plugin does not implement allow_publish', packageName);
        return next();
      }

      // @ts-ignore
      plugin.allow_publish(
        user,
        pkg,
        // @ts-ignore
        (err: VerdaccioError, ok: boolean): void => {
          if (_.isNil(err) === false && _.isError(err)) {
            debug('forbidden publish for %o', packageName);
            return callback(err);
          }

          if (ok) {
            debug('allowed publish for %o', packageName);
            return callback(null, ok);
          }

          debug('allow publish skip validation for %o', packageName);
          next(); // cb(null, false) causes next plugin to roll
        }
      );
    })();
  }

  public apiJWTmiddleware(): Function {
    debug('jwt middleware');
    const plugins = this.plugins.slice(0);
    const helpers = { createAnonymousRemoteUser, createRemoteUser };
    for (const plugin of plugins) {
      if (plugin.apiJWTmiddleware) {
        return plugin.apiJWTmiddleware(helpers);
      }
    }

    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction): void => {
      req.pause();

      const next = function (err: VerdaccioError | void): void {
        req.resume();
        // uncomment this to reject users with bad auth headers
        // return _next.apply(null, arguments)
        // swallow error, user remains unauthorized
        // set remoteUserError to indicate that user was attempting authentication
        if (err) {
          req.remote_user.error = err.message;
        }
        return _next();
      };

      if (this._isRemoteUserValid(req.remote_user)) {
        debug('jwt has remote user');
        return next();
      }

      // in case auth header does not exist we return anonymous function
      req.remote_user = createAnonymousRemoteUser();

      const { authorization } = req.headers;
      if (_.isNil(authorization)) {
        debug('jwt invalid auth header');
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        debug('api middleware auth heather is not valid');
        return next(getBadRequest(API_ERROR.BAD_AUTH_HEADER));
      }

      const security: Security = getSecurity(this.config);
      const { secret } = this.config;

      if (isAESLegacy(security)) {
        debug('api middleware using legacy auth token');
        this._handleAESMiddleware(req, security, secret, authorization, next);
      } else {
        debug('api middleware using JWT auth token');
        this._handleJWTAPIMiddleware(req, security, secret, authorization, next);
      }
    };
  }

  private _handleJWTAPIMiddleware(
    req: $RequestExtend,
    security: Security,
    secret: string,
    authorization: string,
    next: Function
  ): void {
    debug('handle JWT api middleware');
    const { scheme, token } = parseAuthTokenHeader(authorization);
    if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
      debug('handle basic token');
      // this should happen when client tries to login with an existing user
      const credentials = convertPayloadToBase64(token).toString();
      const { user, password } = parseBasicPayload(credentials) as AESPayload;
      debug('authenticating %o', user);
      this.authenticate(user, password, (err, user): void => {
        if (!err) {
          debug('generating a remote user');
          req.remote_user = user;
          next();
        } else {
          debug('generating anonymous user');
          req.remote_user = createAnonymousRemoteUser();
          next(err);
        }
      });
    } else {
      debug('handle jwt token');
      const credentials: any = getMiddlewareCredentials(security, secret, authorization);
      if (credentials) {
        // if the signature is valid we rely on it
        req.remote_user = credentials;
        debug('generating a remote user');
        next();
      } else {
        // with JWT throw 401
        debug('jwt invalid token');
        next(getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      }
    }
  }

  private _handleAESMiddleware(
    req: $RequestExtend,
    security: Security,
    secret: string,
    authorization: string,
    next: Function
  ): void {
    debug('handle legacy api middleware');
    debug('api middleware secret %o', secret);
    debug('api middleware authorization %o', authorization);
    const credentials: any = getMiddlewareCredentials(security, secret, authorization);
    debug('api middleware credentials %o', credentials);
    if (credentials) {
      const { user, password } = credentials;
      debug('authenticating %o', user);
      this.authenticate(user, password, (err, user): void => {
        if (!err) {
          req.remote_user = user;
          debug('generating a remote user');
          next();
        } else {
          req.remote_user = createAnonymousRemoteUser();
          debug('generating anonymous user');
          next(err);
        }
      });
    } else {
      // we force npm client to ask again with basic authentication
      debug('legacy invalid header');
      return next(getBadRequest(API_ERROR.BAD_AUTH_HEADER));
    }
  }

  private _isRemoteUserValid(remote_user: RemoteUser): boolean {
    return _.isUndefined(remote_user) === false && _.isUndefined(remote_user.name) === false;
  }

  /**
   * JWT middleware for WebUI
   */
  public webUIJWTmiddleware(): Function {
    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction): void => {
      if (this._isRemoteUserValid(req.remote_user)) {
        return _next();
      }

      req.pause();
      const next = (err: VerdaccioError | void): void => {
        req.resume();
        if (err) {
          // req.remote_user.error = err.message;
          res.status(err.statusCode).send(err.message);
        }

        return _next();
      };

      const { authorization } = req.headers;
      if (_.isNil(authorization)) {
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        return next(getBadRequest(API_ERROR.BAD_AUTH_HEADER));
      }

      const token = (authorization || '').replace(`${TOKEN_BEARER} `, '');
      if (!token) {
        return next();
      }

      let credentials;
      try {
        credentials = verifyJWTPayload(token, this.config.secret);
      } catch (err) {
        // FIXME: intended behaviour, do we want it?
      }

      if (this._isRemoteUserValid(credentials)) {
        const { name, groups } = credentials;
        // $FlowFixMe
        req.remote_user = createRemoteUser(name, groups);
      } else {
        req.remote_user = createAnonymousRemoteUser();
      }

      next();
    };
  }

  public async jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): Promise<string> {
    const { real_groups, name, groups } = user;
    const realGroupsValidated = _.isNil(real_groups) ? [] : real_groups;
    const groupedGroups = _.isNil(groups) ? real_groups : groups.concat(realGroupsValidated);
    const payload: RemoteUser = {
      real_groups: realGroupsValidated,
      name,
      groups: groupedGroups,
    };

    const token: string = await signPayload(payload, this.secret, signOptions);

    return token;
  }

  /**
   * Encrypt a string.
   */
  public aesEncrypt(value: string): string | void {
    return aesEncrypt(value, this.secret);
  }
}

export { Auth };
