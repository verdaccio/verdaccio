"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _experimentalUtils = require("@typescript-eslint/experimental-utils");

var _utils = require("./utils");

const trimFXprefix = word => ['f', 'x'].includes(word.charAt(0)) ? word.substr(1) : word;

const doesBinaryExpressionContainStringNode = binaryExp => {
  if ((0, _utils.isStringNode)(binaryExp.right)) {
    return true;
  }

  if (binaryExp.left.type === _experimentalUtils.AST_NODE_TYPES.BinaryExpression) {
    return doesBinaryExpressionContainStringNode(binaryExp.left);
  }

  return (0, _utils.isStringNode)(binaryExp.left);
};

const quoteStringValue = node => node.type === _experimentalUtils.AST_NODE_TYPES.TemplateLiteral ? `\`${node.quasis[0].value.raw}\`` : node.raw;

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce valid titles',
      recommended: false
    },
    messages: {
      titleMustBeString: 'Title must be a string',
      emptyTitle: '{{ jestFunctionName }} should not have an empty title',
      duplicatePrefix: 'should not have duplicate prefix',
      accidentalSpace: 'should not have leading or trailing spaces',
      disallowedWord: '"{{ word }}" is not allowed in test titles.'
    },
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        ignoreTypeOfDescribeName: {
          type: 'boolean',
          default: false
        },
        disallowedWords: {
          type: 'array',
          items: {
            type: 'string'
          },
          default: []
        }
      },
      additionalProperties: false
    }],
    fixable: 'code'
  },
  defaultOptions: [{
    ignoreTypeOfDescribeName: false,
    disallowedWords: []
  }],

  create(context, [{
    ignoreTypeOfDescribeName,
    disallowedWords
  }]) {
    const disallowedWordsRegexp = new RegExp(`\\b(${disallowedWords.join('|')})\\b`, 'iu');
    return {
      CallExpression(node) {
        if (!(0, _utils.isDescribe)(node) && !(0, _utils.isTestCase)(node)) {
          return;
        }

        const [argument] = (0, _utils.getJestFunctionArguments)(node);

        if (!argument) {
          return;
        }

        if (!(0, _utils.isStringNode)(argument)) {
          if (argument.type === _experimentalUtils.AST_NODE_TYPES.BinaryExpression && doesBinaryExpressionContainStringNode(argument)) {
            return;
          }

          if (argument.type !== _experimentalUtils.AST_NODE_TYPES.TemplateLiteral && !(ignoreTypeOfDescribeName && (0, _utils.isDescribe)(node))) {
            context.report({
              messageId: 'titleMustBeString',
              loc: argument.loc
            });
          }

          return;
        }

        const title = (0, _utils.getStringValue)(argument);

        if (!title) {
          context.report({
            messageId: 'emptyTitle',
            data: {
              jestFunctionName: (0, _utils.isDescribe)(node) ? _utils.DescribeAlias.describe : _utils.TestCaseName.test
            },
            node
          });
          return;
        }

        if (disallowedWords.length > 0) {
          const disallowedMatch = disallowedWordsRegexp.exec(title);

          if (disallowedMatch) {
            context.report({
              data: {
                word: disallowedMatch[1]
              },
              messageId: 'disallowedWord',
              node: argument
            });
            return;
          }
        }

        if (title.trim().length !== title.length) {
          context.report({
            messageId: 'accidentalSpace',
            node: argument,
            fix: fixer => [fixer.replaceTextRange(argument.range, quoteStringValue(argument).replace(/^([`'"]) +?/u, '$1').replace(/ +?([`'"])$/u, '$1'))]
          });
        }

        const nodeName = trimFXprefix((0, _utils.getNodeName)(node.callee));
        const [firstWord] = title.split(' ');

        if (firstWord.toLowerCase() === nodeName) {
          context.report({
            messageId: 'duplicatePrefix',
            node: argument,
            fix: fixer => [fixer.replaceTextRange(argument.range, quoteStringValue(argument).replace(/^([`'"]).+? /u, '$1'))]
          });
        }
      }

    };
  }

});

exports.default = _default;