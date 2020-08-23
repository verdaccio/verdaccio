"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (app, selfPath) => {
  // Hook for tests only
  app.get('/-/_debug', function (req, res, next) {
    const doGarbabeCollector = _lodash.default.isNil(global.gc) === false;

    if (doGarbabeCollector) {
      global.gc();
    }

    next({
      pid: process.pid,
      // @ts-ignore
      main: process.mainModule.filename,
      conf: selfPath,
      mem: process.memoryUsage(),
      gc: doGarbabeCollector
    });
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZGVidWcvaW5kZXgudHMiXSwibmFtZXMiOlsiYXBwIiwic2VsZlBhdGgiLCJnZXQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZG9HYXJiYWJlQ29sbGVjdG9yIiwiXyIsImlzTmlsIiwiZ2xvYmFsIiwiZ2MiLCJwaWQiLCJwcm9jZXNzIiwibWFpbiIsIm1haW5Nb2R1bGUiLCJmaWxlbmFtZSIsImNvbmYiLCJtZW0iLCJtZW1vcnlVc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O2VBSWUsQ0FBQ0EsR0FBRCxFQUFtQkMsUUFBbkIsS0FBOEM7QUFDM0Q7QUFDQUQsRUFBQUEsR0FBRyxDQUFDRSxHQUFKLENBQVEsV0FBUixFQUFxQixVQUFTQyxHQUFULEVBQThCQyxHQUE5QixFQUFvREMsSUFBcEQsRUFBa0Y7QUFDckcsVUFBTUMsa0JBQWtCLEdBQUdDLGdCQUFFQyxLQUFGLENBQVFDLE1BQU0sQ0FBQ0MsRUFBZixNQUF1QixLQUFsRDs7QUFFQSxRQUFJSixrQkFBSixFQUF3QjtBQUN0QkcsTUFBQUEsTUFBTSxDQUFDQyxFQUFQO0FBQ0Q7O0FBRURMLElBQUFBLElBQUksQ0FBQztBQUNITSxNQUFBQSxHQUFHLEVBQUVDLE9BQU8sQ0FBQ0QsR0FEVjtBQUVIO0FBQ0FFLE1BQUFBLElBQUksRUFBRUQsT0FBTyxDQUFDRSxVQUFSLENBQW1CQyxRQUh0QjtBQUlIQyxNQUFBQSxJQUFJLEVBQUVmLFFBSkg7QUFLSGdCLE1BQUFBLEdBQUcsRUFBRUwsT0FBTyxDQUFDTSxXQUFSLEVBTEY7QUFNSFIsTUFBQUEsRUFBRSxFQUFFSjtBQU5ELEtBQUQsQ0FBSjtBQVFELEdBZkQ7QUFnQkQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgJFJlc3BvbnNlRXh0ZW5kLCAkUmVxdWVzdEV4dGVuZCwgJE5leHRGdW5jdGlvblZlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgKGFwcDogQXBwbGljYXRpb24sIHNlbGZQYXRoOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgLy8gSG9vayBmb3IgdGVzdHMgb25seVxuICBhcHAuZ2V0KCcvLS9fZGVidWcnLCBmdW5jdGlvbihyZXE6ICRSZXF1ZXN0RXh0ZW5kLCByZXM6ICRSZXNwb25zZUV4dGVuZCwgbmV4dDogJE5leHRGdW5jdGlvblZlcik6IHZvaWQge1xuICAgIGNvbnN0IGRvR2FyYmFiZUNvbGxlY3RvciA9IF8uaXNOaWwoZ2xvYmFsLmdjKSA9PT0gZmFsc2U7XG5cbiAgICBpZiAoZG9HYXJiYWJlQ29sbGVjdG9yKSB7XG4gICAgICBnbG9iYWwuZ2MoKTtcbiAgICB9XG5cbiAgICBuZXh0KHtcbiAgICAgIHBpZDogcHJvY2Vzcy5waWQsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBtYWluOiBwcm9jZXNzLm1haW5Nb2R1bGUuZmlsZW5hbWUsXG4gICAgICBjb25mOiBzZWxmUGF0aCxcbiAgICAgIG1lbTogcHJvY2Vzcy5tZW1vcnlVc2FnZSgpLFxuICAgICAgZ2M6IGRvR2FyYmFiZUNvbGxlY3RvcixcbiAgICB9KTtcbiAgfSk7XG59O1xuIl19