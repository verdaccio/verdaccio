import { errorUtils } from '@verdaccio/core';
import {
  validateName as utilValidateName,
  validatePackage as utilValidatePackage,
} from '@verdaccio/utils';

export function validateName(_req, _res, next, value: string, name: string) {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidateName(value)) {
    next();
  } else {
    next(errorUtils.getForbidden('invalid ' + name));
  }
}

export function validatePackage(_req, _res, next, value: string, name: string) {
  if (value === '-') {
    // special case in couchdb usually
    next('route');
  } else if (utilValidatePackage(value)) {
    next();
  } else {
    next(errorUtils.getForbidden('invalid ' + name));
  }
}
