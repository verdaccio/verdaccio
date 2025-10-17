import _ from 'lodash';

import { HEADERS, constants } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export const log = (logger) => {
  return function log(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    // logger
    req.log = logger.child({ sub: 'in' });

    const _auth = req.headers.authorization;
    if (_.isNil(_auth) === false) {
      req.headers.authorization = '<Classified>';
    }

    const _cookie = req.get('cookie');
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

    // Track if the request completed normally
    let requestCompleted = false;
    let abortLogged = false;

    const getRequestContext = () => {
      const forwardedFor = req.get(HEADERS.FORWARDED_FOR);
      const remoteAddress = req.socket.remoteAddress;
      const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;

      req.url = req.originalUrl;
      return {
        request: {
          method: req.method,
          url: req.url,
        },
        user: req.remote_user?.name || null,
        remoteIP,
        bytes: {
          in: bytesin,
          out: bytesout,
        },
      };
    };

    const logCompletedRequest = function (): void {
      requestCompleted = true;

      req.log.http(
        {
          ...getRequestContext(),
          status: res.statusCode,
          error: res.locals._verdaccio_error,
        },
        res.locals._verdaccio_error ? constants.LOG_VERDACCIO_ERROR : constants.LOG_VERDACCIO_BYTES
      );
    };

    const _end = res.end;
    // @ts-ignore
    res.end = function (buf): void {
      if (buf) {
        bytesout += buf.length;
      }
      /* eslint prefer-rest-params: "off" */
      // @ts-ignore
      _end.apply(res, arguments);
      logCompletedRequest();
    };
    next();

    // Handle aborted requests
    const logAbortedRequest = () => {
      if (abortLogged || requestCompleted) return;
      abortLogged = true;

      req.log.warn(
        {
          ...getRequestContext(),
          status: constants.HTTP_STATUS.CLIENT_CLOSED_REQUEST,
        },
        constants.LOG_VERDACCIO_ABORT
      );
    };

    req.socket.on('close', () => {
      if (!requestCompleted) {
        logAbortedRequest();
      }
    });

    req.socket.on('error', () => {
      if (!requestCompleted) {
        logAbortedRequest();
      }
    });
  };
};
