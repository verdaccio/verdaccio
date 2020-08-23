"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLevel = calculateLevel;
exports.subsystems = exports.levels = void 0;

var _kleur = require("kleur");

// level to color
const levels = {
  fatal: _kleur.red,
  error: _kleur.red,
  warn: _kleur.yellow,
  http: _kleur.magenta,
  info: _kleur.cyan,
  debug: _kleur.green,
  trace: _kleur.white
};
/**
 * Match the level based on buyan severity scale
 * @param {*} x severity level
 * @return {String} security level
 */

exports.levels = levels;

function calculateLevel(x) {
  switch (true) {
    case x < 15:
      return 'trace';

    case x < 25:
      return 'debug';

    case x < 35:
      return 'info';

    case x == 35:
      return 'http';

    case x < 45:
      return 'warn';

    case x < 55:
      return 'error';

    default:
      return 'fatal';
  }
}

const subsystems = [{
  in: (0, _kleur.green)('<--'),
  out: (0, _kleur.yellow)('-->'),
  fs: (0, _kleur.black)('-=-'),
  default: (0, _kleur.blue)('---')
}, {
  in: '<--',
  out: '-->',
  fs: '-=-',
  default: '---'
}];
exports.subsystems = subsystems;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbG9nZ2VyL2xldmVscy50cyJdLCJuYW1lcyI6WyJsZXZlbHMiLCJmYXRhbCIsInJlZCIsImVycm9yIiwid2FybiIsInllbGxvdyIsImh0dHAiLCJtYWdlbnRhIiwiaW5mbyIsImN5YW4iLCJkZWJ1ZyIsImdyZWVuIiwidHJhY2UiLCJ3aGl0ZSIsImNhbGN1bGF0ZUxldmVsIiwieCIsInN1YnN5c3RlbXMiLCJpbiIsIm91dCIsImZzIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNPLE1BQU1BLE1BQU0sR0FBRztBQUNsQkMsRUFBQUEsS0FBSyxFQUFFQyxVQURXO0FBRWxCQyxFQUFBQSxLQUFLLEVBQUVELFVBRlc7QUFHbEJFLEVBQUFBLElBQUksRUFBRUMsYUFIWTtBQUlsQkMsRUFBQUEsSUFBSSxFQUFFQyxjQUpZO0FBS2xCQyxFQUFBQSxJQUFJLEVBQUVDLFdBTFk7QUFNbEJDLEVBQUFBLEtBQUssRUFBRUMsWUFOVztBQU9sQkMsRUFBQUEsS0FBSyxFQUFFQztBQVBXLENBQWY7QUFVUDs7Ozs7Ozs7QUFLTyxTQUFTQyxjQUFULENBQXdCQyxDQUF4QixFQUEyQjtBQUM5QixVQUFRLElBQVI7QUFDSSxTQUFLQSxDQUFDLEdBQUcsRUFBVDtBQUNJLGFBQU8sT0FBUDs7QUFDSixTQUFLQSxDQUFDLEdBQUcsRUFBVDtBQUNJLGFBQU8sT0FBUDs7QUFDSixTQUFLQSxDQUFDLEdBQUcsRUFBVDtBQUNJLGFBQU8sTUFBUDs7QUFDSixTQUFLQSxDQUFDLElBQUksRUFBVjtBQUNJLGFBQU8sTUFBUDs7QUFDSixTQUFLQSxDQUFDLEdBQUcsRUFBVDtBQUNJLGFBQU8sTUFBUDs7QUFDSixTQUFLQSxDQUFDLEdBQUcsRUFBVDtBQUNJLGFBQU8sT0FBUDs7QUFDSjtBQUNJLGFBQU8sT0FBUDtBQWRSO0FBZ0JIOztBQUVNLE1BQU1DLFVBQVUsR0FBRyxDQUN0QjtBQUNJQyxFQUFBQSxFQUFFLEVBQUUsa0JBQU0sS0FBTixDQURSO0FBRUlDLEVBQUFBLEdBQUcsRUFBRSxtQkFBTyxLQUFQLENBRlQ7QUFHSUMsRUFBQUEsRUFBRSxFQUFFLGtCQUFNLEtBQU4sQ0FIUjtBQUlJQyxFQUFBQSxPQUFPLEVBQUUsaUJBQUssS0FBTDtBQUpiLENBRHNCLEVBT3RCO0FBQ0lILEVBQUFBLEVBQUUsRUFBRSxLQURSO0FBRUlDLEVBQUFBLEdBQUcsRUFBRSxLQUZUO0FBR0lDLEVBQUFBLEVBQUUsRUFBRSxLQUhSO0FBSUlDLEVBQUFBLE9BQU8sRUFBRTtBQUpiLENBUHNCLENBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeWVsbG93LCBncmVlbiwgYmxhY2ssIGJsdWUsIHJlZCwgbWFnZW50YSwgY3lhbiwgd2hpdGUgfSBmcm9tICdrbGV1cic7XG5cbi8vIGxldmVsIHRvIGNvbG9yXG5leHBvcnQgY29uc3QgbGV2ZWxzID0ge1xuICAgIGZhdGFsOiByZWQsXG4gICAgZXJyb3I6IHJlZCxcbiAgICB3YXJuOiB5ZWxsb3csXG4gICAgaHR0cDogbWFnZW50YSxcbiAgICBpbmZvOiBjeWFuLFxuICAgIGRlYnVnOiBncmVlbixcbiAgICB0cmFjZTogd2hpdGUsXG59O1xuXG4vKipcbiAqIE1hdGNoIHRoZSBsZXZlbCBiYXNlZCBvbiBidXlhbiBzZXZlcml0eSBzY2FsZVxuICogQHBhcmFtIHsqfSB4IHNldmVyaXR5IGxldmVsXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHNlY3VyaXR5IGxldmVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVMZXZlbCh4KSB7XG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgIGNhc2UgeCA8IDE1OlxuICAgICAgICAgICAgcmV0dXJuICd0cmFjZSc7XG4gICAgICAgIGNhc2UgeCA8IDI1OlxuICAgICAgICAgICAgcmV0dXJuICdkZWJ1Zyc7XG4gICAgICAgIGNhc2UgeCA8IDM1OlxuICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgY2FzZSB4ID09IDM1OlxuICAgICAgICAgICAgcmV0dXJuICdodHRwJztcbiAgICAgICAgY2FzZSB4IDwgNDU6XG4gICAgICAgICAgICByZXR1cm4gJ3dhcm4nO1xuICAgICAgICBjYXNlIHggPCA1NTpcbiAgICAgICAgICAgIHJldHVybiAnZXJyb3InO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdmYXRhbCc7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3Qgc3Vic3lzdGVtcyA9IFtcbiAgICB7XG4gICAgICAgIGluOiBncmVlbignPC0tJyksXG4gICAgICAgIG91dDogeWVsbG93KCctLT4nKSxcbiAgICAgICAgZnM6IGJsYWNrKCctPS0nKSxcbiAgICAgICAgZGVmYXVsdDogYmx1ZSgnLS0tJyksXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGluOiAnPC0tJyxcbiAgICAgICAgb3V0OiAnLS0+JyxcbiAgICAgICAgZnM6ICctPS0nLFxuICAgICAgICBkZWZhdWx0OiAnLS0tJyxcbiAgICB9LFxuXTtcbiJdfQ==