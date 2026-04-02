import buildDebug from 'debug';
import { isNil } from 'lodash-es';

import { HEADERS } from '@verdaccio/core';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:log');

function isStaticRequest(url: string): boolean {
  return url.startsWith('/-/static/');
}

// FIXME: deprecated, moved to @verdaccio/dev-commons
export const LOG_STATUS_MESSAGE =
  "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;

export type LogOptions = {
  // When true, static file requests (/-/static/*) are hidden from pino logs
  // and only visible via DEBUG=verdaccio:middleware:log. Defaults to true.
  hideStaticLogs?: boolean;
};

export const log = (logger, options: LogOptions = {}) => {
  const { hideStaticLogs = true } = options;

  return function log(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    // logger
    req.log = logger.child({ sub: 'in' });

    const _auth = req.headers.authorization;
    if (isNil(_auth) === false) {
      req.headers.authorization = '<Classified>';
    }

    const _cookie = req.get('cookie');
    if (isNil(_cookie) === false) {
      req.headers.cookie = '<Classified>';
    }

    req.url = req.originalUrl;
    const _skipLog = hideStaticLogs && isStaticRequest(req.url);
    if (_skipLog) {
      debug("@{ip} requested '@{req.method} @{req.url}'", { ip: req.ip, req });
    } else {
      req.log.info({ req: req, ip: req.ip }, "@{ip} requested '@{req.method} @{req.url}'");
    }
    req.originalUrl = req.url;

    if (isNil(_auth) === false) {
      req.headers.authorization = _auth;
    }

    if (isNil(_cookie) === false) {
      req.headers.cookie = _cookie;
    }

    let bytesin = 0;
    req.on('data', function (chunk): void {
      bytesin += chunk.length;
    });

    let bytesout = 0;
    const _write = res.write;
    // @ts-ignore
    res.write = function (...args): boolean {
      bytesout += args[0]?.length || 0;
      // @ts-ignore
      return _write.apply(res, args);
    };

    const log = function (): void {
      const forwardedFor = req.get(HEADERS.FORWARDED_FOR);
      const remoteAddress = req.socket.remoteAddress;
      const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
      let message;
      if (res.locals._verdaccio_error) {
        message = LOG_VERDACCIO_ERROR;
      } else {
        message = LOG_VERDACCIO_BYTES;
      }

      req.url = req.originalUrl;
      if (_skipLog) {
        debug(message, {
          request: { method: req.method, url: req.url },
          user: req.remote_user?.name || null,
          remoteIP,
          status: res.statusCode,
          error: res.locals._verdaccio_error,
          bytes: { in: bytesin, out: bytesout },
        });
      } else {
        req.log.http(
          {
            request: {
              method: req.method,
              url: req.url,
            },
            user: req.remote_user?.name || null,
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
      }
      req.originalUrl = req.url;
    };

    req.on('close', function (): void {
      log();
    });

    const _end = res.end;
    // @ts-ignore
    res.end = function (...args): void {
      if (args[0]) {
        bytesout += args[0].length;
      }
      // @ts-ignore
      _end.apply(res, args);
      log();
    };
    next();
  };
};
