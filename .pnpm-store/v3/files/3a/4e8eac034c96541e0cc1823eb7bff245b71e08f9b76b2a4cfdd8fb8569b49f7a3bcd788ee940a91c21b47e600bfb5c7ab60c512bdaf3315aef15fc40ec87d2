"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      description: 'Prefer using toThrow for exception tests',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      noTryExpect: ['Tests should use Jest‘s exception helpers.', 'Use "expect(() => yourFunction()).toThrow()" for synchronous tests,', 'or "await expect(yourFunction()).rejects.toThrow()" for async tests'].join(' ')
    },
    type: 'problem',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    let isTest = false;
    let catchDepth = 0;

    function isThrowExpectCall(node) {
      return catchDepth > 0 && (0, _utils.isExpectCall)(node);
    }

    return {
      CallExpression(node) {
        if ((0, _utils.isTestCase)(node)) {
          isTest = true;
        } else if (isTest && isThrowExpectCall(node)) {
          context.report({
            messageId: 'noTryExpect',
            node
          });
        }
      },

      FunctionDeclaration(node) {
        const declaredVariables = context.getDeclaredVariables(node);
        const testCallExpressions = (0, _utils.getTestCallExpressionsFromDeclaredVariables)(declaredVariables);

        if (testCallExpressions.length > 0) {
          isTest = true;
        }
      },

      CatchClause() {
        if (isTest) {
          ++catchDepth;
        }
      },

      'CatchClause:exit'() {
        if (isTest) {
          --catchDepth;
        }
      },

      'CallExpression:exit'(node) {
        if ((0, _utils.isTestCase)(node)) {
          isTest = false;
        }
      },

      'FunctionDeclaration:exit'(node) {
        const declaredVariables = context.getDeclaredVariables(node);
        const testCallExpressions = (0, _utils.getTestCallExpressionsFromDeclaredVariables)(declaredVariables);

        if (testCallExpressions.length > 0) {
          isTest = false;
        }
      }

    };
  }

});

exports.default = _default;