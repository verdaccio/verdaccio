/**
 * @prettier
 * @flow
 */

import { $RequestExtend, $ResponseExtend, $NextFunctionVer } from '../../../../types';
import { Router } from 'express';

export default function (route: Router): void {
  route.get('/-/ping', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next({});
  });
}
