import _ from 'lodash';
import buildDebug from 'debug';

import {
  validateName as utilValidateName,
  validatePackage as utilValidatePackage,
  isObject,
  stringToMD5,
  ErrorCode,
} from '@verdaccio/utils';

import { NextFunction, Request, Response } from 'express';

import { Config, Package, RemoteUser, Logger } from '@verdaccio/types';
import { logger } from '@verdaccio/logger';
import { IAuth } from '@verdaccio/auth';
import {
  API_ERROR,
  HEADER_TYPE,
  HEADERS,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  VerdaccioError,
} from '@verdaccio/commons-api';
import { HttpError } from 'http-errors';
import { getVersionFromTarball } from './middleware-utils';

export type $RequestExtend = Request & { remote_user?: RemoteUser; log: Logger };
export type $ResponseExtend = Response & { cookies?: any };
export type $NextFunctionVer = NextFunction & any;

const debug = buildDebug('verdaccio:middleware');

export function match(regexp: RegExp): any {
  return function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer,
    value: string
  ): void {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
}

// TODO: remove, was relocated to web package
// @ts-deprecated
export function setSecurityWebHeaders(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  // disable loading in frames (clickjacking, etc.)
  res.header(HEADERS.FRAMES_OPTIONS, 'deny');
  // avoid stablish connections outside of domain
  res.header(HEADERS.CSP, "connect-src 'self'");
  // https://stackoverflow.com/questions/18337630/what-is-x-content-type-options-nosniff
  res.header(HEADERS.CTO, 'nosniff');
  // https://stackoverflow.com/questions/9090577/what-is-the-http-header-x-xss-protection
  res.header(HEADERS.XSS, '1; mode=block');
  next();
}

// flow: express does not match properly
// flow info
// https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validateName(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer,
  value: string,
  name: string
): void {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidateName(value)) {
    next();
  } else {
    next(ErrorCode.getForbidden('invalid ' + name));
  }
}

// flow: express does not match properly
// flow info
// https://github.com/flowtype/flow-typed/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+express
export function validatePackage(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer,
  value: string,
  name: string
): void {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidatePackage(value)) {
    next();
  } else {
    next(ErrorCode.getForbidden('invalid ' + name));
  }
}

export function media(expect: string | null): any {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req.headers[HEADER_TYPE.CONTENT_TYPE] !== expect) {
      next(
        ErrorCode.getCode(
          HTTP_STATUS.UNSUPPORTED_MEDIA,
          'wrong content-type, expect: ' +
            expect +
            ', got: ' +
            req.headers[HEADER_TYPE.CONTENT_TYPE]
        )
      );
    } else {
      next();
    }
  };
}

export function encodeScopePackage(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  next();
}

export function expectJson(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (!isObject(req.body)) {
    return next(ErrorCode.getBadRequest("can't parse incoming json"));
  }
  next();
}

export function antiLoop(config: Config): Function {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req.headers.via != null) {
      const arr = req.headers.via.split(',');

      for (let i = 0; i < arr.length; i++) {
        const m = arr[i].match(/\s*(\S+)\s+(\S+)/);
        if (m && m[2] === config.server_id) {
          return next(ErrorCode.getCode(HTTP_STATUS.LOOP_DETECTED, 'loop detected'));
        }
      }
    }
    next();
  };
}

export function allow(auth: IAuth): Function {
  return function (action: string): Function {
    return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      req.pause();
      const packageName = req.params.scope
        ? `@${req.params.scope}/${req.params.package}`
        : req.params.package;
      const packageVersion = req.params.filename
        ? getVersionFromTarball(req.params.filename)
        : undefined;
      const remote = req.remote_user;
      logger.trace(
        { action, user: remote?.name },
        `[middleware/allow][@{action}] allow for @{user}`
      );
      auth['allow_' + action](
        { packageName, packageVersion },
        remote,
        function (error, allowed): void {
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
        }
      );
    };
  };
}

export interface MiddlewareError {
  error: string;
}

export type FinalBody = Package | MiddlewareError | string;

export function final(
  body: FinalBody,
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (res.statusCode === HTTP_STATUS.UNAUTHORIZED && !res.getHeader(HEADERS.WWW_AUTH)) {
    // they say it's required for 401, so...
    res.header(HEADERS.WWW_AUTH, `${TOKEN_BASIC}, ${TOKEN_BEARER}`);
  }

  try {
    if (_.isString(body) || _.isObject(body)) {
      if (!res.getHeader(HEADERS.CONTENT_TYPE)) {
        res.header(HEADERS.CONTENT_TYPE, HEADERS.JSON);
      }

      if (typeof body === 'object' && _.isNil(body) === false) {
        if (typeof (body as MiddlewareError).error === 'string') {
          res.locals._verdaccio_error = (body as MiddlewareError).error;
          // res._verdaccio_error = (body as MiddlewareError).error;
        }
        body = JSON.stringify(body, undefined, '  ') + '\n';
      }

      // don't send etags with errors
      if (
        !res.statusCode ||
        (res.statusCode >= HTTP_STATUS.OK && res.statusCode < HTTP_STATUS.MULTIPLE_CHOICES)
      ) {
        res.header(HEADERS.ETAG, '"' + stringToMD5(body as string) + '"');
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
        res.socket?.destroy();
      }
      return;
    }
    throw err;
  }

  res.send(body);
}

