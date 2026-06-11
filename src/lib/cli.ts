#!/usr/bin/env node
import { runCli } from '@verdaccio/cli';

import { startServer } from './run-server';

const pkgVersion = process.env.PACKAGE_VERSION || 'dev';

if (pkgVersion.includes('canary')) {
  console.warn(
    '\n' +
      '⚠️  WARNING: You are running a CANARY build of Verdaccio (v' +
      pkgVersion +
      ').\n' +
      '   This is an unstable pre-release version meant for testing only.\n' +
      '   Do not use in production. For stable releases: npm install -g verdaccio\n'
  );
}

// Reuse @verdaccio/cli's command set, but inject 7.x's server factory so the
// registry boots with the legacy-callback-capable Storage.
runCli({ startServer, version: pkgVersion, pkgName: 'verdaccio' });
