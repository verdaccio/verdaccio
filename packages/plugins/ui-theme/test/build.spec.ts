import path from 'node:path';
import { build } from 'vite';
import type { Rolldown } from 'vite';
import { describe, expect, test } from 'vitest';

describe('production build', () => {
  test('loads its files relative to the entry, so the UI works under url_prefix', async () => {
    const result = (await build({
      configFile: path.resolve(import.meta.dirname, '../vite.config.mjs'),
      logLevel: 'silent',
      build: { write: false },
    })) as Rolldown.RolldownOutput;

    const chunks = result.output.filter((file) => file.type === 'chunk');
    expect(chunks.some((chunk) => chunk.dynamicImports.length > 0)).toBe(true);
    const rootAbsolute = chunks.filter((chunk) => /["'`]\/-\/static\//.test(chunk.code));
    expect(rootAbsolute.map((chunk) => chunk.fileName)).toEqual([]);
  }, 60_000);
});