// FIXME: deprecated, moved to @verdaccio/dev-commons
export const LOG_STATUS_MESSAGE =
  "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;

export function log(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
  // logger
  req.log = logger.child({ sub: 'in' });

  const _auth = req.headers.authorization;
  if (_.isNil(_auth) === false) {
    req.headers.authorization = '<Classified>';
  }

  const _cookie = req.headers.cookie;
  if (_.isNil(_cookie) === false) {
    req.headers.cookie = '<Classified>';
  }

  req.url = req.originalUrl;
  req.log.info({ req: req, ip: req.ip }, "@{ip} requested '@{req.method} @{req.url}'");
  req.originalUrl = req.url;

  if (_.isNil(_auth) === false) {
    req.headers.authorization = _auth;
  }

  if (_.isNil(_cookie) === false) {
    req.headers.cookie = _cookie;
  }

  let bytesin = 0;
  req.on('data', function (chunk): void {
    bytesin += chunk.length;
  });

  let bytesout = 0;
  const _write = res.write;
  // FIXME: res.write should return boolean
  // @ts-ignore
  res.write = function (buf): boolean {
    bytesout += buf.length;
    /* eslint prefer-rest-params: "off" */
    // @ts-ignore
    _write.apply(res, arguments);
  };

  const log = function (): void {
    const forwardedFor = req.headers['x-forwarded-for'];
    const remoteAddress = req.connection.remoteAddress;
    const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
    let message;
    if (res.locals._verdaccio_error) {
      message = LOG_VERDACCIO_ERROR;
    } else {
      message = LOG_VERDACCIO_BYTES;
    }

    req.url = req.originalUrl;
    req.log.warn(
      {
        request: {
          method: req.method,
          url: req.url,
        },
        level: 35, // http
        user: (req.remote_user && req.remote_user.name) || null,
        remoteIP,
        status: res.statusCode,
        error: res.locals._verdaccio_error,
        bytes: {
          in: bytesin,
          out: bytesout,
        },
      },
      message
    );
    req.originalUrl = req.url;
  };

  req.on('close', function (): void {
    log();
  });

  const _end = res.end;
  res.end = function (buf): void {
    if (buf) {
      bytesout += buf.length;
    }
    /* eslint prefer-rest-params: "off" */
    // @ts-ignore
    _end.apply(res, arguments);
    log();
  };
  next();
}

export function handleError(
  err: HttpError,
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
) {
  debug('error handler init');
  if (_.isError(err)) {
    debug('is native error');
    if (err.code === 'ECONNABORT' && res.statusCode === HTTP_STATUS.NOT_MODIFIED) {
      return next();
    }
    if (_.isFunction(res.locals.report_error) === false) {
      debug('is locals error report ref');
      // in case of very early error this middleware may not be loaded before error is generated
      // fixing that
      errorReportingMiddleware(req, res, _.noop);
    }
    debug('set locals error report ref');
    res.locals.report_error(err);
  } else {
    // Fall to Middleware.final
    debug('no error to report, jump next layer');
    return next(err);
  }
}

// Middleware
export function errorReportingMiddleware(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  debug('error report middleware');
  res.locals.report_error =
    res.locals.report_error ||
    function (err: VerdaccioError): void {
      if (err.status && err.status >= HTTP_STATUS.BAD_REQUEST && err.status < 600) {
        debug('is error > 409 %o', err?.status);
        if (_.isNil(res.headersSent) === false) {
          debug('send status %o', err?.status);
          res.status(err.status);
          debug('next layer %o', err?.message);
          next({ error: err.message || API_ERROR.UNKNOWN_ERROR });
        }
      } else {
        debug('is error < 409 %o', err?.status);
        logger.error({ err: err }, 'unexpected error: @{!err.message}\n@{err.stack}');
        if (!res.status || !res.send) {
          // TODO: decide which debug keep
          logger.error('this is an error in express.js, please report this');
          debug('this is an error in express.js, please report this, destroy response %o', err);
          res.destroy();
        } else if (!res.headersSent) {
          debug('report internal error %o', err);
          res.status(HTTP_STATUS.INTERNAL_ERROR);
          next({ error: API_ERROR.INTERNAL_SERVER_ERROR });
        } else {
          // socket should be already closed
          debug('this should not happen, otherwise report %o', err);
        }
      }
    };

  debug('error report middleware next()');
  next();
}
