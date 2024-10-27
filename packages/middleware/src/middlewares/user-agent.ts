import { getUserAgent } from '@verdaccio/config';
import { HEADERS } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function userAgent(config) {
  return function (_req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    res.setHeader(HEADERS.POWERED_BY, getUserAgent(config?.user_agent));
    next();
  };
}
