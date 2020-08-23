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
      description: 'Suggest using `toHaveLength()`',
      recommended: false
    },
    messages: {
      useToHaveLength: 'Use toHaveLength() instead'
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
          expect: {
            arguments: [argument]
          },
          matcher
        } = (0, _utils.parseExpectCall)(node);

        if (!matcher || !(0, _utils.isParsedEqualityMatcherCall)(matcher) || !argument || argument.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || !(0, _utils.isSupportedAccessor)(argument.property, 'length') || argument.property.type !== _experimentalUtils.AST_NODE_TYPES.Identifier) {
          return;
        }

        context.report({
          fix(fixer) {
            const propertyDot = context.getSourceCode().getFirstTokenBetween(argument.object, argument.property, token => token.value === '.');
            /* istanbul ignore if */

            if (propertyDot === null) {
              throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
            }

            return [fixer.remove(propertyDot), fixer.remove(argument.property), fixer.replaceText(matcher.node.property, 'toHaveLength')];
          },

          messageId: 'useToHaveLength',
          node: matcher.node.property
        });
      }

    };
  }

});

exports.default = _default;