import type { NextFunction, Request, Response } from 'express';

import { errorUtils } from '@verdaccio/core';
import {
  validateName as validateNameBase,
  validatePackage as validatePackageBase,
} from '@verdaccio/utils';

export function isNameValid(name: string): boolean {
  return validateNameBase(name) && !name.includes('*');
}

export function isPackageValid(name: string): boolean {
  return validatePackageBase(name) && !name.includes('*');
}

export function validateName(
  _req: Request,
  _res: Response,
  next: NextFunction,
  value: string,
  name: string
): void {
  if (isNameValid(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}

export function validatePackage(
  _req: Request,
  _res: Response,
  next: NextFunction,
  value: string,
  name: string
): void {
  if (isPackageValid(value)) {
    next();
  } else {
    next(errorUtils.getBadRequest('invalid ' + name));
  }
}
