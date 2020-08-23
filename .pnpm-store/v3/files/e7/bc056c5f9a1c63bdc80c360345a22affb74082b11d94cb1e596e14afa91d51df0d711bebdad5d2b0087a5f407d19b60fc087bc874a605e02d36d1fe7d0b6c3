"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var chalk_1 = __importDefault(require("chalk"));
var DEFAULT_SIGNS = [' ', '⚠', '✖'];
var DEFAULT_COLORS = ['white', 'yellow', 'red'];
function format(report, options) {
    if (report === void 0) { report = {}; }
    if (options === void 0) { options = {}; }
    var _a = report.results, results = _a === void 0 ? [] : _a;
    var fi = function (result) {
        return formatInput(result, options);
    };
    var fr = function (result) { return formatResult(result, options); };
    return results
        .filter(function (r) { return Array.isArray(r.warnings) || Array.isArray(r.errors); })
        .map(function (result) { return __spreadArrays(fi(result), fr(result)); })
        .reduce(function (acc, item) { return (Array.isArray(item) ? __spreadArrays(acc, item) : __spreadArrays(acc, [item])); }, [])
        .join('\n');
}
exports.format = format;
function formatInput(result, options) {
    if (options === void 0) { options = {}; }
    var _a = options.color, enabled = _a === void 0 ? true : _a;
    var _b = result.errors, errors = _b === void 0 ? [] : _b, _c = result.warnings, warnings = _c === void 0 ? [] : _c, _d = result.input, input = _d === void 0 ? '' : _d;
    if (!input) {
        return [''];
    }
    var sign = '⧗';
    var decoration = enabled ? chalk_1["default"].gray(sign) : sign;
    var commitText = errors.length > 0 ? input : input.split('\n')[0];
    var decoratedInput = enabled ? chalk_1["default"].bold(commitText) : commitText;
    var hasProblems = errors.length > 0 || warnings.length > 0;
    return options.verbose || hasProblems
        ? [decoration + "   input: " + decoratedInput]
        : [];
}
function formatResult(result, options) {
    if (result === void 0) { result = {}; }
    if (options === void 0) { options = {}; }
    var _a = options.signs, signs = _a === void 0 ? DEFAULT_SIGNS : _a, _b = options.colors, colors = _b === void 0 ? DEFAULT_COLORS : _b, _c = options.color, enabled = _c === void 0 ? true : _c;
    var _d = result.errors, errors = _d === void 0 ? [] : _d, _e = result.warnings, warnings = _e === void 0 ? [] : _e;
    var problems = __spreadArrays(errors, warnings).map(function (problem) {
        var sign = signs[problem.level] || '';
        var color = colors[problem.level] || 'white';
        var decoration = enabled ? chalk_1["default"][color](sign) : sign;
        var name = enabled
            ? chalk_1["default"].grey("[" + problem.name + "]")
            : "[" + problem.name + "]";
        return decoration + "   " + problem.message + " " + name;
    });
    var sign = selectSign(result);
    var color = selectColor(result);
    var deco = enabled ? chalk_1["default"][color](sign) : sign;
    var el = errors.length;
    var wl = warnings.length;
    var hasProblems = problems.length > 0;
    var summary = options.verbose || hasProblems
        ? deco + "   found " + el + " problems, " + wl + " warnings"
        : undefined;
    var fmtSummary = enabled && typeof summary === 'string' ? chalk_1["default"].bold(summary) : summary;
    var help = hasProblems ? "\u24D8   Get help: " + options.helpUrl : undefined;
    return __spreadArrays(problems, [
        hasProblems ? '' : undefined,
        fmtSummary,
        help,
        help ? '' : undefined
    ]).filter(function (line) { return typeof line === 'string'; });
}
exports.formatResult = formatResult;
exports["default"] = format;
function selectSign(result) {
    if ((result.errors || []).length > 0) {
        return '✖';
    }
    return (result.warnings || []).length ? '⚠' : '✔';
}
function selectColor(result) {
    if ((result.errors || []).length > 0) {
        return 'red';
    }
    return (result.warnings || []).length ? 'yellow' : 'green';
}
//# sourceMappingURL=format.js.map