// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/debug/**',
      '**/build/**',
      '**/test/types-test/**/*.ts',
      '**/test/types-test/plugins/**/*.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // JS files with CommonJS (module.exports, require)
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        exports: 'readonly',
      },
    },
  },

  // TS files with ESM-style
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module', // Typical for TS with `import/export`
      },
    },
  },

  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.js',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.js',
      'test/unit/**/*.ts',
      'test/unit/**/*.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-empty-object-types': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    rules: {
      'no-useless-escape': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
