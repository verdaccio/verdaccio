import { errorUtils, validationUtils } from '@verdaccio/core';

export function validateName(_req, _res, next, value: string, name: string) {
  if (validationUtils.validateName(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}

export function validatePackage(_req, _res, next, value: string, name: string) {
  if (validationUtils.validatePackage(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}
