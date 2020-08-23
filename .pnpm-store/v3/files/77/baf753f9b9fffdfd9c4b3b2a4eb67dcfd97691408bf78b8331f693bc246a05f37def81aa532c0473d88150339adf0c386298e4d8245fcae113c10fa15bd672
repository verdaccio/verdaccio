"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var ExtendableError = _interopDefault(require("extendable-error"));

class GitError extends ExtendableError {
  constructor(code, message) {
    super(`${message}, exit code: ${code}`), this.code = code;
  }
}

class ValidationError extends ExtendableError {}

class ExitError extends ExtendableError {
  constructor(code) {
    super(`The process exited with code: ${code}`), this.code = code;
  }
}

class PreExitButNotInPreModeError extends ExtendableError {
  constructor() {
    super("pre mode cannot be exited when not in pre mode");
  }
}

class PreEnterButInPreModeError extends ExtendableError {
  constructor() {
    super("pre mode cannot be entered when in pre mode");
  }
}

class InternalError extends ExtendableError {
  constructor(message) {
    super(message);
  }
}

exports.ExitError = ExitError, exports.GitError = GitError, exports.InternalError = InternalError, 
exports.PreEnterButInPreModeError = PreEnterButInPreModeError, exports.PreExitButNotInPreModeError = PreExitButNotInPreModeError, 
exports.ValidationError = ValidationError;
