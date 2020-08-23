"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using inline snapshots',
      recommended: false
    },
    messages: {
      toMatch: 'Use toMatchInlineSnapshot() instead',
      toMatchError: 'Use toThrowErrorMatchingInlineSnapshot() instead'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        const {
          callee
        } = node;

        if (callee.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || callee.property.type !== _experimentalUtils.AST_NODE_TYPES.Identifier) {
          return;
        }

        if (callee.property.name === 'toMatchSnapshot') {
          context.report({
            fix(fixer) {
              return [fixer.replaceText(callee.property, 'toMatchInlineSnapshot')];
            },

            messageId: 'toMatch',
            node: callee.property
          });
        } else if (callee.property.name === 'toThrowErrorMatchingSnapshot') {
          context.report({
            fix(fixer) {
              return [fixer.replaceText(callee.property, 'toThrowErrorMatchingInlineSnapshot')];
            },

            messageId: 'toMatchError',
            node: callee.property
          });
        }
      }

    };
  }

});

exports.default = _default;