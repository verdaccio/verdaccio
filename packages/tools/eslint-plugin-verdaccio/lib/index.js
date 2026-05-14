'use strict';

const jsxSpread = require('./rules/jsx-spread');
const jsxNoStyle = require('./rules/jsx-no-style');
const jsxNoClassnameObject = require('./rules/jsx-no-classname-object');

const plugin = {
  meta: {
    name: 'eslint-plugin-verdaccio',
    version: '10.0.0',
  },
  rules: {
    'jsx-spread': jsxSpread,
    'jsx-no-style': jsxNoStyle,
    'jsx-no-classname-object': jsxNoClassnameObject,
  },
  configs: {},
};

// Flat config: self-referencing plugin
plugin.configs.recommended = [
  {
    plugins: {
      verdaccio: plugin,
    },
    rules: {
      'verdaccio/jsx-spread': 'error',
      'verdaccio/jsx-no-style': 'error',
      'verdaccio/jsx-no-classname-object': 'error',
    },
  },
];

module.exports = plugin;
