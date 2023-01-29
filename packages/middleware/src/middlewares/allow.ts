import { API_ERROR, errorUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { getVersionFromTarball } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function allow<T>(auth: T): Function {
  return function (action: string): Function {
    return function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      req.pause();
      const packageName = req.params.scope
        ? `@${req.params.scope}/${req.params.package}`
        : req.params.package;
      const packageVersion = req.params.filename
        ? getVersionFromTarball(req.params.filename)
        : undefined;
      const remote = req.remote_user;
      logger.trace(
        { action, user: remote?.name },
        `[middleware/allow][@{action}] allow for @{user}`
      );
      auth['allow_' + action](
        { packageName, packageVersion },
        remote,
        function (error, allowed): void {
          req.resume();
          if (error) {
            next(error);
          } else if (allowed) {
            next();
          } else {
            // last plugin (that's our built-in one) returns either
            // cb(err) or cb(null, true), so this should never happen
            throw errorUtils.getInternalError(API_ERROR.PLUGIN_ERROR);
          }
        }
      );
    };
  };
}
