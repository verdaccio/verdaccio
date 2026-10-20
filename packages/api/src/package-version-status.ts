import type { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { API_ERROR, HTTP_STATUS, errorUtils, reqUtils } from '@verdaccio/core';
import { PACKAGE_API_ENDPOINTS } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

export default function packageVersionStatus(router: Router, auth: Auth, storage: Storage): void {
  router.get(
    PACKAGE_API_ENDPOINTS.version_status,
    function (req: $RequestExtend, _res: $ResponseExtend, next: $NextFunctionVer): void {
      const packageName = reqUtils.paramToString(req.params.statusPackage);
      const version = reqUtils.paramToString(req.params.statusVersion);
      const user = req.remote_user;
      if (!user?.name) {
        return next(errorUtils.getUnauthorized(API_ERROR.MUST_BE_LOGGED));
      }
      auth.allow_publish(
        { packageName, packageVersion: version },
        user,
        async (error: any, allowed?: boolean) => {
          if (
            error &&
            ![HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN, HTTP_STATUS.NOT_FOUND].includes(
              error.status
            )
          ) {
            return next(error);
          }
          if (error || !allowed) {
            return next(errorUtils.getNotFound('no such package version'));
          }
          try {
            const status = await storage.getPackageVersionStatus(packageName, version);
            return next({ packageName, version, status });
          } catch (error) {
            return next(error);
          }
        }
      );
    }
  );
}
