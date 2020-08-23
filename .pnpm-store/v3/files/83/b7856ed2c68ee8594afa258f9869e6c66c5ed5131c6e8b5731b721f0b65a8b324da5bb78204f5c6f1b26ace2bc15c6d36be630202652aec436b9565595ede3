"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isNullLiteral = node => node.type === _experimentalUtils.AST_NODE_TYPES.Literal && node.value === null;
/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a `null` literal as the sole argument.
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedEqualityMatcherCall<MaybeTypeCast<NullLiteral>>}
 */


const isNullEqualityMatcher = matcher => (0, _utils.isParsedEqualityMatcherCall)(matcher) && isNullLiteral((0, _utils.followTypeAssertionChain)(matcher.arguments[0]));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toBeNull()`',
      recommended: false
    },
    messages: {
      useToBeNull: 'Use toBeNull() instead'
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

        if (matcher && isNullEqualityMatcher(matcher)) {
          context.report({
            fix: fixer => [fixer.replaceText(matcher.node.property, 'toBeNull'), fixer.remove(matcher.arguments[0])],
            messageId: 'useToBeNull',
            node: matcher.node.property
          });
        }
      }

    };
  }

});

exports.default = _default;