module.exports = {
  extends: [
    'eslint:recommended',
    'google',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'jest', 'prettier'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    __APP_VERSION__: true,
  },
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  rules: {
    curly: ['error', 'all'],
    'jest/no-export': 0,
    'jest/no-test-callback': 0,
    'jest/expect-expect': 0,
    'jest/valid-title': 0,
    'jest/no-try-expect': 0,
    'jest/no-done-callback': 'off',
    'jest/no-conditional-expect': 'off',
    'keyword-spacing': 'off',
    'no-tabs': 'off',
    'no-useless-escape': 'off',
    'padded-blocks': 'off',
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'eol-last': 'error',
    'no-irregular-whitespace': 'error',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-trailing-spaces': 'error',
    camelcase: 'off',
    'guard-for-in': 'error',
    'new-cap': 'error',
    'max-len': ['error', 180],
    'no-console': ['error', { allow: ['warn'] }],
    'no-constant-condition': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'error',
    'no-new-require': 'error',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-var': 'error',
    'one-var': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'handle-callback-err': 0,
    'prefer-const': 0,
    // typescript
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/array-type': ['error'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,

    // rules to fix
    'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
    'jest/no-identical-title': ['warn'],
    'prefer-promise-reject-errors': ['warn'],
    'jest/no-disabled-tests': ['warn'],
    'jest/no-commented-out-tests': ['warn'],
    '@typescript-eslint/prefer-optional-chain': ['warn'],
    '@typescript-eslint/explicit-member-accessibility': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};
