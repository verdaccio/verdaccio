"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_ci_1 = __importDefault(require("is-ci"));
const path_1 = __importDefault(require("path"));
const _1 = require("./");
// Just for testing
if (process.env.HUSKY_DEBUG === 'true' || process.env.HUSKY_DEBUG === '1') {
    console.log(`husky:debug INIT_CWD=${process.env.INIT_CWD}`);
}
// Action can be "install" or "uninstall"
// huskyDir is ONLY used in dev, don't use this arguments
const [, , action, huskyDir = path_1.default.join(__dirname, '../..')] = process.argv;
// Find Git dir
try {
    // Run installer
    if (action === 'install') {
        _1.install(huskyDir, undefined, is_ci_1.default);
    }
    else {
        _1.uninstall(huskyDir);
    }
}
catch (error) {
    console.log(`husky > failed to ${action}`);
    console.log(error.message);
}
