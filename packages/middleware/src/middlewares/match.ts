import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export function match(regexp: RegExp): any {
  return function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer,
    value: string
  ): void {
    if (regexp.exec(value)) {
      next();
    } else {
      next('route');
    }
  };
}
