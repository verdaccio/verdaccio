/* eslint prefer-spread: "off" */
/* eslint prefer-rest-params: "off" */

import {loadPlugin} from '../lib/plugin-loader';
const Crypto = require('crypto');
const Error = require('http-errors');
const Logger = require('./logger');
const pkgJson = require('../../package.json');
const jwt = require('jsonwebtoken');
/**
 * Handles the authentification, load auth plugins.
 */
class Auth {

  /**
   * @param {*} config config reference
   */
  constructor(config) {
    this.config = config;
    this.logger = Logger.logger.child({sub: 'auth'});
    this.secret = config.secret;

    const plugin_params = {
      config: config,
      logger: this.logger,
    };

    if (config.users_file) {
      if (!config.auth || !config.auth.htpasswd) {
        // b/w compat
        config.auth = config.auth || {};
        config.auth.htpasswd = {file: config.users_file};
      }
    }

    this.plugins = loadPlugin(config, config.auth, plugin_params, function(p) {
      return p.authenticate || p.allow_access || p.allow_publish;
    });

    this.plugins.unshift({
      verdaccio_version: pkgJson.version,

      authenticate: function(user, password, cb) {
        if (config.users != null
        && config.users[user] != null
        && (Crypto.createHash('sha1').update(password).digest('hex')
              === config.users[user].password)
        ) {
          return cb(null, [user]);
        }

        return cb();
      },

      adduser: function(user, password, cb) {
        if (config.users && config.users[user]) {
          return cb(Error[403]('this user already exists'));
        }

        return cb();
      },
    });

    const allow_action = function(action) {
      return function(user, pkg, cb) {
        let ok = pkg[action].reduce(function(prev, curr) {
          if (user.name === curr || user.groups.indexOf(curr) !== -1) return true;
          return prev;
        }, false);

        if (ok) return cb(null, true);

        if (user.name) {
          cb( Error[403]('user ' + user.name + ' is not allowed to ' + action + ' package ' + pkg.name) );
        } else {
          cb( Error[403]('unregistered users are not allowed to ' + action + ' package ' + pkg.name) );
        }
      };
    };

    this.plugins.push({
      authenticate: function(user, password, cb) {
        return cb( Error[403]('bad username/password, access denied') );
      },

      add_user: function(user, password, cb) {
        return cb( Error[409]('registration is disabled') );
      },

      allow_access: allow_action('access'),
      allow_publish: allow_action('publish'),
    });
  }

  /**
   * Authenticate an user.
   * @param {*} user
   * @param {*} password
   * @param {*} cb
   */
  authenticate(user, password, cb) {
    const plugins = this.plugins.slice(0)
    ;(function next() {
      let p = plugins.shift();

      if (typeof(p.authenticate) !== 'function') {
        return next();
      }

      p.authenticate(user, password, function(err, groups) {
        if (err) {
          return cb(err);
        }
        if (groups != null && groups != false) {
          return cb(err, authenticatedUser(user, groups));
        }
        next();
      });
    })();
  }

