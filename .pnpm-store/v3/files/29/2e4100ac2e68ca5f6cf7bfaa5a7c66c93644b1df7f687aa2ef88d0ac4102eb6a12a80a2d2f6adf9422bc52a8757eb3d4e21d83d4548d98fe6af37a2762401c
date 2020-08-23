"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const isThenOrCatchCall = node => node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.callee.property) && ['then', 'catch'].includes((0, _utils.getAccessorValue)(node.callee.property));

const isExpectCallPresentInFunction = body => {
  if (body.type === _experimentalUtils.AST_NODE_TYPES.BlockStatement) {
    return body.body.find(line => {
      if (line.type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement) {
        return isFullExpectCall(line.expression);
      }

      if (line.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement && line.argument) {
        return isFullExpectCall(line.argument);
      }

      return false;
    });
  }

  return isFullExpectCall(body);
};

const isFullExpectCall = expression => expression.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && (0, _utils.isExpectMember)(expression.callee);

const reportReturnRequired = (context, node) => {
  context.report({
    loc: {
      end: {
        column: node.loc.end.column,
        line: node.loc.end.line
      },
      start: node.loc.start
    },
    messageId: 'returnPromise',
    node
  });
};

const isPromiseReturnedLater = (node, testFunctionBody) => {
  let promiseName;

  if (node.type === _experimentalUtils.AST_NODE_TYPES.ExpressionStatement && node.expression.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.expression.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(node.expression.callee.object)) {
    promiseName = (0, _utils.getAccessorValue)(node.expression.callee.object);
  } else if (node.type === _experimentalUtils.AST_NODE_TYPES.VariableDeclarator && node.id.type === _experimentalUtils.AST_NODE_TYPES.Identifier) {
    promiseName = node.id.name;
  }

  const lastLineInTestFunc = testFunctionBody[testFunctionBody.length - 1];
  return lastLineInTestFunc.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement && lastLineInTestFunc.argument && ('name' in lastLineInTestFunc.argument && lastLineInTestFunc.argument.name === promiseName || !promiseName);
};

const isTestFunc = node => node.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && (0, _utils.isSupportedAccessor)(node.callee) && [_utils.TestCaseName.it, _utils.TestCaseName.test].includes((0, _utils.getAccessorValue)(node.callee));

const findTestFunction = node => {
  while (node) {
    if ((0, _utils.isFunction)(node) && node.parent && isTestFunc(node.parent)) {
      return node;
    }

    node = node.parent;
  }

  return null;
};

const isParentThenOrPromiseReturned = (node, testFunctionBody) => node.type === _experimentalUtils.AST_NODE_TYPES.ReturnStatement || isPromiseReturnedLater(node, testFunctionBody);

const verifyExpectWithReturn = (promiseCallbacks, node, context, testFunctionBody) => {
  promiseCallbacks.some(promiseCallback => {
    if (promiseCallback && (0, _utils.isFunction)(promiseCallback) && promiseCallback.body) {
      if (isExpectCallPresentInFunction(promiseCallback.body) && node.parent && node.parent.parent && !isParentThenOrPromiseReturned(node.parent.parent, testFunctionBody)) {
        reportReturnRequired(context, node.parent.parent);
        return true;
      }
    }

    return false;
  });
};

const isHavingAsyncCallBackParam = testFunction => testFunction.params[0] && testFunction.params[0].type === _experimentalUtils.AST_NODE_TYPES.Identifier;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce having return statement when testing with promises',
      recommended: 'error'
    },
    messages: {
      returnPromise: 'Promise should be returned to test its fulfillment or rejection'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        if (!isThenOrCatchCall(node) || node.parent && node.parent.type === _experimentalUtils.AST_NODE_TYPES.AwaitExpression) {
          return;
        }

        const testFunction = findTestFunction(node);

        if (testFunction && !isHavingAsyncCallBackParam(testFunction)) {
          const {
            body
          } = testFunction;
          /* istanbul ignore if https://github.com/typescript-eslint/typescript-eslint/issues/734 */

          if (!body) {
            throw new Error(`Unexpected null when attempting to fix ${context.getFilename()} - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
          }

          if (body.type !== _experimentalUtils.AST_NODE_TYPES.BlockStatement) {
            return;
          }

          const testFunctionBody = body.body;
          const [fulfillmentCallback, rejectionCallback] = node.arguments; // then block can have two args, fulfillment & rejection
          // then block can have one args, fulfillment
          // catch block can have one args, rejection
          // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

          verifyExpectWithReturn([fulfillmentCallback, rejectionCallback], node.callee, context, testFunctionBody);
        }
      }

    };
  }

});

exports.default = _default;