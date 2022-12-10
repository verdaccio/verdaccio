/* eslint-disable no-console */
const { build } = require('esbuild');
const esbuildPluginPino = require('esbuild-plugin-pino');

build({
  banner: {
    js: `#!/usr/bin/env node\n/* eslint-disable */\n//prettier-ignore`,
  },
  entryPoints: ['./src/start.ts'],
  bundle: true,
  platform: `node`,
  target: `node16`,
  sourcemap: 'external',
  outdir: './build',
  plugins: [esbuildPluginPino({ transports: ['@verdaccio/logger-prettify'] })],
}).catch((err) => {
  console.error('err', err);
  process.exit(1);
});
