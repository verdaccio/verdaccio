import { Command, Option } from 'clipanion';
import path from 'path';

import { findConfigFile } from '@verdaccio/config';

import { listenDefaultCallback, startVerdaccio } from '../../bootstrap';
import { logger } from '../../logger';
import { parseConfigFile } from '../../utils';

const pkgVersion = process.env.PACKAGE_VERSION || 'dev';
const pkgName = 'verdaccio';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export class InitCommand extends Command {
  static paths = [Command.Default];

  listen = Option.String('-l,--listen', {
    description: 'host:port number to listen on (default: localhost:4873)',
  });

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

  config = Option.String('-c,--config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  async execute() {
    let configPathLocation;
    try {
      configPathLocation = findConfigFile(this.config as string);
      const configParsed: ReturnType<any> = parseConfigFile(configPathLocation);
      if (!configParsed.self_path) {
        configParsed.self_path = path.resolve(configPathLocation);
        // compatibility with 6.x plugins
        configParsed.configPath = configParsed.self_path;
      }
      if (!configParsed.https) {
        configParsed.https = { enable: false };
      }

      process.title = (configParsed.web && configParsed.web.title) || 'verdaccio';

      startVerdaccio(
        configParsed,
        this.listen as string,
        configPathLocation,
        pkgVersion,
        pkgName,
        listenDefaultCallback
      );
      logger.info({ file: configPathLocation }, 'config file  - @{file}');
    } catch (err: any) {
      console.error(`cannot open config file ${configPathLocation}: ${err.stack}`);
      // @ts-ignore
      if (typeof logger?.logger?.fatal === 'function') {
        logger.fatal(
          { file: configPathLocation, err: err },
          'cannot open config file @{file}: @{!err.message}'
        );
      } else {
        console.error(`cannot open config file ${configPathLocation}: ${!err.message}`);
      }
      process.exit(1);
    }
  }
}
