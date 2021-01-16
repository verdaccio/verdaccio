import _ from 'lodash';
import { Application } from 'express';
import { $ResponseExtend, $RequestExtend, $NextFunctionVer } from '../../types/custom';

export default (app: Application, configPath: string): void => {
  // Hook for tests only
  app.get(
    '/-/_debug',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const doGarbabeCollector = _.isNil(global.gc) === false;

      if (doGarbabeCollector) {
        global.gc();
      }

      next({
        pid: process.pid,
        // @ts-ignore
        main: process.mainModule.filename,
        conf: configPath,
        mem: process.memoryUsage(),
        gc: doGarbabeCollector,
      });
    }
  );
};
