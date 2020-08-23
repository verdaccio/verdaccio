"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndGenerateServices = exports.parse = void 0;
const debug_1 = __importDefault(require("debug"));
const glob_1 = require("glob");
const is_glob_1 = __importDefault(require("is-glob"));
const semver_1 = __importDefault(require("semver"));
const ts = __importStar(require("typescript"));
const ast_converter_1 = require("./ast-converter");
const convert_1 = require("./convert");
const createDefaultProgram_1 = require("./create-program/createDefaultProgram");
const createIsolatedProgram_1 = require("./create-program/createIsolatedProgram");
const createProjectProgram_1 = require("./create-program/createProjectProgram");
const createSourceFile_1 = require("./create-program/createSourceFile");
const semantic_or_syntactic_errors_1 = require("./semantic-or-syntactic-errors");
const shared_1 = require("./create-program/shared");
const log = debug_1.default('typescript-eslint:typescript-estree:parser');
/**
 * This needs to be kept in sync with the top-level README.md in the
 * typescript-eslint monorepo
 */
const SUPPORTED_TYPESCRIPT_VERSIONS = '>=3.3.1 <3.10.0';
/*
 * The semver package will ignore prerelease ranges, and we don't want to explicitly document every one
 * List them all separately here, so we can automatically create the full string
 */
const SUPPORTED_PRERELEASE_RANGES = [];
const ACTIVE_TYPESCRIPT_VERSION = ts.version;
const isRunningSupportedTypeScriptVersion = semver_1.default.satisfies(ACTIVE_TYPESCRIPT_VERSION, [SUPPORTED_TYPESCRIPT_VERSIONS]
    .concat(SUPPORTED_PRERELEASE_RANGES)
    .join(' || '));
let extra;
let warnedAboutTSVersion = false;
function enforceString(code) {
    /**
     * Ensure the source code is a string
     */
    if (typeof code !== 'string') {
        return String(code);
    }
    return code;
}
/**
 * @param code The code of the file being linted
 * @param shouldProvideParserServices True if the program should be attempted to be calculated from provided tsconfig files
 * @param shouldCreateDefaultProgram True if the program should be created from compiler host
 * @returns Returns a source file and program corresponding to the linted code
 */
function getProgramAndAST(code, shouldProvideParserServices, shouldCreateDefaultProgram) {
    return ((shouldProvideParserServices &&
        createProjectProgram_1.createProjectProgram(code, shouldCreateDefaultProgram, extra)) ||
        (shouldProvideParserServices &&
            shouldCreateDefaultProgram &&
            createDefaultProgram_1.createDefaultProgram(code, extra)) ||
        createIsolatedProgram_1.createIsolatedProgram(code, extra));
}
/**
 * Compute the filename based on the parser options.
 *
 * Even if jsx option is set in typescript compiler, filename still has to
 * contain .tsx file extension.
 *
 * @param options Parser options
 */
function getFileName({ jsx } = {}) {
    return jsx ? 'estree.tsx' : 'estree.ts';
}
/**
 * Resets the extra config object
 */
function resetExtra() {
    extra = {
        code: '',
        comment: false,
        comments: [],
        createDefaultProgram: false,
        debugLevel: new Set(),
        errorOnTypeScriptSyntacticAndSemanticIssues: false,
        errorOnUnknownASTType: false,
        extraFileExtensions: [],
        filePath: getFileName(),
        jsx: false,
        loc: false,
        log: console.log,
        preserveNodeMaps: true,
        projects: [],
        range: false,
        strict: false,
        tokens: null,
        tsconfigRootDir: process.cwd(),
        useJSXTextNode: false,
    };
}
/**
 * Normalizes, sanitizes, resolves and filters the provided
 */
