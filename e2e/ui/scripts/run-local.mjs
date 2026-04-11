#!/usr/bin/env node
// Orchestrates a local e2e UI run with a clean, throwaway storage so reruns
// never collide on already-published packages or stale users.
//
// Steps:
//   1. Create a temp dir under os.tmpdir().
//   2. Materialize a Verdaccio config inside it with absolute paths for
//      `storage`, `plugins`, and `auth.htpasswd.file`.
//   3. Spawn `node packages/verdaccio/bin/verdaccio --config <tmp-config>`.
//   4. Poll /-/ping until it answers.
//   5. PUT the `test` / `test` user the signin suite needs.
//   6. Spawn cypress (run or open, controlled by --open).
//   7. Tear down: kill verdaccio, remove the temp dir, propagate cypress's
//      exit code.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2eUiRoot = resolve(__dirname, '..');
const repoRoot = resolve(e2eUiRoot, '../..');
const verdaccioBin = resolve(repoRoot, 'packages/verdaccio/bin/verdaccio');
const baseConfigPath = resolve(e2eUiRoot, 'config/config.yaml');
const registryUrl = 'http://localhost:4873';

const openMode = process.argv.includes('--open');

const tempDir = mkdtempSync(resolve(tmpdir(), 'verdaccio-e2e-ui-'));
const tempConfigPath = resolve(tempDir, 'config.yaml');
const tempStoragePath = resolve(tempDir, 'storage');
const tempHtpasswdPath = resolve(tempDir, 'htpasswd');

// Materialize a config that points every path-based field at the temp dir.
// `plugins` is removed entirely so verdaccio falls back to the built-in
// defaults instead of looking for a non-existent ./plugins folder next to
// the temp config.
const baseConfig = readFileSync(baseConfigPath, 'utf8');
const tempConfig = baseConfig
  .replace(/^storage:.*$/m, `storage: ${tempStoragePath}`)
  .replace(/^plugins:.*\n/m, '')
  .replace(/^(\s*file:\s*).*$/m, `$1${tempHtpasswdPath}`);
writeFileSync(tempConfigPath, tempConfig);

console.log(`[e2e-ui] temp dir: ${tempDir}`);
console.log(`[e2e-ui] config:   ${tempConfigPath}`);

let verdaccioProc = null;
let cypressProc = null;
let cleanedUp = false;

function cleanup(exitCode) {
  if (cleanedUp) return;
  cleanedUp = true;
  if (verdaccioProc && verdaccioProc.exitCode === null) {
    try {
      verdaccioProc.kill('SIGTERM');
    } catch {}
  }
  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch (err) {
    console.warn(`[e2e-ui] failed to remove temp dir: ${err.message}`);
  }
  process.exit(exitCode);
}

for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => cleanup(130));
}

async function waitForPing(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${url}/-/ping`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Verdaccio did not respond at ${url}/-/ping`);
}

async function createSigninUser() {
  const res = await fetch(`${registryUrl}/-/user/org.couchdb.user:test`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'test',
      password: 'test',
      _id: 'org.couchdb.user:test',
      type: 'user',
      roles: [],
    }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`Failed to create test user: HTTP ${res.status}`);
  }
}

async function main() {
  console.log('[e2e-ui] starting verdaccio…');
  verdaccioProc = spawn('node', [verdaccioBin, '--config', tempConfigPath], {
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, NODE_ENV: 'production' },
  });
  verdaccioProc.on('exit', (code, signal) => {
    if (!cleanedUp) {
      console.error(`[e2e-ui] verdaccio exited unexpectedly (code=${code} signal=${signal})`);
      cleanup(code ?? 1);
    }
  });

  await waitForPing(registryUrl);
  console.log('[e2e-ui] verdaccio is up');

  await createSigninUser();
  console.log('[e2e-ui] test user ready');

  const cypressArgs = openMode ? ['cypress', 'open'] : ['cypress', 'run'];
  console.log(`[e2e-ui] launching ${cypressArgs.join(' ')}…`);
  cypressProc = spawn('pnpm', ['exec', ...cypressArgs], {
    stdio: 'inherit',
    cwd: e2eUiRoot,
    env: { ...process.env, VERDACCIO_URL: registryUrl },
  });

  cypressProc.on('exit', (code) => cleanup(code ?? 1));
}

main().catch((err) => {
  console.error('[e2e-ui]', err);
  cleanup(1);
});
