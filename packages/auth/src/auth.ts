import buildDebug from 'debug';
import _ from 'lodash';
import { HTPasswd } from 'verdaccio-htpasswd';

import { createAnonymousRemoteUser, createRemoteUser } from '@verdaccio/config';
import {
  API_ERROR,
  PLUGIN_CATEGORY,
  SUPPORT_ERRORS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  VerdaccioError,
  errorUtils,
  pluginUtils,
  warningUtils,
} from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import {
  aesEncrypt,
  aesEncryptDeprecated,
  parseBasicPayload,
  signPayload,
  utils as signatureUtils,
} from '@verdaccio/signature';
import {
  AllowAccess,
  Callback,
  Config,
  JWTSignOptions,
  PackageAccess,
  RemoteUser,
  Security,
} from '@verdaccio/types';
import { getMatchedPackagesSpec, isFunction, isNil } from '@verdaccio/utils';

import {
  $RequestExtend,
  $ResponseExtend,
  AESPayload,
  IAuthMiddleware,
  NextFunction,
  TokenEncryption,
} from './types';
import {
  convertPayloadToBase64,
  getDefaultPlugins,
  getMiddlewareCredentials,
  isAESLegacy,
  isAuthHeaderValid,
  parseAuthTokenHeader,
  verifyJWTPayload,
} from './utils';

const debug = buildDebug('verdaccio:auth');

class Auth implements IAuthMiddleware, TokenEncryption, pluginUtils.IBasicAuth {
  public config: Config;
  public secret: string;
  public plugins: pluginUtils.Auth<Config>[];

  public constructor(config: Config) {
    this.config = config;
    this.secret = config.secret;
    this.plugins = [];
    if (!this.secret) {
      throw new TypeError('secret it is required value on initialize the auth class');
    }
  }

  public async init() {
    let plugins = (await this.loadPlugin()) as pluginUtils.Auth<unknown>[];

    debug('auth plugins found %s', plugins.length);
    if (!plugins || plugins.length === 0) {
      plugins = this.loadDefaultPlugin();
    }
    this.plugins = plugins;

    this._applyDefaultPlugins();
  }

  private loadDefaultPlugin() {
    debug('load default auth plugin');
    const pluginOptions: pluginUtils.PluginOptions = {
      config: this.config,
      logger,
    };
    let authPlugin;
    try {
      authPlugin = new HTPasswd(
        { file: './htpasswd' },
        pluginOptions as any as pluginUtils.PluginOptions
      );
    } catch (error: any) {
      debug('error on loading auth htpasswd plugin stack: %o', error);
      logger.info({}, 'no auth plugin has been found');
      return [];
    }

    return [authPlugin];
  }

  private async loadPlugin() {
    return asyncLoadPlugin<pluginUtils.Auth<unknown>>(
      this.config.auth,
      {
        config: this.config,
        logger,
      },
      (plugin): boolean => {
        const { authenticate, allow_access, allow_publish } = plugin;

        return (
          typeof authenticate !== 'undefined' ||
          typeof allow_access !== 'undefined' ||
          typeof allow_publish !== 'undefined'
        );
      },
      this.config?.serverSettings?.pluginPrefix,
      PLUGIN_CATEGORY.AUTHENTICATION
    );
  }

  private _applyDefaultPlugins(): void {
    // TODO: rename to applyFallbackPluginMethods
    this.plugins.push(getDefaultPlugins(logger));
  }

