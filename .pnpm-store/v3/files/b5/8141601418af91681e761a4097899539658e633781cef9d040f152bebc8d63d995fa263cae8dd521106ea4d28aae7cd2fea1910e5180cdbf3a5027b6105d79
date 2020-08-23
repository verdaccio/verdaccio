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
const typescript_1 = require("typescript");
const semver = __importStar(require("semver"));
const util = __importStar(require("../util"));
const is3dot9 = !semver.satisfies(typescript_1.version, '< 3.9.0 || < 3.9.1-rc || < 3.9.0-beta');
exports.default = util.createRule({
    name: 'no-non-null-asserted-optional-chain',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallows using a non-null assertion after an optional chain expression',
            category: 'Possible Errors',
            recommended: 'error',
            suggestion: true,
        },
        messages: {
            noNonNullOptionalChain: 'Optional chain expressions can return undefined by design - using a non-null assertion is unsafe and wrong.',
            suggestRemovingNonNull: 'You should remove the non-null assertion.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            'TSNonNullExpression > :matches(OptionalMemberExpression, OptionalCallExpression)'(node) {
                var _a;
                if (is3dot9) {
                    // TS3.9 made a breaking change to how non-null works with optional chains.
                    // Pre-3.9,  `x?.y!.z` means `(x?.y).z` - i.e. it essentially scrubbed the optionality from the chain
                    // Post-3.9, `x?.y!.z` means `x?.y!.z`  - i.e. it just asserts that the property `y` is non-null, not the result of `x?.y`.
                    // This means that for > 3.9, x?.y!.z is valid!
                    // NOTE: these cases are still invalid:
                    // - x?.y.z!
                    // - (x?.y)!.z
                    const nnAssertionParent = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent;
                    if ((nnAssertionParent === null || nnAssertionParent === void 0 ? void 0 : nnAssertionParent.type) ===
                        experimental_utils_1.AST_NODE_TYPES.OptionalMemberExpression ||
                        (nnAssertionParent === null || nnAssertionParent === void 0 ? void 0 : nnAssertionParent.type) === experimental_utils_1.AST_NODE_TYPES.OptionalCallExpression) {
                        return;
                    }
                }
                // selector guarantees this assertion
                const parent = node.parent;
                context.report({
                    node,
                    messageId: 'noNonNullOptionalChain',
                    // use a suggestion instead of a fixer, because this can obviously break type checks
                    suggest: [
                        {
                            messageId: 'suggestRemovingNonNull',
                            fix(fixer) {
                                return fixer.removeRange([
                                    parent.range[1] - 1,
                                    parent.range[1],
                                ]);
                            },
                        },
                    ],
                });
            },
        };
    },
});
//# sourceMappingURL=no-non-null-asserted-optional-chain.js.map