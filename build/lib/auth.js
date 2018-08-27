'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constants = require('./constants');

var _pluginLoader = require('../lib/plugin-loader');

var _pluginLoader2 = _interopRequireDefault(_pluginLoader);

var _utils = require('./utils');

var _cryptoUtils = require('./crypto-utils');

var _authUtils = require('./auth-utils');

var _configUtils = require('./config-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LoggerApi = require('./logger');

class Auth {

  constructor(config) {
    this.config = config;
    this.logger = LoggerApi.logger.child({ sub: 'auth' });
    this.secret = config.secret;
    this.plugins = this._loadPlugin(config);
    this._applyDefaultPlugins();
  }

  _loadPlugin(config) {
    const pluginOptions = {
      config,
      logger: this.logger
    };

    return (0, _pluginLoader2.default)(config, config.auth, pluginOptions, plugin => {
      const { authenticate, allow_access, allow_publish } = plugin;

      return authenticate || allow_access || allow_publish;
    });
  }

  _applyDefaultPlugins() {
    this.plugins.push((0, _authUtils.getDefaultPlugins)());
  }

  authenticate(user, password, cb) {
    const plugins = this.plugins.slice(0);
    (function next() {
      const plugin = plugins.shift();

      if (_lodash2.default.isFunction(plugin.authenticate) === false) {
        return next();
      }

      plugin.authenticate(user, password, function (err, groups) {
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
          if (_lodash2.default.isString(groups)) {
            throw new TypeError('invalid type for function');
          }
          const isGroupValid = _lodash2.default.isArray(groups);
          if (!isGroupValid) {
            throw new TypeError(_constants.API_ERROR.BAD_FORMAT_USER_GROUP);
          }

          return cb(err, authenticatedUser(user, groups));
        }
        next();
      });
    })();
  }

  add_user(user, password, cb) {
    let self = this;
    let plugins = this.plugins.slice(0);

    (function next() {
      let plugin = plugins.shift();
      let method = 'adduser';
      if (_lodash2.default.isFunction(plugin[method]) === false) {
        method = 'add_user';
      }
      if (_lodash2.default.isFunction(plugin[method]) === false) {
        next();
      } else {
        // p.add_user() execution
        plugin[method](user, password, function (err, ok) {
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
  allow_access(packageName, user, callback) {
    let plugins = this.plugins.slice(0);
    // $FlowFixMe
    let pkg = Object.assign({ name: packageName }, (0, _configUtils.getMatchedPackagesSpec)(packageName, this.config.packages));

    (function next() {
      const plugin = plugins.shift();

      if (_lodash2.default.isFunction(plugin.allow_access) === false) {
        return next();
      }

      plugin.allow_access(user, pkg, function (err, ok) {
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
  allow_publish(packageName, user, callback) {
    let plugins = this.plugins.slice(0);
    // $FlowFixMe
    let pkg = Object.assign({ name: packageName }, (0, _configUtils.getMatchedPackagesSpec)(packageName, this.config.packages));

    (function next() {
      const plugin = plugins.shift();

      if (_lodash2.default.isFunction(plugin.allow_publish) === false) {
        return next();
      }

      plugin.allow_publish(user, pkg, (err, ok) => {
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
    return (req, res, _next) => {
      req.pause();

      const next = function (err) {
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

      if (_lodash2.default.isUndefined(req.remote_user) === false && _lodash2.default.isUndefined(req.remote_user.name) === false) {
        return next();
      }
      req.remote_user = buildAnonymousUser();

      const authorization = req.headers.authorization;
      if (_lodash2.default.isNil(authorization)) {
        return next();
      }

      const parts = authorization.split(' ');
      if (parts.length !== 2) {
        return next(_utils.ErrorCode.getBadRequest(_constants.API_ERROR.BAD_AUTH_HEADER));
      }

      const credentials = this._parseCredentials(parts);
      if (!credentials) {
        return next();
      }

      const index = credentials.indexOf(':');
      if (index < 0) {
        return next();
      }

      const user = credentials.slice(0, index);
      const pass = credentials.slice(index + 1);

      this.authenticate(user, pass, function (err, user) {
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

  _parseCredentials(parts) {
    let credentials;
    const scheme = parts[0];
    if (scheme.toUpperCase() === _constants.TOKEN_BASIC.toUpperCase()) {
      credentials = (0, _utils.buildBase64Buffer)(parts[1]).toString();
      this.logger.info(_constants.API_ERROR.DEPRECATED_BASIC_HEADER);
      return credentials;
    } else if (scheme.toUpperCase() === _constants.TOKEN_BEARER.toUpperCase()) {
      const token = (0, _utils.buildBase64Buffer)(parts[1]);

      credentials = (0, _cryptoUtils.aesDecrypt)(token, this.secret).toString('utf8');
      return credentials;
    } else {
      return;
    }
  }

  /**
   * JWT middleware for WebUI
   */
  webUIJWTmiddleware() {
    return (req, res, _next) => {
      if (_lodash2.default.isNull(req.remote_user) === false && _lodash2.default.isNil(req.remote_user.name) === false) {
        return _next();
      }

      req.pause();
      const next = () => {
        req.resume();
        return _next();
      };

      const token = (req.headers.authorization || '').replace(`${_constants.TOKEN_BEARER} `, '');
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

  issueUIjwt(user, expiresIn) {
    const { name, real_groups } = user;
    const payload = {
      user: name,
      group: real_groups && real_groups.length ? real_groups : undefined
    };

    return (0, _cryptoUtils.signPayload)(payload, this.secret, { expiresIn: expiresIn || Auth.DEFAULT_EXPIRE_WEB_TOKEN });
  }

  /**
   * Decodes the token.
   * @param {*} token
   * @return {Object}
   */
  decode_token(token) {
    let decoded;
    try {
      decoded = (0, _cryptoUtils.verifyPayload)(token, this.secret);
    } catch (err) {
      throw _utils.ErrorCode.getCode(_constants.HTTP_STATUS.UNAUTHORIZED, err.message);
    }

    return decoded;
  }

  /**
   * Encrypt a string.
   */
  aesEncrypt(buf) {
    return (0, _cryptoUtils.aesEncrypt)(buf, this.secret);
  }
}

/**
 * Builds an anonymous user in case none is logged in.
 * @return {Object} { name: xx, groups: [], real_groups: [] }
 */
Auth.DEFAULT_EXPIRE_WEB_TOKEN = '7d';
function buildAnonymousUser() {
  return {
    name: undefined,
    // groups without '$' are going to be deprecated eventually
    groups: [_constants.ROLES.$ALL, _constants.ROLES.$ANONYMOUS, _constants.ROLES.DEPRECATED_ALL, _constants.ROLES.DEPRECATED_ANONUMOUS],
    real_groups: []
  };
}

/**
 * Authenticate an user.
 * @return {Object} { name: xx, pluginGroups: [], real_groups: [] }
 */
function authenticatedUser(name, pluginGroups) {
  const isGroupValid = _lodash2.default.isArray(pluginGroups);
  const groups = (isGroupValid ? pluginGroups : []).concat([_constants.ROLES.$ALL, _constants.ROLES.$AUTH, _constants.ROLES.DEPRECATED_ALL, _constants.ROLES.DEPRECATED_AUTH, _constants.ROLES.ALL]);

  return {
    name,
    groups,
    real_groups: pluginGroups
  };
}

exports.default = Auth;