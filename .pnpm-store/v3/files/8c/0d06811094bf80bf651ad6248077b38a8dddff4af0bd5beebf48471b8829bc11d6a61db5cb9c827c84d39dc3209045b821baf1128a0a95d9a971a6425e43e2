"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_up_1 = __importDefault(require("find-up"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function default_1(cwd) {
    const foundPath = find_up_1.default.sync('.git', { cwd });
    if (foundPath) {
        const stats = fs_1.default.lstatSync(foundPath);
        // If it's a .git file resolve path
        if (stats.isFile()) {
            // Expect following format
            // git: pathToGit
            // On Windows pathToGit can contain ':' (example "gitdir: C:/Some/Path")
            const gitFileData = fs_1.default.readFileSync(foundPath, 'utf-8');
            const gitDir = gitFileData
                .split(':')
                .slice(1)
                .join(':')
                .trim();
            const resolvedGitDir = path_1.default.resolve(path_1.default.dirname(foundPath), gitDir);
            // For git-worktree, check if commondir file exists and return that path
            const pathCommonDir = path_1.default.join(resolvedGitDir, 'commondir');
            if (fs_1.default.existsSync(pathCommonDir)) {
                const commondir = fs_1.default.readFileSync(pathCommonDir, 'utf-8').trim();
                const resolvedCommonGitDir = path_1.default.join(resolvedGitDir, commondir);
                return resolvedCommonGitDir;
            }
            return resolvedGitDir;
        }
        // Else return path to .git directory
        return foundPath;
    }
    return null;
}
exports.default = default_1;
