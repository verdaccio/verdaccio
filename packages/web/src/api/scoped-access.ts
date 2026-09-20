import type { Auth } from '@verdaccio/auth';
import { createAnonymousRemoteUser } from '@verdaccio/config';
import { errorUtils, reqUtils, validationUtils } from '@verdaccio/core';
import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '@verdaccio/middleware';
import type { Config, RemoteUser } from '@verdaccio/types';

import { addScope, hasLogin } from '../web-utils';

/**
 * Builds the package name from the route params; returns null for a malformed
 * `:scope` segment.
 */
type Param = string | string[] | undefined;

export function resolveScopedName(rawScope: Param, rawPackage: Param): string | null {
  const packageName = reqUtils.paramToString(rawPackage);
  const scope = reqUtils.paramToString(rawScope);
  if (!scope) {
    return packageName;
  }
  if (scope[0] !== '@') {
    return null;
  }
  const name = addScope(scope.slice(1), packageName);
  return validationUtils.validatePackage(name) && !name.includes('*') ? name : null;
}

/**
 * Validates the route params and checks access before the handlers run.
 */
export function scopedPackageAccess(auth: Auth, config: Config) {
  return function (req: $RequestExtend, _res: $ResponseExtend, next: $NextFunctionVer): void {
    const packageName = resolveScopedName(req.params.scope, req.params.package);
    if (packageName === null) {
      return next(errorUtils.getNotFound());
    }
    (req as $RequestExtend & { scopedPackageName?: string }).scopedPackageName = packageName;
    const remoteUser: RemoteUser = hasLogin(config) ? req.remote_user : createAnonymousRemoteUser();
    auth.allow_access({ packageName }, remoteUser, (err, allowed): void => {
      if (err) {
        return next(err);
      }
      if (allowed) {
        return next();
      }
      return next(errorUtils.getForbidden());
    });
  };
}
