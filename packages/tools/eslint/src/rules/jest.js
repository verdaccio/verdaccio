module.exports = {
  extends: ['plugin:jest/recommended'],
  plugins: ['jest'],
  env: {
    jest: true,
  },
  rules: {
    'jest/no-export': 0,
    'jest/no-test-callback': 0,
    'jest/expect-expect': 0,
    'jest/no-try-expect': 0,
    'jest/no-done-callback': 'off',
    'jest/no-conditional-expect': 'off',
    // rules to fix
    'jest/no-identical-title': ['warn'],
    'jest/no-disabled-tests': ['warn'],
    'jest/no-commented-out-tests': ['warn'],
  },
};
