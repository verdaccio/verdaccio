import { runServer } from 'verdaccio';

import { ConfigBuilder } from '@verdaccio/config';
import { constants, fileUtils } from '@verdaccio/core';

fileUtils
  .createTempFolder('test')
  .then((folderPath) => {
    const configuration = ConfigBuilder.build({
      storage: folderPath,
      // @ts-ignore
      logs: { level: 'info', type: 'stdout', format: 'pretty' },
      uplinks: {},
      packages: {},
      configPath: folderPath,
    })
      .addUplink('npmjs', { url: 'https://registry.npmjs.org' })
      .addPackageAccess('@verdaccio/*', {
        access: constants.ROLES.$ANONYMOUS,
        publish: constants.ROLES.$ANONYMOUS,
      })
      .addPackageAccess(constants.PACKAGE_ACCESS.SCOPE, {
        access: constants.ROLES.$ANONYMOUS,
        publish: constants.ROLES.$ANONYMOUS,
        proxy: 'npmjs',
      })
      .addPackageAccess('verdaccio', {
        access: constants.ROLES.$ANONYMOUS,
        publish: constants.ROLES.$ANONYMOUS,
      })
      .addPackageAccess('verdaccio-*', {
        access: constants.ROLES.$ANONYMOUS,
        publish: constants.ROLES.$ANONYMOUS,
      })
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
        proxy: 'npmjs',
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd',
        },
      });
    return runServer(configuration.getConfig());
  })
  .then((app: any) => {
    app.listen(4873, () => {
      console.log('running verdaccio server');
    });
  })
  .catch(console.error);
