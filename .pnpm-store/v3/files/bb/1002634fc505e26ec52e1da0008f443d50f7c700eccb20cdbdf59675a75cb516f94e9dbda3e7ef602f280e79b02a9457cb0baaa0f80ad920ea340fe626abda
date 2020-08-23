"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlockFile = unlockFile;

var _lockfile = _interopRequireDefault(require("lockfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// unlocks file by removing existing lock file
function unlockFile(name, next) {
  const lockFileName = `${name}.lock`;

  _lockfile.default.unlock(lockFileName, function () {
    return next(null);
  });
}