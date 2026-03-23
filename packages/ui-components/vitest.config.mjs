import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  test: {
    //
    /**
     * The environment to run the tests in.
     * @see https://vitest.dev/config/#environment
     */
    environment: 'jsdom',
    /**
     * Whether to expose global variables like `describe`, `it`, `expect`.
     * @see https://vitest.dev/config/#globals
     */
    globals: true,
    /**
     * The files to run before each test file.
     * @see https://vitest.dev/config/#setupfiles
     */
    setupFiles: ['./vitest/setup.ts'],
    /**
     * The files to exclude from the tests.
     * @see https://vitest.dev/config/#exclude
     */
    exclude: ['**/node_modules/**', '**/build/**'],
    /**
     * The snapshot format options.
     * @see https://vitest.dev/config/#snapshotformat
     */
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    /**
     * The snapshot serializers to use.
     * @see https://vitest.dev/config/#snapshotserializers
     */
    snapshotSerializers: ['./vitest/vitestSerializer.ts'],
    /**
     * The aliases to use for imports.
     * @see https://vitest.dev/config/#alias
     */
    alias: {
      // https://github.com/vitest-dev/vitest/issues/5664#issuecomment-2093986338
      '@emotion/react': path.resolve('node_modules/@emotion/react/dist/emotion-react.cjs.mjs'),
      '\\.(s?css)$': './vitest/identity.js',
      '\\.(png)$': './vitest/identity.js',
      '\\.(svg)$': './vitest/unit/empty.ts',
      '\\.(jpg)$': './vitest/unit/empty.ts',
      '\\.(md)$': './vitest/unit/empty-string.ts',
    },
    /**
     * The timeout for each test.
     * @see https://vitest.dev/config/#testtimeout
     */
    testTimeout: 20000,
    /**
     * The coverage options.
     * @see https://vitest.dev/config/#coverage
     */
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/build/**',
        '**stories.**',
        '**/src/**/*.test.{ts,tsx}',
        '**/src/**/*.stories.{ts,tsx}',
        '**/storybook-static/**/*',
        '**__partials__/**/*',
        'vitest/**',
        '.storybook/**',
        'node_modules',
        './ui-components/public',
        './src/ui-components/src/utils/__partials__/**',
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      'verdaccio-ui/components': path.resolve(__dirname, './src/components'),
      'verdaccio-ui/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
