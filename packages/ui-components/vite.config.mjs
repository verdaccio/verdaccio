import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { createLibConfig } from '../../vite.lib.config.mjs';
import { svgInlinePlugin, linkEntryCssPlugin } from './tools/vite-plugins.mjs';

const baseConfig = createLibConfig(import.meta.dirname,
  { bundleDeps: ['react/jsx-runtime', 'react/jsx-dev-runtime'] }
);

export default defineConfig({
  ...baseConfig,
  plugins: [
    react(),
    svgInlinePlugin(),
    linkEntryCssPlugin(),
    ...baseConfig.plugins,
  ],
});
