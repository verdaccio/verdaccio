'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.parsePackage = parsePackage;
exports.stringifyPackage = stringifyPackage;

function stringifyPackage(pkg) {
  return JSON.stringify(pkg, null, '\t');
}

function parsePackage(pkg) {
  return JSON.parse(pkg);
}
//# sourceMappingURL=utils.js.map
