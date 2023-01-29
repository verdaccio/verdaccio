import { errorUtils } from '@verdaccio/core';
import {
  validateName as utilValidateName,
  validatePackage as utilValidatePackage,
} from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function validateName(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer,
  value: string,
  name: string
): void {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidateName(value)) {
    next();
  } else {
    next(errorUtils.getForbidden('invalid ' + name));
  }
}

export function validatePackage(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer,
  value: string,
  name: string
): void {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidatePackage(value)) {
    next();
  } else {
    next(errorUtils.getForbidden('invalid ' + name));
  }
}
