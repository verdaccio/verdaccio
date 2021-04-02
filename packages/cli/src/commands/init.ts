import { Command, Option } from 'clipanion';
import * as t from 'typanion';

import { ConfigRuntime } from '@verdaccio/types';
import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import { startVerdaccio, listenDefaultCallback } from '@verdaccio/node-api';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export class InitCommand extends Command {
  static paths = [Command.Default];

  listen = Option.String('-l,--listen', {
    description: 'host:port number to listen on (default: localhost:4873)',
  });

  // eslint-disable-next-line
  static usage = Command.Usage({
    description: `launch the server`,
    details: `
      This start the registry in the default port.

      When used without arguments, it:

      - bootstrap the server at the port  \`4873\`

      The optional arguments are:

      - \`--listen\` to switch the default server port,
      - \`--config\` to define a different configuration path location,

    `,
    examples: [
      [`Runs the server with the default configuration`, `verdaccio`],
      [`Runs the server in the port 5000`, `verdaccio --listen 5000`],
      [
        `Runs the server by using a different absolute location of the configuration file`,
        `verdaccio --config /home/user/verdaccio/config.yaml`,
      ],
    ],
  });

  config = Option.String('-c, --config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  async execute() {
    let configPathLocation;
    let verdaccioConfiguration: ConfigRuntime;
    try {
      configPathLocation = findConfigFile(this.config as string);
      verdaccioConfiguration = parseConfigFile(configPathLocation);
      const { web, https } = verdaccioConfiguration;

      process.title = web?.title || DEFAULT_PROCESS_NAME;

      if (!https) {
        verdaccioConfiguration = Object.assign({}, verdaccioConfiguration, {
          https: { enable: false },
        });
      }

      const { version, name } = require('../../package.json');

      startVerdaccio(
        verdaccioConfiguration,
        this.listen as string,
        configPathLocation,
        version,
        name,
        listenDefaultCallback
      );
    } catch (err) {
      process.exit(1);
    }
  }
}

// export default function initProgram(commander, pkgVersion, pkgName) {
//   const cliListener = commander.listen;
//   let configPathLocation;
//   let verdaccioConfiguration: ConfigRuntime;
//   try {
//     configPathLocation = findConfigFile(commander.config);
//     verdaccioConfiguration = parseConfigFile(configPathLocation);
//     const { web, https } = verdaccioConfiguration;

//     process.title = web?.title || DEFAULT_PROCESS_NAME;

//     if (!https) {
//       verdaccioConfiguration = Object.assign({}, verdaccioConfiguration, {
//         https: { enable: false },
//       });
//     }

//     // initLogger.warn({file: configPathLocation}, 'config file  - @{file}');

//     startVerdaccio(
//       verdaccioConfiguration,
//       cliListener,
//       configPathLocation,
//       pkgVersion,
//       pkgName,
//       listenDefaultCallback
//     );
//   } catch (err) {
//     process.exit(1);
//   }
// }
