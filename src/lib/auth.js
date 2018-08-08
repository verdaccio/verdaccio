// @flow

import _ from 'lodash';

import {API_ERROR, ROLES, TOKEN_BEARER} from './constants';
import loadPlugin from '../lib/plugin-loader';
import {aesEncrypt, signPayload} from './crypto-utils';
import {
  getDefaultPlugins, resolveTokenMiddleWare, verifyJWTPayload, buildAnonymousUser, isAuthHeaderValid,
} from './auth-utils';
import {ErrorCode} from './utils';
import {getMatchedPackagesSpec} from './config-utils';

import type {
Config, Logger, Callback, IPluginAuth, RemoteUser, JWTSignOptions,
} from '@verdaccio/types';
import type {$Response, NextFunction} from 'express';
import type {$RequestExtend, JWTPayload, IAuth} from '../../types';

const LoggerApi = require('./logger');

class Auth implements IAuth {
  config: Config;
  logger: Logger;
  secret: string;
  plugins: Array<any>;

  constructor(config: Config) {
    this.config = config;
    this.logger = LoggerApi.logger.child({sub: 'auth'});
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
      const {authenticate, allow_access, allow_publish} = plugin;

      return authenticate || allow_access || allow_publish;
    });
  }

  _applyDefaultPlugins() {
    this.plugins.push(getDefaultPlugins());
  }

  authenticate(user: string, password: string, cb: Callback) {
    const plugins = this.plugins.slice(0);
    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.authenticate) === false) {
        return next();
      }

      plugin.authenticate(user, password, function(err, groups) {
        if (err) {
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
            throw new TypeError('invalid type for function');
          }
          const isGroupValid: boolean = _.isArray(groups);
          if (!isGroupValid) {
            throw new TypeError(API_ERROR.BAD_FORMAT_USER_GROUP);
          }

          return cb(err, authenticatedUser(user, groups));
        }
        next();
      });
    })();
  }

  add_user(user: string, password: string, cb: Callback) {
    let self = this;
    let plugins = this.plugins.slice(0);

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
            return cb(err);
          }
          if (ok) {
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
    let pkg = Object.assign({name: packageName}, getMatchedPackagesSpec(packageName, this.config.packages));

    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access(user, pkg, function(err, ok: boolean) {
        if (err) {
          return callback(err);
        }

        if (ok) {
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
    // $FlowFixMe
    let pkg = Object.assign({name: packageName}, getMatchedPackagesSpec(packageName, this.config.packages));

    (function next() {
      const plugin = plugins.shift();

      if (_.isFunction(plugin.allow_publish) === false) {
        return next();
      }

      plugin.allow_publish(user, pkg, (err, ok: boolean) => {
        if (err) {
          return callback(err);
        }

        if (ok) {
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

      if (_.isUndefined(req.remote_user) === false
          && _.isUndefined(req.remote_user.name) === false) {
        return next();
      }
      req.remote_user = buildAnonymousUser();

      const authorization = req.headers.authorization;
      if (_.isNil(authorization)) {
        return next();
      }

      if (!isAuthHeaderValid(authorization)) {
        return next( ErrorCode.getBadRequest(API_ERROR.BAD_AUTH_HEADER) );
      }

      const credentials: JWTPayload = resolveTokenMiddleWare(this.config, authorization, next);
      this.authenticate(credentials.user, (credentials.password: any), function(err, user) {
        if (!err) {
          req.remote_user = user;
          next();
        } else {
          req.remote_user = buildAnonymousUser();
          next(err);
        }
      });
    };
  }

  /**
   * JWT middleware for WebUI
   */
  webUIJWTmiddleware() {
    return (req: $RequestExtend, res: $Response, _next: NextFunction) => {
      if (_.isNull(req.remote_user) === false && _.isNil(req.remote_user.name) === false) {
       return _next();
      }

      req.pause();
      const next = () => {
        req.resume();
        return _next();
      };

      const token = (req.headers.authorization || '').replace(`${TOKEN_BEARER} `, '');
      if (!token) {
        return next();
      }

      let credentials;
      try {
        credentials = verifyJWTPayload(token, this.secret);
      } catch (err) {
       // FIXME: intended behaviour, do we want it?
      }

      if (credentials) {
        req.remote_user = authenticatedUser(credentials.user, (credentials.group: any));
      } else {
        req.remote_user = buildAnonymousUser();
      }

      next();
    };
  }

  issueUIjwt(user: RemoteUser, signOptions: JWTSignOptions): string {
    const {name, real_groups} = user;
    const payload: JWTPayload = {
      user: name,
      group: real_groups && real_groups.length ? real_groups : undefined,
    };

    return signPayload(payload, this.secret, signOptions);
  }

  issuAPIjwt(name: string, password: string, signOptions: JWTSignOptions): string {
    const payload: JWTPayload = {
      user: name,
      password,
    };

    return signPayload(payload, this.secret, signOptions);
  }

  /**
   * Encrypt a string.
   */
  aesEncrypt(buf: Buffer): Buffer {
    return aesEncrypt(buf, this.secret);
  }
}

/**
 * Authenticate an user.
 * @return {Object} { name: xx, pluginGroups: [], real_groups: [] }
 */
function authenticatedUser(name: string, pluginGroups: Array<any>) {
  const isGroupValid: boolean = _.isArray(pluginGroups);
  const groups = (isGroupValid ? pluginGroups : []).concat([
      ROLES.$ALL,
      ROLES.$AUTH,
      ROLES.DEPRECATED_ALL,
      ROLES.DEPRECATED_AUTH,
      ROLES.ALL]);

  return {
    name,
    groups,
    real_groups: pluginGroups,
  };
}

export default Auth;
