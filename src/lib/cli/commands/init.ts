import { Command, Option } from 'clipanion';
import path from 'path';

import { listenDefaultCallback, startVerdaccio } from '../../bootstrap';
import findConfigFile from '../../config-path';
import { parseConfigFile } from '../../utils';

require('pkginfo')(module);
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';
const logger = require('../../logger');

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

  config = Option.String('-c,--config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  async execute() {
    let configPathLocation;
    try {
      configPathLocation = findConfigFile(this.config as string);
      const verdaccioConfiguration = parseConfigFile(configPathLocation);
      if (!verdaccioConfiguration.self_path) {
        verdaccioConfiguration.self_path = path.resolve(configPathLocation);
      }
      if (!verdaccioConfiguration.https) {
        verdaccioConfiguration.https = { enable: false };
      }

      logger.logger.warn({ file: configPathLocation }, 'config file  - @{file}');
      process.title =
        (verdaccioConfiguration.web && verdaccioConfiguration.web.title) || 'verdaccio';

      startVerdaccio(
        verdaccioConfiguration,
        this.listen as string,
        configPathLocation,
        pkgVersion,
        pkgName,
        listenDefaultCallback
      );
    } catch (err) {
      logger.logger.fatal(
        { file: configPathLocation, err: err },
        'cannot open config file @{file}: @{!err.message}'
      );
      process.exit(1);
    }
  }
}
