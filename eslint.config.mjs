import verdaccio, {
  cypressConfig,
  vitestConfig,
} from '@verdaccio/eslint-config';
import vitest from '@vitest/eslint-plugin';
import reactX from 'eslint-plugin-react-x';
import verdaccioPlugin from 'eslint-plugin-verdaccio';

export default [
  ...verdaccio,
  ...vitestConfig,
  ...cypressConfig,

  // -----------------------------------------------
  // Disable type-checked rules for monorepo performance
  // (v12 enables project: true which OOMs on large monorepos)
  // -----------------------------------------------
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
        program: null,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      // no-undef does not work correctly with TypeScript without type-checking
      'no-undef': 'off',
      // Relax rules not present in v11 or producing too many errors
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // New ESLint 10 rules - warn for gradual adoption
      'preserve-caught-error': 'warn',
      'no-unassigned-vars': 'warn',
      'no-useless-assignment': 'warn',
    },
  },

  // -----------------------------------------------
  // React config (using eslint-plugin-react-x for ESLint 10 compat)
  // -----------------------------------------------
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-x': reactX,
    },
    rules: {
      ...reactX.configs['recommended-typescript'].rules,
    },
  },

  // -----------------------------------------------
  // Verdaccio custom rules
  // -----------------------------------------------
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      verdaccio: verdaccioPlugin,
    },
    rules: {
      ...verdaccioPlugin.configs.recommended.rules,
    },
  },

  // -----------------------------------------------
  // Global ignores (migrated from .eslintignore)
  // -----------------------------------------------
  {
    ignores: [
      'assets/**/*',
      '**/fixtures/**',
      '**/mock/store/**',
      '**/partials/**',
      '**/types/custom.d.ts',
      'build/',
      'coverage/',
      'node_modules/',
      'static/',
      'wiki/',
      'dist/',
      'docs/',
      'test/functional/store/*',
      'docker-examples/**/lib/**/*.js',
      'test/cli/e2e-yarn4/bin/yarn-4.0.0-rc.14.cjs',
      'yarn.js',
      'packages/ui-components/storybook-static',
      '**/static/**/*.js',
      '**/build/**',
      'dist.js',
      'bundle.js',
    ],
  },

  // -----------------------------------------------
  // Package-level overrides
  // -----------------------------------------------
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'no-useless-escape': 'off',
    },
  },

  // -----------------------------------------------
  // Core types package: relaxed TS strictness
  // -----------------------------------------------
  {
    files: ['packages/core/types/**/*.ts'],
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // -----------------------------------------------
  // Test files: relax rules for test ergonomics
  // -----------------------------------------------
  {
    files: [
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/__mocks__/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: [
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
    ],
    plugins: { vitest },
    rules: {
      'vitest/expect-expect': 'off',
      'vitest/no-conditional-expect': 'off',
      'vitest/no-standalone-expect': 'off',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-commented-out-tests': 'warn',
    },
  },

  // -----------------------------------------------
  // CLI package: allow console
  // -----------------------------------------------
  {
    files: ['packages/cli/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // -----------------------------------------------
  // Logger prettify: allow for-in without guard
  // -----------------------------------------------
  {
    files: ['packages/logger/logger-prettify/**/*.ts'],
    rules: {
      'guard-for-in': 'off',
    },
  },

  // -----------------------------------------------
  // Node API examples: allow console
  // -----------------------------------------------
  {
    files: ['packages/node-api/examples/**/*.{ts,js}'],
    rules: {
      'no-console': 'off',
    },
  },

  // -----------------------------------------------
  // UI theme tools: allow console
  // -----------------------------------------------
  {
    files: ['packages/plugins/ui-theme/tools/**/*.{ts,js}'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'log'] }],
    },
  },

  // -----------------------------------------------
  // Local publish scripts: allow console
  // -----------------------------------------------
  {
    files: ['packages/tools/local-publish/src/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // -----------------------------------------------
  // E2E tests: allow console and require imports
  // -----------------------------------------------
  {
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // -----------------------------------------------
  // Scripts: allow require imports
  // -----------------------------------------------
  {
    files: ['scripts/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  // -----------------------------------------------
  // Docker examples: relaxed rules
  // -----------------------------------------------
  {
    files: ['docker-examples/**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
