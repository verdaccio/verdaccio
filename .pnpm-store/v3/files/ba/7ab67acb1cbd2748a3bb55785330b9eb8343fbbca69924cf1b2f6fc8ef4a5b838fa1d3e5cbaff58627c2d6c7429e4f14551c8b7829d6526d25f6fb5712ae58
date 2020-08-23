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
      description: 'Suggest using toStrictEqual()',
      recommended: false
    },
    messages: {
      useToStrictEqual: 'Use toStrictEqual() instead'
    },
    fixable: 'code',
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const {
          matcher
        } = (0, _utils.parseExpectCall)(node);

        if (matcher && (0, _utils.isParsedEqualityMatcherCall)(matcher, _utils.EqualityMatcher.toEqual)) {
          context.report({
            fix: fixer => [fixer.replaceText(matcher.node.property, _utils.EqualityMatcher.toStrictEqual)],
            messageId: 'useToStrictEqual',
            node: matcher.node.property
          });
        }
      }

    };
  }

});

exports.default = _default;