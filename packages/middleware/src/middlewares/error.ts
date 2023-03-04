import buildDebug from 'debug';
import { HttpError } from 'http-errors';
import _ from 'lodash';

import { API_ERROR, HTTP_STATUS, VerdaccioError } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:error');

export const handleError = (logger) =>
  function handleError(
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
        errorReportingMiddleware(logger)(req, res, _.noop);
      }
      debug('set locals error report ref');
      res.locals.report_error(err);
    } else {
      // Fall to Middleware.final
      debug('no error to report, jump next layer');
      return next(err);
    }
  };

// Middleware
export const errorReportingMiddleware = (logger) =>
  function errorReportingMiddleware(
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
  };
