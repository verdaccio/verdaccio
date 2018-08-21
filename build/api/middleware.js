'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = match;
exports.securityIframe = securityIframe;
exports.validateName = validateName;
exports.validatePackage = validatePackage;
exports.media = media;
exports.encodeScopePackage = encodeScopePackage;
exports.expectJson = expectJson;
exports.anti_loop = anti_loop;
exports.allow = allow;
exports.final = final;
exports.log = log;
exports.errorReportingMiddleware = errorReportingMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../lib/utils');

var _constants = require('../lib/constants');

var _cryptoUtils = require('../lib/crypto-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Logger = require('../lib/logger');

function match(regexp) {
  return function (req, res, next, value) {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
}

function securityIframe(req, res, next) {
  // disable loading in frames (clickjacking, etc.)
  res.header('X-Frame-Options', 'deny');
  next();
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
function validateName(req, res, next, value, name) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if ((0, _utils.validateName)(value)) {
    next();
  } else {
    next(_utils.ErrorCode.getForbidden('invalid ' + name));
  }
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
function validatePackage(req, res, next, value, name) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if ((0, _utils.validate_package)(value)) {
    next();
  } else {
    next(_utils.ErrorCode.getForbidden('invalid ' + name));
  }
}

function media(expect) {
  return function (req, res, next) {
    if (req.headers[_constants.HEADER_TYPE.CONTENT_TYPE] !== expect) {
      next(_utils.ErrorCode.getCode(_constants.HTTP_STATUS.UNSUPORTED_MEDIA, 'wrong content-type, expect: ' + expect + ', got: ' + req.headers[_constants.HEADER_TYPE.CONTENT_TYPE]));
    } else {
      next();
    }
  };
}

function encodeScopePackage(req, res, next) {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  next();
}

function expectJson(req, res, next) {
  if (!(0, _utils.isObject)(req.body)) {
    return next(_utils.ErrorCode.getBadRequest('can\'t parse incoming json'));
  }
  next();
}

function anti_loop(config) {
  return function (req, res, next) {
    if (req.headers.via != null) {
      let arr = req.headers.via.split(',');

      for (let i = 0; i < arr.length; i++) {
        const m = arr[i].match(/\s*(\S+)\s+(\S+)/);
        if (m && m[2] === config.server_id) {
          return next(_utils.ErrorCode.getCode(_constants.HTTP_STATUS.LOOP_DETECTED, 'loop detected'));
        }
      }
    }
    next();
  };
}

function allow(auth) {
  return function (action) {
    return function (req, res, next) {
      req.pause();
      let packageName = req.params.package;
      if (req.params.scope) {
        packageName = `@${req.params.scope}/${packageName}`;
      }
      // $FlowFixMe
      auth['allow_' + action](packageName, req.remote_user, function (error, allowed) {
        req.resume();
        if (error) {
          next(error);
        } else if (allowed) {
          next();
        } else {
          // last plugin (that's our built-in one) returns either
          // cb(err) or cb(null, true), so this should never happen
          throw _utils.ErrorCode.getInternalError('bug in the auth plugin system');
        }
      });
    };
  };
}

function final(body, req, res, next) {
  if (res.statusCode === _constants.HTTP_STATUS.UNAUTHORIZED && !res.getHeader('WWW-Authenticate')) {
    // they say it's required for 401, so...
    res.header('WWW-Authenticate', `${_constants.TOKEN_BASIC}, ${_constants.TOKEN_BEARER}`);
  }

  try {
    if (_lodash2.default.isString(body) || _lodash2.default.isObject(body)) {
      if (!res.getHeader('Content-type')) {
        res.header('Content-type', _constants.HEADERS.JSON);
      }

      if (typeof body === 'object' && _lodash2.default.isNil(body) === false) {
        if (typeof body.error === 'string') {
          res._verdaccio_error = body.error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (!res.statusCode || res.statusCode >= 200 && res.statusCode < 300) {
        res.header('ETag', '"' + (0, _cryptoUtils.stringToMD5)(body) + '"');
      }
    } else {
      // send(null), send(204), etc.
    }
  } catch (err) {
    // if verdaccio sends headers first, and then calls res.send()
    // as an error handler, we can't report error properly,
    // and should just close socket
    if (err.message.match(/set headers after they are sent/)) {
      if (_lodash2.default.isNil(res.socket) === false) {
        res.socket.destroy();
      }
      return;
    } else {
      throw err;
    }
  }

  res.send(body);
}

function log(req, res, next) {
  // logger
  req.log = Logger.logger.child({ sub: 'in' });

  let _auth = req.headers.authorization;
  if (_lodash2.default.isNil(_auth) === false) {
    req.headers.authorization = '<Classified>';
  }

  let _cookie = req.headers.cookie;
  if (_lodash2.default.isNil(_cookie) === false) {
    req.headers.cookie = '<Classified>';
  }

  req.url = req.originalUrl;
  req.log.info({ req: req, ip: req.ip }, '@{ip} requested \'@{req.method} @{req.url}\'');
  req.originalUrl = req.url;

  if (_lodash2.default.isNil(_auth) === false) {
    req.headers.authorization = _auth;
  }

  if (_lodash2.default.isNil(_cookie) === false) {
    req.headers.cookie = _cookie;
  }

  let bytesin = 0;
  req.on('data', function (chunk) {
    bytesin += chunk.length;
  });

  let bytesout = 0;
  let _write = res.write;
  res.write = function (buf) {
    bytesout += buf.length;
    /* eslint prefer-rest-params: "off" */
    _write.apply(res, arguments);
  };

  const log = function () {
    let forwardedFor = req.headers['x-forwarded-for'];
    let remoteAddress = req.connection.remoteAddress;
    let remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
    let message = '@{status}, user: @{user}(@{remoteIP}), req: \'@{request.method} @{request.url}\'';
    if (res._verdaccio_error) {
      message += ', error: @{!error}';
    } else {
      message += ', bytes: @{bytes.in}/@{bytes.out}';
    }

    req.url = req.originalUrl;
    req.log.warn({
      request: {
        method: req.method,
        url: req.url
      },
      level: 35, // http
      user: req.remote_user && req.remote_user.name,
      remoteIP,
      status: res.statusCode,
      error: res._verdaccio_error,
      bytes: {
        in: bytesin,
        out: bytesout
      }
    }, message);
    req.originalUrl = req.url;
  };

  req.on('close', function () {
    log();
  });

  const _end = res.end;
  res.end = function (buf) {
    if (buf) {
      bytesout += buf.length;
    }
    /* eslint prefer-rest-params: "off" */
    _end.apply(res, arguments);
    log();
  };
  next();
}

// Middleware
function errorReportingMiddleware(req, res, next) {
  res.report_error = res.report_error || function (err) {
    if (err.status && err.status >= _constants.HTTP_STATUS.BAD_REQUEST && err.status < 600) {
      if (_lodash2.default.isNil(res.headersSent) === false) {
        res.status(err.status);
        next({ error: err.message || _constants.API_ERROR.UNKNOWN_ERROR });
      }
    } else {
      Logger.logger.error({ err: err }, 'unexpected error: @{!err.message}\n@{err.stack}');
      if (!res.status || !res.send) {
        Logger.logger.error('this is an error in express.js, please report this');
        res.destroy();
      } else if (!res.headersSent) {
        res.status(_constants.HTTP_STATUS.INTERNAL_ERROR);
        next({ error: _constants.API_ERROR.INTERNAL_SERVER_ERROR });
      } else {
        // socket should be already closed
      }
    }
  };

  next();
}