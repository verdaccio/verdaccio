import { HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { Config } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

/**
 * A middleware that avoid a registry points itself as proxy and avoid create infinite loops.
 * @param config
 * @returns
 */
export function antiLoop(config: Config): Function {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req?.headers?.via != null) {
      const arr = req.get('via')?.split(',');
      if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
          // the "via" header must contains an specific headers, this has to be on sync
          // with the proxy request
          // match eg: Server 1 or Server 2
          // TODO: improve this RegEX
          const m = arr[i].trim().match(/\s*(\S+)\s+(\S+)/);
          if (m && m[2] === config.server_id) {
            return next(errorUtils.getCode(HTTP_STATUS.LOOP_DETECTED, 'loop detected'));
          }
        }
      }
    }
    next();
  };
}
