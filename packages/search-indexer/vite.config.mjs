import { createLibConfig } from '../../vite.lib.config.mjs';

export default createLibConfig(import.meta.dirname, {
  bundleDeps: ['@orama/orama'],
});
