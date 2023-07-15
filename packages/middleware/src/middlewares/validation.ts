import { NextFunction, Request, Response } from 'express';

import { errorUtils, validationUtils } from '@verdaccio/core';

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
