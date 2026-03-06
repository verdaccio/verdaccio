import { errorUtils, validationUtils } from '@verdaccio/core';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function expectJson(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (!validationUtils.isObject(req.body)) {
    return next(errorUtils.getBadRequest("can't parse incoming json"));
  }
  next();
}
