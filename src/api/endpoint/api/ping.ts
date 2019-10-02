/**
 * @prettier
 * @flow
 */

import { Router } from 'express';
import { $RequestExtend, $ResponseExtend, $NextFunctionVer } from '../../../../types';

export default function(route: Router): void {
  route.get('/-/ping', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next({});
  });
}