  public changePassword(
    username: string,
    password: string,
    newPassword: string,
    cb: Callback
  ): void {
    const validPlugins = _.filter(this.plugins, (plugin) => isFunction(plugin.changePassword));

    if (_.isEmpty(validPlugins)) {
      return cb(errorUtils.getInternalError(SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
    }

    for (const plugin of validPlugins) {
      if (isNil(plugin) || isFunction(plugin.changePassword) === false) {
        debug('auth plugin does not implement changePassword, trying next one');
        continue;
      } else {
        debug('updating password for %o', username);
        plugin.changePassword!(username, password, newPassword, (err, profile): void => {
          if (err) {
            logger.error(
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

  public async invalidateToken(token: string) {
    // eslint-disable-next-line no-console
    console.log('invalidate token pending to implement', token);
    return Promise.resolve();
  }

  public authenticate(
    username: string,
    password: string,
    cb: (error: VerdaccioError | null, user?: RemoteUser) => void
  ): void {
    const plugins = this.plugins.slice(0);
    (function next(): void {
      const plugin = plugins.shift() as pluginUtils.Auth<Config>;

      if (isFunction(plugin.authenticate) === false) {
        return next();
      }

      debug('authenticating %o', username);
      plugin.authenticate(username, password, function (err: VerdaccioError | null, groups): void {
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

  public add_user(
    user: string,
    password: string,
    cb: (error: VerdaccioError | null, user?: RemoteUser) => void
  ): void {
    const self = this;
    const plugins = this.plugins.slice(0);
    debug('add user %o', user);

    (function next(): void {
      let method = 'adduser';
      const plugin = plugins.shift() as pluginUtils.Auth<Config>;
      // @ts-expect-error future major (7.x) should remove this section
      if (typeof plugin.adduser === 'undefined' && typeof plugin.add_user === 'function') {
        method = 'add_user';
        warningUtils.emit(warningUtils.Codes.VERWAR006);
      }
      // @ts-ignore
      if (typeof plugin[method] !== 'function') {
        next();
      } else {
        // TODO: replace by adduser whenever add_user deprecation method has been removed
        // @ts-ignore
        plugin[method](
          user,
          password,
          function (err: VerdaccioError | null, ok?: boolean | string): void {
            if (err) {
              debug('the user %o could not be added. Error: %o', user, err?.message);
              return cb(err);
            }
            if (ok) {
              debug('the user %o has been added', user);
              return self.authenticate(user, password, cb);
            }
            debug('user could not be added, skip to next auth plugin');
            next();
          }
        );
      }
    })();
  }

  /**
   * Allow user to access a package.
   */
  public allow_access(
    { packageName, packageVersion }: pluginUtils.AuthPluginPackage,
    user: RemoteUser,
    callback: pluginUtils.AccessCallback
  ): void {
    const plugins = this.plugins.slice(0);
    const pkgAllowAccess: AllowAccess = { name: packageName, version: packageVersion };
    const pkg = Object.assign(
      {},
      pkgAllowAccess,
      getMatchedPackagesSpec(packageName, this.config.packages)
    ) as AllowAccess & PackageAccess;
    debug('allow access for %o', packageName);

    (function next(): void {
      const plugin: pluginUtils.Auth<unknown> = plugins.shift() as pluginUtils.Auth<unknown>;

      if (_.isNil(plugin) || isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access!(user, pkg, function (err: VerdaccioError | null, ok?: boolean): void {
        if (err) {
          debug('forbidden access for %o. Error: %o', packageName, err?.message);
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
    { packageName, packageVersion }: pluginUtils.AuthPluginPackage,
    user: RemoteUser,
    callback: Callback
  ): void {
    const pkg = Object.assign(
      { name: packageName, version: packageVersion },
      getMatchedPackagesSpec(packageName, this.config.packages)
    );
    debug('allow unpublish for %o', packageName);

    for (const plugin of this.plugins) {
      if (typeof plugin?.allow_unpublish !== 'function') {
        debug('allow unpublish for %o plugin does not implement allow_unpublish', packageName);
        continue;
      } else {
        plugin.allow_unpublish(user, pkg, (err, ok): void => {
          if (err) {
            debug(
              'forbidden publish for %o, it will fallback on unpublish permissions',
              packageName
            );
            return callback(err);
          }

          if (_.isNil(ok) === true) {
            debug('bypass unpublish for %o, publish will handle the access', packageName);
            return this.allow_publish({ packageName, packageVersion }, user, callback);
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
    { packageName, packageVersion }: pluginUtils.AuthPluginPackage,
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

      if (typeof plugin?.allow_publish !== 'function') {
        debug('allow publish for %o plugin does not implement allow_publish', packageName);
        return next();
      }

      plugin.allow_publish(user, pkg, (err: VerdaccioError | null, ok?: boolean): void => {
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
      });
    })();
  }

  public apiJWTmiddleware(): any {
    debug('jwt middleware');
    const plugins = this.plugins.slice(0);
    const helpers = { createAnonymousRemoteUser, createRemoteUser };
    for (const plugin of plugins) {
      if (plugin.apiJWTmiddleware) {
        return plugin.apiJWTmiddleware(helpers);
      }
    }

    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction) => {
      req.pause();
      const next = function (err?: VerdaccioError): NextFunction {
        req.resume();
        // uncomment this to reject users with bad auth headers
        // return _next.apply(null, arguments)
        // swallow error, user remains unauthorized
        // set remoteUserError to indicate that user was attempting authentication
        if (err) {
          req.remote_user.error = err.message;
        }

        return _next() as unknown as NextFunction;
      };

      // FUTURE: disabled, not removed yet but seems unreacable code
      // if (this._isRemoteUserValid(req.remote_user)) {
      //   debug('jwt has a valid authentication header');
      //   return next();
      // }

      // in case auth header does not exist we return anonymous function
      const remoteUser = createAnonymousRemoteUser();
      req.remote_user = remoteUser;
      res.locals.remote_user = remoteUser;

      const { authorization } = req.headers;
      if (_.isNil(authorization)) {
        debug('jwt, authentication header is missing');
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        debug('api middleware authentication heather is invalid');
        return next(errorUtils.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
      }
      const { secret, security } = this.config;

      if (isAESLegacy(security)) {
        debug('api middleware using legacy auth token');
        this.handleAESMiddleware(req, security, secret, authorization, next);
      } else {
        debug('api middleware using JWT auth token');
        this.handleJWTAPIMiddleware(req, security, secret, authorization, next);
      }
    };
  }

  private handleJWTAPIMiddleware(
    req: $RequestExtend,
    security: Security,
    secret: string,
    authorization: string,
    next: any
  ): void {
    debug('handle JWT api middleware');
    const { scheme, token } = parseAuthTokenHeader(authorization);
    if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
      debug('handle basic token');
      // this should happen when client tries to login with an existing user
      const credentials = convertPayloadToBase64(token).toString();
      const { user, password } = parseBasicPayload(credentials) as AESPayload;
      debug('authenticating %o', user);
      this.authenticate(user, password, (err: VerdaccioError | null, user): void => {
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
        next(errorUtils.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
      }
    }
  }

  private handleAESMiddleware(
    req: $RequestExtend,
    security: Security,
    secret: string,
    authorization: string,
    next: Function
  ): void {
    debug('handle legacy api middleware');
    debug('api middleware has a secret? %o', typeof secret === 'string');
    debug('api middleware authorization %o', typeof authorization === 'string');
    const credentials: any = getMiddlewareCredentials(security, secret, authorization);
    debug('api middleware credentials %o', credentials?.name);
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
      return next(errorUtils.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
    }
  }

  private _isRemoteUserValid(remote_user?: RemoteUser): boolean {
    return _.isUndefined(remote_user) === false && _.isUndefined(remote_user?.name) === false;
  }

  /**
   * JWT middleware for WebUI
   */
  public webUIJWTmiddleware() {
    return (req: $RequestExtend, res: $ResponseExtend, _next: NextFunction): void => {
      if (this._isRemoteUserValid(req.remote_user)) {
        return _next();
      }

      req.pause();
      const next = (err: VerdaccioError | void): void => {
        req.resume();
        if (err) {
          req.remote_user.error = err.message;
          res.status(err.statusCode).send(err.message);
        }

        return _next();
      };

      const { authorization } = req.headers;
      if (_.isNil(authorization)) {
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        return next(errorUtils.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
      }

      const token = (authorization || '').replace(`${TOKEN_BEARER} `, '');
      if (!token) {
        return next();
      }

      let credentials: RemoteUser | undefined;
      try {
        credentials = verifyJWTPayload(token, this.config.secret);
      } catch (err: any) {
        // FIXME: intended behaviour, do we want it?
      }

      if (this._isRemoteUserValid(credentials)) {
        const { name, groups } = credentials as RemoteUser;
        req.remote_user = createRemoteUser(name as string, groups);
      } else {
        req.remote_user = createAnonymousRemoteUser();
      }

      next();
    };
  }

  public async jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): Promise<string> {
    const { real_groups, name, groups } = user;
    debug('jwt encrypt %o', name);
    const realGroupsValidated = _.isNil(real_groups) ? [] : real_groups;
    const groupedGroups = _.isNil(groups)
      ? real_groups
      : Array.from(new Set([...groups.concat(realGroupsValidated)]));
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
    if (this.secret.length === signatureUtils.TOKEN_VALID_LENGTH) {
      debug('signing with enhanced aes legacy');
      const token = aesEncrypt(value, this.secret);
      return token;
    } else {
      debug('signing with enhanced aes deprecated legacy');
      // deprecated aes (legacy) signature, only must be used for legacy version
      const token = aesEncryptDeprecated(Buffer.from(value), this.secret).toString('base64');
      return token;
    }
  }
}

export { Auth };
