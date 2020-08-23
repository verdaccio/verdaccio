"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockFile = void 0;

var _utils = require("./utils");

/**
 * locks a file by creating a lock file
 * @param name
 * @param callback
 */
const lockFile = function (name, callback) {
  Promise.resolve().then(() => {
    return (0, _utils.statDir)(name);
  }).then(() => {
    return (0, _utils.statfile)(name);
  }).then(() => {
    return (0, _utils.lockfile)(name);
  }).then(() => {
    callback(null);
  }).catch(err => {
    callback(err);
  });
};

exports.lockFile = lockFile;