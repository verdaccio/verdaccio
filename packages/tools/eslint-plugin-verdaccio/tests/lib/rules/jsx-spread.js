'use strict';

const rule = require('../../../lib/rules/jsx-spread');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('jsx-spread', rule, {
  valid: [
    '<div foo="1" bar="1"/>',
    '<div/>',
    '<div foo bar/>',
    {
      code: '<div {...props}/>',
      options: ['never'],
    },
    {
      code: '<div {...props} foo={"1"}/>',
      options: ['never'],
    },
  ],

  invalid: [
    {
      code: '<div {...props}/>',
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
    {
      code: '<div foo {...props}/>',
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
    {
      code: '<div foo="1" {...props}/>',
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
    {
      code: '<Component foo="1" {...props}>test</Component>',
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
  ],
});
