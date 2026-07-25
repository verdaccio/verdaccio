import buildDebug from 'debug';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';

import type { Config } from '@verdaccio/types';
import { isURL } from '@verdaccio/url';

import { HTTP_STATUS } from '../lib/constants';
import type { $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:favicon');

export function serveFavicon(config: Config) {
  return function (_req: $RequestExtend, res: $ResponseExtend) {
    try {
      const logoConf: string = config?.web?.favicon as string;
      if (logoConf === '') {
        debug('favicon disabled');
        res.status(404);
      } else if (!_.isEmpty(logoConf)) {
        debug('custom favicon');
        if (
          isURL(logoConf, {
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
        // __dirname only exists in the CJS build; the ESM build resolves from import.meta.url
        const moduleDir =
          typeof __dirname === 'undefined'
            ? path.dirname(fileURLToPath(import.meta.url))
            : __dirname;
        fs.createReadStream(path.join(moduleDir, './web/html/favicon.ico')).pipe(res);
        debug('rendered ico');
      }
    } catch (err: any) {
      debug('error triggered, favicon not found %s', err?.message);
      res.status(HTTP_STATUS.NOT_FOUND).end();
    }
  };
}
