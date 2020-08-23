"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isExpectAssertionsOrHasAssertionsCall = expression => {
  if (expression.type !== _experimentalUtils.AST_NODE_TYPES.CallExpression || expression.callee.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || !(0, _utils.isSupportedAccessor)(expression.callee.object, 'expect') || !(0, _utils.isSupportedAccessor)(expression.callee.property)) {
    return false;
  }

  const expectAssertionName = (0, _utils.getAccessorValue)(expression.callee.property);

  if (expectAssertionName !== 'assertions') {
    return expectAssertionName === 'hasAssertions';
  }

  const [arg] = expression.arguments;
  return (0, _utils.hasOnlyOneArgument)(expression) && arg.type === _experimentalUtils.AST_NODE_TYPES.Literal && typeof arg.value === 'number' && Number.isInteger(arg.value);
};

const getFunctionFirstLine = functionBody => functionBody[0] && functionBody[0].expression;

const isFirstLineExprStmt = functionBody => functionBody[0] && functionBody[0].type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Suggest using `expect.assertions()` OR `expect.hasAssertions()`',
      recommended: false
    },
    messages: {
      haveExpectAssertions: 'Every test should have either `expect.assertions(<number of assertions>)` or `expect.hasAssertions()` as its first expression'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      'CallExpression[callee.name=/^(it|test)$/][arguments.1.body.body]'(node) {
        const testFuncBody = node.arguments[1].body.body;

        if (!isFirstLineExprStmt(testFuncBody)) {
          context.report({
            messageId: 'haveExpectAssertions',
            node
          });
          return;
        }

        const testFuncFirstLine = getFunctionFirstLine(testFuncBody);

        if (!isExpectAssertionsOrHasAssertionsCall(testFuncFirstLine)) {
          context.report({
            messageId: 'haveExpectAssertions',
            node
          });
        }
      }

    };
  }

});

exports.default = _default;