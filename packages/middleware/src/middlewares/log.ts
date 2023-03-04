import _ from 'lodash';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

// FIXME: deprecated, moved to @verdaccio/dev-commons
export const LOG_STATUS_MESSAGE =
  "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}'";
export const LOG_VERDACCIO_ERROR = `${LOG_STATUS_MESSAGE}, error: @{!error}`;
export const LOG_VERDACCIO_BYTES = `${LOG_STATUS_MESSAGE}, bytes: @{bytes.in}/@{bytes.out}`;

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

    const log = function (): void {
      const forwardedFor = req.get('x-forwarded-for');
      const remoteAddress = req.connection.remoteAddress;
      const remoteIP = forwardedFor ? `${forwardedFor} via ${remoteAddress}` : remoteAddress;
      let message;
      if (res.locals._verdaccio_error) {
        message = LOG_VERDACCIO_ERROR;
      } else {
        message = LOG_VERDACCIO_BYTES;
      }

      req.url = req.originalUrl;
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
      req.originalUrl = req.url;
    };

    req.on('close', function (): void {
      log();
    });

    const _end = res.end;
    // @ts-ignore
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
  };
};