  /**
   * Add a new user.
   * @param {*} user
   * @param {*} password
   * @param {*} cb
   */
  add_user(user, password, cb) {
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
        p[n](user, password, function(err, ok) {
          if (err) return cb(err);
          if (ok) return self.authenticate(user, password, cb);
          next();
        });
      }
    })();
  }

  /**
   * Allow user to access a package.
   * @param {*} package_name
   * @param {*} user
   * @param {*} callback
   */
  allow_access(package_name, user, callback) {
    let plugins = this.plugins.slice(0);
    let pkg = Object.assign({name: package_name},
                                this.config.getMatchedPackagesSpec(package_name))

    ;(function next() {
      let p = plugins.shift();

      if (typeof(p.allow_access) !== 'function') {
        return next();
      }

      p.allow_access(user, pkg, function(err, ok) {
        if (err) return callback(err);
        if (ok) return callback(null, ok);
        next(); // cb(null, false) causes next plugin to roll
      });
    })();
  }

  /**
   * Allow user to publish a package.
   * @param {*} package_name
   * @param {*} user
   * @param {*} callback
   */
  allow_publish(package_name, user, callback) {
    let plugins = this.plugins.slice(0);
    let pkg = Object.assign({name: package_name},
                                this.config.getMatchedPackagesSpec(package_name))

    ;(function next() {
      let p = plugins.shift();

      if (typeof(p.allow_publish) !== 'function') {
        return next();
      }

      p.allow_publish(user, pkg, function(err, ok) {
        if (err) return callback(err);
        if (ok) return callback(null, ok);
        next(); // cb(null, false) causes next plugin to roll
      });
    })();
  }

  /**
   * Set up a basic middleware.
   * @return {Function}
   */
  basic_middleware() {
    let self = this;
    let credentials;
    return function(req, res, _next) {
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

      let authorization = req.headers.authorization;
      if (authorization == null) return next();

      let parts = authorization.split(' ');

      if (parts.length !== 2) {
        return next( Error[400]('bad authorization header') );
      }

      const scheme = parts[0];
      if (scheme === 'Basic') {
         credentials = new Buffer(parts[1], 'base64').toString();
      } else if (scheme === 'Bearer') {
         credentials = self.aes_decrypt(new Buffer(parts[1], 'base64')).toString('utf8');
        if (!credentials) {
          return next();
        }
      } else {
        return next();
      }

      const index = credentials.indexOf(':');
      if (index < 0) {
        return next();
      }

      const user = credentials.slice(0, index);
      const pass = credentials.slice(index + 1);

      self.authenticate(user, pass, function(err, user) {
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
   * Set up the bearer middleware.
   * @return {Function}
   */
  bearer_middleware() {
    let self = this;
    return function(req, res, _next) {
      req.pause();
      const next = function(_err) {
        req.resume();
        return _next.apply(null, arguments);
      };

      if (req.remote_user != null && req.remote_user.name !== undefined) {
        return next();
      }
      req.remote_user = buildAnonymousUser();

      let authorization = req.headers.authorization;
      if (authorization == null) {
        return next();
      }

      let parts = authorization.split(' ');

      if (parts.length !== 2) {
        return next( Error[400]('bad authorization header') );
      }

      let scheme = parts[0];
      let token = parts[1];

      if (scheme !== 'Bearer') {
        return next();
      }
      let user;
      try {
        user = self.decode_token(token);
      } catch(err) {
        return next(err);
      }

      req.remote_user = authenticatedUser(user.u, user.g);
      req.remote_user.token = token;
      next();
    };
  }

  /**
   * JWT middleware for WebUI
   * @return {Function}
   */
  jwtMiddleware() {
    return (req, res, _next) => {
      if (req.remote_user !== null && req.remote_user.name !== undefined) return _next();

      req.pause();
      const next = function(_err) {
        req.resume();
        return _next();
      };

      req.remote_user = buildAnonymousUser();

      let token = (req.headers.authorization || '').replace('Bearer ', '');
      if (!token) return next();

      let decoded;
      try {
        decoded = this.decode_token(token);
      } catch (err) {/**/}

      if (decoded) {
        req.remote_user = authenticatedUser(decoded.user, decoded.group);
      }

      next();
    };
  }

  /**
   * Generates the token.
   * @param {object} user
   * @param {string} expire_time
   * @return {string}
   */
  issue_token(user, expire_time) {
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
  decode_token(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (err) {
      throw Error[401](err.message);
    }

    return decoded;
  }

  /**
   * Encrypt a string.
   * @param {String} buf
   * @return {Buffer}
   */
  aes_encrypt(buf) {
    const c = Crypto.createCipher('aes192', this.secret);
    const b1 = c.update(buf);
    const b2 = c.final();
    return Buffer.concat([b1, b2]);
  }

  /**
    * Dencrypt a string.
   * @param {String} buf
   * @return {Buffer}
   */
  aes_decrypt(buf) {
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
    groups: ['$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'],
    real_groups: [],
  };
}

/**
 * Authenticate an user.
 * @param {*} name
 * @param {*} groups
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
function authenticatedUser(name, groups) {
  let _groups = (groups || []).concat(['$all', '$authenticated', '@all', '@authenticated', 'all']);
  return {
    name: name,
    groups: _groups,
    real_groups: groups,
  };
}

module.exports = Auth;
