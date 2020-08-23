'use strict';

module.exports = {
  configs: {
    recommended: {
      plugins: ['verdaccio'],
      rules: {
        'verdaccio/jsx-spread': 'error',
        'verdaccio/jsx-no-style': 'error',
        'verdaccio/jsx-no-classname-object': 'error',
      },
    },
  },
  rules: {
    'jsx-spread': require('./rules/jsx-spread'),
    'jsx-no-style': require('./rules/jsx-no-style'),
    'jsx-no-classname-object': require('./rules/jsx-no-classname-object'),
  },
  rulesConfig: {
    'jsx-spread': 2,
    'jsx-no-style': 2,
    'jsx-no-classname-object': 2,
  },
};
