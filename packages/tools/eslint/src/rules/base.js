module.exports = {
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['import'],
  rules: {
    curly: ['error', 'all'],
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
    // disabled in favor of @typescript-eslint/no-unused-vars
    'no-unused-vars': 'off',
    'max-len': ['error', 100],
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
    'prefer-promise-reject-errors': ['warn'],

    '@typescript-eslint/prefer-optional-chain': ['warn'],
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
