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
      description: 'Use `.only` and `.skip` over `f` and `x`',
      recommended: 'error'
    },
    messages: {
      usePreferredName: 'Use "{{ preferredNodeName }}" instead'
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion'
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(node) {
        const nodeName = (0, _utils.getNodeName)(node.callee);
        if (!nodeName || !(0, _utils.isDescribe)(node) && !(0, _utils.isTestCase)(node)) return;
        const preferredNodeName = getPreferredNodeName(nodeName);
        if (!preferredNodeName) return;
        context.report({
          messageId: 'usePreferredName',
          node: node.callee,
          data: {
            preferredNodeName
          },

          fix(fixer) {
            return [fixer.replaceText(node.callee, preferredNodeName)];
          }

        });
      }

    };
  }

});

exports.default = _default;

function getPreferredNodeName(nodeName) {
  const firstChar = nodeName.charAt(0);

  if (firstChar === 'f') {
    return `${nodeName.slice(1)}.only`;
  }

  if (firstChar === 'x') {
    return `${nodeName.slice(1)}.skip`;
  }

  return null;
}