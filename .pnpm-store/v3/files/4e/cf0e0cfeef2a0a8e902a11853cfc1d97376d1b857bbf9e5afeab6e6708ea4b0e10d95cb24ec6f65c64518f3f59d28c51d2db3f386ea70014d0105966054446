"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const getBlockType = stmt => {
  const func = stmt.parent;
  /* istanbul ignore if */

  if (!func) {
    throw new Error(`Unexpected BlockStatement. No parent defined. - please file a github issue at https://github.com/jest-community/eslint-plugin-jest`);
  } // functionDeclaration: function func() {}


  if (func.type === _experimentalUtils.AST_NODE_TYPES.FunctionDeclaration) {
    return 'function';
  }

  if ((0, _utils.isFunction)(func) && func.parent) {
    const expr = func.parent; // arrowfunction or function expr

    if (expr.type === _experimentalUtils.AST_NODE_TYPES.VariableDeclarator) {
      return 'function';
    } // if it's not a variable, it will be callExpr, we only care about describe


    if (expr.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && (0, _utils.isDescribe)(expr)) {
      return _utils.DescribeAlias.describe;
    }
  }

  return null;
};

const isEach = node => node.callee.type === _experimentalUtils.AST_NODE_TYPES.CallExpression && node.callee.callee.type === _experimentalUtils.AST_NODE_TYPES.MemberExpression && node.callee.callee.property.type === _experimentalUtils.AST_NODE_TYPES.Identifier && node.callee.callee.property.name === 'each' && node.callee.callee.object.type === _experimentalUtils.AST_NODE_TYPES.Identifier && _utils.TestCaseName.hasOwnProperty(node.callee.callee.object.name);

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prevents expects that are outside of an it or test block.',
      recommended: false
    },
    messages: {
      unexpectedExpect: 'Expect must be inside of a test block.'
    },
    type: 'suggestion',
    schema: []
  },
  defaultOptions: [],

  create(context) {
    const callStack = [];
    return {
      CallExpression(node) {
        if ((0, _utils.isExpectCall)(node)) {
          const parent = callStack[callStack.length - 1];

          if (!parent || parent === _utils.DescribeAlias.describe) {
            context.report({
              node,
              messageId: 'unexpectedExpect'
            });
          }

          return;
        }

        if ((0, _utils.isTestCase)(node)) {
          callStack.push(_utils.TestCaseName.test);
        }

        if (node.callee.type === _experimentalUtils.AST_NODE_TYPES.TaggedTemplateExpression) {
          callStack.push('template');
        }
      },

      'CallExpression:exit'(node) {
        const top = callStack[callStack.length - 1];

        if (((0, _utils.isTestCase)(node) && node.callee.type !== _experimentalUtils.AST_NODE_TYPES.MemberExpression || isEach(node)) && top === _utils.TestCaseName.test || node.callee.type === _experimentalUtils.AST_NODE_TYPES.TaggedTemplateExpression && top === 'template') {
          callStack.pop();
        }
      },

      BlockStatement(stmt) {
        const blockType = getBlockType(stmt);

        if (blockType) {
          callStack.push(blockType);
        }
      },

      'BlockStatement:exit'(stmt) {
        const blockType = getBlockType(stmt);

        if (blockType && blockType === callStack[callStack.length - 1]) {
          callStack.pop();
        }
      },

      ArrowFunctionExpression(node) {
        if (node.parent && node.parent.type !== _experimentalUtils.AST_NODE_TYPES.CallExpression) {
          callStack.push('arrowFunc');
        }
      },

      'ArrowFunctionExpression:exit'() {
        if (callStack[callStack.length - 1] === 'arrowFunc') {
          callStack.pop();
        }
      }

    };
  }

});

exports.default = _default;