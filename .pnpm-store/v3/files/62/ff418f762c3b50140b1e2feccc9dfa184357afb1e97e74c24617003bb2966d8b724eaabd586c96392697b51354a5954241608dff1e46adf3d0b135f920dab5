"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_up_1 = __importDefault(require("find-up"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const getConf_1 = __importDefault(require("../getConf"));
const getScript_1 = __importDefault(require("./getScript"));
const is_1 = require("./is");
const resolveGitDir_1 = __importDefault(require("./resolveGitDir"));
const hookList = [
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    'pre-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    'pre-rebase',
    'post-checkout',
    'post-merge',
    'pre-push',
    'pre-receive',
    'update',
    'post-receive',
    'post-update',
    'push-to-checkout',
    'pre-auto-gc',
    'post-rewrite',
    'sendemail-validate'
];
function writeHook(filename, script) {
    fs_1.default.writeFileSync(filename, script, 'utf-8');
    fs_1.default.chmodSync(filename, 0o0755);
}
function createHook(filename, script) {
    // Get name, used for logging
    const name = path_1.default.basename(filename);
    // Check if hook exist
    if (fs_1.default.existsSync(filename)) {
        const hook = fs_1.default.readFileSync(filename, 'utf-8');
        // Migrate
        if (is_1.isGhooks(hook)) {
            console.log(`migrating existing ghooks script: ${name}`);
            return writeHook(filename, script);
        }
        // Migrate
        if (is_1.isPreCommit(hook)) {
            console.log(`migrating existing pre-commit script: ${name}`);
            return writeHook(filename, script);
        }
        // Update
        if (is_1.isHusky(hook) || is_1.isYorkie(hook)) {
            return writeHook(filename, script);
        }
        // Skip
        console.log(`skipping existing user hook: ${name}`);
        return;
    }
    // Create hook if it doesn't exist
    writeHook(filename, script);
}
function createHooks(filenames, script) {
    filenames.forEach((filename) => createHook(filename, script));
}
function canRemove(filename) {
    if (fs_1.default.existsSync(filename)) {
        const data = fs_1.default.readFileSync(filename, 'utf-8');
        return is_1.isHusky(data);
    }
    return false;
}
function removeHook(filename) {
    fs_1.default.unlinkSync(filename);
}
function removeHooks(filenames) {
    filenames.filter(canRemove).forEach(removeHook);
}
// This prevents the case where someone would want to debug a node_module that has
// husky as devDependency and run npm install from node_modules directory
function isInNodeModules(dir) {
    // INIT_CWD holds the full path you were in when you ran npm install (supported also by yarn and pnpm)
    // See https://docs.npmjs.com/cli/run-script
    if (process.env.INIT_CWD) {
        return process.env.INIT_CWD.indexOf('node_modules') !== -1;
    }
    // Old technique
    return (dir.match(/node_modules/g) || []).length > 1;
}
function getHooks(gitDir) {
    const gitHooksDir = path_1.default.join(gitDir, 'hooks');
    return hookList.map((hookName) => path_1.default.join(gitHooksDir, hookName));
}
/**
 * @param {string} huskyDir - e.g. /home/typicode/project/node_modules/husky/
 * @param {string} requireRunNodePath - path to run-node resolved by require e.g. /home/typicode/project/node_modules/run-node/run-node
 * @param {string} isCI - true if running in CI
 */
function install(huskyDir, requireRunNodePath = require.resolve('run-node/run-node'), isCI) {
    console.log('husky > Setting up git hooks');
    // First directory containing user's package.json
    const userPkgDir = pkg_dir_1.default.sync(path_1.default.join(huskyDir, '..'));
    if (userPkgDir === undefined) {
        console.log("Can't find package.json, skipping Git hooks installation.");
        console.log('Please check that your project has a package.json or create it and reinstall husky.');
        return;
    }
    // Get conf from package.json or .huskyrc
    const conf = getConf_1.default(userPkgDir);
    // Get directory containing .git directory or in the case of Git submodules, the .git file
    const gitDirOrFile = find_up_1.default.sync('.git', { cwd: userPkgDir });
    // Resolve git directory (e.g. .git/ or .git/modules/path/to/submodule)
    const resolvedGitDir = resolveGitDir_1.default(userPkgDir);
    // Checks
    if (process.env.HUSKY_SKIP_INSTALL === 'true') {
        console.log("HUSKY_SKIP_INSTALL environment variable is set to 'true',", 'skipping Git hooks installation.');
        return;
    }
    if (gitDirOrFile === null || gitDirOrFile === undefined) {
        console.log("Can't find .git, skipping Git hooks installation.");
        console.log("Please check that you're in a cloned repository", "or run 'git init' to create an empty Git repository and reinstall husky.");
        return;
    }
    if (resolvedGitDir === null) {
        console.log("Can't find resolved .git directory, skipping Git hooks installation.");
        return;
    }
    if (isCI && conf.skipCI) {
        console.log('CI detected, skipping Git hooks installation.');
        return;
    }
    if (isInNodeModules(huskyDir)) {
        console.log('Trying to install from node_modules directory, skipping Git hooks installation.');
        return;
    }
    // Create hooks directory if doesn't exist
    if (!fs_1.default.existsSync(path_1.default.join(resolvedGitDir, 'hooks'))) {
        fs_1.default.mkdirSync(path_1.default.join(resolvedGitDir, 'hooks'));
    }
    // Create hooks
    // Get root dir based on the first .git directory of file found
    const rootDir = path_1.default.dirname(gitDirOrFile);
    const hooks = getHooks(resolvedGitDir);
    const script = getScript_1.default(rootDir, huskyDir, requireRunNodePath);
    createHooks(hooks, script);
    console.log(`husky > Done`);
    console.log('husky > Like husky? You can support the project on Patreon:');
    console.log('husky > \x1b[36m%s\x1b[0m 🐕', 'https://www.patreon.com/typicode');
}
exports.install = install;
function uninstall(huskyDir) {
    console.log('husky > Uninstalling git hooks');
    const userPkgDir = pkg_dir_1.default.sync(path_1.default.join(huskyDir, '..'));
    const resolvedGitDir = resolveGitDir_1.default(userPkgDir);
    if (resolvedGitDir === null) {
        console.log("Can't find resolved .git directory, skipping Git hooks uninstallation.");
        return;
    }
    if (isInNodeModules(huskyDir)) {
        console.log('Trying to uninstall from node_modules directory, skipping Git hooks uninstallation.');
        return;
    }
    // Remove hooks
    const hooks = getHooks(resolvedGitDir);
    removeHooks(hooks);
    console.log('husky > Done');
}
exports.uninstall = uninstall;
