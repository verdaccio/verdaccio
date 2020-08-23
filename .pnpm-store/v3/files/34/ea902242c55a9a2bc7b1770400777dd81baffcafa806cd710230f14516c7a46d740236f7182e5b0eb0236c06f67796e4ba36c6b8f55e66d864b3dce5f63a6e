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
      category: 'Best Practices',
      description: 'Prevents test cases and hooks to be outside of a describe block',
      recommended: false
    },
    messages: {
      unexpectedTestCase: 'All test cases must be wrapped in a describe block.',
      unexpectedHook: 'All hooks must be wrapped in a describe block.'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    let numberOfDescribeBlocks = 0;
    return {
      CallExpression(node) {
        if ((0, _utils.isDescribe)(node)) {
          numberOfDescribeBlocks++;
          return;
        }

        if (numberOfDescribeBlocks === 0) {
          if ((0, _utils.isTestCase)(node)) {
            context.report({
              node,
              messageId: 'unexpectedTestCase'
            });
            return;
          }

          if ((0, _utils.isHook)(node)) {
            context.report({
              node,
              messageId: 'unexpectedHook'
            });
            return;
          }
        }
      },

      'CallExpression:exit'(node) {
        if ((0, _utils.isDescribe)(node)) {
          numberOfDescribeBlocks--;
        }
      }

    };
  }

});

exports.default = _default;