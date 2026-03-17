import { createLibConfig } from '../../vite.lib.config.mjs';

export default createLibConfig(import.meta.dirname, {
  entry: ['src/index.ts', 'src/start.ts'],
});
