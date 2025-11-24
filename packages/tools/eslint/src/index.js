module.exports = {
  extends: [
    './rules/base.js',
    './rules/prettier.js',
    './rules/react.js',
    './rules/vitest.js',
    './rules/cypress.js',
  ],
  env: {
    es6: true,
    node: true,
  },
  globals: {
    __APP_VERSION__: true,
    NodeJS: true,
    cy: true,
  },
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
};
