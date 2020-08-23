"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

// todo: refactor into "ban-matchers"
var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow using `toBeTruthy()` & `toBeFalsy()`',
      recommended: false
    },
    messages: {
      avoidMatcher: 'Avoid {{ matcherName }}'
    },
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

        if (!matcher || !['toBeTruthy', 'toBeFalsy'].includes(matcher.name)) {
          return;
        }

        context.report({
          messageId: 'avoidMatcher',
          node: matcher.node.property,
          data: {
            matcherName: matcher.name
          }
        });
      }

    };
  }

});

exports.default = _default;