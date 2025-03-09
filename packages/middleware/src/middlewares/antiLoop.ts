import { HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { Config } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

/**
 * A middleware that avoid a registry points itself as proxy and avoid create infinite loops.
 * @param config
 * @returns
 */
export function antiLoop(config: Config) {
  return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    if (req?.headers?.via != null) {
      const arr = req.get('via')?.split(',');
      if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
          // the "via" header must contain a specific value, this has to be in sync
          // with the proxy request
          // match eg: Server 1 or Server 2

          // RFC 7230: Via = 1*( "," OWS Via-value )
          //           Via-value = received-protocol RWS received-by [ RWS comment ]
          //           received-protocol = [ protocol-name "/" ] protocol-version
          //           received-by = ( uri-host [ ":" port ] ) / pseudonym

          // Split the trimmed header value into parts
          const parts = arr[i].trim().split(/\s+/);
          // Check if we have at least protocol/version and received-by parts
          if (parts.length >= 2) {
            // Get the received-by value (server id), removing any comment
            const serverId = parts[1].split('(')[0].trim();
            if (serverId === config.server_id) {
              return next(errorUtils.getCode(HTTP_STATUS.LOOP_DETECTED, 'loop detected'));
            }
          }
        }
      }
    }
    next();
  };
}
