"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var semver = __importStar(require("semver"));
var isSemver = function (c) {
    var firstLine = c.split('\n').shift();
    if (typeof firstLine !== 'string') {
        return false;
    }
    var stripped = firstLine.replace(/^chore(\([^)]+\))?:/, '').trim();
    return semver.valid(stripped) !== null;
};
var test = function (r) { return r.test.bind(r); };
exports.wildcards = [
    test(/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m),
    test(/^(R|r)evert (.*)/),
    test(/^(fixup|squash)!/),
    isSemver,
    test(/^Merged (.*?)(in|into) (.*)/),
    test(/^Merge remote-tracking branch (.*)/),
    test(/^Automatic merge(.*)/),
    test(/^Auto-merged (.*?) into (.*)/)
];
//# sourceMappingURL=defaults.js.map