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
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'no-unsafe-call',
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallows calling an any type value',
            category: 'Possible Errors',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages: {
            unsafeCall: 'Unsafe call of an any typed value.',
            unsafeNew: 'Unsafe construction of an any type value.',
            unsafeTemplateTag: 'Unsafe any typed template tag.',
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const { program, esTreeNodeToTSNodeMap } = util.getParserServices(context);
        const checker = program.getTypeChecker();
        function checkCall(node, reportingNode, messageId) {
            const tsNode = esTreeNodeToTSNodeMap.get(node);
            const type = util.getConstrainedTypeAtLocation(checker, tsNode);
            if (util.isTypeAnyType(type)) {
                context.report({
                    node: reportingNode,
                    messageId: messageId,
                });
            }
        }
        return {
            ':matches(CallExpression, OptionalCallExpression) > *.callee'(node) {
                checkCall(node, node, 'unsafeCall');
            },
            NewExpression(node) {
                checkCall(node.callee, node, 'unsafeNew');
            },
            'TaggedTemplateExpression > *.tag'(node) {
                checkCall(node, node, 'unsafeTemplateTag');
            },
        };
    },
});
//# sourceMappingURL=no-unsafe-call.js.map