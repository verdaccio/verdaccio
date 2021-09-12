import { Application } from 'express';
import { $ResponseExtend, $RequestExtend, $NextFunctionVer } from '../../types/custom';

export default (app: Application, configPath: string): void => {
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
        main: process.mainModule.filename,
        conf: configPath,
        mem: process.memoryUsage(),
        gc: global.gc,
      });
    }
  );
};
