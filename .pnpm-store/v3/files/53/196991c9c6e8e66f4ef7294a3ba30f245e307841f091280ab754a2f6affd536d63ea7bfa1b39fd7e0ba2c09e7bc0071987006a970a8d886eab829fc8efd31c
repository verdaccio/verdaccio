/**
 * @fileoverview disallow style on jsx components
 * @author
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const ERROR_MESSAGE = 'style attribute is not allowed jsx elements.';

module.exports = {
  ERROR_MESSAGE: ERROR_MESSAGE,
  meta: {
    docs: {
      description: 'disallow style on jsx components',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        enum: ['always', 'never'],
      },
    ],
  },

  create: function(context) {
    // variables should be defined here
    const configuration = context.options[0] || 'always';

    return {
      JSXOpeningElement: function(node) {
        if (node.attributes.length === 0 || configuration === 'never') {
          return;
        }

        node.attributes.some(decl => {
          if (decl.type === 'JSXAttribute' && decl.name.name === 'style') {
            context.report({
              node: node,
              message: ERROR_MESSAGE,
            });
            return true;
          }

          return false;
        });

        return;
      },
    };
  },
};
