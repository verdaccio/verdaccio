// @flow

import _ from 'lodash';

import {
  validateName as utilValidateName,
  validatePackage as utilValidatePackage,
  isObject,
  ErrorCode} from '../lib/utils';
import {API_ERROR, HEADER_TYPE, HEADERS, HTTP_STATUS, TOKEN_BASIC, TOKEN_BEARER} from '../lib/constants';
import {stringToMD5} from '../lib/crypto-utils';
import type {$ResponseExtend, $RequestExtend, $NextFunctionVer, IAuth} from '../../types';
import type {Config} from '@verdaccio/types';

const Logger = require('../lib/logger');

export function match(regexp: RegExp) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string) {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
}

export function securityIframe(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
  // disable loading in frames (clickjacking, etc.)
  res.header('X-Frame-Options', 'deny');
  next();
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validateName(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string, name: string) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidateName(value)) {
    next();
  } else {
    next( ErrorCode.getForbidden('invalid ' + name));
  }
}

// flow: express does not match properly
// flow info https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validatePackage(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer, value: string, name: string) {
  if (value.charAt(0) === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidatePackage(value)) {
    next();
  } else {
    next( ErrorCode.getForbidden('invalid ' + name) );
  }
}

export function media(expect: string) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (req.headers[HEADER_TYPE.CONTENT_TYPE] !== expect) {
      next( ErrorCode.getCode(HTTP_STATUS.UNSUPPORTED_MEDIA, 'wrong content-type, expect: ' + expect
        + ', got: '+req.headers[HEADER_TYPE.CONTENT_TYPE]) );
    } else {
      next();
    }
  };
}

export function encodeScopePackage(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  next();
}

export function expectJson(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
  if (!isObject(req.body)) {
    return next( ErrorCode.getBadRequest('can\'t parse incoming json') );
  }
  next();
}

export function anti_loop(config: Config) {
  return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (req.headers.via != null) {
      let arr = req.headers.via.split(',');

      for (let i=0; i<arr.length; i++) {
        const m = arr[i].match(/\s*(\S+)\s+(\S+)/);
        if (m && m[2] === config.server_id) {
          return next( ErrorCode.getCode(HTTP_STATUS.LOOP_DETECTED, 'loop detected') );
        }
      }
    }
    next();
  };
}

export function allow(auth: IAuth) {
  return function(action: string) {
    return function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      req.pause();
      let packageName = req.params.package;
      if (req.params.scope) {
        packageName = `@${req.params.scope}/${packageName}`;
      }
      // $FlowFixMe
      auth['allow_' + action](packageName, req.remote_user, function(error, allowed) {
        req.resume();
        if (error) {
          next(error);
        } else if (allowed) {
          next();
        } else {
          // last plugin (that's our built-in one) returns either
          // cb(err) or cb(null, true), so this should never happen
          throw ErrorCode.getInternalError(API_ERROR.PLUGIN_ERROR);
        }
      });
    };
  };
}

 export function final(body: any, req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
  if (res.statusCode === HTTP_STATUS.UNAUTHORIZED && !res.getHeader(HEADERS.WWW_AUTH)) {
    // they say it's required for 401, so...
    res.header(HEADERS.WWW_AUTH, `${TOKEN_BASIC}, ${TOKEN_BEARER}`);
  }

  try {
    if (_.isString(body) || _.isObject(body)) {
      if (!res.getHeader(HEADERS.CONTENT_TYPE)) {
        res.header(HEADERS.CONTENT_TYPE, HEADERS.JSON);
      }

      if (typeof(body) === 'object' && _.isNil(body) === false) {
        if (typeof(body.error) === 'string') {
          res._verdaccio_error = body.error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (!res.statusCode || (res.statusCode >= 200 && res.statusCode < 300)) {
        res.header(HEADERS.ETAG, '"' + stringToMD5(body) + '"');
      }
    } else {
      // send(null), send(204), etc.
    }
  } catch (err) {
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
}

export function log(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
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
    /* eslint prefer-rest-params: "off" */
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
      user: req.remote_user && req.remote_user.name || null,
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
    log();
  });

  const _end = res.end;
  res.end = function(buf) {
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
export function errorReportingMiddleware(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
  res.report_error = res.report_error || function(err) {
    if (err.status && err.status >= HTTP_STATUS.BAD_REQUEST && err.status < 600) {
      if (_.isNil(res.headersSent) === false) {
        res.status(err.status);
        next({error: err.message || API_ERROR.UNKNOWN_ERROR});
      }
    } else {
      Logger.logger.error( {err: err}, 'unexpected error: @{!err.message}\n@{err.stack}');
      if (!res.status || !res.send) {
        Logger.logger.error('this is an error in express.js, please report this');
        res.destroy();
      } else if (!res.headersSent) {
        res.status(HTTP_STATUS.INTERNAL_ERROR);
        next({error: API_ERROR.INTERNAL_SERVER_ERROR});
      } else {
        // socket should be already closed
      }
    }
  };

  next();
}
