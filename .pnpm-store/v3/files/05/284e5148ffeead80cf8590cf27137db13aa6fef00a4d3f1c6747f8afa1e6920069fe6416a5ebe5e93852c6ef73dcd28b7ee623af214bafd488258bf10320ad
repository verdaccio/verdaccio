"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isUndefinedIdentifier = node => node.type === _experimentalUtils.AST_NODE_TYPES.Identifier && node.name === 'undefined';
/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a `undefined` identifier as the sole argument.
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedEqualityMatcherCall<MaybeTypeCast<UndefinedIdentifier>>}
 */


const isUndefinedEqualityMatcher = matcher => (0, _utils.isParsedEqualityMatcherCall)(matcher) && isUndefinedIdentifier((0, _utils.followTypeAssertionChain)(matcher.arguments[0]));

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toBeUndefined()`',
      recommended: false
    },
    messages: {
      useToBeUndefined: 'Use toBeUndefined() instead'
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

        if (matcher && isUndefinedEqualityMatcher(matcher)) {
          context.report({
            fix: fixer => [fixer.replaceText(matcher.node.property, 'toBeUndefined'), fixer.remove(matcher.arguments[0])],
            messageId: 'useToBeUndefined',
            node: matcher.node.property
          });
        }
      }

    };
  }

});

exports.default = _default;