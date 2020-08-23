"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var _ = __importStar(require("lodash"));
exports["default"] = ensureCase;
function ensureCase(raw, target) {
    if (raw === void 0) { raw = ''; }
    if (target === void 0) { target = 'lowercase'; }
    // We delete any content together with quotes because he can contains proper names (example `refactor: `Eslint` configuration`).
    // We need trim string because content with quotes can be at the beginning or end of a line
    var input = String(raw)
        .replace(/`.*?`|".*?"|'.*?'/g, '')
        .trim();
    var transformed = toCase(input, target);
    if (transformed === '' || transformed.match(/^\d/)) {
        return true;
    }
    return transformed === input;
}
function toCase(input, target) {
    switch (target) {
        case 'camel-case':
            return _.camelCase(input);
        case 'kebab-case':
            return _.kebabCase(input);
        case 'snake-case':
            return _.snakeCase(input);
        case 'pascal-case':
            return _.upperFirst(_.camelCase(input));
        case 'start-case':
            return _.startCase(input);
        case 'upper-case':
        case 'uppercase':
            return input.toUpperCase();
        case 'sentence-case':
        case 'sentencecase':
            return input.charAt(0).toUpperCase() + input.slice(1);
        case 'lower-case':
        case 'lowercase':
        case 'lowerCase': // Backwards compat config-angular v4
            return input.toLowerCase();
        default:
            throw new TypeError("ensure-case: Unknown target case \"" + target + "\"");
    }
}
//# sourceMappingURL=case.js.map