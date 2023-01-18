import { Router } from 'express';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';

export default function (route: Router): void {
  route.get(
    '/-/ping',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next({});
    }
  );
}
