import { errorUtils } from '@verdaccio/core';
import { isObject } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function expectJson(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  if (!isObject(req.body)) {
    return next(errorUtils.getBadRequest("can't parse incoming json"));
  }
  next();
}
