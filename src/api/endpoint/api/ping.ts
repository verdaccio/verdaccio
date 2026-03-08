import type { Router } from 'express';

import { PING_API_ENDPOINTS } from '@verdaccio/middleware';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';

export default function (route: Router): void {
  route.get(
    PING_API_ENDPOINTS.ping,
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next({});
    }
  );
}
