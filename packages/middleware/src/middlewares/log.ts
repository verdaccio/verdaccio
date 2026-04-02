import buildDebug from 'debug';
import { isNil } from 'lodash-es';

import { HEADERS, constants } from '@verdaccio/core';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:log');

function isStaticRequest(url: string): boolean {
  return url.startsWith('/-/static/');
}

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
    res.write = function (...args): boolean {
      bytesout += args[0]?.length || 0;
      // @ts-ignore
      return _write.apply(res, args);
    };

    // Track if the request completed normally
    let requestCompleted = false;
    let abortLogged = false;

    const getRequestContext = () => {
      const forwardedFor = req.get(HEADERS.FORWARDED_FOR);
      const remoteAddress = req.socket.remoteAddress;
      const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
      return {
        request: {
          method: req.method,
          url: req.originalUrl,
        },
        user: req.remote_user?.name || null,
        remoteIP,
        status: res.statusCode,
        error: res.locals._verdaccio_error,
        bytes: {
          in: bytesin,
          out: bytesout,
        },
      };
    };

    const logAbortedRequest = () => {
      if (abortLogged || requestCompleted) return;
      abortLogged = true;

      req.log.info(
        {
          ...getRequestContext(),
          status: constants.HTTP_STATUS.CLIENT_CLOSED_REQUEST,
        },
        constants.LOG_VERDACCIO_ABORT
      );
    };

    const cleanupSocketListeners = () => {
      req.socket.removeListener('close', onClose);
      req.socket.removeListener('error', onError);
    };

    const onClose = () => {
      if (!requestCompleted) {
        logAbortedRequest();
      }
      cleanupSocketListeners();
    };

    const onError = () => {
      if (!requestCompleted) {
        logAbortedRequest();
      }
      cleanupSocketListeners();
    };

    const logCompletedRequest = () => {
      requestCompleted = true;

      const message = res.locals._verdaccio_error
        ? constants.LOG_VERDACCIO_ERROR
        : constants.LOG_VERDACCIO_BYTES;

      if (_skipLog) {
        debug(message, getRequestContext());
      } else {
        req.url = req.originalUrl;
        req.log.http(getRequestContext(), message);
        req.originalUrl = req.url;
      }

      cleanupSocketListeners();
    };

    const _end = res.end;
    // @ts-ignore
    res.end = function (...args): void {
      if (args[0]) {
        bytesout += args[0].length;
      }
      // @ts-ignore
      _end.apply(res, args);
      logCompletedRequest();
    };

    req.socket.on('close', onClose);
    req.socket.on('error', onError);

    next();
  };
};
