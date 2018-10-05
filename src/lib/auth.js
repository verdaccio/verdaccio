/**
 * @prettier
 * @flow
 */

import _ from 'lodash';

import { API_ERROR, SUPPORT_ERRORS, TOKEN_BASIC, TOKEN_BEARER } from './constants';
import loadPlugin from '../lib/plugin-loader';
import { aesEncrypt, signPayload } from './crypto-utils';
import {
  getDefaultPlugins,
  getMiddlewareCredentials,
  verifyJWTPayload,
  createAnonymousRemoteUser,
  isAuthHeaderValid,
  getSecurity,
  isAESLegacy,
  parseAuthTokenHeader,
  parseBasicPayload,
  createRemoteUser,
} from './auth-utils';
import { convertPayloadToBase64, ErrorCode } from './utils';
import { getMatchedPackagesSpec } from './config-utils';

import type { Config, Logger, Callback, IPluginAuth, RemoteUser, JWTSignOptions, Security } from '@verdaccio/types';
import type { $Response, NextFunction } from 'express';
import type { $RequestExtend, IAuth } from '../../types';

const LoggerApi = require('./logger');

class Auth implements IAuth {
  config: Config;
  logger: Logger;
  secret: string;
  plugins: Array<any>;

  constructor(config: Config) {
    this.config = config;
    this.logger = LoggerApi.logger.child({ sub: 'auth' });
    this.secret = config.secret;
    this.plugins = this._loadPlugin(config);
    this._applyDefaultPlugins();
  }

  _loadPlugin(config: Config) {
    const pluginOptions = {
      config,
      logger: this.logger,
    };

    return loadPlugin(config, config.auth, pluginOptions, (plugin: IPluginAuth) => {
      const { authenticate, allow_access, allow_publish } = plugin;

      return authenticate || allow_access || allow_publish;
    });
  }

  _applyDefaultPlugins() {
    this.plugins.push(getDefaultPlugins());
  }

  changePassword(username: string, password: string, newPassword: string, cb: Callback) {
    const validPlugins = _.filter(this.plugins, plugin => _.isFunction(plugin.changePassword));

    if (_.isEmpty(validPlugins)) {
      return cb(ErrorCode.getInternalError(SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
    }

    for (const plugin of validPlugins) {
      this.logger.trace({ username }, 'updating password for @{username}');
      plugin.changePassword(username, password, newPassword, (err, profile) => {
        if (err) {
          this.logger.error(
            { username, err },
            `An error has been produced 
          updating the password for @{username}. Error: @{err.message}`
          );
          return cb(err);
        }

        this.logger.trace({ username }, 'updated password for @{username} was successful');
        return cb(null, profile);
      });
    }
  }

  authenticate(username: string, password: string, cb: Callback) {
    const plugins = this.plugins.slice(0);
    const self = this;
    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.authenticate) === false) {
        return next();
      }

      self.logger.trace({ username }, 'authenticating @{username}');
      plugin.authenticate(username, password, function(err, groups) {
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

  add_user(user: string, password: string, cb: Callback) {
    let self = this;
    let plugins = this.plugins.slice(0);
    this.logger.trace({ user }, 'add user @{user}');

    (function next() {
      let plugin = plugins.shift();
      let method = 'adduser';
      if (_.isFunction(plugin[method]) === false) {
        method = 'add_user';
      }
      if (_.isFunction(plugin[method]) === false) {
        next();
      } else {
        // p.add_user() execution
        plugin[method](user, password, function(err, ok) {
          if (err) {
            self.logger.trace({ user, err }, 'the user @{user} could not being added. Error: @{err}');
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
  allow_access(packageName: string, user: RemoteUser, callback: Callback) {
    let plugins = this.plugins.slice(0);
    // $FlowFixMe
    let pkg = Object.assign({ name: packageName }, getMatchedPackagesSpec(packageName, this.config.packages));
    const self = this;
    this.logger.trace({ packageName }, 'allow access for @{packageName}');

    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access(user, pkg, function(err, ok: boolean) {
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

  /**
   * Allow user to publish a package.
   */
  allow_publish(packageName: string, user: string, callback: Callback) {
    let plugins = this.plugins.slice(0);
    const self = this;
    // $FlowFixMe
    let pkg = Object.assign({ name: packageName }, getMatchedPackagesSpec(packageName, this.config.packages));
    this.logger.trace({ packageName }, 'allow publish for @{packageName}');

    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.allow_publish) === false) {
        return next();
      }

      plugin.allow_publish(user, pkg, (err, ok: boolean) => {
        if (err) {
          self.logger.trace({ packageName }, 'forbidden publish for @{packageName}');
          return callback(err);
        }

        if (ok) {
          self.logger.trace({ packageName }, 'allowed publish for @{packageName}');
          return callback(null, ok);
        }
        next(); // cb(null, false) causes next plugin to roll
      });
    })();
  }

  apiJWTmiddleware() {
    return (req: $RequestExtend, res: $Response, _next: NextFunction) => {
      req.pause();

      const next = function(err) {
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

  _handleJWTAPIMiddleware(req: $RequestExtend, security: Security, secret: string, authorization: string, next: Function) {
    const { scheme, token } = parseAuthTokenHeader(authorization);
    if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
      // this should happen when client tries to login with an existing user
      const credentials = convertPayloadToBase64(token).toString();
      const { user, password } = (parseBasicPayload(credentials): any);
      this.authenticate(user, password, (err, user) => {
        if (!err) {
          req.remote_user = user;
          next();
        } else {
          req.remote_user = createAnonymousRemoteUser();
          next(err);
        }
      });
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

  _handleAESMiddleware(req: $RequestExtend, security: Security, secret: string, authorization: string, next: Function) {
    const credentials: any = getMiddlewareCredentials(security, secret, authorization);
    if (credentials) {
      const { user, password } = credentials;
      this.authenticate(user, password, (err, user) => {
        if (!err) {
          req.remote_user = user;
          next();
        } else {
          req.remote_user = createAnonymousRemoteUser();
          next(err);
        }
      });
    } else {
      // we force npm client to ask again with basic authentication
      return next(ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER));
    }
  }

  _isRemoteUserMissing(remote_user: RemoteUser): boolean {
    return _.isUndefined(remote_user) === false && _.isUndefined(remote_user.name) === false;
  }

  /**
   * JWT middleware for WebUI
   */
  webUIJWTmiddleware() {
    return (req: $RequestExtend, res: $Response, _next: NextFunction) => {
      if (this._isRemoteUserMissing(req.remote_user)) {
        return _next();
      }

      req.pause();
      const next = err => {
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

  async jwtEncrypt(user: RemoteUser, signOptions: JWTSignOptions): string {
    const { real_groups } = user;
    const payload: RemoteUser = {
      ...user,
      group: real_groups && real_groups.length ? real_groups : undefined,
    };

    const token: string = await signPayload(payload, this.secret, signOptions);

    // $FlowFixMe
    return token;
  }

  /**
   * Encrypt a string.
   */
  aesEncrypt(buf: Buffer): Buffer {
    return aesEncrypt(buf, this.secret);
  }
}

export default Auth;
