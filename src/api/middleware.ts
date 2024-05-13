import buildDebug from 'debug';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import validator from 'validator';

import { Config, Manifest } from '@verdaccio/types';

import { HTTP_STATUS } from '../lib/constants';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:favicon');

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

export interface MiddlewareError {
  error: string;
}

export type FinalBody = Manifest | MiddlewareError | string;
