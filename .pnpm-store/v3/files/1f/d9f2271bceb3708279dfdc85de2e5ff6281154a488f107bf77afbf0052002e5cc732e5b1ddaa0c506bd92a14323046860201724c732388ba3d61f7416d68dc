"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const validTestCaseNames = [_utils.TestCaseName.test, _utils.TestCaseName.it];
const testFunctions = new Set([_utils.DescribeAlias.describe, ...validTestCaseNames]);

const isConcurrentExpression = expression => expression.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && (0, _utils.isSupportedAccessor)(expression.property, _utils.TestCaseProperty.concurrent) && !!expression.parent && expression.parent.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression;

const matchesTestFunction = object => 'name' in object && (object.name in _utils.TestCaseName || object.name in _utils.DescribeAlias);

const isCallToFocusedTestFunction = object => object.name.startsWith('f') && testFunctions.has(object.name.substring(1));

const isCallToTestOnlyFunction = callee => matchesTestFunction(callee.object) && (0, _utils.isSupportedAccessor)(isConcurrentExpression(callee) ? callee.parent.property : callee.property, 'only');

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow focused tests',
      recommended: false
    },
    messages: {
      focusedTest: 'Unexpected focused test.'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],
  create: context => ({
    CallExpression(node) {
      const callee = node.callee.type === _experimentalUtils.AST_NODE_TYPES.TaggedTemplateExpression ? node.callee.tag : node.callee;

      if (callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression) {
        if (callee.object.type === _experimentalUtils.AST_NODE_TYPES.Identifier && isCallToFocusedTestFunction(callee.object)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.object
          });
          return;
        }

        if (callee.object.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && isCallToTestOnlyFunction(callee.object)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.object.property
          });
          return;
        }

        if (isCallToTestOnlyFunction(callee)) {
          context.report({
            messageId: 'focusedTest',
            node: callee.property
          });
          return;
        }
      }

      if (callee.type === _experimentalUtils.AST_NODE_TYPES.Identifier && isCallToFocusedTestFunction(callee)) {
        context.report({
          messageId: 'focusedTest',
          node: callee
        });
      }
    }

  })
});

exports.default = _default;