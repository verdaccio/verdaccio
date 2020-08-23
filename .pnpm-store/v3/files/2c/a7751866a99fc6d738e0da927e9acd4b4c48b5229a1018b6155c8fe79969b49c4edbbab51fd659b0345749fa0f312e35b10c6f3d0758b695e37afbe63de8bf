"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = exports.parse = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const analyze_scope_1 = require("./analyze-scope");
function validateBoolean(value, fallback = false) {
    if (typeof value !== 'boolean') {
        return fallback;
    }
    return value;
}
function parse(code, options) {
    return parseForESLint(code, options).ast;
}
exports.parse = parse;
function parseForESLint(code, options) {
    if (!options || typeof options !== 'object') {
        options = {};
    }
    // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
    // if sourceType is not provided by default eslint expect that it will be set to "script"
    if (options.sourceType !== 'module' && options.sourceType !== 'script') {
        options.sourceType = 'script';
    }
    if (typeof options.ecmaFeatures !== 'object') {
        options.ecmaFeatures = {};
    }
    const parserOptions = {};
    Object.assign(parserOptions, options, {
        useJSXTextNode: validateBoolean(options.useJSXTextNode, true),
        jsx: validateBoolean(options.ecmaFeatures.jsx),
    });
    if (typeof options.filePath === 'string') {
        const tsx = options.filePath.endsWith('.tsx');
        if (tsx || options.filePath.endsWith('.ts')) {
            parserOptions.jsx = tsx;
        }
    }
    /**
     * Allow the user to suppress the warning from typescript-estree if they are using an unsupported
     * version of TypeScript
     */
    const warnOnUnsupportedTypeScriptVersion = validateBoolean(options.warnOnUnsupportedTypeScriptVersion, true);
    if (!warnOnUnsupportedTypeScriptVersion) {
        parserOptions.loggerFn = false;
    }
    const { ast, services } = typescript_estree_1.parseAndGenerateServices(code, parserOptions);
    ast.sourceType = options.sourceType;
    const scopeManager = analyze_scope_1.analyzeScope(ast, options);
    return { ast, services, scopeManager, visitorKeys: typescript_estree_1.visitorKeys };
}
exports.parseForESLint = parseForESLint;
//# sourceMappingURL=parser.js.map