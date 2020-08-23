"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = __importDefault(require("cosmiconfig"));
function getConf(dir) {
    const explorer = cosmiconfig_1.default('husky');
    const { config = {} } = explorer.searchSync(dir) || {};
    const defaults = {
        skipCI: true
    };
    return Object.assign({}, defaults, config);
}
exports.default = getConf;
