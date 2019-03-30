/**
 * @prettier
 * @flow
 */

import type { Router } from 'express';
import type { $RequestExtend, $ResponseExtend, $NextFunctionVer } from '../../../../types';

export default function(route: Router) {
  route.get('/-/ping', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next({});
  });
}
