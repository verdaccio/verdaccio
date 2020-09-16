import { Router } from 'express';
import { $RequestExtend, $ResponseExtend, $NextFunctionVer } from '../types/custom';

export default function (route: Router): void {
  route.get('/-/ping', function (
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ) {
    next({});
  });
}
