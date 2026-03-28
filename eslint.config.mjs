import verdaccio from '@verdaccio/eslint-config';

const ignores = [
  {
    ignores: [
      '**/debug/**',
      '**/build/**',
      'vite.config.ts',
      'vitest.config.mjs',
      '**/test/types-test/**/*.ts',
      '**/test/types-test/plugins/**/*.ts',
    ],
  },
];

const testFilePatterns = [
  '**/*.{test,spec}.{js,ts,jsx,tsx}',
  '**/tests/**/*.{ts,tsx}',
  '**/test/**/*.{ts,tsx}',
  '**/__tests__/**/*.{ts,tsx}',
  '**/__mocks__/**/*.{ts,tsx}',
];

export default [
  ...verdaccio,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: testFilePatterns,
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': 'off',
    },
  },
  {
    rules: {
      'no-useless-escape': 'off',
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...ignores,
];
