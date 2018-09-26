/**
 * @prettier
 */

// @flow

import _ from 'lodash';
import type {$Application} from 'express';
import type {$ResponseExtend, $RequestExtend, $NextFunctionVer} from '../../../types';

export default (app: $Application, selfPath: string) => {
  // Hook for tests only
  app.get('/-/_debug', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const doGarbabeCollector = _.isNil(global.gc) === false;

    if (doGarbabeCollector) {
      global.gc();
    }

    next({
      pid: process.pid,
      main: process.mainModule.filename,
      conf: selfPath,
      mem: process.memoryUsage(),
      gc: doGarbabeCollector,
    });
  });
};
