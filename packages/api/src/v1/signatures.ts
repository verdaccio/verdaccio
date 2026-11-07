import type { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { API_ERROR, errorUtils, pkgUtils, reqUtils } from '@verdaccio/core';
import { SIGNATURE_API_ENDPOINTS, allow } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Logger } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../types/custom';

// `:spec` is `name@version`; the access rules read them as separate params
function splitSpec(req: $RequestExtend, _res: $ResponseExtend, next: $NextFunctionVer): void {
  const parsed = pkgUtils.parsePackageSpec(reqUtils.paramToString(req.params.spec));
  if (!parsed) {
    // the spec is not echoed back: it is attacker-controlled input
    return next(errorUtils.getBadRequest(API_ERROR.INVALID_PACKAGE_SPEC));
  }
  req.params.package = parsed.name;
  req.params.version = parsed.version;
  next();
}

export default function (route: Router, auth: Auth, storage: Storage, logger: Logger): void {
  const can = allow(auth, {
    beforeAll: (a, b) => logger.trace(a, b),
    afterAll: (a, b) => logger.trace(a, b),
  });

  route.get(
    SIGNATURE_API_ENDPOINTS.keys,
    async function (_req: $RequestExtend, _res: $ResponseExtend, next: $NextFunctionVer) {
      try {
        const keys = await storage.getRegistryKeys();
        next(keys ? { keys } : errorUtils.getNotFound(API_ERROR.FILE_NOT_FOUND));
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    SIGNATURE_API_ENDPOINTS.attestations,
    splitSpec,
    can('access'),
    async function (req: $RequestExtend, _res: $ResponseExtend, next: $NextFunctionVer) {
      const name = reqUtils.paramToString(req.params.package);
      const version = reqUtils.paramToString(req.params.version);
      try {
        const attestations = await storage.getAttestations(name, version);
        next(attestations ?? errorUtils.getNotFound(API_ERROR.VERSION_NOT_EXIST));
      } catch (err) {
        next(err);
      }
    }
  );
}
