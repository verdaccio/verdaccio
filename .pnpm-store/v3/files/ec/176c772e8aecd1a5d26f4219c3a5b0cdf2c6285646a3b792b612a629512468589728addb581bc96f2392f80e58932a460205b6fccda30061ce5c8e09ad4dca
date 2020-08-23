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
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'prefer-ts-expect-error',
    meta: {
        type: 'problem',
        docs: {
            description: 'Recommends using `// @ts-expect-error` over `// @ts-ignore`',
            category: 'Best Practices',
            recommended: false,
        },
        fixable: 'code',
        messages: {
            preferExpectErrorComment: 'Use "// @ts-expect-error" to ensure an error is actually being suppressed.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const tsIgnoreRegExp = /^\/*\s*@ts-ignore/;
        const sourceCode = context.getSourceCode();
        return {
            Program() {
                const comments = sourceCode.getAllComments();
                comments.forEach(comment => {
                    if (comment.type !== experimental_utils_1.AST_TOKEN_TYPES.Line) {
                        return;
                    }
                    if (tsIgnoreRegExp.test(comment.value)) {
                        context.report({
                            node: comment,
                            messageId: 'preferExpectErrorComment',
                            fix: fixer => fixer.replaceText(comment, `//${comment.value.replace('@ts-ignore', '@ts-expect-error')}`),
                        });
                    }
                });
            },
        };
    },
});
//# sourceMappingURL=prefer-ts-expect-error.js.map