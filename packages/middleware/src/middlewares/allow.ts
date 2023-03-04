import { API_ERROR, errorUtils } from '@verdaccio/core';
import { getVersionFromTarball } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function allow<T>(
  auth: T,
  options = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeAll: (_a: any, _b: any) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterAll: (_a: any, _b: any) => {},
  }
): Function {
  const { beforeAll, afterAll } = options;
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
      beforeAll?.(
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
            afterAll?.(
              { action, user: remote?.name },
              `[middleware/allow][@{action}] allowed for @{user}`
            );
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
