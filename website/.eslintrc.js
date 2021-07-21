module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript'
  ],
  rules: {
    "@typescript-eslint/no-use-before-define": "warn",
    "max-len": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
  }
};