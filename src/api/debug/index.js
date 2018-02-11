import _ from 'lodash';

export default (app, selfPath) => {
    // Hook for tests only
    app.get('/-/_debug', function(req, res, next) {
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
