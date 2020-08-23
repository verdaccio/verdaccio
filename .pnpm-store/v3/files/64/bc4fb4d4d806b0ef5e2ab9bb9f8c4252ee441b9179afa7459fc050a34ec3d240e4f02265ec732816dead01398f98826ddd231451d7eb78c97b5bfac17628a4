"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackageJSON = exports.extractWorkspaces = exports.isMatchWorkspaces = exports.checkWorkspaces = exports.findWorkspaceRoot = void 0;
const path_1 = __importDefault(require("path"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const fs_1 = require("fs");
const micromatch_1 = __importDefault(require("micromatch"));
/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} [initial]
 * @return {string|null}
 */
function findWorkspaceRoot(initial) {
    if (!initial) {
        initial = process.cwd();
    }
    let _pkg = pkg_dir_1.default.sync(initial);
    if (!_pkg) {
        return null;
    }
    initial = path_1.default.normalize(_pkg);
    let previous = null;
    let current = initial;
    do {
        const manifest = readPackageJSON(current);
        const workspaces = extractWorkspaces(manifest);
        let { done, found } = checkWorkspaces(current, initial);
        if (done) {
            return found;
        }
        previous = current;
        current = path_1.default.dirname(current);
    } while (current !== previous);
    return null;
}
exports.findWorkspaceRoot = findWorkspaceRoot;
function checkWorkspaces(current, initial) {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);
    let done = false;
    let found;
    let relativePath;
    if (workspaces) {
        done = true;
        relativePath = path_1.default.relative(current, initial);
        if (relativePath === '' || isMatchWorkspaces(relativePath, workspaces)) {
            found = current;
        }
        else {
            found = null;
        }
    }
    return {
        done,
        found,
        relativePath,
    };
}
exports.checkWorkspaces = checkWorkspaces;
function isMatchWorkspaces(relativePath, workspaces) {
    let ls = micromatch_1.default([relativePath], workspaces);
    return ls.length > 0;
}
exports.isMatchWorkspaces = isMatchWorkspaces;
function extractWorkspaces(manifest) {
    const workspaces = (manifest || {}).workspaces;
    return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
}
exports.extractWorkspaces = extractWorkspaces;
function readPackageJSON(dir) {
    const file = path_1.default.join(dir, 'package.json');
    if (fs_1.existsSync(file)) {
        return JSON.parse(fs_1.readFileSync(file, 'utf8'));
    }
    return null;
}
exports.readPackageJSON = readPackageJSON;
findWorkspaceRoot.findWorkspaceRoot = findWorkspaceRoot;
findWorkspaceRoot.readPackageJSON = readPackageJSON;
findWorkspaceRoot.extractWorkspaces = extractWorkspaces;
findWorkspaceRoot.isMatchWorkspaces = isMatchWorkspaces;
findWorkspaceRoot.default = findWorkspaceRoot;
exports.default = findWorkspaceRoot;
//# sourceMappingURL=core.js.map