import { Application } from 'express';

import { Config as IConfig } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../types/custom';

export default (app: Application, config: IConfig): void => {
  // Hook for tests only
  app.get(
    '/-/_debug',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      if (global.gc) {
        global.gc();
      }

      next({
        pid: process.pid,
        // @ts-ignore
        main: process.main,
        config,
        mem: process.memoryUsage(),
        gc: global.gc,
      });
    }
  );
};
