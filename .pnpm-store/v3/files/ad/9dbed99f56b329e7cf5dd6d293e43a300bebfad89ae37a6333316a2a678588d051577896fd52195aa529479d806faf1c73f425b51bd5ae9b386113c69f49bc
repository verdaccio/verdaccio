/**
 * @fileoverview check the usage of nested objects as classnames
 * @author
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const ERROR_MESSAGE = 'className attribute with object expression is not allowed jsx elements.';
module.exports = {
  ERROR_MESSAGE: ERROR_MESSAGE,
  meta: {
    docs: {
      description: 'check the usage of nested objects as classnames',
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
          if (
            decl.type === 'JSXAttribute' &&
            decl.name.name === 'className' &&
            decl.value.type === 'JSXExpressionContainer'
          ) {
            if (decl.value.expression.type === 'ObjectExpression') {
              context.report({
                node: node,
                message: ERROR_MESSAGE,
              });
              return true;
            }
          }

          return false;
        });

        return;
      },
    };
  },
};
