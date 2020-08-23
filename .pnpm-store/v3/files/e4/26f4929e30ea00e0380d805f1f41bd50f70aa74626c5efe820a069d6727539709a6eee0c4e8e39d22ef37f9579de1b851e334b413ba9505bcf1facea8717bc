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
      description: 'Disallow expect.resolves',
      recommended: false
    },
    messages: {
      expectResolves: 'Use `expect(await promise)` instead.'
    },
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],
  create: context => ({
    MemberExpression(node) {
      if ((0, _utils.isExpectCall)(node.object) && (0, _utils.isSupportedAccessor)(node.property, _utils.ModifierName.resolves)) {
        context.report({
          node: node.property,
          messageId: 'expectResolves'
        });
      }
    }

  })
});

exports.default = _default;