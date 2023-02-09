import buildDebug from 'debug';
import fs from 'fs';
import { HttpError } from 'http-errors';
import _ from 'lodash';
import path from 'path';
import validator from 'validator';

import { Config, Package } from '@verdaccio/types';

import { API_ERROR, HTTP_STATUS } from '../lib/constants';
import { logger } from '../lib/logger';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio');

export function serveFavicon(config: Config) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    try {
      // @ts-ignore
      const logoConf: string = config?.web?.favicon as string;
      if (logoConf === '') {
        debug('favicon disabled');
        res.status(404);
      } else if (!_.isEmpty(logoConf)) {
        debug('custom favicon');
        if (
          validator.isURL(logoConf, {
            require_host: true,
            require_valid_protocol: true,
          })
        ) {
          debug('redirect to %o', logoConf);
          res.redirect(logoConf);
          return;
        } else {
          const faviconPath = path.normalize(logoConf);
          debug('serving favicon from %o', faviconPath);
          fs.access(faviconPath, fs.constants.R_OK, (err) => {
            if (err) {
              debug('no read permissions to read: %o, reason:', logoConf, err?.message);
              return res.status(HTTP_STATUS.NOT_FOUND).end();
            } else {
              res.setHeader('content-type', 'image/x-icon');
              fs.createReadStream(faviconPath).pipe(res);
              debug('rendered custom ico');
            }
          });
        }
      } else {
        res.setHeader('content-type', 'image/x-icon');
        fs.createReadStream(path.posix.join(__dirname, './web/html/favicon.ico')).pipe(res);
        debug('rendered ico');
      }
    } catch (err) {
      debug('error triggered, favicon not found');
      res.status(HTTP_STATUS.NOT_FOUND).end();
    }
  };
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

export interface MiddlewareError {
  error: string;
}

export type FinalBody = Package | MiddlewareError | string;

// Middleware
export function errorReportingMiddleware(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  res.locals.report_error =
    res.locals.report_error ||
    function (err: any): void {
      if (err.status && err.status >= HTTP_STATUS.BAD_REQUEST && err.status < 600) {
        if (!res.headersSent) {
          res.status(err.status);
          next({ error: err.message || API_ERROR.UNKNOWN_ERROR });
        }
      } else {
        logger.error({ err: err }, 'unexpected error: @{!err.message}\n@{err.stack}');
        if (!res.status || !res.send) {
          logger.error('this is an error in express.js, please report this');
          res.destroy();
        } else if (!res.headersSent) {
          res.status(HTTP_STATUS.INTERNAL_ERROR);
          next({ error: API_ERROR.INTERNAL_SERVER_ERROR });
        } else {
          // socket should be already closed
        }
      }
    };

  next();
}
