import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'cypress';

import { setupVerdaccioTasks } from '@verdaccio/e2e-ui';

const registryUrl = process.env.VERDACCIO_URL || 'http://localhost:4873';

const watchers: Record<string, fs.FSWatcher> = {};

/**
 * Bundle spec/support files with Vite. TypeScript 7 no longer ships the JS
 * compiler API that Cypress's default webpack/ts-loader preprocessor relies
 * on. Vite is imported dynamically at preprocess time: Cypress bundles this
 * config file (and anything it imports statically) with its own packaged
 * webpack, and a bundled copy of Vite crashes rolldown's native binding.
 */
async function viteBundle(file: Cypress.FileObject): Promise<string> {
  const { filePath, outputPath, shouldWatch } = file;

  if (shouldWatch && !watchers[filePath]) {
    watchers[filePath] = fs.watch(filePath, () => file.emit('rerun'));
    file.on('close', () => {
      watchers[filePath]?.close();
      delete watchers[filePath];
    });
  }

  const { build } = await import('vite');
  const fileName = path.basename(outputPath);
  const globalName = `spec_${fileName.replace(/\W/g, '_')}`;

  await build({
    configFile: false,
    logLevel: 'warn',
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test'),
    },
    resolve: {
      alias: [
        // @verdaccio/e2e-ui mixes browser test suites and Node-only cy.task
        // implementations in one entry point; stub the Node builtins out of
        // the browser spec bundle (they are only invoked inside the tasks,
        // which run in the Cypress server process).
        {
          find: /^(node:)?(fs|fs\/promises|child_process|os|path)$/,
          replacement: path.resolve(__dirname, './cypress/support/node-builtins-stub.cjs'),
        },
      ],
    },
    build: {
      emptyOutDir: false,
      minify: false,
      outDir: path.dirname(outputPath),
      sourcemap: true,
      write: true,
      watch: null,
      lib: {
        entry: filePath,
        fileName: () => fileName,
        formats: ['umd'],
        name: globalName,
      },
    },
  });

  return outputPath;
}

export default defineConfig({
  e2e: {
    baseUrl: registryUrl,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', viteBundle);
      setupVerdaccioTasks(on, { registryUrl });
    },
  },
  video: false,
  screenshotOnRunFailure: false,
  env: {
    VERDACCIO_URL: registryUrl,
  },
});
