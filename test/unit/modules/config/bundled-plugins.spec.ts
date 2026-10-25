import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';

const { dependencies } = JSON.parse(
  readFileSync(path.join(import.meta.dirname, '../../../../package.json'), 'utf8')
);

// plugin keys are either a bare suffix (`htpasswd`) or a full package name (`@verdaccio/package-filter`)
const toPackageName = (key: string) => (key.startsWith('@') ? key : `verdaccio-${key}`);

const pluginsOf = (config: Record<string, any>): string[] =>
  ['auth', 'middlewares', 'filters', 'store'].flatMap((section) =>
    Object.keys(config[section] ?? {}).map(toPackageName)
  );

describe('bundled plugins', () => {
  test.each(['default.yaml', 'docker.yaml'])(
    'every plugin enabled in %s ships with the verdaccio package',
    (file) => {
      const plugins = pluginsOf(getDefaultConfig(file));
      expect(plugins).toContain('@verdaccio/package-filter');
      for (const plugin of plugins) {
        expect(dependencies, `${plugin} is enabled in ${file}`).toHaveProperty(plugin);
      }
    }
  );
});
