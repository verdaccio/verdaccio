import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

import { generatePackageMetadata } from '@verdaccio/test-helper';

const execFileAsync = promisify(execFile);

test.each(['import', 'require'])('loads the compiled package through %s', async (mode) => {
  const document = generatePackageMetadata('@scope/verdaccio').versions['1.0.0'];
  const script = `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    const { SearchMemoryIndexer: indexer } = ${mode === 'import' ? "await import('@verdaccio/search-indexer')" : "createRequire(import.meta.url)('@verdaccio/search-indexer')"};
    const document = JSON.parse(process.argv[1]);
    indexer.configureStorage({ getLocalDatabase: callback => callback(null, [document]) });
    await indexer.init({ error: error => { throw error; } });
    const result = await indexer.query('verdaccio');
    assert.equal(result.count, 1);
    assert.equal(result.hits[0].document.name, document.name);
    assert.equal(typeof result.elapsed.raw, 'number');
    await indexer.remove(document.name);
    assert.equal((await indexer.query('')).count, 0);
  `;

  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    ['--input-type=module', '-e', script, JSON.stringify(document)],
    { cwd: new URL('..', import.meta.url), timeout: 5000 }
  );
  expect(stdout).toBe('');
  expect(stderr).toBe('');
});
