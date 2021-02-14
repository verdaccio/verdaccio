import { ConfigRuntime } from '@verdaccio/types';
import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import { startVerdaccio, listenDefaultCallback } from '@verdaccio/node-api';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export default function initProgram(commander, pkgVersion, pkgName) {
  const cliListener = commander.listen;
  let configPathLocation;
  let verdaccioConfiguration: ConfigRuntime;
  try {
    configPathLocation = findConfigFile(commander.config);
    verdaccioConfiguration = parseConfigFile(configPathLocation);
    const { web, https } = verdaccioConfiguration;

    process.title = web?.title || DEFAULT_PROCESS_NAME;

    if (!https) {
      verdaccioConfiguration = Object.assign({}, verdaccioConfiguration, {
        https: { enable: false },
      });
    }

    // initLogger.warn({file: configPathLocation}, 'config file  - @{file}');

    startVerdaccio(
      verdaccioConfiguration,
      cliListener,
      configPathLocation,
      pkgVersion,
      pkgName,
      listenDefaultCallback
    );
  } catch (err) {
    process.exit(1);
  }
}
