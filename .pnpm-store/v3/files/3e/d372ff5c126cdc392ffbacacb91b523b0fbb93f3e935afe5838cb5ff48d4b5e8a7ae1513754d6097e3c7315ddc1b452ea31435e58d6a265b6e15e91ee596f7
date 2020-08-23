"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const testCaseNames = new Set([...Object.keys(_utils.TestCaseName), 'it.only', 'it.concurrent.only', 'it.skip', 'it.concurrent.skip', 'test.only', 'test.concurrent.only', 'test.skip', 'test.concurrent.skip', 'fit.concurrent']);

const isTestArrowFunction = node => node.parent !== undefined && node.parent.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && testCaseNames.has((0, _utils.getNodeName)(node.parent.callee));

const conditionName = {
  [_experimentalUtils.AST_NODE_TYPES.ConditionalExpression]: 'conditional',
  [_experimentalUtils.AST_NODE_TYPES.SwitchStatement]: 'switch',
  [_experimentalUtils.AST_NODE_TYPES.IfStatement]: 'if'
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      description: 'Disallow conditional logic',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      noConditionalExpect: 'Test should not contain { condition } statements.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    const stack = [];

    function validate(node) {
      const lastElementInStack = stack[stack.length - 1];

      if (stack.length === 0 || !lastElementInStack) {
        return;
      }

      context.report({
        data: {
          condition: conditionName[node.type]
        },
        messageId: 'noConditionalExpect',
        node
      });
    }

    return {
      CallExpression(node) {
        stack.push((0, _utils.isTestCase)(node));
      },

      FunctionExpression() {
        stack.push(false);
      },

      FunctionDeclaration(node) {
        const declaredVariables = context.getDeclaredVariables(node);
        const testCallExpressions = (0, _utils.getTestCallExpressionsFromDeclaredVariables)(declaredVariables);
        stack.push(testCallExpressions.length > 0);
      },

      ArrowFunctionExpression(node) {
        stack.push(isTestArrowFunction(node));
      },

      IfStatement: validate,
      SwitchStatement: validate,
      ConditionalExpression: validate,

      'CallExpression:exit'() {
        stack.pop();
      },

      'FunctionExpression:exit'() {
        stack.pop();
      },

      'FunctionDeclaration:exit'() {
        stack.pop();
      },

      'ArrowFunctionExpression:exit'() {
        stack.pop();
      }

    };
  }

});

exports.default = _default;