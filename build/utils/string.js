"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spliceURL = spliceURL;
function spliceURL(...args) {
  return Array.from(args).reduce((lastResult, current) => lastResult + current).replace(/([^:])(\/)+(.)/g, `$1/$3`);
}