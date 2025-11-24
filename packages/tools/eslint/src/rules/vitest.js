module.exports = {
  // TODO: replace with plugin:@vitest/recommended after update to ESLint 9
  extends: ['plugin:@vitest/legacy-recommended', 'plugin:vitest-globals/recommended'],
  plugins: ['@vitest'],
  env: {
    'vitest-globals/env': true,
  },
  rules: {
    '@vitest/expect-expect': 'off',
    // rules to fix
    '@vitest/no-identical-title': ['warn'],
    '@vitest/no-disabled-tests': ['warn'],
    '@vitest/no-commented-out-tests': ['warn'],
    // TODO: Decide whether to use globals or not
    // '@vitest/prefer-importing-vitest-globals': ['warn'],
    // '@vitest/no-importing-vitest-globals': ['warn'],
  },
};
