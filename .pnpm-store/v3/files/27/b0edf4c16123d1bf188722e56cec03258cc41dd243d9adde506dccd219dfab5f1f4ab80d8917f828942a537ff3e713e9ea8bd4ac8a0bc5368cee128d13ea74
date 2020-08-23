"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const util_1 = require("../util");
exports.default = util_1.createRule({
    name: 'prefer-literal-enum-member',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require that all enum members be literal values to prevent unintended enum member name shadow issues',
            category: 'Best Practices',
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            notLiteral: `Explicit enum value must only be a literal value (string, number, boolean, etc).`,
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            TSEnumMember(node) {
                // If there is no initializer, then this node is just the name of the member, so ignore.
                if (node.initializer == null) {
                    return;
                }
                // any old literal
                if (node.initializer.type === experimental_utils_1.AST_NODE_TYPES.Literal) {
                    return;
                }
                // -1 and +1
                if (node.initializer.type === experimental_utils_1.AST_NODE_TYPES.UnaryExpression &&
                    ['+', '-'].includes(node.initializer.operator) &&
                    node.initializer.argument.type === experimental_utils_1.AST_NODE_TYPES.Literal) {
                    return;
                }
                context.report({
                    node: node.id,
                    messageId: 'notLiteral',
                });
            },
        };
    },
});
//# sourceMappingURL=prefer-literal-enum-member.js.map