"use strict";

function getVersionRangeType(versionRange) {
  return "^" === versionRange.charAt(0) ? "^" : "~" === versionRange.charAt(0) ? "~" : versionRange.startsWith(">=") ? ">=" : versionRange.startsWith("<=") ? "<=" : ">" === versionRange.charAt(0) ? ">" : "";
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = getVersionRangeType;
