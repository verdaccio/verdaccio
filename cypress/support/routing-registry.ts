import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';

let server: Server | undefined;
let storage: string | undefined;

function registryUrls(listener: Server) {
  const publishUrl = `http://127.0.0.1:${(listener.address() as AddressInfo).port}`;
  return { registryUrl: `${publishUrl}/registry`, publishUrl };
}

export async function stopRoutingRegistry() {
  if (server) {
    const current = server;
    server = undefined;
    current.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      current.close((error) => (error ? reject(error) : resolve()));
    });
  }
  if (storage) {
    await rm(storage, { recursive: true, force: true });
    storage = undefined;
  }
  return null;
}

export async function startRoutingRegistry(projectRoot: string) {
  if (server) return registryUrls(server);
  const local = createRequire(path.join(projectRoot, 'packages/server/express/package.json'));
  const express = local('express');
  storage = await mkdtemp(path.join(os.tmpdir(), 'verdaccio-routing-e2e-'));
  const configPath = path.join(storage, 'config.yaml');
  await writeFile(configPath, '');
  const config = {
    storage,
    self_path: configPath,
    configPath,
    url_prefix: '/registry',
    auth: { htpasswd: { file: path.join(storage, 'htpasswd') } },
    uplinks: {},
    packages: { '**': { access: '$all', publish: '$all', unpublish: '$all' } },
    plugins: path.join(projectRoot, 'packages/server/express/test/config/plugins'),
    middlewares: { 'routing-delay': { defer: true } },
    web: { enable: true, title: 'Verdaccio routing' },
    log: { type: 'stdout', format: 'json', level: 'warn' },
  };
  await local('@verdaccio/logger').setup(config.log);
  const { startServer } = local('./build/index.js');
  const app = express();
  const registry = await startServer(config);
  app.use('/registry', registry);
  // Fixture publishing uses the root; browser requests exercise the prefixed mount.
  app.use('/', registry);
  const listener: Server = app.listen(0, '127.0.0.1');
  server = listener;
  await once(listener, 'listening');
  return registryUrls(listener);
}
