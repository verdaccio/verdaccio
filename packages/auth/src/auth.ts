import _ from 'lodash';
import { NextFunction } from 'express';

import { VerdaccioError } from '@verdaccio/commons-api';
import {API_ERROR, SUPPORT_ERRORS, TOKEN_BASIC, TOKEN_BEARER} from '@verdaccio/dev-commons';
import { loadPlugin } from '@verdaccio/loaders';
import { aesEncrypt, signPayload } from '@verdaccio/utils';
import {
  getDefaultPlugins,
  getMiddlewareCredentials,
  verifyJWTPayload,
  createAnonymousRemoteUser,
  isAuthHeaderValid,
  getSecurity,
  isAESLegacy,
  convertPayloadToBase64,
  ErrorCode,
  parseAuthTokenHeader,
  parseBasicPayload,
  createRemoteUser,
} from '@verdaccio/utils';

import { getMatchedPackagesSpec } from '@verdaccio/utils';
import { Config, Logger, Callback, IPluginAuth, RemoteUser, JWTSignOptions, Security, AuthPluginPackage, AllowAccess, PackageAccess } from '@verdaccio/types';
import { $RequestExtend, $ResponseExtend, IAuth, AESPayload } from '@verdaccio/dev-types';

/* eslint-disable @typescript-eslint/no-var-requires */
const LoggerApi = require('@verdaccio/logger');

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
    this.plugins.push(getDefaultPlugins());
  }

  public changePassword(username: string, password: string, newPassword: string, cb: Callback): void {
    const validPlugins = _.filter(this.plugins, plugin => _.isFunction(plugin.changePassword));

		if (_.isEmpty(validPlugins)) {
			return cb(ErrorCode.getInternalError(SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
		}

		for (const plugin of validPlugins) {
			if (_.isNil(plugin) || _.isFunction(plugin.changePassword) === false) {
				this.logger.trace('auth plugin does not implement changePassword, trying next one');
				continue;
			} else {
				this.logger.trace({username}, 'updating password for @{username}');
				plugin.changePassword!(
					username,
					password,
					newPassword,
					(err, profile): void => {
						if (err) {
							this.logger.error(
								{username, err},
								`An error has been produced
            updating the password for @{username}. Error: @{err.message}`
							);
							return cb(err);
						}

						this.logger.trace({username}, 'updated password for @{username} was successful');
						return cb(null, profile);
					}
				);
			}
		}
  }

  public authenticate(username: string, password: string, cb: Callback): void {
    const plugins = this.plugins.slice(0);
    const self = this;
    (function next(): void {
      const plugin = plugins.shift() as IPluginAuth<Config>;

      if (_.isFunction(plugin.authenticate) === false) {
        return next();
      }

      self.logger.trace({ username }, 'authenticating @{username}');
      plugin.authenticate(username, password, function(err, groups): void {
        if (err) {
          self.logger.trace({ username, err }, 'authenticating for user @{username} failed. Error: @{err.message}');
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

          self.logger.trace({ username, groups }, 'authentication for user @{username} was successfully. Groups: @{groups}');
          return cb(err, createRemoteUser(username, groups));
        }
        next();
      });
    })();
  }

  public add_user(user: string, password: string, cb: Callback): void {
    const self = this;
    const plugins = this.plugins.slice(0);
    this.logger.trace({ user }, 'add user @{user}');

    (function next(): void {
      const plugin = plugins.shift() as IPluginAuth<Config>;
      let method = 'adduser';
      if (_.isFunction(plugin[method]) === false) {
        method = 'add_user';
        self.logger.warn('the plugin method add_user in the auth plugin is deprecated and will be removed in next major release, notify to the plugin author');
      }

      if (_.isFunction(plugin[method]) === false) {
        next();
      } else {
        // p.add_user() execution
        plugin[method](user, password, function(err, ok): void {
          if (err) {
            self.logger.trace({ user, err: err.message }, 'the user @{user} could not being added. Error: @{err}');
            return cb(err);
          }
          if (ok) {
            self.logger.trace({ user }, 'the user @{user} has been added');
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
  public allow_access({ packageName, packageVersion }: AuthPluginPackage, user: RemoteUser, callback: Callback): void {
    const plugins = this.plugins.slice(0);
    const pkgAllowAcces: AllowAccess = { name: packageName, version: packageVersion };
    const pkg = Object.assign({}, pkgAllowAcces, getMatchedPackagesSpec(packageName, this.config.packages)) as AllowAccess & PackageAccess;
    const self = this;
    this.logger.trace({ packageName }, 'allow access for @{packageName}');

    (function next(): void {
      const plugin: IPluginAuth<Config> = plugins.shift() as IPluginAuth<Config>;

      if (_.isNil(plugin) || _.isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access!(user, pkg, function(err, ok: boolean): void {
        if (err) {
          self.logger.trace({ packageName, err }, 'forbidden access for @{packageName}. Error: @{err.message}');
          return callback(err);
        }

        if (ok) {
          self.logger.trace({ packageName }, 'allowed access for @{packageName}');
          return callback(null, ok);
        }

        next(); // cb(null, false) causes next plugin to roll
      });
    })();
  }

  public allow_unpublish({ packageName, packageVersion }: AuthPluginPackage, user: RemoteUser, callback: Callback): void {
    const pkg = Object.assign({ name: packageName, version: packageVersion }, getMatchedPackagesSpec(packageName, this.config.packages));
    this.logger.trace({ packageName }, 'allow unpublish for @{packageName}');

    for (const plugin of this.plugins) {
      if (_.isNil(plugin) || _.isFunction(plugin.allow_unpublish) === false) {
        this.logger.trace({ packageName }, 'allow unpublish for @{packageName} plugin does not implement allow_unpublish');
        continue;
      } else {
        plugin.allow_unpublish!(
          user,
          pkg,
          (err, ok: boolean): void => {
            if (err) {
              this.logger.trace({ packageName }, 'forbidden publish for @{packageName}, it will fallback on unpublish permissions');
              return callback(err);
            }

            if (_.isNil(ok) === true) {
              this.logger.trace({ packageName }, 'we bypass unpublish for @{packageName}, publish will handle the access');
              // @ts-ignore
              // eslint-disable-next-line
              return this.allow_publish(...arguments);
            }

            if (ok) {
              this.logger.trace({ packageName }, 'allowed unpublish for @{packageName}');
              return callback(null, ok);
            }
          }
        );
      }
    }
  }

  /**
   * Allow user to publish a package.
   */
  public allow_publish({ packageName, packageVersion }: AuthPluginPackage, user: RemoteUser, callback: Callback): void {
    const plugins = this.plugins.slice(0);
    const self = this;
    const pkg = Object.assign({ name: packageName, version: packageVersion }, getMatchedPackagesSpec(packageName, this.config.packages));
    this.logger.trace({ packageName, plugins: this.plugins.length }, 'allow publish for @{packageName} init | plugins: @{plugins}');

    (function next(): void {
      const plugin = plugins.shift();

      if (_.isNil(plugin) || _.isFunction(plugin.allow_publish) === false) {
        self.logger.trace({ packageName }, 'allow publish for @{packageName} plugin does not implement allow_publish');
        return next();
      }

      // @ts-ignore
      plugin.allow_publish(
        user,
        pkg,
        // @ts-ignore
        (err: VerdaccioError, ok: boolean): void => {
          if (_.isNil(err) === false && _.isError(err)) {
            self.logger.trace({ packageName }, 'forbidden publish for @{packageName}');
            return callback(err);
          }

          if (ok) {
            self.logger.trace({ packageName }, 'allowed publish for @{packageName}');
            return callback(null, ok);
          }

          self.logger.trace({ packageName }, 'allow publish skip validation for @{packageName}');
          next(); // cb(null, false) causes next plugin to roll
        }
      );
    })();
  }

  public apiJWTmiddleware(): Function {
    const plugins = this.plugins.slice(0);
    const helpers = { createAnonymousRemoteUser, createRemoteUser };
    for (const plugin of plugins) {
      if (plugin.apiJWTmiddleware) {
        return plugin.apiJWTmiddleware(helpers);
      }
    }

    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction): void => {
      req.pause();

      const next = function(err: VerdaccioError | void): void {
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

      if (this._isRemoteUserMissing(req.remote_user)) {
        return next();
      }

      // in case auth header does not exist we return anonymous function
      req.remote_user = createAnonymousRemoteUser();

      const { authorization } = req.headers;
      if (_.isNil(authorization)) {
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        this.logger.trace('api middleware auth heather is not valid');
        return next(ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
      }

      const security: Security = getSecurity(this.config);
      const { secret } = this.config;

      if (isAESLegacy(security)) {
        this.logger.trace('api middleware using legacy auth token');
        this._handleAESMiddleware(req, security, secret, authorization, next);
      } else {
        this.logger.trace('api middleware using JWT auth token');
        this._handleJWTAPIMiddleware(req, security, secret, authorization, next);
      }
    };
  }

  private _handleJWTAPIMiddleware(req: $RequestExtend, security: Security, secret: string, authorization: string, next: Function): void {
    const { scheme, token } = parseAuthTokenHeader(authorization);
    if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
      // this should happen when client tries to login with an existing user
      const credentials = convertPayloadToBase64(token).toString();
      const { user, password } = parseBasicPayload(credentials) as AESPayload;
      this.authenticate(
        user,
        password,
        (err, user): void => {
          if (!err) {
            req.remote_user = user;
            next();
          } else {
            req.remote_user = createAnonymousRemoteUser();
            next(err);
          }
        }
      );
    } else {
      // jwt handler
      const credentials: any = getMiddlewareCredentials(security, secret, authorization);
      if (credentials) {
        // if the signature is valid we rely on it
        req.remote_user = credentials;
        next();
      } else {
        // with JWT throw 401
        next(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      }
    }
  }

  private _handleAESMiddleware(req: $RequestExtend, security: Security, secret: string, authorization: string, next: Function): void {
    const credentials: any = getMiddlewareCredentials(security, secret, authorization);
    if (credentials) {
      const { user, password } = credentials;
      this.authenticate(
        user,
        password,
        (err, user): void => {
          if (!err) {
            req.remote_user = user;
            next();
          } else {
            req.remote_user = createAnonymousRemoteUser();
            next(err);
          }
        }
      );
    } else {
      // we force npm client to ask again with basic authentication
      return next(ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
    }
  }

  private _isRemoteUserMissing(remote_user: RemoteUser): boolean {
    return _.isUndefined(remote_user) === false && _.isUndefined(remote_user.name) === false;
  }

  /**
   * JWT middleware for WebUI
   */
  public webUIJWTmiddleware(): Function {
    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction): void => {
      if (this._isRemoteUserMissing(req.remote_user)) {
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
        return next(ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
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

      if (credentials) {
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
  public aesEncrypt(buf: Buffer): Buffer {
    return aesEncrypt(buf, this.secret);
  }
}

export { Auth };
