import { Router } from 'express';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';

export default function (route: Router): void {
  route.get(
    '/-/ping',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next({});
    }
  );
}
