// @flow

import {loadPlugin} from '../lib/plugin-loader';
import Crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {ErrorCode} from './utils';

import type {Config, Logger, Callback} from '@verdaccio/types';
import type {$Response, NextFunction} from 'express';
import type {$RequestExtend} from '../../types';

const LoggerApi = require('./logger');
/**
 * Handles the authentification, load auth plugins.
 */
class Auth {
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
    const plugin_params = {
      config,
      logger: this.logger,
    };

    return loadPlugin(config, config.auth, plugin_params, function(p) {
      return p.authenticate || p.allow_access || p.allow_publish;
    });
  }

  _applyDefaultPlugins() {
    const allow_action = function(action) {
      return function(user, pkg, cb) {
        const ok = pkg[action].reduce(function(prev, curr) {
          if (user.name === curr || user.groups.indexOf(curr) !== -1) return true;
          return prev;
        }, false);

        if (ok) {
          return cb(null, true);
        }

        if (user.name) {
          cb(ErrorCode.get403('user ' + user.name + ' is not allowed to ' + action + ' package ' + pkg.name));
        } else {
          cb(ErrorCode.get403('unregistered users are not allowed to ' + action + ' package ' + pkg.name));
        }
      };
    };

    this.plugins.push({
      authenticate: function(user, password, cb) {
        cb(ErrorCode.get403('bad username/password, access denied'));
      },

      add_user: function(user, password, cb) {
        return cb(ErrorCode.get409('bad username/password, access denied'));
      },

      allow_access: allow_action('access'),
      allow_publish: allow_action('publish'),
    });
  }

  authenticate(user: string, password: string, cb: Callback) {
    const plugins = this.plugins.slice(0)
    ;(function next() {
      const plugin = plugins.shift();

      if (typeof(plugin.authenticate) !== 'function') {
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
          if (typeof groups === 'string') {
            throw new TypeError('invalid type for function');
          }
          return cb(err, authenticatedUser(user, groups));
        }
        next();
      });
    })();
  }

  add_user(user: string, password: string, cb: Callback) {
    let self = this;
    let plugins = this.plugins.slice(0)

    ;(function next() {
      let p = plugins.shift();
      let n = 'adduser';
      if (typeof(p[n]) !== 'function') {
        n = 'add_user';
      }
      if (typeof(p[n]) !== 'function') {
        next();
      } else {
        // p.add_user() execution
        p[n](user, password, function(err, ok) {
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
  allow_access(packageName: string, user: string, callback: Callback) {
    let plugins = this.plugins.slice(0);
    // $FlowFixMe
    let pkg = Object.assign({name: packageName}, this.config.getMatchedPackagesSpec(packageName));

    (function next() {
      let p = plugins.shift();

      if (typeof(p.allow_access) !== 'function') {
        return next();
      }

      p.allow_access(user, pkg, function(err, ok) {

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
    let pkg = Object.assign({name: packageName}, this.config.getMatchedPackagesSpec(packageName));

    (function next() {
      const plugin = plugins.shift();

      if (typeof(plugin.allow_publish) !== 'function') {
        return next();
      }

      plugin.allow_publish(user, pkg, function(err, ok) {
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

      if (req.remote_user != null && req.remote_user.name !== undefined) {
        return next();
      }
      req.remote_user = buildAnonymousUser();

      const authorization = req.headers.authorization;
      if (authorization == null) {
        return next();
      }

      const parts = authorization.split(' ');
      if (parts.length !== 2) {
        return next( ErrorCode.get400('bad authorization header') );
      }

      const credentials = this._parseCredentials(parts);

      if (!credentials) {
        return next();
      }

      const index = credentials.indexOf(':');
      if (index < 0) {
        return next();
      }

      const user: string = credentials.slice(0, index);
      const pass: string = credentials.slice(index + 1);

      this.authenticate(user, pass, function(err, user) {
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

  _parseCredentials(parts: Array<string>) {
      let credentials;
      const scheme = parts[0];
      if (scheme.toUpperCase() === 'BASIC') {
         credentials = new Buffer(parts[1], 'base64').toString();
         this.logger.warn('basic authentication is deprecated, please use JWT instead');
         return credentials;
      } else if (scheme.toUpperCase() === 'BEARER') {
         credentials = this.aes_decrypt(new Buffer(parts[1], 'base64')).toString('utf8');
         return credentials;
      } else {
        return;
      }
  }

  /**
   * JWT middleware for WebUI
   */
  webUIJWTmiddleware() {
    return (req: $RequestExtend, res: $Response, _next: NextFunction) => {
      if (req.remote_user !== null && req.remote_user.name !== undefined) {
       return _next();
      }

      req.pause();
      const next = function(_err) {
        req.resume();
        return _next();
      };

      const token = (req.headers.authorization || '').replace('Bearer ', '');
      if (!token) {
        return next();
      }

      let decoded;
      try {
        decoded = this.decode_token(token);
      } catch (err) {
       // FIXME: intended behaviour, do we want it?
      }

      if (decoded) {
        req.remote_user = authenticatedUser(decoded.user, decoded.group);
      } else {
        req.remote_user = buildAnonymousUser();
      }

      next();
    };
  }

  issueUIjwt(user: any, expire_time: string) {
    return jwt.sign(
      {
        user: user.name,
        group: user.real_groups && user.real_groups.length ? user.real_groups : undefined,
      },
      this.secret,
      {
        notBefore: '1000', // Make sure the time will not rollback :)
        expiresIn: expire_time || '7d',
      }
    );
  }

  /**
   * Decodes the token.
   * @param {*} token
   * @return {Object}
   */
  decode_token(token: string) {
    let decoded;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (err) {
      throw ErrorCode.getCode(401, err.message);
    }

    return decoded;
  }

  /**
   * Encrypt a string.
   */
  aes_encrypt(buf: Buffer): Buffer {
    const c = Crypto.createCipher('aes192', this.secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  }

  /**
    * Dencrypt a string.
   */
  aes_decrypt(buf: Buffer ) {
    try {
      const c = Crypto.createDecipher('aes192', this.secret);
      const b1 = c.update(buf);
      const b2 = c.final();
      return Buffer.concat([b1, b2]);
    } catch(_) {
      return new Buffer(0);
    }
  }
}

/**
 * Builds an anonymous user in case none is logged in.
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
function buildAnonymousUser() {
  return {
    name: undefined,
    // groups without '$' are going to be deprecated eventually
    groups: ['$all', '$anonymous', '@all', '@anonymous'],
    real_groups: [],
  };
}

/**
 * Authenticate an user.
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
function authenticatedUser(name: string, groups: Array<any>) {
  let _groups = (groups || []).concat(['$all', '$authenticated', '@all', '@authenticated', 'all']);
  return {
    name: name,
    groups: _groups,
    real_groups: groups,
  };
}

export default Auth;
