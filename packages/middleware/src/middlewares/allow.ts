import buildDebug from 'debug';

import { API_ERROR, errorUtils } from '@verdaccio/core';
import { getVersionFromTarball } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:allow');

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
        : req.params.version
          ? req.params.version
          : undefined;
      const remote = req.remote_user;
      debug(
        'check if user %o can %o package %o version %o',
        remote?.name,
        action,
        packageName,
        packageVersion
      );
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
            debug('user is NOT allowed to %o', action);
            next(error);
          } else if (allowed) {
            debug('user is allowed to %o', action);
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
