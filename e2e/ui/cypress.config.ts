import { defineConfig } from 'cypress';
import getPort from 'get-port';
import { join } from 'path';
import { Registry, ServerQuery } from 'verdaccio';

import { parseConfigFile } from '@verdaccio/config';
import { HEADERS, HTTP_STATUS, fileUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

let registry1;
export default defineConfig({
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    setupNodeEvents(on) {
      async function ensureRegistryStarted() {
        if (registry1) {
          return;
        }
        const configProtected = parseConfigFile(join(__dirname, './config/config.yaml'));
        const registry1storage = await fileUtils.createTempStorageFolder('storage-1');
        const protectedRegistry = await Registry.fromConfigToPath({
          ...configProtected,
          storage: registry1storage,
        });
        const port = await getPort();
        registry1 = new Registry(protectedRegistry.configPath, {
          createUser: true,
          credentials: { user: 'test', password: 'test' },
          port,
        });
        await registry1.init();
      }

      on('before:run', async () => {
        await ensureRegistryStarted();
      });

      on('before:spec', async () => {
        await ensureRegistryStarted();
      });

      on('after:run', async () => {
        registry1?.stop();
      });

      on('task', {
        async publishScoped({ pkgName }) {
          await ensureRegistryStarted();
          const scopedPackageMetadata = generatePackageMetadata(pkgName, '1.0.6');
          const server = new ServerQuery(registry1.getRegistryUrl());
          const response = await server.putPackage(
            scopedPackageMetadata.name,
            scopedPackageMetadata,
            {
              [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
            }
          );
          response.status(HTTP_STATUS.CREATED);
          return null;
        },
        async publishProtected({ pkgName }) {
          await ensureRegistryStarted();
          const protectedPackageMetadata = generatePackageMetadata(pkgName, '5.0.5');
          const server = new ServerQuery(registry1.getRegistryUrl());
          await server.putPackage(protectedPackageMetadata.name, protectedPackageMetadata, {
            [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
          });
          return null;
        },
        async registry() {
          await ensureRegistryStarted();
          return {
            registryUrl: registry1.getRegistryUrl(),
            port: registry1.getPort(),
          };
        },
      });
    },
  },
});
