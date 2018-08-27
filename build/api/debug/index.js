'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (app, selfPath) => {
  // Hook for tests only
  app.get('/-/_debug', function (req, res, next) {
    const doGarbabeCollector = _lodash2.default.isNil(global.gc) === false;

    if (doGarbabeCollector) {
      global.gc();
    }

    next({
      pid: process.pid,
      main: process.mainModule.filename,
      conf: selfPath,
      mem: process.memoryUsage(),
      gc: doGarbabeCollector
    });
  });
};