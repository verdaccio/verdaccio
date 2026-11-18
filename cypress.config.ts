import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';

import { defineConfig } from 'cypress';

import { setupVerdaccioTasks } from '@verdaccio/e2e-ui';

const registryUrl = process.env.VERDACCIO_URL || 'http://localhost:4873';

let routingServer: Server | undefined;
let routingStorage: string | undefined;

function registryUrls(listener: Server) {
  const publishUrl = `http://127.0.0.1:${(listener.address() as AddressInfo).port}`;
  return { registryUrl: `${publishUrl}/registry`, publishUrl };
}

async function closeRoutingServer(listener: Server) {
  if (!listener.listening) return;
  listener.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    listener.close((error) => (error ? reject(error) : resolve()));
  });
}

async function stopRoutingRegistry() {
  const listener = routingServer;
  const storage = routingStorage;
  routingServer = undefined;
  routingStorage = undefined;
  try {
    if (listener) await closeRoutingServer(listener);
  } finally {
    if (storage) await rm(storage, { recursive: true, force: true });
  }
  return null;
}

async function startRoutingRegistry(projectRoot: string) {
  if (routingServer) return registryUrls(routingServer);
  if (!existsSync(path.join(projectRoot, 'build/api/index.js'))) {
    throw new Error('Run "yarn build" before running the prefixed routing suite.');
  }
  const local = createRequire(path.join(projectRoot, 'package.json'));
  const express = local('express');
  const { default: createApp } = local('./build/api/index.js');
  const { setup } = local('./build/lib/logger/index.js');
  const storage = await mkdtemp(path.join(os.tmpdir(), 'verdaccio-routing-e2e-'));
  let listener: Server | undefined;
  try {
    const plugins = path.join(storage, 'plugins');
    await mkdir(plugins);
    await writeFile(
      path.join(plugins, 'verdaccio-routing-delay.js'),
      'module.exports = () => ({ register_middlewares(app) { app.use(async (_req, _res, next) => { await Promise.resolve(); next(); }); } });'
    );
    const configPath = path.join(storage, 'config.yaml');
    await writeFile(configPath, '');
    const config = {
      storage: path.join(storage, 'data'),
      self_path: configPath,
      configPath,
      url_prefix: '/registry',
      auth: { htpasswd: { file: path.join(storage, 'htpasswd') } },
      uplinks: {},
      packages: { '**': { access: '$all', publish: '$all', unpublish: '$all' } },
      plugins,
      middlewares: { 'routing-delay': {} },
      web: { enable: true, title: 'Verdaccio routing' },
      log: { type: 'stdout', format: 'json', level: 'warn' },
    };
    setup(config.log);
    const registry = await createApp(config);
    const app = express();
    app.use('/registry', registry);
    // Fixture publishing uses the root; browser requests exercise the prefixed mount.
    app.use('/', registry);
    listener = app.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    routingServer = listener;
    routingStorage = storage;
    return registryUrls(listener);
  } catch (error) {
    await Promise.allSettled([
      ...(listener ? [closeRoutingServer(listener)] : []),
      rm(storage, { recursive: true, force: true }),
    ]);
    throw error;
  }
}

export default defineConfig({
  e2e: {
    baseUrl: registryUrl,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      setupVerdaccioTasks(on, { registryUrl });
      on('task', {
        startRoutingRegistry: () => startRoutingRegistry(config.projectRoot),
        stopRoutingRegistry,
      });
      on('after:spec', stopRoutingRegistry);
    },
  },
  video: false,
  screenshotOnRunFailure: false,
  env: {
    VERDACCIO_URL: registryUrl,
  },
});
