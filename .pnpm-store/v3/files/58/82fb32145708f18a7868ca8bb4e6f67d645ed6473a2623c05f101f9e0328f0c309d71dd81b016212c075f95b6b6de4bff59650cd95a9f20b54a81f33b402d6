/**
 * @fileoverview spread over jsx
 * @author verdaccio
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const ERROR_MESSAGE = 'spread operator is not allowed jsx elements.';
const rule = {
  ERROR_MESSAGE: ERROR_MESSAGE,
  meta: {
    docs: {
      description: 'spread over jsx',
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

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      JSXOpeningElement: function(node) {
        if (node.attributes.length === 0 || configuration === 'never') {
          return;
        }

        node.attributes.some(decl => {
          if (decl.type === 'JSXSpreadAttribute') {
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

module.exports = rule;
