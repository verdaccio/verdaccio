'use strict';

const rule = require('../../../lib/rules/jsx-no-style');
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

ruleTester.run('jsx-no-style', rule, {
  valid: ['<div/>', '<div className="test"/>', '<div className={"test"}/>', '<div foo/>'],

  invalid: [
    {
      code: '<Link to="/" style={{ marginRight: \'1em\' }}/>',
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
    {
      code: `<span key={String(index)} href={suggestion.link} style={{ fontWeight: fontWeight.semiBold }}>
      {part.text}
    </span>`,
      errors: [{ message: rule.ERROR_MESSAGE }],
    },
  ],
});
