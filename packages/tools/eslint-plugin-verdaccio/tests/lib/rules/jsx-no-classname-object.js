'use strict';

const rule = require('../../../lib/rules/jsx-no-classname-object');
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

ruleTester.run('jsx-no-classname-object', rule, {
  valid: [
    '<div className="{}"/>',
    '<div className={"test"}/>',
    '<div className="test"/>',
    '<div className={this.getClassName()}/>',
  ],

  invalid: [
    {
      code: "<div className={{fontSize: '12px'}}/>",
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
  ],
});
