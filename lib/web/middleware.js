/* eslint prefer-rest-params: "off" */

'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const createError = require('http-errors');
const utils = require('../utils');
const Logger = require('../logger');


module.exports.match = function match(regexp) {
  return function(req, res, next, value) {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
};

module.exports.securityIframe = function securityIframe(req, res, next) {
  // disable loading in frames (clickjacking, etc.)
  res.header('X-Frame-Options', 'deny');
  next();
};

module.exports.validate_name = function validate_name(req, res, next, value, name) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utils.validate_name(value)) {
    next();
  } else {
    next( createError[403]('invalid ' + name) );
  }
};

module.exports.validate_package = function validate_package(req, res, next, value, name) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utils.validate_package(value)) {
    next();
  } else {
    next( createError[403]('invalid ' + name) );
  }
};

module.exports.media = function media(expect) {
  return function(req, res, next) {
    if (req.headers['content-type'] !== expect) {
      next( createError[415]('wrong content-type, expect: ' + expect
        + ', got: '+req.headers['content-type']) );
    } else {
      next();
    }
  };
};

module.exports.encodeScopePackage = function(req, res, next) {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  next();
};

module.exports.expect_json = function expect_json(req, res, next) {
  if (!utils.is_object(req.body)) {
    return next( createError[400]('can\'t parse incoming json') );
  }
  next();
};

module.exports.anti_loop = function(config) {
  return function(req, res, next) {
    if (req.headers.via != null) {
      let arr = req.headers.via.split(',');

      for (let i=0; i<arr.length; i++) {
        let m = arr[i].match(/\s*(\S+)\s+(\S+)/);
        if (m && m[2] === config.server_id) {
          return next( createError[508]('loop detected') );
        }
      }
    }
    next();
  };
};

/**
 * Express doesn't do etags with requests <= 1024b
 * we use md5 here, it works well on 1k+ bytes, but sucks with fewer data
 * could improve performance using crc32 after benchmarks.
 * @param {Object} data
 * @return {String}
 */
function md5sum(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}


module.exports.allow = function(auth) {
  return function(action) {
    return function(req, res, next) {
      req.pause();
      auth['allow_' + action](req.params.package, req.remote_user, function(error, allowed) {
        req.resume();
        if (error) {
          next(error);
        } else if (allowed) {
          next();
        } else {
          // last plugin (that's our built-in one) returns either
          // cb(err) or cb(null, true), so this should never happen
          throw createError('bug in the auth plugin system');
        }
      });
    };
  };
};

module.exports.final = function(body, req, res, next) {
  if (res.statusCode === 401 && !res.getHeader('WWW-Authenticate')) {
    // they say it's required for 401, so...
    res.header('WWW-Authenticate', 'Basic, Bearer');
  }

  try {
    if (_.isString(body) || _.isObject(body)) {
      if (!res.getHeader('Content-type')) {
        res.header('Content-type', 'application/json');
      }

      if (typeof(body) === 'object' && _.isNil(body) === false) {
        if (typeof(body.error) === 'string') {
          res._verdaccio_error = body.error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (!res.statusCode || (res.statusCode >= 200 && res.statusCode < 300)) {
        res.header('ETag', '"' + md5sum(body) + '"');
      }
    } else {
      // send(null), send(204), etc.
    }
  } catch(err) {
    // if verdaccio sends headers first, and then calls res.send()
    // as an error handler, we can't report error properly,
    // and should just close socket
    if (err.message.match(/set headers after they are sent/)) {
      if (_.isNil(res.socket) === false) {
        res.socket.destroy();
      }
      return;
    } else {
      throw err;
    }
  }

  res.send(body);
};

module.exports.log = function(req, res, next) {
  // logger
  req.log = Logger.logger.child({sub: 'in'});

  let _auth = req.headers.authorization;
  if (_.isNil(_auth) === false) {
    req.headers.authorization = '<Classified>';
  }
  let _cookie = req.headers.cookie;
  if (_.isNil(_cookie) === false) {
    req.headers.cookie = '<Classified>';
  }

  req.url = req.originalUrl;
  req.log.info( {req: req, ip: req.ip}
    , '@{ip} requested \'@{req.method} @{req.url}\'' );
  req.originalUrl = req.url;

  if (_.isNil(_auth) === false) {
    req.headers.authorization = _auth;
  }

  if (_.isNil(_cookie) === false) {
    req.headers.cookie = _cookie;
  }

  let bytesin = 0;
  req.on('data', function(chunk) {
    bytesin += chunk.length;
  });

  let bytesout = 0;
  let _write = res.write;
  res.write = function(buf) {
    bytesout += buf.length;
    _write.apply(res, arguments);
  };

  const log = function() {
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
        url: req.url,
      },
      level: 35, // http
      user: req.remote_user && req.remote_user.name,
      remoteIP,
      status: res.statusCode,
      error: res._verdaccio_error,
      bytes: {
        in: bytesin,
        out: bytesout,
      },
    }, message);
    req.originalUrl = req.url;
  };

  req.on('close', function() {
    log(true);
  });

  const _end = res.end;
  res.end = function(buf) {
    if (buf) {
      bytesout += buf.length;
    }
    _end.apply(res, arguments);
    log();
  };
  next();
};
