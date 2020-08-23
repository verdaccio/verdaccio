"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isBooleanLiteral = node => node.type === _experimentalUtils.AST_NODE_TYPES.Literal && typeof node.value === 'boolean';

/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a boolean literal as the sole argument.
 *
 * @example javascript
 * toBe(true);
 * toEqual(false);
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedBooleanEqualityMatcher}
 */
const isBooleanEqualityMatcher = matcher => (0, _utils.isParsedEqualityMatcherCall)(matcher) && isBooleanLiteral((0, _utils.followTypeAssertionChain)(matcher.arguments[0]));

/**
 * Checks if the given `node` is a `CallExpression` representing the calling
 * of an `includes`-like method that can be 'fixed' (using `toContain`).
 *
 * @param {CallExpression} node
 *
 * @return {node is FixableIncludesCallExpression}
 *
 * @todo support `['includes']()` syntax (remove last property.type check to begin)
 * @todo break out into `isMethodCall<Name extends string>(node: TSESTree.Node, method: Name)` util-fn
 */
const isFixableIncludesCallExpression = node => node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.callee.property, 'includes') && node.callee.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier && (0, _utils.hasOnlyOneArgument)(node);

const buildToContainFuncExpectation = negated => negated ? `${_utils.ModifierName.not}.toContain` : 'toContain';
/**
 * Finds the first `.` character token between the `object` & `property` of the given `member` expression.
 *
 * @param {TSESTree.MemberExpression} member
 * @param {SourceCode} sourceCode
 *
 * @return {Token | null}
 */


const findPropertyDotToken = (member, sourceCode) => sourceCode.getFirstTokenBetween(member.object, member.property, token => token.value === '.');

const getNegationFixes = (node, modifier, matcher, sourceCode, fixer, fileName) => {
  const [containArg] = node.arguments;
  const negationPropertyDot = findPropertyDotToken(modifier.node, sourceCode);
  const toContainFunc = buildToContainFuncExpectation((0, _utils.followTypeAssertionChain)(matcher.arguments[0]).value);
  /* istanbul ignore if */

  if (negationPropertyDot === null) {
    throw new Error(`Unexpected null when attempting to fix ${fileName} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  }

  return [fixer.remove(negationPropertyDot), fixer.remove(modifier.node.property), fixer.replaceText(matcher.node.property, toContainFunc), fixer.replaceText(matcher.arguments[0], sourceCode.getText(containArg))];
};

const getCommonFixes = (node, sourceCode, fileName) => {
  const [containArg] = node.arguments;
  const includesCallee = node.callee;
  const propertyDot = findPropertyDotToken(includesCallee, sourceCode);
  const closingParenthesis = sourceCode.getTokenAfter(containArg);
  const openParenthesis = sourceCode.getTokenBefore(containArg);
  /* istanbul ignore if */

  if (propertyDot === null || closingParenthesis === null || openParenthesis === null) {
    throw new Error(`Unexpected null when attempting to fix ${fileName} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  }

  return [containArg, includesCallee.property, propertyDot, closingParenthesis, openParenthesis];
}; // expect(array.includes(<value>)[not.]{toBe,toEqual}(<boolean>)


var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `toContain()`',
      recommended: false
    },
    messages: {
      useToContain: 'Use toContain() instead'
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
            arguments: [includesCall]
          },
          matcher,
          modifier
        } = (0, _utils.parseExpectCall)(node);

        if (!matcher || modifier && modifier.name !== _utils.ModifierName.not || !isBooleanEqualityMatcher(matcher) || !isFixableIncludesCallExpression(includesCall)) {
          return;
        }

        context.report({
          fix(fixer) {
            const sourceCode = context.getSourceCode();
            const fileName = context.getFilename();
            const fixArr = getCommonFixes(includesCall, sourceCode, fileName).map(target => fixer.remove(target));

            if (modifier && modifier.name === _utils.ModifierName.not) {
              return getNegationFixes(includesCall, modifier, matcher, sourceCode, fixer, fileName).concat(fixArr);
            }

            const toContainFunc = buildToContainFuncExpectation(!(0, _utils.followTypeAssertionChain)(matcher.arguments[0]).value);
            const [containArg] = includesCall.arguments;
            fixArr.push(fixer.replaceText(matcher.node.property, toContainFunc));
            fixArr.push(fixer.replaceText(matcher.arguments[0], sourceCode.getText(containArg)));
            return fixArr;
          },

          messageId: 'useToContain',
          node: (modifier || matcher).node.property
        });
      }

    };
  }

});

exports.default = _default;