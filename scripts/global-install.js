#!/usr/bin/env node

/**
 * Builds, packs, and installs verdaccio globally from the local workspace.
 *
 * Workspace dependencies (@verdaccio/middleware, @verdaccio/ui-theme, etc.)
 * are packed separately and overlaid on top of the global install so that
 * local changes are reflected.
 *
 * Usage:
 *   pnpm global:install
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function runCapture(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', ...opts }).trim();
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verdaccio-global-'));
console.log(`Temp directory: ${tmpDir}`);

// Workspace packages to overlay on the global install
const OVERLAY_PACKAGES = [
  { dir: 'packages/middleware', scope: '@verdaccio/middleware' },
  { dir: 'packages/plugins/ui-theme', scope: '@verdaccio/ui-theme' },
  { dir: 'packages/proxy', scope: '@verdaccio/proxy' },
  { dir: 'packages/core/core', scope: '@verdaccio/core' },
  { dir: 'packages/server/express', scope: '@verdaccio/server' },
  { dir: 'packages/config', scope: '@verdaccio/config' },
];

// 1. Pack verdaccio itself
console.log('\nPacking verdaccio...');
run(`pnpm pack --pack-destination "${tmpDir}"`, { cwd: path.join(ROOT, 'packages/verdaccio') });

// 2. Install globally from tarball
const tarballs = fs
  .readdirSync(tmpDir)
  .filter((f) => f.startsWith('verdaccio-') && f.endsWith('.tgz'));
if (tarballs.length === 0) {
  console.error('No tarball found');
  process.exit(1);
}
const mainTarball = path.join(tmpDir, tarballs[0]);
console.log(`\nInstalling globally: ${mainTarball}`);
run(`npm install -g "${mainTarball}"`);

// 3. Find the global install location
const globalRoot = runCapture('npm root -g');
const globalVerdaccio = path.join(globalRoot, 'verdaccio', 'node_modules');

// 4. Pack and overlay workspace dependencies
for (const pkg of OVERLAY_PACKAGES) {
  const pkgDir = path.join(ROOT, pkg.dir);
  if (!fs.existsSync(pkgDir)) {
    console.warn(`Skipping ${pkg.scope}: directory not found`);
    continue;
  }

  const targetDir = path.join(globalVerdaccio, ...pkg.scope.split('/'));
  if (!fs.existsSync(targetDir)) {
    console.log(`Skipping ${pkg.scope}: not in global install`);
    continue;
  }

  console.log(`\nOverlaying ${pkg.scope}...`);
  run(`pnpm pack --pack-destination "${tmpDir}"`, { cwd: pkgDir });

  // Find the tarball (take the most recent one matching the package name)
  const pkgName = pkg.scope.replace('@verdaccio/', 'verdaccio-');
  const pkgTarball = fs
    .readdirSync(tmpDir)
    .filter((f) => f.startsWith(pkgName) && f.endsWith('.tgz'))
    .sort()
    .pop();

  if (!pkgTarball) {
    console.warn(`No tarball found for ${pkg.scope}`);
    continue;
  }

  run(`tar xzf "${path.join(tmpDir, pkgTarball)}" --strip-components=1 -C "${targetDir}"`);
}

// 5. Verify
const version = runCapture('verdaccio --version');
console.log(`\nInstalled verdaccio ${version}`);
console.log('Run: verdaccio');

// Cleanup
fs.rmSync(tmpDir, { recursive: true, force: true });
