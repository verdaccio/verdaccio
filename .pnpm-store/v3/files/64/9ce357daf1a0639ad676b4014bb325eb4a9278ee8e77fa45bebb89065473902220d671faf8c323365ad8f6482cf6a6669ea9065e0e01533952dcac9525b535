"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Defaults = __importStar(require("./defaults"));
function isIgnored(commit, opts) {
    if (commit === void 0) { commit = ''; }
    if (opts === void 0) { opts = {}; }
    var ignores = typeof opts.ignores === 'undefined' ? [] : opts.ignores;
    if (!Array.isArray(ignores)) {
        throw new Error("ignores must be of type array, received " + ignores + " of type " + typeof ignores);
    }
    var invalids = ignores.filter(function (c) { return typeof c !== 'function'; });
    if (invalids.length > 0) {
        throw new Error("ignores must be array of type function, received items of type: " + invalids
            .map(function (i) { return typeof i; })
            .join(', '));
    }
    var base = opts.defaults === false ? [] : Defaults.wildcards;
    return __spreadArrays(base, ignores).some(function (w) { return w(commit); });
}
exports["default"] = isIgnored;
//# sourceMappingURL=is-ignored.js.map