function prepareAndTransformProjects(projectsInput, ignoreListInput) {
    let projects = [];
    // Normalize and sanitize the project paths
    if (typeof projectsInput === 'string') {
        projects.push(projectsInput);
    }
    else if (Array.isArray(projectsInput)) {
        for (const project of projectsInput) {
            if (typeof project === 'string') {
                projects.push(project);
            }
        }
    }
    if (projects.length === 0) {
        return projects;
    }
    // Transform glob patterns into paths
    projects = projects.reduce((projects, project) => projects.concat(is_glob_1.default(project)
        ? glob_1.sync(project, {
            cwd: extra.tsconfigRootDir,
        })
        : project), []);
    // Normalize and sanitize the ignore regex list
    const ignoreRegexes = [];
    if (Array.isArray(ignoreListInput)) {
        for (const ignore of ignoreListInput) {
            if (ignore instanceof RegExp) {
                ignoreRegexes.push(ignore);
            }
            else if (typeof ignore === 'string') {
                ignoreRegexes.push(new RegExp(ignore));
            }
        }
    }
    else {
        ignoreRegexes.push(/\/node_modules\//);
    }
    // Remove any paths that match the ignore list
    const filtered = projects.filter(project => {
        for (const ignore of ignoreRegexes) {
            if (ignore.test(project)) {
                return false;
            }
        }
        return true;
    });
    log('parserOptions.project matched projects: %s', projects);
    log('ignore list applied to parserOptions.project: %s', filtered);
    return filtered;
}
function applyParserOptionsToExtra(options) {
    /**
     * Configure Debug logging
     */
    if (options.debugLevel === true) {
        extra.debugLevel = new Set(['typescript-eslint']);
    }
    else if (Array.isArray(options.debugLevel)) {
        extra.debugLevel = new Set(options.debugLevel);
    }
    if (extra.debugLevel.size > 0) {
        // debug doesn't support multiple `enable` calls, so have to do it all at once
        const namespaces = [];
        if (extra.debugLevel.has('typescript-eslint')) {
            namespaces.push('typescript-eslint:*');
        }
        if (extra.debugLevel.has('eslint') ||
            // make sure we don't turn off the eslint debug if it was enabled via --debug
            debug_1.default.enabled('eslint:*')) {
            // https://github.com/eslint/eslint/blob/9dfc8501fb1956c90dc11e6377b4cb38a6bea65d/bin/eslint.js#L25
            namespaces.push('eslint:*,-eslint:code-path');
        }
        debug_1.default.enable(namespaces.join(','));
    }
    /**
     * Track range information in the AST
     */
    extra.range = typeof options.range === 'boolean' && options.range;
    extra.loc = typeof options.loc === 'boolean' && options.loc;
    /**
     * Track tokens in the AST
     */
    if (typeof options.tokens === 'boolean' && options.tokens) {
        extra.tokens = [];
    }
    /**
     * Track comments in the AST
     */
    if (typeof options.comment === 'boolean' && options.comment) {
        extra.comment = true;
        extra.comments = [];
    }
    /**
     * Enable JSX - note the applicable file extension is still required
     */
    if (typeof options.jsx === 'boolean' && options.jsx) {
        extra.jsx = true;
    }
    /**
     * Get the file path
     */
    if (typeof options.filePath === 'string' && options.filePath !== '<input>') {
        extra.filePath = options.filePath;
    }
    else {
        extra.filePath = getFileName(extra);
    }
    /**
     * The JSX AST changed the node type for string literals
     * inside a JSX Element from `Literal` to `JSXText`.
     *
     * When value is `true`, these nodes will be parsed as type `JSXText`.
     * When value is `false`, these nodes will be parsed as type `Literal`.
     */
    if (typeof options.useJSXTextNode === 'boolean' && options.useJSXTextNode) {
        extra.useJSXTextNode = true;
    }
    /**
     * Allow the user to cause the parser to error if it encounters an unknown AST Node Type
     * (used in testing)
     */
    if (typeof options.errorOnUnknownASTType === 'boolean' &&
        options.errorOnUnknownASTType) {
        extra.errorOnUnknownASTType = true;
    }
    /**
     * Allow the user to override the function used for logging
     */
    if (typeof options.loggerFn === 'function') {
        extra.log = options.loggerFn;
    }
    else if (options.loggerFn === false) {
        extra.log = () => { };
    }
    if (typeof options.tsconfigRootDir === 'string') {
        extra.tsconfigRootDir = options.tsconfigRootDir;
    }
    // NOTE - ensureAbsolutePath relies upon having the correct tsconfigRootDir in extra
    extra.filePath = shared_1.ensureAbsolutePath(extra.filePath, extra);
    // NOTE - prepareAndTransformProjects relies upon having the correct tsconfigRootDir in extra
    extra.projects = prepareAndTransformProjects(options.project, options.projectFolderIgnoreList);
    if (Array.isArray(options.extraFileExtensions) &&
        options.extraFileExtensions.every(ext => typeof ext === 'string')) {
        extra.extraFileExtensions = options.extraFileExtensions;
    }
    /**
     * Allow the user to enable or disable the preservation of the AST node maps
     * during the conversion process.
     */
    if (typeof options.preserveNodeMaps === 'boolean') {
        extra.preserveNodeMaps = options.preserveNodeMaps;
    }
    extra.createDefaultProgram =
        typeof options.createDefaultProgram === 'boolean' &&
            options.createDefaultProgram;
}
function warnAboutTSVersion() {
    var _a;
    if (!isRunningSupportedTypeScriptVersion && !warnedAboutTSVersion) {
        const isTTY = typeof process === undefined ? false : (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.isTTY;
        if (isTTY) {
            const border = '=============';
            const versionWarning = [
                border,
                'WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.',
                'You may find that it works just fine, or you may not.',
                `SUPPORTED TYPESCRIPT VERSIONS: ${SUPPORTED_TYPESCRIPT_VERSIONS}`,
                `YOUR TYPESCRIPT VERSION: ${ACTIVE_TYPESCRIPT_VERSION}`,
                'Please only submit bug reports when using the officially supported version.',
                border,
            ];
            extra.log(versionWarning.join('\n\n'));
        }
        warnedAboutTSVersion = true;
    }
}
function parse(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure users do not attempt to use parse() when they need parseAndGenerateServices()
     */
    if (options === null || options === void 0 ? void 0 : options.errorOnTypeScriptSyntacticAndSemanticIssues) {
        throw new Error(`"errorOnTypeScriptSyntacticAndSemanticIssues" is only supported for parseAndGenerateServices()`);
    }
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    code = enforceString(code);
    extra.code = code;
    /**
     * Apply the given parser options
     */
    if (typeof options !== 'undefined') {
        applyParserOptionsToExtra(options);
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */
    warnAboutTSVersion();
    /**
     * Create a ts.SourceFile directly, no ts.Program is needed for a simple
     * parse
     */
    const ast = createSourceFile_1.createSourceFile(code, extra);
    /**
     * Convert the TypeScript AST to an ESTree-compatible one
     */
    const { estree } = ast_converter_1.astConverter(ast, extra, false);
    return estree;
}
exports.parse = parse;
function parseAndGenerateServices(code, options) {
    /**
     * Reset the parse configuration
     */
    resetExtra();
    /**
     * Ensure the source code is a string, and store a reference to it
     */
    code = enforceString(code);
    extra.code = code;
    /**
     * Apply the given parser options
     */
    if (typeof options !== 'undefined') {
        applyParserOptionsToExtra(options);
        if (typeof options.errorOnTypeScriptSyntacticAndSemanticIssues ===
            'boolean' &&
            options.errorOnTypeScriptSyntacticAndSemanticIssues) {
            extra.errorOnTypeScriptSyntacticAndSemanticIssues = true;
        }
    }
    /**
     * Warn if the user is using an unsupported version of TypeScript
     */
    warnAboutTSVersion();
    /**
     * Generate a full ts.Program in order to be able to provide parser
     * services, such as type-checking
     */
    const shouldProvideParserServices = extra.projects && extra.projects.length > 0;
    const { ast, program } = getProgramAndAST(code, shouldProvideParserServices, extra.createDefaultProgram);
    /**
     * Convert the TypeScript AST to an ESTree-compatible one, and optionally preserve
     * mappings between converted and original AST nodes
     */
    const preserveNodeMaps = typeof extra.preserveNodeMaps === 'boolean' ? extra.preserveNodeMaps : true;
    const { estree, astMaps } = ast_converter_1.astConverter(ast, extra, preserveNodeMaps);
    /**
     * Even if TypeScript parsed the source code ok, and we had no problems converting the AST,
     * there may be other syntactic or semantic issues in the code that we can optionally report on.
     */
    if (program && extra.errorOnTypeScriptSyntacticAndSemanticIssues) {
        const error = semantic_or_syntactic_errors_1.getFirstSemanticOrSyntacticError(program, ast);
        if (error) {
            throw convert_1.convertError(error);
        }
    }
    /**
     * Return the converted AST and additional parser services
     */
    return {
        ast: estree,
        services: {
            hasFullTypeInformation: shouldProvideParserServices,
            program,
            esTreeNodeToTSNodeMap: astMaps.esTreeNodeToTSNodeMap,
            tsNodeToESTreeNodeMap: astMaps.tsNodeToESTreeNodeMap,
        },
    };
}
exports.parseAndGenerateServices = parseAndGenerateServices;
//# sourceMappingURL=parser.js.map