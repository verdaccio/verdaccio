import type { NextFunction, Request, Response } from 'express';

import { errorUtils, reqUtils, validationUtils } from '@verdaccio/core';

export function validateName(
  _req: Request,
  _res: Response,
  next: NextFunction,
  value: string,
  name: string
) {
  if (validationUtils.validateName(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}

export function validatePackage(
  _req: Request,
  _res,
  next: NextFunction,
  value: string,
  name: string
) {
  if (validationUtils.validatePackage(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}

/** Run on the status route before authentication, as required by the npm contract. */
export function validatePackageVersionStatus(req: Request, _res: Response, next: NextFunction) {
  const packageName = reqUtils.paramToString(req.params.statusPackage);
  const version = reqUtils.paramToString(req.params.statusVersion);
  if (!validationUtils.validatePackage(packageName)) {
    return next(errorUtils.getBadRequest('invalid package name'));
  }
  if (!validationUtils.validateExactVersion(version)) {
    return next(errorUtils.getBadRequest('version must be an exact semantic version'));
  }
  return next();
}
