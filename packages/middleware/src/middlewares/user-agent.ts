import { getUserAgent } from '@verdaccio/config';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function userAgent(config) {
  return function (_req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    res.setHeader('x-powered-by', getUserAgent(config?.user_agent));
    next();
  };
}
