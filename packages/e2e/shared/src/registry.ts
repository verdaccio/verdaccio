import { spawn } from 'child_process';
import fs from 'fs';
import getPort from 'get-port';
import path from 'path';

import { ConfigBuilder } from '@verdaccio/config';
import { constants, fileUtils } from '@verdaccio/core';
import { ping } from '@verdaccio/registry-cli';

const { ROLES } = constants;

export interface RegistryInstance {
  url: string;
  token: string;
  process: ReturnType<typeof spawn>;
  tempDir: string;
}

export interface StartRegistryOptions {
  configBuilder?: ConfigBuilder;
}

async function waitForRegistry(url: string, timeoutMs = 30_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const result = await ping(url);
      if (result.ok) {
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Registry at ${url} did not start within ${timeoutMs}ms`);
}

async function createUser(url: string, user: string, password: string): Promise<string> {
  const res = await fetch(`${url}/-/user/org.couchdb.user:${user}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user,
      password,
      _id: `org.couchdb.user:${user}`,
      type: 'user',
      roles: [],
    }),
  });
  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error(`Failed to create user: ${JSON.stringify(data)}`);
  }
  return data.token;
}

function buildDefaultConfig(storagePath: string, htpasswdPath: string): ConfigBuilder {
  return ConfigBuilder.build()
    .addStorage(storagePath)
    .addUplink('npmjs', { url: 'https://registry.npmjs.org/' })
    .addPackageAccess('@*/*', {
      access: [ROLES.$ALL],
      publish: [ROLES.$AUTH],
      proxy: ['npmjs'],
    })
    .addPackageAccess('**', {
      access: [ROLES.$ALL],
      publish: [ROLES.$AUTH],
      proxy: ['npmjs'],
    })
    .addAuth({ htpasswd: { file: htpasswdPath, max_users: 100 } })
    .addLogger({ type: 'stdout', format: 'pretty', level: 'warn' });
}

export async function startRegistry(
  name: string,
  options?: StartRegistryOptions
): Promise<RegistryInstance> {
  const port = await getPort();
  const url = `http://localhost:${port}`;
  const tempDir = await fileUtils.createTempStorageFolder(`verdaccio-e2e-${name}`);
  const storagePath = path.join(tempDir, 'storage');
  fs.mkdirSync(storagePath, { recursive: true });

  const htpasswdPath = path.join(tempDir, 'htpasswd');
  const builder = options?.configBuilder ?? buildDefaultConfig(storagePath, htpasswdPath);

  let yaml = builder.getAsYaml();
  yaml += `\nlisten: ${port}\n`;

  const configPath = path.join(tempDir, 'config.yaml');
  fs.writeFileSync(configPath, yaml);

  const verdaccioBin = require.resolve('verdaccio/bin/verdaccio');
  const registryProcess = spawn('node', [verdaccioBin, '--config', configPath], {
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  await waitForRegistry(url);
  const token = await createUser(url, `e2e-${name}-${Date.now()}`, 'e2e-password');

  return { url, token, process: registryProcess, tempDir };
}

export function stopRegistry(instance: RegistryInstance): void {
  if (instance.process) {
    instance.process.kill('SIGTERM');
  }
  if (instance.tempDir) {
    fs.rmSync(instance.tempDir, { recursive: true, force: true });
  }
}

export { ConfigBuilder };
