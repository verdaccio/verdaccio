import { defineConfig } from 'cypress';
import getPort from 'get-port';
import { join } from 'path';
import { Registry, ServerQuery } from 'verdaccio';

import { parseConfigFile } from '@verdaccio/config';
import { HEADERS, fileUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

let registry1;
export default defineConfig({
  retries: {
    runMode: 5,
    openMode: 0,
  },
  // Enable this to see debug screenshots on test failure
  // screenshotOnRunFailure: true,
  // Enable this to see debug video on test failure
  // video: true,
  e2e: {
    setupNodeEvents(on) {
      on('before:run', async () => {
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
      });

      on('after:run', async () => {
        registry1.stop();
      });

      on('task', {
        publishScoped({ pkgName }) {
          const scopedPackageMetadata = generatePackageMetadata(pkgName, '1.0.6');
          const server = new ServerQuery(registry1.getRegistryUrl());
          server
            .putPackage(scopedPackageMetadata.name, scopedPackageMetadata, {
              [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
            })
            .then(() => {});
          return null;
        },
        publishProtected({ pkgName }) {
          const protectedPackageMetadata = generatePackageMetadata(pkgName, '5.0.5');
          const server = new ServerQuery(registry1.getRegistryUrl());
          server
            .putPackage(protectedPackageMetadata.name, protectedPackageMetadata, {
              [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
            })
            .then(() => {});
        },
        registry() {
          return {
            registryUrl: registry1.getRegistryUrl(),
            port: registry1.getPort(),
          };
        },
      });
    },
  },
});
